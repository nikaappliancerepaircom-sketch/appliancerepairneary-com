/**
 * fix-titles-meta.js
 * Fix title length (target: ≤60 chars) and meta description length (target: 140-160 chars)
 * for Calgary neighborhood service pages on appliancerepairneary.com
 *
 * Title strategy: Remove " | From $65" if present, otherwise shorten long suffixes
 * Desc strategy: Replace "Book online or email calgary@appliancerepairneary.com." with "Book online."
 *                (or "Book online or email us." if result would be < 140 chars)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASEDIR = 'C:/appliancerepairneary';

// File name patterns to process
const NAME_PATTERNS = [
  /^(dishwasher|washer|fridge)-repair-/,
  /^(lg|samsung|whirlpool|bosch|ge|frigidaire|kenmore|maytag|kitchenaid|electrolux)-repair-/
];

function matchesPattern(filename) {
  return NAME_PATTERNS.some(p => p.test(filename));
}

// ---------------------------------------------------------------------------
// Title shortening logic
// ---------------------------------------------------------------------------
// Map of long suffixes → shorter replacements
const SUFFIX_REPLACEMENTS = [
  // Exact string removal first
  [' | From $65', ''],
  // Long suffix replacements (longest first to avoid partial matches)
  [' | Same-Day Washing Machine Repair', ' | Same-Day Service'],
  [' | Same-Day Refrigerator Repair', ' | Same-Day Service'],
  [' | Same-Day Appliance Repair', ' | Same-Day'],
  [' | Calgary Appliance Repair Near You', ' | Calgary'],
  [' | Appliance Repair Near Me 2026', ' | Same-Day'],
  [' | Appliance Repair Near Me', ' | Same-Day'],
  [' | Book Online 2026', ' | Book Online'],
  // Phone + year suffix
];

/**
 * Shorten a title string to ≤60 chars using known patterns.
 * Returns the new title (unchanged if already ≤60).
 */
function shortenTitle(title) {
  if (title.length <= 60) return title;

  // 1. Try each known suffix replacement
  for (const [search, replace] of SUFFIX_REPLACEMENTS) {
    if (title.includes(search)) {
      const candidate = title.replace(search, replace);
      if (candidate.length <= 60) return candidate;
      // Even after replacement still too long — try further
      if (candidate.length < title.length) {
        // Continue to next rule on shortened candidate
        title = candidate;
      }
    }
  }

  // 2. Handle phone number suffix: "| (437) 524-1053 2026" → truncate year
  title = title.replace(/\| \(\d{3}\) \d{3}-\d{4} 2026/, '| (437) 524-1053');
  if (title.length <= 60) return title;

  // 3. Handle garbled/truncated suffixes with replacement characters
  // e.g. "| Applian� 2026" → "| Same-Day"
  title = title.replace(/\| Appli(?:ance (?:Repair (?:Near(?:\s+\w+)?)?)?)?�.*$/, '| Same-Day');
  if (title.length <= 60) return title;

  // 4. If still too long, truncate at last pipe and add "| Same-Day"
  const pipeIdx = title.lastIndexOf(' | ');
  if (pipeIdx > 0) {
    const base = title.substring(0, pipeIdx);
    const candidate = base + ' | Same-Day';
    if (candidate.length <= 60) return candidate;
    // Base itself too long — hard truncate (shouldn't normally happen)
    return candidate.substring(0, 60);
  }

  // 5. Hard truncate as last resort
  return title.substring(0, 60);
}

// ---------------------------------------------------------------------------
// Description shortening logic
// ---------------------------------------------------------------------------
const EMAIL_LONG = 'Book online or email calgary@appliancerepairneary.com.';
const EMAIL_SHORT = 'Book online.';
const EMAIL_MED = 'Book online or email us.';

function shortenDesc(desc) {
  if (desc.length <= 160) return desc;

  if (desc.endsWith(EMAIL_LONG)) {
    const base = desc.slice(0, -EMAIL_LONG.length);
    // Try shortest first
    const short = base + EMAIL_SHORT;
    if (short.length >= 140 && short.length <= 160) return short;
    if (short.length > 160) {
      // base still too long — trim base to fit 160 with EMAIL_SHORT
      return base.substring(0, 160 - EMAIL_SHORT.length) + EMAIL_SHORT;
    }
    // short.length < 140 — use medium
    const med = base + EMAIL_MED;
    if (med.length >= 140) return med;
    // Still < 140 with medium — just return short (can't pad)
    return short;
  }

  // No email ending — try trimming last sentence
  // For sentences ending in "Updated 2026." or similar patterns
  const updated2026 = / Updated 2026\.?$/;
  if (updated2026.test(desc)) {
    const trimmed = desc.replace(updated2026, '.');
    if (trimmed.length <= 160) return trimmed;
  }

  // General fallback: hard truncate at last word boundary before 160
  if (desc.length > 160) {
    let truncated = desc.substring(0, 160);
    // Find last space to avoid cutting words
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 140) {
      truncated = truncated.substring(0, lastSpace);
    }
    // Ensure ends with period
    if (!truncated.endsWith('.')) truncated += '.';
    return truncated;
  }

  return desc;
}

// ---------------------------------------------------------------------------
// HTML tag fixers
// ---------------------------------------------------------------------------
function fixTitleTag(content) {
  return content.replace(/<title>(.*?)<\/title>/g, (match, title) => {
    const fixed = shortenTitle(title);
    return `<title>${fixed}</title>`;
  });
}

