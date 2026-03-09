import { launchBrowser } from './browser-utils';

const SIPLAH_URL = 'https://siplahgramedia.id/main/penyedia/70756dc2b4ac4e028d12d9fc313eb832';

export interface SiplahProduct {
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
    subcategory: string;
    link: string;
    sourceId: string;
}

export async function scrapeSiplahProducts(): Promise<SiplahProduct[]> {
    const browser = await launchBrowser();
    const products: SiplahProduct[] = [];

    try {
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        console.log('[SIPLah Scraper] Navigating to:', SIPLAH_URL);
        await page.goto(SIPLAH_URL, { waitUntil: 'networkidle2', timeout: 60000 });

        await new Promise(res => setTimeout(res, 3000));
        await page.evaluate(() => window.scrollBy(0, 1500));
        await new Promise(res => setTimeout(res, 3000));

        // @ts-ignore
        const extraction = await page.evaluate((baseUrl) => {
            const results: import('./siplah-scraper').SiplahProduct[] = [];
            const cards = Array.from(document.querySelectorAll('.card.custom-box-shadow, .card'));

            cards.forEach(card => {
                try {
                    const titleEl = card.querySelector('.nama-product, h1, h2, h3, h4, h5');
                    let title = titleEl?.textContent?.trim() || '';
                    if (!title || title.length < 3) {
                        const texts = (card.textContent || '').split('\n').map(t => t.trim()).filter(t => t.length > 5 && !t.includes('Rp'));
                        if (texts.length > 0) title = texts[0];
                    }

                    if (!title || title.length < 3) return;

                    const textContent = (card as HTMLElement).innerText || card.textContent || '';
                    const priceMatches = textContent.match(/Rp[\s\.]*([0-9\.]+)/i);
                    let priceNum = priceMatches?.[1] ? parseInt(priceMatches[1].replace(/\./g, ''), 10) : null;

                    const img = card.querySelector('img');
                    let image = img?.src || img?.getAttribute('data-src') || '';
                    if (!image.startsWith('http') && image) {
                        image = image.startsWith('/') ? baseUrl + image : baseUrl + '/' + image;
                    }

                    let href = card.querySelector('a')?.href || '';
                    if (!href.startsWith('http') && href) {
                        href = href.startsWith('/') ? baseUrl + href : baseUrl + '/' + href;
                    }

                    const categoryBadge = card.querySelector('.badge-primary')?.textContent?.trim() || '';
                    const description = `Produk asli dari SIPLah Gramedia. ${title}. Kategori: ${categoryBadge}`;

                    let category = 'Educational Books';
                    let subcategory = 'Katalog Umum';
                    const titleLower = title.toLowerCase();

                    if (titleLower.includes('sd ') || titleLower.includes('mi ')) subcategory = 'Katalog SD';
                    else if (titleLower.includes('smp ') || titleLower.includes('mts ') || titleLower.includes('kelas vii')) subcategory = 'Katalog SMP';
                    else if (titleLower.includes('sma ') || titleLower.includes('smk ') || titleLower.includes('smalb')) subcategory = 'Katalog SMA/SMK';

                    if (titleLower.includes('poster') || titleLower.includes('alat') || titleLower.includes('atk') || titleLower.includes('peralatan') || titleLower.includes('greebel')) {
                        category = 'Non-Book Products';
                        subcategory = 'Perlengkapan Sekolah & APE';
                    }

                    const sourceId = btoa(title).substring(0, 50);

                    results.push({
                        title: title.substring(0, 150),
                        description: description.length > 200 ? description.substring(0, 197) + '...' : description,
                        price: priceNum,
                        image: image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
                        category,
                        subcategory,
                        link: href || baseUrl,
                        sourceId
                    });
                } catch (e) { }
            });

            return results;
        }, 'https://siplahgramedia.id');

        console.log(`[SIPLah Scraper] Extracted ${extraction.length} items`);

        const unique = new Map();
        for (const p of extraction) {
            if (!unique.has(p.title) && p.title.length > 5 && p.price !== null) {
                unique.set(p.title, p);
            }
        }

        const finalArr = Array.from(unique.values());
        products.push(...finalArr);
    } finally {
        await browser.close();
    }

    return products;
}
