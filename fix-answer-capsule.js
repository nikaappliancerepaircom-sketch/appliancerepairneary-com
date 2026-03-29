#!/usr/bin/env node
/**
 * fix-answer-capsule.js
 * Injects "Need [service] in [city]? Call (437) 524-1053..." into the
 * first <p> after H1 for service pages that are missing it.
 */

const fs = require('fs');
const path = require('path');

// Pages to skip
const SKIP_FILES = new Set([
  '404.html', 'about.html', 'index.html', 'areas.html', 'book.html',
  'pricing.html', 'privacy.html', 'services.html', 'brands.html',
  'for-businesses.html', 'service-template.html', 'contact.html',
  'llms.txt', 'robots.txt', 'sitemap.xml'
]);

const BASE = 'C:/appliancerepairneary';
const DIRS = [
  BASE,
  path.join(BASE, '_pages_queue'),
  path.join(BASE, 'blog'),
];

function toTitleCase(str) {
  return str
    .split('-')
    .map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); })
    .join(' ');
}

function extractServiceCity(filename) {
  var base = filename.replace(/\.html$/, '');
  var serviceTerminators = ['repair', 'installation', 'service', 'maintenance', 'cleaning'];
  var parts = base.split('-');
  var splitIdx = -1;
  for (var i = parts.length - 1; i >= 0; i--) {
    if (serviceTerminators.indexOf(parts[i].toLowerCase()) !== -1) {
      splitIdx = i;
      break;
    }
  }
  if (splitIdx === -1) return null;
  var serviceParts = parts.slice(0, splitIdx + 1);
  var cityParts = parts.slice(splitIdx + 1);
  if (cityParts.length === 0) return null;
  var service = serviceParts.join(' ');
  var city = toTitleCase(cityParts.join('-'));
  return { service: service, city: city };
}

function findFirstPAfterH1(html) {
  var h1Match = html.match(/<h1[\s>]/i);
  if (!h1Match) return null;
  var searchFrom = h1Match.index;
  var pRegex = /<p(\s[^>]*)?>[\s\S]*?<\/p>/gi;
  pRegex.lastIndex = searchFrom;
  var pMatch = pRegex.exec(html);
  if (!pMatch) return null;
  var openTagMatch = pMatch[0].match(/^<p[^>]*>/i);
  if (!openTagMatch) return null;
  var openTag = openTagMatch[0];
  var innerContent = pMatch[0].slice(openTag.length, pMatch[0].length - 4);
  return {
    index: pMatch.index,
    fullMatch: pMatch[0],
    openTag: openTag,
    innerContent: innerContent
  };
}

var fixedCount = 0;
var skippedCount = 0;
var skippedReasons = { alreadyHasPhone: 0, cantParse: 0, noP: 0, skipFile: 0 };

for (var d = 0; d < DIRS.length; d++) {
  var dir = DIRS[d];
  var isBlog = (dir === path.join(BASE, 'blog'));
  var files = fs.readdirSync(dir).filter(function(f) { return f.endsWith('.html'); });

  for (var i = 0; i < files.length; i++) {
    var filename = files[i];

    if (SKIP_FILES.has(filename)) {
      skippedCount++;
      skippedReasons.skipFile++;
      continue;
    }

    // Skip blog pages entirely
    if (isBlog) {
      skippedCount++;
      skippedReasons.skipFile++;
      continue;
    }

    var filePath = path.join(dir, filename);
    var html = fs.readFileSync(filePath, 'utf8');

    // Find first <p> after H1
    var parsed = findFirstPAfterH1(html);
    if (!parsed) {
      skippedCount++;
      skippedReasons.noP++;
      continue;
    }

    // Skip if first <p> already has phone
    if (parsed.innerContent.indexOf('437') !== -1 || parsed.innerContent.indexOf('524-1053') !== -1) {
      skippedCount++;
      skippedReasons.alreadyHasPhone++;
      continue;
    }

    // Extract service/city from filename
    var info = extractServiceCity(filename);
    if (!info) {
      skippedCount++;
      skippedReasons.cantParse++;
      continue;
    }

    // Build injection sentence
    var injection = 'Need ' + info.service + ' in ' + info.city + '? Call <a href="tel:+14375241053">(437) 524-1053</a> \u2014 same-day service, 90-day parts &amp; labour warranty. ';

    // Rebuild the <p> with injection prepended inside
    var newP = parsed.openTag + injection + parsed.innerContent + '</p>';

    // Replace in HTML
    var newHtml = html.slice(0, parsed.index) + newP + html.slice(parsed.index + parsed.fullMatch.length);

    fs.writeFileSync(filePath, newHtml, 'utf8');
    fixedCount++;
  }
}

console.log('');
console.log('=== fix-answer-capsule.js RESULTS ===');
console.log('  Fixed:   ' + fixedCount);
console.log('  Skipped: ' + skippedCount);
console.log('    - Already has phone in first <p>: ' + skippedReasons.alreadyHasPhone);
console.log('    - Skip-listed / blog:             ' + skippedReasons.skipFile);
console.log('    - Cannot parse service/city:      ' + skippedReasons.cantParse);
console.log('    - No <p> found after H1:          ' + skippedReasons.noP);
console.log('');
