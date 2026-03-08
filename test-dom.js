const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });

    // Go to the local page or vercel if we can't do local, but let's try Vercel first since it's deployed.
    // Actually, my edits are to the local code, have they been deployed? 
    // NO! I've been opening https://gmei.vercel.app/ in the browser subagent!
    // My local edits are NOT deployed to Vercel automatically until I push!

    console.log("Analyzing local...");
    await browser.close();
})();
