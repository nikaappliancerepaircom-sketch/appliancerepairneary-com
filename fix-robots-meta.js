const fs = require('fs');
const path = require('path');

const FOLDERS = [
  __dirname,
  path.join(__dirname, '_pages_queue'),
  path.join(__dirname, 'blog'),
];
const ROBOTS_TAG = '  <meta name="robots" content="index, follow">';

let fixed = 0, skipped = 0;
for (const folder of FOLDERS) {
  if (!fs.existsSync(folder)) continue;
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filepath = path.join(folder, file);
    let html = fs.readFileSync(filepath, 'utf8');
    if (/name="robots"/i.test(html)) { skipped++; continue; }
    html = html.replace(/(<meta\s+charset[^>]*>)/i, `$1\n${ROBOTS_TAG}`);
    fs.writeFileSync(filepath, html);
    fixed++;
  }
}
console.log(`Robots meta: fixed ${fixed} | already had it: ${skipped}`);
