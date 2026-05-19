#!/usr/bin/env node
/**
 * fix-schema-name.js -- NEARY
 * Fixes ProfessionalService JSON-LD schema on neighborhood/brand pages:
 *   1. Sets name to "Appliance Repair Neary" (if not already)
 *   2. Adds legalName "Appliance Repair Neary" (if missing)
 *   3. Adds sameAs array (if missing)
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const CORRECT_NAME = 'Appliance Repair Neary';
const SAME_AS = [
  'https://www.google.com/maps/search/Appliance+Repair+Neary+Calgary',
  'https://www.yelp.com/biz/appliance-repair-neary-calgary'
];

const SERVICE_PATTERN = /^(dishwasher|washer|fridge)-repair-.+\.html$/;
const BRAND_PATTERN = /^(lg|samsung|whirlpool|bosch|ge|frigidaire|kenmore|maytag|kitchenaid|electrolux)-repair-.+\.html$/;

function getTargetFiles() {
  const files = fs.readdirSync(DIR);
  return files.filter(f => SERVICE_PATTERN.test(f) || BRAND_PATTERN.test(f));
}

function processFile(filename) {
  const filepath = path.join(DIR, filename);
  let html = fs.readFileSync(filepath, 'utf8');

  const re = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let changed = false;
  let newHtml = html;

  const matches = [];
  let m;
  const reGlobal = new RegExp(re.source, 'gi');
  while ((m = reGlobal.exec(html)) !== null) {
    matches.push({ full: m[0], inner: m[1], index: m.index });
  }

  for (const match of matches) {
    const jsonText = match.inner.trim();
    let schema;
    try {
      schema = JSON.parse(jsonText);
    } catch (e) {
      continue;
    }

    let psNode = null;
    if (schema['@type'] === 'ProfessionalService') {
      psNode = schema;
    } else if (Array.isArray(schema['@graph'])) {
      psNode = schema['@graph'].find(n => n['@type'] === 'ProfessionalService');
    }

    if (!psNode) continue;

    let nodeChanged = false;

    if (psNode['name'] !== CORRECT_NAME) {
      psNode['name'] = CORRECT_NAME;
      nodeChanged = true;
    }

    if (!psNode['legalName']) {
      psNode['legalName'] = CORRECT_NAME;
      nodeChanged = true;
    }

    if (!psNode['sameAs']) {
      psNode['sameAs'] = SAME_AS;
      nodeChanged = true;
    }

    if (nodeChanged) {
      const newJsonText = JSON.stringify(schema);
      const newScript = '<script type="application/ld+json">' + newJsonText + '</script>';
      newHtml = newHtml.replace(match.full, newScript);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filepath, newHtml, 'utf8');
  }

  return changed;
}

const files = getTargetFiles();
console.log('Found ' + files.length + ' files to process...');

let changedCount = 0;
let skippedCount = 0;
let errorCount = 0;

for (const file of files) {
  try {
    const changed = processFile(file);
    if (changed) {
      changedCount++;
    } else {
      skippedCount++;
    }
  } catch (err) {
    errorCount++;
    console.error('ERROR processing ' + file + ': ' + err.message);
  }
}

console.log('\nDone.');
console.log('  Changed: ' + changedCount);
console.log('  Already correct (skipped): ' + skippedCount);
console.log('  Errors: ' + errorCount);
console.log('  Total processed: ' + files.length);
