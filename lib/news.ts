import axios from "axios";
import { prisma } from "./prisma";
import { SyncService } from "./sync-service";
import { isRelevant } from "./shared-keywords";

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    link: string;
    category: string;
}

const FALLBACK_NEWS: NewsItem[] = [
    {
        id: "fb-news-1",
        title: "Gramedia Mitra Edukasi Dukung Literasi Nasional melalui Digitalisasi Sekolah",
        description: "Program e-Perpus GMEI hadir untuk mempermudah akses buku digital bagi siswa di seluruh penjuru Indonesia dengan teknologi cloud terbaru.",
        image: "/images/ABOUT/IMG_7787.JPG",
        date: new Date().toISOString(),
        link: "#",
        category: "Info Pendidikan"
    },
    {
        id: "fb-news-2",
        title: "Peluncuran Produk BTP & BTU Kurikulum Merdeka Terbaru 2026",
        description: "GMEI resmi merilis seri buku teks pendamping yang telah disesuaikan dengan standar Asesmen Nasional untuk meningkatkan mutu belajar.",
        image: "/images/ABOUT/IMG_7761.JPG",
        date: new Date().toISOString(),
        link: "#",
        category: "Produk Baru"
    }
];

const FALLBACK_EVENTS: NewsItem[] = [
    {
        id: "fb-event-1",
        title: "Webinar Nasional: Transformasi Digital dalam Manajemen Perpustakaan Sekolah",
        description: "Ikuti pelatihan intensif bagi guru dan pustakawan untuk mengoptimalkan sistem e-Perpus dalam mendukung minat baca siswa.",
        image: "/images/ABOUT/IMG_7809.JPG",
        date: new Date(Date.now() + 86400000 * 7).toISOString(),
        link: "#",
        category: "Webinar"
    },
    {
        id: "fb-event-2",
        title: "Workshop Implementasi Kurikulum Merdeka bersama Pakar Pendidikan",
        description: "Sesi diskusi mendalam mengenai penyusunan modul ajar dan strategi asesmen bagi sekolah mitra PT Gramedia Mitra Edukasi Indonesia.",
        image: "/images/ABOUT/IMG_7795.JPG",
        date: new Date(Date.now() + 86400000 * 14).toISOString(),
        link: "#",
        category: "Workshop"
    }
];

export async function fetchGramediaNews(): Promise<NewsItem[]> {
    try {
        // Trigger sync in background (fire and forget for public speed)
        SyncService.syncNews().catch(console.error);

        const news = await prisma.news.findMany({
            where: { isPublished: true },
            orderBy: { date: 'desc' },
            take: 12
        });

        // Map Prisma model to NewsItem interface
        return news.map(n => ({
            id: n.id,
            title: n.title,
            description: n.description,
            image: n.image,
            date: n.date.toISOString(),
            link: n.sourceId ? Buffer.from(n.sourceId, 'base64').toString() : `/news/${n.id}`,
            category: n.category || "Info Pendidikan"
        }));
    } catch (error) {
        console.error("Error fetching news from DB:", error);
        return FALLBACK_NEWS;
    }
}

export async function fetchGramediaEvents(): Promise<NewsItem[]> {
    try {
        // Trigger sync in background
        SyncService.syncEvents().catch(console.error);

        const events = await prisma.event.findMany({
            where: { isPublished: true },
            orderBy: { date: 'desc' },
            take: 10
        });

        return events.map(e => ({
            id: e.id,
            title: e.title,
            description: e.description,
            image: e.image,
            date: e.date.toISOString(),
            link: e.sourceId ? (e.link || "#") : `/events/${e.id}`,
            category: "Event Pendidikan"
        }));
    } catch (error) {
        console.error("Error fetching events from DB:", error);
        return FALLBACK_EVENTS;
    }
}
