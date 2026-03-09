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
        if (text.includes(city.toLowerCase())) return city;
    }
    return "Gramedia Official";
}

export class SyncService {
    private static lastNewsSync = 0;
    private static lastEventsSync = 0;
    private static lastProductsSync = 0;
    private static readonly SYNC_COOLDOWN = 15 * 60 * 1000;
    private static readonly PRODUCT_SYNC_COOLDOWN = 60 * 60 * 1000;

    private static async fetchRss(url: string) {
        try {
            const { data } = await axios.get(url, {
                timeout: 8000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            return Array.from(data.matchAll(/<item>([\s\S]*?)<\/item>/g)).map((m: any) => m[1]);
        } catch (e) {
            console.error(`[SyncService] RSS fetch error for ${url}:`, e);
            return [];
        }
    }

    private static parseItem(itemContent: string) {
        const title = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim() || "";
        const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || "";
        const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || "";
        const descriptionRaw = itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1') || "";
        const imageMatch = itemContent.match(/<media:content[\s\S]*?url="([\s\S]*?)"/) || descriptionRaw.match(/<img[\s\S]*?src="([\s\S]*?)"/);

        return {
            title, link, pubDate, descriptionRaw,
            image: imageMatch?.[1] || "/images/LOGO/LOGO GMEI (1).png",
            description: descriptionRaw.replace(/<[^>]*>?/gm, '').substring(0, 200),
            sourceId: Buffer.from(link).toString('base64'),
            date: isNaN(new Date(pubDate).getTime()) ? new Date() : new Date(pubDate)
        };
    }

    static async syncNews() {
        if (Date.now() - this.lastNewsSync < this.SYNC_COOLDOWN) return;
        const items = await this.fetchRss("https://www.gramedia.com/blog/feed/");
        let created = 0;

        for (const item of items) {
            const data = this.parseItem(item);
            if (!isRelevant(data.title, data.descriptionRaw)) continue;

            const existing = await prisma.news.findUnique({ where: { sourceId: data.sourceId } });
            if (!existing) created++;

            await prisma.news.upsert({
                where: { sourceId: data.sourceId },
                update: { title: data.title, description: data.description, image: data.image, date: data.date },
                create: {
                    sourceId: data.sourceId, title: data.title, description: data.description, content: data.descriptionRaw,
                    image: data.image, date: data.date, category: "Info Pendidikan", isExternal: true, isPublished: true
                }
            });
        }
        if (created > 0) {
            await prisma.activity.create({ data: { action: "SYNC", target: "NEWS", details: `RSS News: +${created} articles` } });
        }
        this.lastNewsSync = Date.now();
    }

    static async syncEvents() {
        if (Date.now() - this.lastEventsSync < this.SYNC_COOLDOWN) return;
        const items = await this.fetchRss("https://www.gramedia.com/blog/tag/event/feed/");
        let created = 0;

        for (const item of items) {
            const data = this.parseItem(item);
            if (!isRelevant(data.title, data.descriptionRaw)) continue;

            const existing = await prisma.event.findUnique({ where: { sourceId: data.sourceId } });
            if (!existing) created++;

            const loc = extractLocation(data.title, data.descriptionRaw);
            const type = data.date < new Date() ? "Past" : "Upcoming";

            await prisma.event.upsert({
                where: { sourceId: data.sourceId },
                update: { title: data.title, description: data.description, image: data.image, date: data.date, location: loc, type },
                create: {
                    sourceId: data.sourceId, title: data.title, description: data.description, content: data.descriptionRaw,
                    image: data.image, date: data.date, location: loc, type, isExternal: true, isPublished: true, link: data.link
                }
            });
        }
        if (created > 0) {
            await prisma.activity.create({ data: { action: "SYNC", target: "EVENT", details: `RSS Events: +${created} events` } });
        }
        this.lastEventsSync = Date.now();
    }

    static async syncProducts(force = false) {
        if (!force && Date.now() - this.lastProductsSync < this.PRODUCT_SYNC_COOLDOWN) return;

        const products: any[] = [];
        try {
            const { scrapeSiplahProducts } = await import("./siplah-scraper");
            products.push(...await scrapeSiplahProducts());

            const { scrapeGramediaProducts } = await import("./gramedia-scraper");
            products.push(...await scrapeGramediaProducts([
                "https://www.gramedia.com/search?q=smp",
                "https://www.gramedia.com/search?q=buku+sd",
                "https://www.gramedia.com/search?q=sma",
                "https://www.gramedia.com/categories/kerajinan-keterampilan"
            ]));
        } catch (e) {
            console.error("[SyncService] Product sync failed:", e);
        }

        for (const p of products) {
            const id = p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 100);
            await prisma.product.upsert({
                where: { id },
                update: { description: p.description, price: p.price, image: p.image, category: p.category, subcategory: p.subcategory, link: p.link },
                create: { id, title: p.title, description: p.description, price: p.price, image: p.image, category: p.category, subcategory: p.subcategory, link: p.link }
            });
        }
        this.lastProductsSync = Date.now();
    }
}
