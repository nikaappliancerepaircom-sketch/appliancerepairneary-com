#!/usr/bin/env node
/**
 * fix-answer-capsule-v2.js
 * Injects answer capsule into pages still missing phone in first <p>
 * Handles: installation pages, city hubs, brand pages, symptom pages
 */

const fs = require('fs');
const path = require('path');

const PHONE_HTML = '<a href="tel:+14375241053">(437) 524-1053</a>';
const PHONE_PATTERN = /437|524-1053/;

// Skip purely utility pages
const SKIP_FILES = new Set([
  '404.html','book.html','contact.html','areas.html','pricing.html',
  'privacy.html','services.html','brands.html','for-businesses.html',
  'service-template.html','index.html','about.html','sitemap.xml',
  'llms.txt','robots.txt',
]);

const FOLDERS = [
  { dir: __dirname, label: 'root' },
  { dir: path.join(__dirname, '_pages_queue'), label: 'queue' },
  { dir: path.join(__dirname, 'blog'), label: 'blog' },
];

const BRANDS = {
  'bosch': 'Bosch', 'lg': 'LG', 'samsung': 'Samsung', 'whirlpool': 'Whirlpool',
  'frigidaire': 'Frigidaire', 'ge': 'GE', 'kenmore': 'Kenmore', 'miele': 'Miele',
  'maytag': 'Maytag', 'electrolux': 'Electrolux', 'kitchenaid': 'KitchenAid',
};

const APPLIANCES = {
  'washer': 'washer', 'dryer': 'dryer', 'fridge': 'fridge', 'refrigerator': 'fridge',
  'dishwasher': 'dishwasher', 'oven': 'oven', 'stove': 'stove', 'range': 'range',
  'freezer': 'freezer', 'microwave': 'microwave', 'appliance': 'appliance',
};

function toTitleCase(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function buildCapsule(filename) {
  const base = filename.replace('.html', '').toLowerCase();
  const parts = base.split('-');

  // Skip blog pages
  if (base.startsWith('appliance-repair-') && !base.includes('-repair-near')) return null;

  // --- Pattern: [brand]-[appliance]-repair(-[city]).html ---
  // e.g. bosch-repair-calgary, lg-fridge-repair, ge-washer-repair
  const brandKey = Object.keys(BRANDS).find(b => parts[0] === b || (parts.length > 1 && parts[1] === b));
  if (brandKey) {
    const brand = BRANDS[brandKey];
    // Extract city: last part(s) after known keywords
    const cityStartIdx = parts.findIndex((p, i) => i > 0 && !['repair','fridge','washer','dryer','dishwasher','oven','stove','range','freezer','microwave','appliance'].includes(p));
    let city = '';
    let appliance = '';

    // Find appliance type
    const appKey = parts.find(p => APPLIANCES[p] && p !== brandKey);
    if (appKey) appliance = APPLIANCES[appKey] + ' repair';
    else appliance = 'appliance repair';

    // Find city (parts after 'repair')
    const repairIdx = parts.indexOf('repair');
    if (repairIdx !== -1 && repairIdx < parts.length - 1) {
      city = toTitleCase(parts.slice(repairIdx + 1).join(' '));
    }

    if (city) {
      return `Need ${brand} ${appliance} in ${city}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
    } else {
      return `Need ${brand} ${appliance}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
    }
  }

  // --- Pattern: [service]-installation-[city].html ---
  if (base.includes('-installation-') || base.includes('-installation')) {
    const installIdx = parts.indexOf('installation');
    const serviceStr = parts.slice(0, installIdx).join(' ');
    const cityParts = parts.slice(installIdx + 1);
    const city = cityParts.length ? toTitleCase(cityParts.join(' ')) : '';
    if (city) {
      return `Need ${serviceStr} installation in ${city}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
    } else {
      return `Need ${serviceStr} installation? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
    }
  }

  // --- Pattern: [appliance]-not-[symptom]-near-me.html ---
  if (base.includes('-near-me') || base.includes('-not-')) {
    const appKey = parts[0];
    const appliance = APPLIANCES[appKey] || appKey;
    return `Need ${appliance} repair near you? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
  }

  // --- Pattern: [service]-repair-[city] (already handled in v1, fallback) ---
  const repairIdx = parts.indexOf('repair');
  if (repairIdx !== -1 && repairIdx > 0) {
    const service = parts.slice(0, repairIdx).join(' ') + ' repair';
    const cityParts = parts.slice(repairIdx + 1);
    const city = cityParts.length ? toTitleCase(cityParts.join(' ')) : '';
    if (city) {
      return `Need ${service} in ${city}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
    }
  }

  // --- Pattern: [city].html (city hub pages like toronto.html, calgary.html) ---
  const cityHubs = ['toronto','calgary','edmonton','mississauga','brampton','markham',
    'vaughan','richmond','newmarket','oakville','burlington','oshawa','pickering',
    'ajax','whitby','scarborough','airdrie','beaumont','canmore','chestermere',
    'cochrane','devon','fort','high','langdon','leduc','okotoks','sherwood',
    'spruce','stony','strathmore'];
  if (cityHubs.some(c => base.startsWith(c)) || parts.length <= 2) {
    const city = toTitleCase(base.replace(/-/g, ' '));
    return `Need appliance repair in ${city}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
  }

  // --- Gas appliance pages ---
  if (base.startsWith('gas-')) {
    const service = parts.slice(0, 3).join(' '); // e.g. gas dryer repair
    const cityParts = parts.slice(3);
    const city = cityParts.length ? toTitleCase(cityParts.join(' ')) : '';
    if (city) return `Need ${service} in ${city}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
    return `Need ${service}? Call ${PHONE_HTML} — same-day service, 90-day parts &amp; labour warranty. `;
  }

  return null; // can't determine
}

let fixed = 0, skipped = 0, noPattern = 0;

for (const { dir, label } of FOLDERS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();

  for (const file of files) {
    if (SKIP_FILES.has(file)) { skipped++; continue; }

    const filepath = path.join(dir, file);
    let html = fs.readFileSync(filepath, 'utf8');

    // Already has phone in first <p>?
    const firstParaMatch = html.match(/<p[^>]*>([\s\S]{0,600}?)<\/p>/i);
    if (!firstParaMatch) { skipped++; continue; }
    if (PHONE_PATTERN.test(firstParaMatch[1])) { skipped++; continue; }

    const capsule = buildCapsule(file);
    if (!capsule) { noPattern++; continue; }

    html = html.replace(
      firstParaMatch[0],
      firstParaMatch[0].replace(/(<p[^>]*>)/i, `$1${capsule}`)
    );
    fs.writeFileSync(filepath, html);
    fixed++;
  }
}

console.log(`Answer capsule v2: fixed ${fixed} | skipped ${skipped} | no pattern ${noPattern}`);
