import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SyncService } from "@/lib/sync-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        // Sync with external RSS feed on request
        await SyncService.syncEvents();

        const events = await prisma.event.findMany({
            where: { isPublished: true },
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, content, image, date, location, link } = body;

        if (!title || !description || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const eventDate = new Date(date);
        const now = new Date();
        const type = eventDate < now ? "Past" : "Upcoming";

        const event = await prisma.event.create({
            data: {
                title,
                description,
                content: content || description,
                image: image || "/images/LOGO/LOGO GMEI (1).png",
                date: eventDate,
                location: location || "Gramedia Official",
                link: link || "#",
                type,
                isExternal: false,
                isPublished: true
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                action: "CREATE",
                target: "EVENT",
                details: `Membuat event baru: ${title}`
            }
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error("Create Event Error:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
