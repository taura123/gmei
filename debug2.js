const fs = require('fs');
const html = fs.readFileSync('gramedia-test.html', 'utf8');
const rx = /<a[^>]*href=\"([^"]*?\/products\/[^"]*?)\"[^>]*>([\s\S]*?)<\/a>/gi;
let m;
let count = 0;
while ((m = rx.exec(html)) && count < 3) {
    const cardHtml = m[2];

    // Simulate querySelector:
    let title = "NOT_FOUND";
    const titleMatch = cardHtml.match(/data-testid="productCardTitle"[^>]*>([\s\S]*?)<\/h2>/) || cardHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
    }
    console.log("Extracted title:", title);
    count++;
}
