import puppeteer from 'puppeteer-core';

const SIPLAH_URL = 'https://siplahgramedia.id/main/penyedia/70756dc2b4ac4e028d12d9fc313eb832';

// Find Chrome executable path on Windows
const CHROME_PATHS = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\' + (process.env.USERNAME || 'HP') + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
];

function getChromePath(): string {
    const { existsSync } = require('fs');

    // 1. Priority: Environment variable (useful for production/Vercel)
    if (process.env.CHROME_EXECUTABLE_PATH && existsSync(process.env.CHROME_EXECUTABLE_PATH)) {
        return process.env.CHROME_EXECUTABLE_PATH;
    }

    // 2. Default paths for Windows local development
    for (const p of CHROME_PATHS) {
        if (existsSync(p)) return p;
    }

    // 3. Last resort (useful for Linux production if not set)
    const linuxPath = '/usr/bin/google-chrome';
    if (existsSync(linuxPath)) return linuxPath;

    throw new Error('Chrome not found. Install Google Chrome or set CHROME_EXECUTABLE_PATH.');
}

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
    const browser = await puppeteer.launch({
        executablePath: getChromePath(),
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
        ],
    });

    const products: SiplahProduct[] = [];

    try {
        const page = await browser.newPage();

        // Set a realistic user agent
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        console.log('[SIPLah Scraper] Navigating to:', SIPLAH_URL);
        await page.goto(SIPLAH_URL, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait a few seconds for hydration/rendering
        await new Promise(res => setTimeout(res, 3000));

        // Small scroll to trigger initial lazy images without unmounting virtualization nodes
        await page.evaluate(() => window.scrollBy(0, 1500));
        await new Promise(res => setTimeout(res, 3000));

        // Extract products using the exact DOM structure from SIPLah
        const extraction = await page.evaluate((baseUrl) => {
            const results: import('./siplah-scraper').SiplahProduct[] = [];

            // Look for card containers
            const cards = Array.from(document.querySelectorAll('.card.custom-box-shadow, .card'));

            cards.forEach(card => {
                try {
                    // Try to find the title
                    const titleEl = card.querySelector('.nama-product, .card-title.nama-product, h1, h2, h3, h4, h5');
                    let title = titleEl?.textContent?.trim() || '';
                    if (!title || title.length < 3) {
                        // Fallback title hunt
                        const texts = (card.textContent || '').split('\n').map(t => t.trim()).filter(t => t.length > 5 && !t.includes('Rp'));
                        if (texts.length > 0) title = texts[0];
                    }

                    const textContent = (card as HTMLElement).innerText || card.textContent || '';

                    // 1. Price
                    const priceMatches = textContent.match(/Rp[\s\.]*([0-9\.]+)/i);
                    let priceNum = null;
                    if (priceMatches && priceMatches[1]) {
                        priceNum = parseInt(priceMatches[1].replace(/\./g, ''), 10);
                    } else {
                        const hargaMatch = textContent.match(/harga.*?([0-9\.]+)/i);
                        if (hargaMatch && hargaMatch[1]) {
                            priceNum = parseInt(hargaMatch[1].replace(/\./g, ''), 10);
                        }
                    }

                    // 2. Image
                    const img = card.querySelector('img');
                    let image = img?.src || img?.getAttribute('data-src') || '';
                    if (!image.startsWith('http') && image) {
                        image = image.startsWith('/') ? baseUrl + image : baseUrl + '/' + image;
                    }

                    // 3. Link (SIPLah often uses JS routing, so fallback to main URL if no <a> found)
                    let href = '';
                    const a = card.querySelector('a');
                    if (a && a.href) href = a.href;
                    if (!href.startsWith('http') && href) {
                        href = href.startsWith('/') ? baseUrl + href : baseUrl + '/' + href;
                    }

                    // 4. Description
                    const categoryBadge = card.querySelector('.badge-primary')?.textContent?.trim() || '';
                    let description = `Produk asli dari SIPLah Gramedia. ${title}. Kategori: ${categoryBadge}`;
                    if (description.length > 200) description = description.substring(0, 197) + '...';

                    // 5. Category
                    let category = 'Educational Books';
                    let subcategory = 'Katalog Umum';
                    const titleLower = title.toLowerCase();

                    if (titleLower.includes('sd ') || titleLower.includes('mi ')) subcategory = 'Katalog SD';
                    else if (titleLower.includes('smp ') || titleLower.includes('mts ') || titleLower.includes('kelas vii')) subcategory = 'Katalog SMP';
                    else if (titleLower.includes('sma ') || titleLower.includes('smk ') || titleLower.includes('smalb')) subcategory = 'Katalog SMA/SMK';

                    if (titleLower.includes('poster') || titleLower.includes('alat') || titleLower.includes('atk') || titleLower.includes('peralatan') || titleLower.includes('greebel') || titleLower.includes('sepeda motor')) {
                        category = 'Non-Book Products';
                        subcategory = 'Perlengkapan Sekolah & APE';
                    }

                    const sourceId = btoa(title || 'siplah').substring(0, 50);

                    // Add product even if it lacks some fields to ensure we don't drop everything
                    if (title.length > 2) {
                        results.push({
                            title: title.substring(0, 150),
                            description,
                            price: priceNum,
                            image: image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
                            category,
                            subcategory,
                            link: href || baseUrl, // Fallback to provided URL (SIPLah penyedia URL)
                            sourceId
                        });
                    }
                } catch (e) { }
            });

            return {
                cardCount: cards.length,
                bodyLength: document.body.innerHTML.length,
                results
            };
        }, 'https://siplahgramedia.id');

        console.log(`[SIPLah Scraper] DOM scan found ${extraction.cardCount} cards in body of length ${extraction.bodyLength}`);
        console.log(`[SIPLah Scraper] Extracted ${extraction.results.length} items via DOM text parsing`);

        // De-duplicate
        const unique = new Map();
        for (const p of extraction.results) {
            if (!unique.has(p.title) && p.title.length > 5 && p.price !== null) {
                unique.set(p.title, p);
            }
        }

        const finalArr = Array.from(unique.values());
        console.log(`[SIPLah Scraper] Final processed unique products: ${finalArr.length}`);
        products.push(...finalArr);

    } finally {
        await browser.close();
    }

    return products;
}
