const fs = require('fs');
const html = fs.readFileSync('gramedia-test.html', 'utf8');

const linkRegex = /href="([^"]*?p\/(?:[-\w]+)|[^"]*?products\/[^"]*?)"/g;
const links = [];
let match;
while ((match = linkRegex.exec(html)) !== null) {
    links.push(match[1]);
}
console.log("Found links:", links.length ? links.slice(0, 5) : "None");

// Also check for image src
const imgRegex = /src="([^"]*?)"|data-src="([^"]*?)"/g;
const imgs = [];
while ((match = imgRegex.exec(html)) !== null) {
    if (match[1]) imgs.push(match[1]);
    if (match[2]) imgs.push(match[2]);
}
console.log("Found images:", imgs.filter(i => i.includes('api.gramedia.com') || i.includes('cdn.gramedia.com')).slice(0, 5));

// Find common text lengths
const texts = html.split('<').map(t => t.split('>')[1]).filter(t => t && t.length > 10).slice(0, 10);
console.log("Random text chunks:", texts);
