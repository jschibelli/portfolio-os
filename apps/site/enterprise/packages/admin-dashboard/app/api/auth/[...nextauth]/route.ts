import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../lib/prisma";
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
} from "../../../lib/auth-security";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours for admin sessions
    updateAge: 30 * 60, // 30 minutes
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
        sameSite: 'strict' as const, // Stricter for admin
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60, // 8 hours
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.callback-url' 
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'strict' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60,
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Host-next-auth.csrf-token' 
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'strict' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 8 * 60 * 60,
      },
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      },
      async authorize(creds, req) {
        if (!creds?.email || !creds?.password) {
          console.warn("Admin authentication attempt with missing credentials");
          return null;
        }

        // Sanitize and validate input
        const email = sanitizeInput(creds.email);
        const password = creds.password;
        
        if (!isValidEmail(email)) {
          console.warn("Admin authentication attempt with invalid email format:", email);
          return null;
        }

        // Get client information for rate limiting and logging
        const clientIP = req ? getClientIP(req as any) : 'unknown';
        const userAgent = req?.headers?.get('user-agent') || 'unknown';
        const rateLimitKey = `admin:${email}:${clientIP}`;

        // Check rate limiting (stricter for admin)
        if (isRateLimited(rateLimitKey)) {
          const lockoutTime = getLockoutTimeRemaining(rateLimitKey);
          console.warn(`Rate limited admin authentication attempt for ${email} from ${clientIP}. Lockout remaining: ${Math.ceil(lockoutTime / 1000)}s`);
          
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
            // Record failed attempt even for non-existent users
            recordFailedAttempt(rateLimitKey);
            console.warn(`Admin authentication attempt for non-existent user: ${email} from ${clientIP}`);
            
            await logAuthAttempt({
              email,
              ip: clientIP,
              userAgent,
              timestamp: new Date(),
              success: false
            });
            
            return null;
          }

          // Only allow admin users to access admin dashboard
          if (user.role !== 'ADMIN') {
            recordFailedAttempt(rateLimitKey);
            console.warn(`Non-admin user attempted admin access: ${email} (role: ${user.role}) from ${clientIP}`);
            
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
            
            return { 
              id: user.id, 
              email: user.email, 
              name: user.name, 
              role: user.role 
            };
          } else {
            // Record failed attempt
            recordFailedAttempt(rateLimitKey);
            console.warn(`Failed admin authentication attempt for ${email} from ${clientIP}`);
            
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
          console.error("Database error during admin authentication:", error);
          
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
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
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
});

export { handler as GET, handler as POST };
