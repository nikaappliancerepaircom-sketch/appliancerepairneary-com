// Check uniqueness of just the body content (between <main> tags)
const fs = require('fs');
const path = require('path');

const SLUGS = [
  'dishwasher-repair-calgary',
  'washer-repair-calgary',
  'dryer-repair-calgary',
  'fridge-repair-calgary',
  'oven-repair-calgary',
  'stove-repair-calgary',
  'freezer-repair-calgary',
  'gas-stove-repair-calgary'
];

function extractMainText(html) {
  const m = html.match(/<main[\s\S]*?<\/main>/);
  if (!m) return '';
  return m[0]
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getNgrams(text, n) {
  const tokens = text.split(' ').filter(t => t.length > 1);
  const grams = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.add(tokens.slice(i, i + n).join(' '));
  }
  return grams;
}

const grams = {};
for (const s of SLUGS) {
  const html = fs.readFileSync(path.join(__dirname, s + '.html'), 'utf8');
  grams[s] = getNgrams(extractMainText(html), 8);
  console.log(`${s}: ${grams[s].size} 8-grams`);
}

console.log('\nMain content uniqueness (8-gram):');
let min = 100, sum = 0, count = 0;
for (let i = 0; i < SLUGS.length; i++) {
  for (let j = i + 1; j < SLUGS.length; j++) {
    const a = grams[SLUGS[i]], b = grams[SLUGS[j]];
    let overlap = 0;
    for (const g of a) if (b.has(g)) overlap++;
    const total = Math.min(a.size, b.size);
    const overlapPct = total === 0 ? 0 : (overlap / total) * 100;
    const uniq = 100 - overlapPct;
    console.log(`  ${SLUGS[i].padEnd(30)} vs ${SLUGS[j].padEnd(30)} ${uniq.toFixed(1)}%`);
    sum += uniq;
    count++;
    if (uniq < min) min = uniq;
  }
}
console.log(`\nAvg: ${(sum/count).toFixed(1)}% Min: ${min.toFixed(1)}%`);
