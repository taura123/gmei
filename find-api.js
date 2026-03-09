const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('request', request => {
        if (request.url().includes('api') || request.url().includes('search')) {
            console.log('REQUEST:', request.url());
        }
    });

    console.log("Navigating to https://www.gramedia.com/search?q=smp");
    await page.goto('https://www.gramedia.com/search?q=smp', { waitUntil: 'networkidle2' });

    await browser.close();
})();
