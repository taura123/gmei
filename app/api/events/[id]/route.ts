import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userName = session?.user?.name || "Admin";

        const { id } = await params;

        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (event.isExternal) {
            // Soft delete for external
            await prisma.event.update({
                where: { id },
                data: { isPublished: false }
            });
        } else {
            // Hard delete for manual
            await prisma.event.delete({
                where: { id }
            });
        }

        // Log activity
        await prisma.activity.create({
            data: {
                action: "DELETE",
                target: "EVENT",
                details: `[${userName}] Menghapus event: "${event.title}".`
            }
        });

        return NextResponse.json({ message: "Event deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userName = session?.user?.name || "Admin";

        const { id } = await params;
        const body = await request.json();
        const { title, date, location, description, content, image, link } = body;

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title,
                date: new Date(date),
                location,
                description,
                content,
                image,
                link
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                action: "UPDATE",
                target: "EVENT",
                details: `[${userName}] Memperbarui event: "${updatedEvent.title}".`
            }
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}
