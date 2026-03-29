const fs = require('fs');
const path = require('path');

const FOLDERS = [
  __dirname,
  path.join(__dirname, '_pages_queue'),
  path.join(__dirname, 'blog'),
];
const PRECONNECT = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;

let fixed = 0, skipped = 0;
for (const folder of FOLDERS) {
  if (!fs.existsSync(folder)) continue;
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filepath = path.join(folder, file);
    let html = fs.readFileSync(filepath, 'utf8');
    if (/rel="preconnect"/i.test(html)) { skipped++; continue; }
    if (/<link\s+rel="stylesheet"/i.test(html)) {
      html = html.replace('<link rel="stylesheet"', `${PRECONNECT}\n  <link rel="stylesheet"`);
    } else {
      html = html.replace('</head>', `${PRECONNECT}\n</head>`);
    }
    fs.writeFileSync(filepath, html);
    fixed++;
  }
}
console.log(`Preconnect: fixed ${fixed} | already had it: ${skipped}`);
