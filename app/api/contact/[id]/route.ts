import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        // @ts-ignore
        const message = await prisma.contact.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Update Message Error:", error);
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // @ts-ignore
        await prisma.contact.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Message deleted" });
    } catch (error) {
        console.error("Delete Message Error:", error);
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
