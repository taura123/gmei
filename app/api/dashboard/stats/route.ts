import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const startStr = searchParams.get("start");
        const endStr = searchParams.get("end");
        const dateStr = searchParams.get("date"); // Legacy support

        let startOfDay: Date;
        let endOfDay: Date;

        if (startStr && endStr) {
            startOfDay = new Date(startStr);
            endOfDay = new Date(endStr);
        } else if (dateStr) {
            // Reconstruct local day boundaries from YYYY-MM-DD
            const [y, m, d] = dateStr.split('-').map(Number);
            startOfDay = new Date(y, m - 1, d, 0, 0, 0, 0);
            endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999);
        } else {
            startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [
            // Temporal stats (filtered by date)
            filteredProducts,
            filteredNews,
            filteredEvents,

            // Absolute totals (current state)
            absProducts,
            absNews,
            absEvents,

            recentActivities,
            timelineEvents,
            unreadContacts,

            // New Insight Data
            categoryDistribution,
            growthLast7Days
        ] = await Promise.all([
            // Filtered
            prisma.product.count({ where: { createdAt: { lte: endOfDay } } }),
            prisma.news.count({ where: { isPublished: true, createdAt: { lte: endOfDay } } }),
            prisma.event.count({ where: { date: { gte: startOfDay }, isPublished: true } }),

            // Absolute
            prisma.product.count(),
            prisma.news.count({ where: { isPublished: true } }),
            prisma.event.count({ where: { isPublished: true } }),

            // Activities / Timeline
            prisma.activity.findMany({
                where: { createdAt: { gte: startOfDay, lte: endOfDay } },
                orderBy: { createdAt: "desc" }
            }),
            prisma.event.findMany({
                where: { date: { gte: startOfDay, lte: endOfDay }, isPublished: true },
                orderBy: { date: "asc" }
            }),
            // @ts-ignore
            prisma.contact.count({ where: { status: "UNREAD" } }),

            // Insights
            prisma.product.groupBy({
                by: ['category'],
                _count: { _all: true },
                orderBy: { _count: { category: 'desc' } }
            }),
            prisma.product.count({
                where: { createdAt: { gte: sevenDaysAgo } }
            })
        ]);

        return NextResponse.json({
            stats: {
                // Filtered for charts
                filtered: {
                    products: filteredProducts,
                    news: filteredNews,
                    events: filteredEvents,
                    total: filteredProducts + filteredNews + filteredEvents
                },
                // Absolute for top cards
                absolute: {
                    products: absProducts,
                    news: absNews,
                    events: absEvents,
                    unreadContacts: unreadContacts || 0,
                    total: absProducts + absNews + absEvents
                },
                // Insights
                insights: {
                    categories: categoryDistribution,
                    growth7d: growthLast7Days
                }
            },
            activities: recentActivities,
            timeline: timelineEvents
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
    }
}