function fixMetaTag(content, nameAttr, attrType) {
  // Fix <meta name="description" content="...">
  // Fix <meta property="og:description" content="...">
  const regex = new RegExp(
    `(<meta\\s+(?:${attrType}="${nameAttr}"[^>]*?|[^>]*?${attrType}="${nameAttr}")[^>]*?\\s+content=")([^"]*)(")`,
    'gi'
  );
  return content.replace(regex, (match, prefix, value, suffix) => {
    let fixed;
    if (nameAttr.includes('title')) {
      fixed = shortenTitle(value);
    } else {
      fixed = shortenDesc(value);
    }
    return `${prefix}${fixed}${suffix}`;
  });
}

function fixOgTitle(content) {
  // og:title
  return content.replace(
    /(<meta\s+property="og:title"\s+content=")([^"]*)(")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenTitle(value)}${suffix}`
  ).replace(
    /(<meta\s+content=")([^"]*)("\s+property="og:title")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenTitle(value)}${suffix}`
  );
}

function fixTwitterTitle(content) {
  return content.replace(
    /(<meta\s+name="twitter:title"\s+content=")([^"]*)(")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenTitle(value)}${suffix}`
  ).replace(
    /(<meta\s+content=")([^"]*)("\s+name="twitter:title")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenTitle(value)}${suffix}`
  );
}

function fixOgDesc(content) {
  return content.replace(
    /(<meta\s+property="og:description"\s+content=")([^"]*)(")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenDesc(value)}${suffix}`
  ).replace(
    /(<meta\s+content=")([^"]*)("\s+property="og:description")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenDesc(value)}${suffix}`
  );
}

function fixMetaDesc(content) {
  return content.replace(
    /(<meta\s+name="description"\s+content=")([^"]*)(")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenDesc(value)}${suffix}`
  ).replace(
    /(<meta\s+content=")([^"]*)("\s+name="description")/gi,
    (match, prefix, value, suffix) => `${prefix}${shortenDesc(value)}${suffix}`
  );
}

// ---------------------------------------------------------------------------
// Main processing
// ---------------------------------------------------------------------------
function processFiles() {
  const allFiles = fs.readdirSync(BASEDIR).filter(f => f.endsWith('.html') && matchesPattern(f));

  let processed = 0;
  let titleFixed = 0;
  let descFixed = 0;
  let unchanged = 0;
  const errors = [];
  const stillLongTitles = [];
  const stillLongDescs = [];

  console.log(`Found ${allFiles.length} matching HTML files`);

  for (const filename of allFiles) {
    const filepath = path.join(BASEDIR, filename);
    try {
      let original = fs.readFileSync(filepath, 'utf-8');
      let content = original;

      // Apply all fixes
      content = fixTitleTag(content);
      content = fixOgTitle(content);
      content = fixTwitterTitle(content);
      content = fixMetaDesc(content);
      content = fixOgDesc(content);

      if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf-8');
        processed++;

        // Check what was fixed
        const origTitleMatch = original.match(/<title>(.*?)<\/title>/);
        const newTitleMatch = content.match(/<title>(.*?)<\/title>/);
        if (origTitleMatch && newTitleMatch && origTitleMatch[1] !== newTitleMatch[1]) {
          titleFixed++;
        }
        const origDescMatch = original.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        const newDescMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        if (origDescMatch && newDescMatch && origDescMatch[1] !== newDescMatch[1]) {
          descFixed++;
        }
      } else {
        unchanged++;
      }

      // Verify final lengths
      const finalTitleMatch = content.match(/<title>(.*?)<\/title>/);
      if (finalTitleMatch && finalTitleMatch[1].length > 60) {
        stillLongTitles.push({ file: filename, length: finalTitleMatch[1].length, title: finalTitleMatch[1] });
      }
      const finalDescMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
      if (finalDescMatch && finalDescMatch[1].length > 160) {
        stillLongDescs.push({ file: filename, length: finalDescMatch[1].length, desc: finalDescMatch[1].substring(0, 80) + '...' });
      }

    } catch (err) {
      errors.push({ file: filename, error: err.message });
    }
  }

  console.log('\n=== RESULTS ===');
  console.log(`Total files found:   ${allFiles.length}`);
  console.log(`Files modified:      ${processed}`);
  console.log(`  - Title fixed:     ${titleFixed}`);
  console.log(`  - Desc fixed:      ${descFixed}`);
  console.log(`Files unchanged:     ${unchanged}`);
  console.log(`Errors:              ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nERRORS:');
    errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
  }

  if (stillLongTitles.length > 0) {
    console.log(`\nStill-long titles (${stillLongTitles.length}):`);
    stillLongTitles.slice(0, 10).forEach(t => console.log(`  [${t.length}] ${t.file}: ${t.title}`));
    if (stillLongTitles.length > 10) console.log(`  ... and ${stillLongTitles.length - 10} more`);
  } else {
    console.log('\nAll titles ≤60 chars ✓');
  }

  if (stillLongDescs.length > 0) {
    console.log(`\nStill-long descs (${stillLongDescs.length}):`);
    stillLongDescs.slice(0, 10).forEach(d => console.log(`  [${d.length}] ${d.file}: ${d.desc}`));
    if (stillLongDescs.length > 10) console.log(`  ... and ${stillLongDescs.length - 10} more`);
  } else {
    console.log('All descs ≤160 chars ✓');
  }

  return { allFiles, processed, titleFixed, descFixed, errors, stillLongTitles, stillLongDescs };
}

processFiles();
