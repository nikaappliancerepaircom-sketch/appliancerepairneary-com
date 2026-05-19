#!/usr/bin/env node
/**
 * inject-reviews.js — NEARY (appliancerepairneary.com)
 * Injects rotating customer review cards into service pages before <footer
 */

const fs = require('fs');
const path = require('path');

const SITE_DIR = __dirname;

const REVIEWS = [
  { quote: "Technician arrived within 2 hours. Fixed my Samsung washer drum bearing — works perfectly now. Very professional.", name: "Michael T., Edmonton" },
  { quote: "My LG fridge stopped cooling on a Friday evening. They came Saturday morning and had it running by noon. Lifesaver!", name: "Sandra K., Calgary" },
  { quote: "Fair pricing, no surprises. They diagnosed my dishwasher leak and fixed it same day. Highly recommend.", name: "James R., Edmonton" },
  { quote: "Called at 8am, booked for 11am. Tech was on time, explained everything, fixed oven igniter in 45 mins.", name: "Patricia L., Calgary" },
];

// Files to skip
const SKIP_NAMES = new Set([
  'index.html', 'about.html', '404.html', 'terms.html', 'privacy.html',
  'contact.html', 'book.html', 'brands.html', 'areas.html', 'accessibility.html',
  'sitemap.html', 'robots.html',
]);

function buildReviewsBlock(r1, r2) {
  return `<section class="reviews-block" style="background:#f8f9fa;padding:2rem 1rem;margin:2rem 0;border-radius:12px;">
  <h2 style="text-align:center;font-size:1.4rem;margin-bottom:1.5rem;">&#11088;&#11088;&#11088;&#11088;&#11088; What Our Customers Say</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;max-width:900px;margin:0 auto;">
    <blockquote style="background:#fff;padding:1.25rem;border-radius:8px;border-left:4px solid #2563eb;margin:0;">
      <p style="margin:0 0 0.75rem;font-style:italic;">"${r1.quote}"</p>
      <cite style="font-size:0.9rem;color:#555;">&#8212; ${r1.name}</cite>
    </blockquote>
    <blockquote style="background:#fff;padding:1.25rem;border-radius:8px;border-left:4px solid #2563eb;margin:0;">
      <p style="margin:0 0 0.75rem;font-style:italic;">"${r2.quote}"</p>
      <cite style="font-size:0.9rem;color:#555;">&#8212; ${r2.name}</cite>
    </blockquote>
  </div>
</section>
`;
}

function processFile(filePath, fileIndex) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has reviews block
  if (content.includes('class="reviews-block"') || content.includes('class="testimonials"')) {
    return false;
  }

  // Skip if no <footer tag
  if (!content.includes('<footer')) {
    return false;
  }

  // Select 2 reviews by rotating: Calgary site — favour Calgary reviews (1+3)
  // pairs: (1,3), (0,2), (1,2), (0,3)
  const pairs = [
    [1, 3], // Sandra + Patricia (both Calgary)
    [0, 2], // Michael + James (both Edmonton)
    [1, 2], // Sandra + James
    [0, 3], // Michael + Patricia
  ];
  const pair = pairs[fileIndex % 4];
  const r1 = REVIEWS[pair[0]];
  const r2 = REVIEWS[pair[1]];

  const block = buildReviewsBlock(r1, r2);

  // Inject before <footer
  const footerIdx = content.indexOf('<footer');
  if (footerIdx === -1) return false;

  const newContent = content.slice(0, footerIdx) + block + content.slice(footerIdx);
  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

function main() {
  // Read all .html files in site root (not in subdirs like blog/)
  const entries = fs.readdirSync(SITE_DIR);
  const files = entries
    .filter(e => e.endsWith('.html'))
    .map(e => path.join(SITE_DIR, e));

  // Filter: skip index, about, 404, etc.
  const serviceFiles = files.filter(f => {
    const name = path.basename(f);
    if (SKIP_NAMES.has(name)) return false;
    return true;
  }).sort();

  console.log(`Found ${serviceFiles.length} candidate service HTML files`);

  let updated = 0;
  let skipped = 0;

  serviceFiles.forEach((filePath, idx) => {
    const result = processFile(filePath, idx);
    if (result) {
      updated++;
      if (updated <= 10 || updated % 50 === 0) {
        console.log(`  [${updated}] Updated: ${path.basename(filePath)}`);
      }
    } else {
      skipped++;
    }
  });

  console.log(`\nDone! Updated: ${updated}, Skipped (already had reviews or no footer): ${skipped}`);
}

main();
