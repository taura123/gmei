import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, recordRateLimitHit, clearRateLimit } from "@/lib/rate-limit";

const LOGIN_LIMIT_CONFIG = {
    maxAttempts: 5,
    windowMinutes: 5
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Get IP address from headers (works locally and in production behind proxies like Vercel)
                const ip = req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || "unknown-ip";

                const rateLimitKey = `login:${ip}`;

                // 1. Check Rate Limit
                const rateLimitCheck = checkRateLimit(rateLimitKey, LOGIN_LIMIT_CONFIG);
                if (!rateLimitCheck.success) {
                    throw new Error(rateLimitCheck.message);
                }

                if (!credentials?.email || !credentials?.password) {
                    recordRateLimitHit(rateLimitKey, LOGIN_LIMIT_CONFIG);
                    throw new Error("Email dan password diperlukan");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.password) {
                    recordRateLimitHit(rateLimitKey, LOGIN_LIMIT_CONFIG);
                    throw new Error("Tidak ada pendaftaran dengan email tersebut");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);

                if (!isValidPassword) {
                    recordRateLimitHit(rateLimitKey, LOGIN_LIMIT_CONFIG);
                    throw new Error("Password salah");
                }

                // 2. Clear rate limit on successful login
                clearRateLimit(rateLimitKey);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: (user as any).role,
                };
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2 hours (Session expires after 2 hours of inactivity)
        updateAge: 30 * 60,  // 30 minutes (Session is updated/extended every 30 minutes of activity)
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.sub as string;
                (session.user as any).role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = (user as any).role;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
