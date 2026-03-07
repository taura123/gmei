import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://gmei.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/events`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/search`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Dynamic news pages
    let newsPages: MetadataRoute.Sitemap = [];
    try {
        const allNews = await prisma.news.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: "desc" },
        });
        newsPages = allNews.map((n) => ({
            url: `${BASE_URL}/news/${n.id}`,
            lastModified: n.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch (e) { }

    // Dynamic event pages
    let eventPages: MetadataRoute.Sitemap = [];
    try {
        const allEvents = await prisma.event.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: "desc" },
        });
        eventPages = allEvents.map((ev) => ({
            url: `${BASE_URL}/events/${ev.id}`,
            lastModified: ev.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));
    } catch (e) { }

    return [...staticPages, ...newsPages, ...eventPages];
}
