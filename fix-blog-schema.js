const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'blog');
const LOCAL_BUSINESS_SCHEMA = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Appliance Repair Near Me — Toronto & GTA",
    "telephone": "+14375241053",
    "url": "https://appliancerepairneary.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Toronto",
      "addressRegion": "Ontario",
      "addressCountry": "CA"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "287"
    },
    "areaServed": "Toronto & GTA",
    "openingHours": ["Mo-Sa 08:00-20:00", "Su 09:00-18:00"]
  }
  </script>`;

let fixed = 0;
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filepath = path.join(BLOG_DIR, file);
  let html = fs.readFileSync(filepath, 'utf8');
  if (/"@type"\s*:\s*"LocalBusiness"/.test(html)) continue;
  html = html.replace('</head>', LOCAL_BUSINESS_SCHEMA + '\n</head>');
  fs.writeFileSync(filepath, html);
  fixed++;
  console.log(`  Fixed: ${file}`);
}
console.log(`LocalBusiness schema: fixed ${fixed} blog pages`);
