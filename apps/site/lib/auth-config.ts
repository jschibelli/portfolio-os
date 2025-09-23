import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
const PrismaAdapter = () => null;
import { prisma } from "./prisma";
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
} from "./auth-security";

export const authOptions = {
  adapter: null as any,
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
          
          await logAuthAttempt({
            email,
            ip: clientIP,
            userAgent,
            timestamp: new Date(),
            success: false
          });
          
          return null;
        }
        
        try {
          const user = await prisma.user.findUnique({ 
            where: { email } 
          });
          
          if (!user) {
            // Record failed attempt even for non-existent users to prevent user enumeration
            recordFailedAttempt(rateLimitKey);
            console.warn(`Authentication attempt for non-existent user: ${email} from ${clientIP}`);
            
            await logAuthAttempt({
              email,
              ip: clientIP,
              userAgent,
              timestamp: new Date(),
              success: false
            });
            
            return null;
          }
          
          // Use secure password comparison with timing attack protection
          const isValid = await securePasswordCompare(password, user.password);
          
          if (isValid) {
            // Clear any failed attempts on successful authentication
            clearFailedAttempts(rateLimitKey);
            
            await logAuthAttempt({
              email,
              ip: clientIP,
              userAgent,
              timestamp: new Date(),
              success: true
            });
            
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
            
            await logAuthAttempt({
              email,
              ip: clientIP,
              userAgent,
              timestamp: new Date(),
              success: false
            });
            
            return null;
          }
        } catch (error) {
          console.error("Database error during authentication:", error);
          
          // Log the error but don't reveal database structure
          await logAuthAttempt({
            email,
            ip: clientIP,
            userAgent,
            timestamp: new Date(),
            success: false
          });
          
          return null;
        }
      },
    }),
  ],
    callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
