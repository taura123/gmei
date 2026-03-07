import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Publicly accessible POST route to log client-side activities.
 * Requires an active session for security.
 */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action, target, details } = body;

        if (!action || !target || !details) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get the actual user name from session for better audit trail
        const userName = session.user?.name || "Admin";
        const detailedLog = `[${userName}] ${details}`;

        const activity = await prisma.activity.create({
            data: {
                action: action.toUpperCase(),
                target: target.toUpperCase(),
                details: detailedLog
            }
        });

        return NextResponse.json(activity, { status: 201 });
    } catch (error) {
        console.error("Activity Log Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
