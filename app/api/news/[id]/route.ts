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

        // Find the item first to check if it's external
        const news = await prisma.news.findUnique({
            where: { id }
        });

        if (!news) {
            return NextResponse.json({ error: "News not found" }, { status: 404 });
        }

        if (news.isExternal) {
            // For external, just hide it so sync doesn't re-add it
            await prisma.news.update({
                where: { id },
                data: { isPublished: false }
            });
        } else {
            // For manual, we can actually delete it
            await prisma.news.delete({
                where: { id }
            });
        }

        // Log activity
        await prisma.activity.create({
            data: {
                action: "DELETE",
                target: "NEWS",
                details: `[${userName}] Menghapus berita: "${news.title}".`
            }
        });

        return NextResponse.json({ message: "News deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
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
        const { title, category, description, content, image } = body;

        const updatedNews = await prisma.news.update({
            where: { id },
            data: {
                title,
                category,
                description,
                content,
                image
            }
        });

        // Log activity
        await prisma.activity.create({
            data: {
                action: "UPDATE",
                target: "NEWS",
                details: `[${userName}] Memperbarui berita: "${updatedNews.title}".`
            }
        });

        return NextResponse.json(updatedNews);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
    }
}
