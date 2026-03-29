#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DIR = 'C:/appliancerepairneary';

const GTA_CITIES = [
  ['toronto',       'Toronto'],
  ['scarborough',   'Scarborough'],
  ['north-york',    'North York'],
  ['etobicoke',     'Etobicoke'],
  ['mississauga',   'Mississauga'],
  ['brampton',      'Brampton'],
  ['vaughan',       'Vaughan'],
  ['richmond-hill', 'Richmond Hill'],
  ['markham',       'Markham'],
  ['oakville',      'Oakville'],
  ['burlington',    'Burlington'],
  ['pickering',     'Pickering'],
  ['ajax',          'Ajax'],
  ['whitby',        'Whitby'],
  ['oshawa',        'Oshawa'],
  ['newmarket',     'Newmarket'],
  ['bradford',      'Bradford'],
];

const SERVICES = [
  { prefix: 'dishwasher-repair', label: 'Dishwasher Repair' },
  { prefix: 'fridge-repair',     label: 'Fridge Repair' },
  { prefix: 'washer-repair',     label: 'Washer Repair' },
  { prefix: 'dryer-repair',      label: 'Dryer Repair' },
  { prefix: 'oven-repair',       label: 'Oven Repair' },
  { prefix: 'stove-repair',      label: 'Stove Repair' },
];

function buildNearbyLinks(service, currentCity) {
  const items = GTA_CITIES
    .filter(([slug]) => slug !== currentCity)
    .map(([slug, label]) => `          <li><a href="/${service.prefix}-${slug}">${service.label} in ${label}</a></li>`)
    .join('\n');
  return `<div class="related-col">
        <h3>${service.label} in Nearby Areas</h3>
        <ul class="related-links">
${items}
        </ul>
      </div>`;
}

const nearbyPattern = /<div class="related-col">\s*<h3>[^<]*Nearby Areas[^<]*<\/h3>[\s\S]*?<\/ul>\s*<\/div>/;

let updated = 0, skipped = 0, noSection = 0;

for (const service of SERVICES) {
  for (const [citySlug] of GTA_CITIES) {
    const file = path.join(DIR, `${service.prefix}-${citySlug}.html`);
    if (!fs.existsSync(file)) { skipped++; continue; }

    let html = fs.readFileSync(file, 'utf8');
    const newSection = buildNearbyLinks(service, citySlug);

    if (nearbyPattern.test(html)) {
      const newHtml = html.replace(nearbyPattern, newSection);
      if (newHtml !== html) {
        fs.writeFileSync(file, newHtml, 'utf8');
        updated++;
        console.log(`✓ ${service.prefix}-${citySlug}`);
      } else {
        skipped++;
        console.log(`= unchanged: ${service.prefix}-${citySlug}`);
      }
    } else {
      noSection++;
      console.log(`~ no section: ${service.prefix}-${citySlug}`);
    }
  }
}

console.log(`\n=============================`);
console.log(`Updated:    ${updated}`);
console.log(`No section: ${noSection}`);
console.log(`Skipped:    ${skipped}`);
