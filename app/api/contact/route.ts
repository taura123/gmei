import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, recordRateLimitHit } from "@/lib/rate-limit";

// Rate Limit Config: 5 messages per 60 minutes
const CONTACT_LIMIT_CONFIG = {
    maxAttempts: 5,
    windowMinutes: 60
};

// Public POST for anyone to send messages
export async function POST(request: Request) {
    try {
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const rateLimitKey = `contact:${ip}`;

        // 1. Check Rate Limit
        const limitCheck = checkRateLimit(rateLimitKey, CONTACT_LIMIT_CONFIG);
        if (!limitCheck.success) {
            return NextResponse.json(
                { error: limitCheck.message || "Batas pengiriman pesan tercapai. Silakan coba lagi nanti." },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Nama, Email, dan Pesan harus diisi." },
                { status: 400 }
            );
        }

        // 2. Clear to proceed - but record the hit first
        recordRateLimitHit(rateLimitKey, CONTACT_LIMIT_CONFIG);

        // @ts-ignore
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject: subject || "No Subject",
                message,
            },
        });

        // Log activity for admin dashboard
        await prisma.activity.create({
            data: {
                action: "CREATE",
                target: "CONTACT",
                details: `Pesan baru masuk dari ${name} (${email})`,
            },
        });

        return NextResponse.json(
            { message: "Pesan Anda telah terkirim! Tim kami akan segera menghubungi Anda.", contact },
            { status: 201 }
        );
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { error: "Gagal mengirim pesan. Silakan coba lagi nanti." },
            { status: 500 }
        );
    }
}

// Admin only GET to fetch all messages
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // @ts-ignore
        const messages = await prisma.contact.findMany({
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Fetch Messages Error:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
