import { launchBrowser } from './browser-utils';

export interface GramediaProduct {
    title: string;
    description: string;
    price: number | null;
    image: string | null;
    category: string;
    subcategory: string;
    link: string;
    sourceId: string;
}

export async function scrapeGramediaProducts(urls: string[]): Promise<GramediaProduct[]> {
    const browser = await launchBrowser();
    const products: GramediaProduct[] = [];

    try {
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        for (const url of urls) {
            console.log('[Gramedia Scraper] Navigating to:', url);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            try {
                await page.waitForSelector('a[href*="/products/"]', { timeout: 15000 });
            } catch (e) {
                console.log('[Gramedia Scraper] Could not find products on ', url);
                continue;
            }

            // Scroll to trigger lazy loading
            await page.evaluate(() => window.scrollBy(0, 1500));
            await new Promise(res => setTimeout(res, 2000));

            // @ts-ignore
            const extraction = await page.evaluate((baseUrl: string) => {
                const results: import('./gramedia-scraper').GramediaProduct[] = [];
                const cards = Array.from(document.querySelectorAll('a[href*="/products/"]'));

                cards.forEach(card => {
                    try {
                        const hrefStr = card.getAttribute('href') || '';
                        let href = hrefStr;
                        if (!href.startsWith('http') && href) {
                            href = href.startsWith('/') ? baseUrl + href : baseUrl + '/' + href;
                        }

                        const rawText = (card as HTMLElement).innerText || card.textContent || '';
                        const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

                        // Title extraction via preferred selectors
                        let title = '';
                        const titleEl = card.querySelector('[data-testid="productCardTitle"], .list-title, .title, .product-name, h2, h3');
                        if (titleEl && titleEl.textContent) {
                            title = titleEl.textContent.trim();
                        }

                        // Fallback title hunt
                        if (!title || title.length < 5) {
                            const withoutPrice = lines.filter(l => !/Rp|%|cashback|diskon/i.test(l));
                            title = withoutPrice.sort((a, b) => b.length - a.length)[0] || '';
                        }

                        if (!title || title.length < 5) return;

                        let priceNum: number | null = null;
                        const priceLine = lines.find(l => /Rp/i.test(l));
                        if (priceLine) {
                            const match = priceLine.match(/Rp[\s\.]*([0-9\.]+)/i);
                            if (match && match[1]) {
                                priceNum = parseInt(match[1].replace(/\./g, ''), 10);
                            }
                        }

                        const img = card.querySelector('img');
                        const image = img?.src || img?.getAttribute('data-src') || '';

                        let category = 'Educational Books';
                        let subcategory = 'Katalog Umum';
                        const urlLower = baseUrl.toLowerCase();
                        const titleLower = title.toLowerCase();

                        if (urlLower.includes('sd') || titleLower.includes('sd ') || titleLower.includes('mi ')) subcategory = 'Katalog SD';
                        else if (urlLower.includes('smp') || titleLower.includes('smp ') || titleLower.includes('mts ') || titleLower.includes('kelas vii')) subcategory = 'Katalog SMP';
                        else if (urlLower.includes('sma') || titleLower.includes('sma ') || titleLower.includes('smk ') || titleLower.includes('smalb')) subcategory = 'Katalog SMA/SMK';

                        if (urlLower.includes('kerajinan') || urlLower.includes('keterampilan') || titleLower.includes('alat') || titleLower.includes('kreatif')) {
                            category = 'Non-Book Products';
                            subcategory = 'Prakarya & Kewirausahaan';
                        }

                        const sourceId = (title || 'gramedia').substring(0, 50);

                        results.push({
                            title: title.length > 150 ? title.substring(0, 147) + '...' : title,
                            description: `Temukan ${title} di Gramedia.com. Kategori: ${category} > ${subcategory}`,
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
            }, url);

            console.log(`[Gramedia Scraper] Extracted ${extraction.length} items from ${url}`);

            const unique = new Map();
            for (const p of extraction) {
                if (!unique.has(p.title) && p.title.length > 5 && p.price !== null) {
                    unique.set(p.title, p);
                }
            }
            products.push(...Array.from(unique.values()));
        }
    } catch (error) {
        console.error('[Gramedia Scraper] Error details:', error);
    } finally {
        await browser.close();
    }

    return products;
}
