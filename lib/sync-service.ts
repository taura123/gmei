import axios from "axios";
import { prisma } from "./prisma";
import { isRelevant } from "./shared-keywords";

const COMMON_LOCATIONS = [
    "Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi", "Bandung", "Surabaya", "Jogja", "Yogyakarta",
    "Semarang", "Malang", "Solo", "Medan", "Makassar", "Bali", "Palembang", "Pekanbaru", "Banjarmasin",
    "Zoom", "Google Meet", "Online", "Webinar", "Youtube", "Istora", "Gramedia", "Mall", "Botani",
    "Gedung", "Kampus", "Universitas", "Sekolah", "Perpustakaan", "Convention Center", "ICE BSD"
];

function extractLocation(title: string, content: string): string {
    const text = (title + " " + content).toLowerCase();
    if (text.includes("bogor botani") || text.includes("botani square")) return "Bogor Botani Square";
    if (text.includes("zoom") || text.includes("google meet") || text.includes("online") || text.includes("webinar")) {
        return "Online / Webinar";
    }
    for (const city of COMMON_LOCATIONS) {
        if (text.includes(city.toLowerCase())) {
            return city;
        }
    }
    return "Gramedia Official";
}

export class SyncService {
    private static lastNewsSync = 0;
    private static lastEventsSync = 0;
    private static readonly SYNC_COOLDOWN = 15 * 60 * 1000; // 15 minutes

    static async syncNews() {
        const now = Date.now();
        if (now - this.lastNewsSync < this.SYNC_COOLDOWN) return;

        try {
            const response = await axios.get("https://www.gramedia.com/blog/feed/", {
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const xml = response.data;
            const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
            let createdCount = 0;

            for (const match of itemMatches) {
                const itemContent = match[1];
                const title = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1]
                    ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() || "";
                const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
                const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || "";
                const descriptionRaw = itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1]
                    ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1') || "";

                if (!isRelevant(title, descriptionRaw)) continue;

                const sourceId = Buffer.from(link).toString('base64');
                const imageMatch = itemContent.match(/<media:content[\s\S]*?url="([\s\S]*?)"/) ||
                    descriptionRaw.match(/<img[\s\S]*?src="([\s\S]*?)"/);
                const image = imageMatch?.[1] || "/images/LOGO/LOGO GMEI (1).png";
                const description = descriptionRaw.replace(/<[^>]*>?/gm, '').substring(0, 200);

                const itemDate = new Date(pubDate);
                const finalDate = isNaN(itemDate.getTime()) ? new Date() : itemDate;

                const existing = await prisma.news.findUnique({ where: { sourceId } });
                if (!existing) createdCount++;

                await prisma.news.upsert({
                    where: { sourceId },
                    update: { title, description, image, date: finalDate },
                    create: {
                        sourceId, title, description, content: descriptionRaw,
                        image, date: finalDate, category: "Info Pendidikan",
                        isExternal: true, isPublished: true
                    }
                });
            }

            if (createdCount > 0) {
                await prisma.activity.create({
                    data: {
                        action: "SYNC",
                        target: "NEWS",
                        details: `Sinkronisasi berita RSS: Berhasil menambahkan ${createdCount} artikel baru.`
                    }
                });
            }
            this.lastNewsSync = Date.now();
        } catch (error) {
            console.error("News Sync Error:", error);
        }
    }

    static async syncEvents() {
        const now = Date.now();
        if (now - this.lastEventsSync < this.SYNC_COOLDOWN) return;

        try {
            const response = await axios.get("https://www.gramedia.com/blog/tag/event/feed/", {
                timeout: 8000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const xml = response.data;
            const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
            let createdCount = 0;

            for (const match of itemMatches) {
                const itemContent = match[1];
                const title = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1]
                    ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() || "";
                const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
                const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || "";
                const descriptionRaw = itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1]
                    ?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1') || "";

                if (!isRelevant(title, descriptionRaw)) continue;

                const sourceId = Buffer.from(link).toString('base64');
                const imageMatch = itemContent.match(/<media:content[\s\S]*?url="([\s\S]*?)"/) ||
                    descriptionRaw.match(/<img[\s\S]*?src="([\s\S]*?)"/);
                const image = imageMatch?.[1] || "/images/LOGO/LOGO GMEI (1).png";
                const description = descriptionRaw.replace(/<[^>]*>?/gm, '').substring(0, 200);

                const itemDate = new Date(pubDate);
                const finalDate = isNaN(itemDate.getTime()) ? new Date() : itemDate;
                const eventType = finalDate < new Date() ? "Past" : "Upcoming";
                const extractedLocation = extractLocation(title, descriptionRaw);

                const existing = await prisma.event.findUnique({ where: { sourceId } });
                if (!existing) createdCount++;

                await prisma.event.upsert({
                    where: { sourceId },
                    update: { title, description, image, date: finalDate, location: extractedLocation, type: eventType },
                    create: {
                        sourceId, title, description, content: descriptionRaw,
                        image, date: finalDate, location: extractedLocation,
                        type: eventType, isExternal: true, isPublished: true, link
                    }
                });
            }

            if (createdCount > 0) {
                await prisma.activity.create({
                    data: {
                        action: "SYNC",
                        target: "EVENT",
                        details: `Sinkronisasi event RSS: Berhasil menambahkan ${createdCount} event baru.`
                    }
                });
            }
            this.lastEventsSync = Date.now();
        } catch (error) {
            console.error("Events Sync Error:", error);
        }
    }

    static async syncProducts() {
        try {
            let products: any[] = [];
            try {
                const { scrapeSiplahProducts } = await import("./siplah-scraper");
                products = await scrapeSiplahProducts();
            } catch (e) { }

            if (products.length === 0) {
                products = [
                    { title: "Buku Pintar Pelajaran SD/Mi 5 In 1", description: "Buku panduan lengkap...", price: 83700, image: "https://cdn.gramedia.com/uploads/items/9789797953461.jpg", category: "Educational Books", subcategory: "Katalog SD", link: "https://www.gramedia.com/products/buku-pintar-pelajaran-sd-mi-5-in-1" }
                ];
            }

            let syncCount = 0;
            for (const product of products) {
                const slug = product.title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 100);
                await prisma.product.upsert({
                    where: { id: slug },
                    update: { description: product.description, price: product.price, image: product.image, category: product.category, subcategory: product.subcategory, link: product.link },
                    create: { id: slug, title: product.title, description: product.description, price: product.price, image: product.image, category: product.category, subcategory: product.subcategory, link: product.link }
                });
                syncCount++;
            }

            // Activity logging removed per user request to reduce noise
        } catch (error) {
            console.error("Products Sync Error:", error);
        }
    }
}
