import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SyncService } from "@/lib/sync-service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        // Sync with external RSS feed on request
        await SyncService.syncNews();

        const news = await prisma.news.findMany({
            where: { isPublished: true },
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, content, image, category } = body;

        if (!title || !description || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const news = await prisma.news.create({
            data: {
                title,
                description,
                content,
                image: image || "/images/LOGO/LOGO GMEI (1).png",
                category: category || "Info Pendidikan",
                isExternal: false,
                isPublished: true,
                date: new Date()
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                action: "CREATE",
                target: "NEWS",
                details: `Menulis artikel baru: ${title}`
            }
        });

        return NextResponse.json(news);
    } catch (error) {
        console.error("Create News Error:", error);
        return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
    }
}
