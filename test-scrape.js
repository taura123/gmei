const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://www.gramedia.com/search?q=smp', { waitUntil: 'networkidle2' });
    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('gramedia-test.html', html);
    await browser.close();
    console.log("Done");
}

run();
