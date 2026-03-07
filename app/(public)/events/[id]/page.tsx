import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import EventDetailClient from "@/components/sections/EventDetailClient";

export const dynamic = 'force-dynamic';

interface EventDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return { title: "Event Tidak Ditemukan" };
    return {
        title: `${event.title} — Event Edukasi`,
        description: event.description || event.content?.substring(0, 160) || "",
        openGraph: {
            title: event.title,
            description: event.description || "",
            type: "article",
            publishedTime: event.date.toISOString(),
            images: event.image ? [{ url: event.image, alt: event.title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: event.description || "",
            images: event.image ? [event.image] : [],
        },
    };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { id }
    });

    if (!event) {
        notFound();
    }

    return <EventDetailClient event={event} />;
}
