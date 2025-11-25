import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";

// PrismaAdapter configuration for NextAuth
// This adapter provides database session and user management
// Error handling is implemented below to ensure graceful fallbacks
import { 
  isRateLimited, 
  recordFailedAttempt, 
  clearFailedAttempts, 
  getLockoutTimeRemaining,
  securePasswordCompare,
  logAuthAttempt,
  sanitizeInput,
  isValidEmail,
  getClientIP
} from "../../../../lib/auth-security";

// Initialize PrismaAdapter with error handling
let adapter: any = null;
try {
  adapter = PrismaAdapter(prisma);
} catch (error) {
  console.error("Failed to initialize PrismaAdapter:", error);
  // Fallback to JWT-only strategy if database adapter fails
  console.warn("Falling back to JWT-only authentication strategy");
}

export const authOptions = {
  adapter,
  session: { 
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
        domain: process.env.NODE_ENV === 'production' ? '.johnschibelli.dev' : undefined,
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
        domain: process.env.NODE_ENV === 'production' ? '.johnschibelli.dev' : undefined,
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
        domain: process.env.NODE_ENV === 'production' ? '.johnschibelli.dev' : undefined,
      },
    },
  },
  providers: [
    // Only add Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    Credentials({
      name: "Credentials",
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      },
      async authorize(creds, req) {
        try {
          if (!creds?.email || !creds?.password) {
            console.warn("Authentication attempt with missing credentials");
            return null;
          }

          // Sanitize and validate input
          const email = sanitizeInput(creds.email);
          const password = creds.password;
          
          if (!isValidEmail(email)) {
            console.warn("Authentication attempt with invalid email format:", email);
            return null;
          }

          // Get client information for rate limiting and logging
          const clientIP = req ? getClientIP(req as any) : 'unknown';
          const userAgent = req?.headers?.get('user-agent') || 'unknown';
          const rateLimitKey = `${email}:${clientIP}`;

          // Check rate limiting
          if (isRateLimited(rateLimitKey)) {
            const lockoutTime = getLockoutTimeRemaining(rateLimitKey);
            console.warn(`Rate limited authentication attempt for ${email} from ${clientIP}. Lockout remaining: ${Math.ceil(lockoutTime / 1000)}s`);
            
            try {
              await logAuthAttempt({
                email,
                ip: clientIP,
                userAgent,
                timestamp: new Date(),
                success: false
              });
            } catch (logError) {
              console.error("Failed to log auth attempt:", logError);
            }
            
            return null;
          }
          
          try {
            // Test database connection first
            await prisma.$connect().catch(() => {
              // Connection might already be established, that's fine
            });
            
            const user = await prisma.user.findUnique({ 
              where: { email } 
            });
            
            if (!user) {
              // Record failed attempt even for non-existent users to prevent user enumeration
              recordFailedAttempt(rateLimitKey);
              console.warn(`Authentication attempt for non-existent user: ${email} from ${clientIP}`);
              
              try {
                await logAuthAttempt({
                  email,
                  ip: clientIP,
                  userAgent,
                  timestamp: new Date(),
                  success: false
                });
              } catch (logError) {
                console.error("Failed to log auth attempt:", logError);
              }
              
              return null;
            }
            
            // Use secure password comparison with timing attack protection
            const isValid = await securePasswordCompare(password, user.password);
            
            if (isValid) {
              // Clear any failed attempts on successful authentication
              clearFailedAttempts(rateLimitKey);
              
              try {
                await logAuthAttempt({
                  email,
                  ip: clientIP,
                  userAgent,
                  timestamp: new Date(),
                  success: true
                });
              } catch (logError) {
                console.error("Failed to log auth attempt:", logError);
              }
              
              const userData = { 
                id: user.id, 
                email: user.email, 
                name: user.name, 
                role: user.role 
              };
              return userData;
            } else {
              // Record failed attempt
              recordFailedAttempt(rateLimitKey);
              console.warn(`Failed authentication attempt for ${email} from ${clientIP}`);
              
              try {
                await logAuthAttempt({
                  email,
                  ip: clientIP,
                  userAgent,
                  timestamp: new Date(),
                  success: false
                });
              } catch (logError) {
                console.error("Failed to log auth attempt:", logError);
              }
              
              return null;
            }
          } catch (dbError) {
            console.error("[AUTH] Database error during authentication:", dbError);
            
            // Enhanced error handling - check for specific error types
            if (dbError instanceof Error) {
              const errorMessage = dbError.message.toLowerCase();
              
              // Log specific error types for debugging without exposing details
              if (errorMessage.includes('connection') || errorMessage.includes('connect')) {
                console.error("[AUTH] Database connection error. Check DATABASE_URL environment variable.");
              } else if (errorMessage.includes('timeout')) {
                console.error("[AUTH] Database timeout during authentication");
              } else if (errorMessage.includes('prisma') || errorMessage.includes('schema')) {
                console.error("[AUTH] Prisma/database schema error. Ensure database is migrated.");
              } else {
                console.error("[AUTH] General database error during authentication:", errorMessage);
              }
            }
            
            // Log the error but don't reveal database structure
            try {
              await logAuthAttempt({
                email,
                ip: clientIP,
                userAgent,
                timestamp: new Date(),
                success: false
              });
            } catch (logError) {
              console.error("Failed to log auth attempt:", logError);
            }
            
            // Return null to fail authentication gracefully instead of throwing
            return null;
          }
        } catch (error) {
          // Catch any unexpected errors in the authorize function
          console.error("[AUTH] Unexpected error in authorize function:", error);
          if (error instanceof Error) {
            console.error("[AUTH] Error message:", error.message);
            console.error("[AUTH] Error stack:", error.stack);
          }
          // Return null to fail authentication gracefully
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      try {
        if (user) {
          token.role = (user as any).role;
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error('[AUTH] Error in jwt callback:', error);
        return token; // Return token even if there's an error
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      try {
        if (token) {
          (session.user as any).role = token.role;
          (session.user as any).id = token.id;
        }
        return session;
      } catch (error) {
        console.error('[AUTH] Error in session callback:', error);
        return session; // Return session even if there's an error
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Validate required environment variables before initializing NextAuth
if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  console.error('[AUTH] ⚠️  Missing required environment variable: NEXTAUTH_SECRET or AUTH_SECRET');
  console.error('[AUTH] Please set at least one of these variables in your .env.local file');
  console.error('[AUTH] Generate a secret with: openssl rand -base64 32');
}

// Check for database connection
if (!process.env.DATABASE_URL) {
  console.warn('[AUTH] ⚠️  DATABASE_URL not set. Database operations may fail.');
}

const baseHandler = NextAuth(authOptions);

// Wrap the handler with error logging for App Router
// NextAuth handler works for both GET and POST in App Router
const handler = async (
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) => {
  try {
    return await baseHandler(req, context);
  } catch (error) {
    console.error('[AUTH] Handler error:', error);
    if (error instanceof Error) {
      console.error('[AUTH] Error message:', error.message);
      
      // Check for common error causes and provide helpful messages
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('secret') || errorMsg.includes('nextauth_secret')) {
        console.error('[AUTH] ❌ Missing or invalid NEXTAUTH_SECRET');
        console.error('[AUTH] Fix: Set NEXTAUTH_SECRET or AUTH_SECRET in your .env.local file');
        console.error('[AUTH] Generate: openssl rand -base64 32');
      }
      if (errorMsg.includes('database') || errorMsg.includes('prisma') || errorMsg.includes('connect')) {
        console.error('[AUTH] ❌ Database connection error');
        console.error('[AUTH] Fix: Check your DATABASE_URL environment variable');
        console.error('[AUTH] Ensure the database is running and accessible');
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('[AUTH] Error stack:', error.stack);
      }
    }
    throw error;
  }
};

// Export the wrapped handler for both GET and POST
export { handler as GET, handler as POST };


