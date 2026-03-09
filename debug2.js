const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('gramedia-test.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const cards = Array.from(document.querySelectorAll('a[href*="/products/"]'));
console.log(`Found ${cards.length} cards`);

cards.slice(0, 2).forEach(card => {
    const getAllTextNodes = (el) => {
        let texts = [];
        el.childNodes.forEach(child => {
            if (child.nodeType === 3) { // TEXT_NODE
                const t = child.textContent?.trim();
                if (t) texts.push(t);
            } else if (child.nodeType === 1) { // ELEMENT_NODE
                texts = texts.concat(getAllTextNodes(child));
            }
        });
        return texts;
    };

    const textNodes = getAllTextNodes(card);
    console.log("TextNodes:", textNodes);

    const candidates = textNodes.filter(t => t.length > 5 && !/Rp|%/i.test(t));
    let title = candidates.sort((a, b) => b.length - a.length)[0];

    let priceNum = null;
    const priceTexts = textNodes.filter(t => /Rp/i.test(t));
    for (const pt of priceTexts) {
        const match = pt.match(/Rp[\s\.]*([0-9\.]+)/i);
        if (match && match[1]) {
            priceNum = parseInt(match[1].replace(/\./g, ''), 10);
            break;
        }
    }

    console.log("-> Title:", title, "Price:", priceNum);
});
