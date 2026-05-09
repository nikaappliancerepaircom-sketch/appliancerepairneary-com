/**
 * migrate-neary-calgary.js
 * Repurposes NEARY satellite to Calgary-only appliance repair site.
 *
 * Actions per file category:
 *  Calgary CMA  → strip phone, replace footer, replace schema, fix breadcrumb .html, update title
 *  Alberta non-Calgary (Edmonton) → noindex
 *  Toronto/GTA  → noindex + collect redirect map
 *  Homepage     → full Calgary rebrand
 *  ALL pages    → fix BreadcrumbList .html leak
 *
 * Run:  node migrate-neary-calgary.js --dry-run
 *       node migrate-neary-calgary.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const BASE    = __dirname;

// ─── Region classifiers ───────────────────────────────────────────────────────

const CALGARY_TOKENS = [
  'calgary','airdrie','cochrane','okotoks','chestermere',
  'strathmore','banff','canmore','high-river','langdon'
];

const EDMONTON_TOKENS = [
  'edmonton','sherwood-park','st-albert','spruce-grove',
  'fort-saskatchewan','beaumont','leduc','devon','stony-plain'
];

const GTA_CITIES = [
  'toronto','mississauga','brampton','oakville','burlington',
  'etobicoke','scarborough','north-york','markham','vaughan',
  'richmond-hill','newmarket','ajax','pickering','oshawa',
  'whitby','bradford'
];

const GTA_NEIGHBOURHOODS = [
  'bayview-village','birchcliff','bloor-west-village','cabbagetown',
  'chinatown','corso-italia','danforth-village','davisville-village',
  'don-mills','dufferin-grove','east-york','forest-hill','greektown',
  'high-park','humber-valley','islington-village','king-west',
  'lawrence-park','leaside','leslieville','liberty-village',
  'little-italy','little-portugal','midtown','ossington','parkdale',
  'riverdale','roncesvalles','rosedale','st-lawrence','swansea',
  'the-annex','the-beaches','the-junction','thorncliffe-park',
  'trinity-bellwoods','wychwood','willowdale'
];

function classify(slug) {
  if (slug === 'index') return 'homepage';
  if (CALGARY_TOKENS.some(t => slug.includes(t)))   return 'calgary';
  if (EDMONTON_TOKENS.some(t => slug.includes(t)))  return 'edmonton';
  if (GTA_CITIES.some(t => slug.includes(t)))        return 'gta';
  if (GTA_NEIGHBOURHOODS.some(t => slug.includes(t))) return 'gta';
  return 'generic';
}

// ─── Phone strip ──────────────────────────────────────────────────────────────

// Regex covers:  tel:+1437... / tel:+1416... / tel:+1647... / tel:+1403... / tel:+1587... / tel:+1780... / tel:+1825...
// and display forms (437) 524-1053 etc.
const TEL_HREF_RE = /href="tel:\+1(437|416|647|403|587|780|825)\d+"/g;

// Replaces an entire <a href="tel:...">...</a> with an anchor to booking
function stripPhoneLinks(html) {
  // Replace <a href="tel:...">DISPLAY</a> → <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a>
  return html.replace(
    /<a\s[^>]*href="tel:[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    '<a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a>'
  );
}

// Strip raw display phone numbers not inside anchor tags
function stripDisplayPhone(html) {
  // (437) 524-1053, (416) ..., (647) ..., etc.
  return html.replace(/\(\s*(437|416|647|403|587|780|825)\s*\)\s*[\d\s\-\.]{7,}/g, '');
}

// ─── Templates ────────────────────────────────────────────────────────────────

const FOOTER_CALGARY = fs.readFileSync(
  'C:/NikaApplianceRepair/templates/footer-calgary.html', 'utf8'
);

const SCHEMA_CALGARY_TPL = fs.readFileSync(
  'C:/NikaApplianceRepair/templates/schema-calgary.json', 'utf8'
);

// ─── BreadcrumbList .html leak fix ───────────────────────────────────────────

// Matches "item": "https://appliancerepairneary.com/some-path.html"
// and removes the .html extension
function fixBreadcrumbHtmlLeak(html) {
  return html.replace(
    /("item"\s*:\s*"https:\/\/appliancerepairneary\.com\/[^"]+?)\.html"/g,
    '$1"'
  );
}

// ─── noindex injection ───────────────────────────────────────────────────────

function injectNoindex(html) {
  if (html.includes('name="robots"')) {
    // Replace existing robots meta
    return html.replace(
      /<meta\s+name="robots"\s+content="[^"]*"/gi,
      '<meta name="robots" content="noindex, follow"'
    );
  }
  // Insert after <head>
  return html.replace(
    /(<head[^>]*>)/i,
    '$1\n  <meta name="robots" content="noindex, follow">'
  );
}

// ─── Footer replacement ──────────────────────────────────────────────────────

function replaceFooter(html, newFooter) {
  // Match <footer ...>...</footer> (may span many lines; use greedy from last <footer open)
  const footerStart = html.lastIndexOf('<footer');
  if (footerStart === -1) return html + '\n' + newFooter;
  const footerEnd = html.indexOf('</footer>', footerStart);
  if (footerEnd === -1) return html;
  const endIdx = footerEnd + '</footer>'.length;
  return html.slice(0, footerStart) + newFooter + html.slice(endIdx);
}

// ─── Schema replacement ───────────────────────────────────────────────────────

function buildCalgarySchema(pageUrl, businessName, description, heroImage, serviceType) {
  return SCHEMA_CALGARY_TPL
    .replace(/\{\{PAGE_URL\}\}/g, pageUrl)
    .replace(/\{\{BUSINESS_NAME\}\}/g, businessName)
    .replace(/\{\{PAGE_DESCRIPTION\}\}/g, description.replace(/"/g, '&quot;'))
    .replace(/\{\{HERO_IMAGE_URL\}\}/g, heroImage)
    .replace(/\{\{SERVICE_TYPE_OR_APPLIANCE_REPAIR\}\}/g, serviceType);
}

function replaceOrInjectSchema(html, newSchemaJson) {
  const schemaTag = `<script type="application/ld+json">\n${newSchemaJson}\n</script>`;

  // Remove ALL existing JSON-LD script blocks
  const jsonldRE = /<script\s+type="application\/ld\+json"[\s\S]*?<\/script>/gi;
  const cleaned = html.replace(jsonldRE, '');

  // Insert before </head>
  return cleaned.replace('</head>', schemaTag + '\n</head>');
}

// ─── Extract page metadata ────────────────────────────────────────────────────

function extractMeta(html, slug) {
  const titleMatch   = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch    = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonMatch   = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const heroImgMatch = html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);

  const title     = titleMatch  ? titleMatch[1].trim()  : '';
  const desc      = descMatch   ? descMatch[1].trim()   : '';
  const canonical = canonMatch  ? canonMatch[1].trim()  : `https://appliancerepairneary.com/${slug}`;
  const heroImg   = heroImgMatch ? heroImgMatch[1]      : 'https://appliancerepairneary.com/og-image.jpg';

  return { title, desc, canonical, heroImg };
}

// ─── Service type inference ───────────────────────────────────────────────────

function inferServiceType(slug) {
  if (slug.includes('dishwasher')) return 'Dishwasher Repair';
  if (slug.includes('fridge') || slug.includes('refrigerator')) return 'Refrigerator Repair';
  if (slug.includes('washer')) return 'Washer Repair';
  if (slug.includes('dryer')) return 'Dryer Repair';
  if (slug.includes('freezer')) return 'Freezer Repair';
  if (slug.includes('oven')) return 'Oven Repair';
  if (slug.includes('stove') || slug.includes('range')) return 'Stove Repair';
  if (slug.includes('microwave')) return 'Microwave Repair';
  return 'Appliance Repair';
}

// ─── City label from slug ─────────────────────────────────────────────────────

function cityLabel(slug) {
  for (const t of CALGARY_TOKENS) {
    if (slug.includes(t)) {
      return t.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return 'Calgary';
}

// ─── Title update for Calgary pages ──────────────────────────────────────────

function updateTitle(html, slug) {
  const service = inferServiceType(slug);
  const city    = cityLabel(slug);
  const newTitle = `${service} ${city} | Calgary Appliance Repair Near You`;
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${newTitle}</title>`);
}

// ─── Homepage transform ───────────────────────────────────────────────────────

function transformHomepage(html) {
  // Title
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    '<title>Calgary Appliance Repair | Same-Day Service | From $65</title>'
  );

  // Meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"/i,
    '<meta name="description" content="Calgary appliance repair — same-day service in Calgary, Airdrie, Cochrane, Okotoks, Chestermere &amp; Strathmore. From $65. Book online or email calgary@appliancerepairneary.com."'
  );

  // OG title
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"/i,
    '<meta property="og:title" content="Calgary Appliance Repair Near You | Same-Day | From $65"'
  );

  // OG description
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"/i,
    '<meta property="og:description" content="Same-day appliance repair in Calgary and surrounding communities. Book online 7 days/week."'
  );

  // OG site name
  html = html.replace(
    /<meta\s+property="og:site_name"\s+content="[^"]*"/i,
    '<meta property="og:site_name" content="Appliance Repair Near You — Calgary"'
  );

  // H1 — replace the entire H1 block
  html = html.replace(
    /<h1[\s\S]*?<\/h1>/i,
    '<h1>Calgary Appliance Repair Near You</h1>'
  );

  // Strip phone links and display phones
  html = stripPhoneLinks(html);
  html = stripDisplayPhone(html);

  // Replace footer
  html = replaceFooter(html, FOOTER_CALGARY);

  // Build homepage schema
  const schemaJson = buildCalgarySchema(
    'https://appliancerepairneary.com/',
    'Calgary Appliance Repair Near You',
    'Same-day appliance repair in Calgary, Airdrie, Cochrane, Okotoks, Chestermere and Strathmore. Book online or email calgary@appliancerepairneary.com.',
    'https://appliancerepairneary.com/og-image.jpg',
    'Appliance Repair'
  );
  html = replaceOrInjectSchema(html, schemaJson);

  // Fix breadcrumb .html leak
  html = fixBreadcrumbHtmlLeak(html);

  return html;
}

// ─── Calgary page transform ───────────────────────────────────────────────────

function transformCalgary(html, slug) {
  // Strip phone links
  html = stripPhoneLinks(html);
  html = stripDisplayPhone(html);

  // Replace footer
  html = replaceFooter(html, FOOTER_CALGARY);

  // Update title
  html = updateTitle(html, slug);

  // Update meta description to remove Toronto refs
  html = html.replace(/West GTA[^"]*/g, 'Calgary CMA');
  html = html.replace(/GTA[^"]*/g, 'Calgary area');

  // Extract metadata for schema
  const { desc, canonical, heroImg } = extractMeta(html, slug);
  const service     = inferServiceType(slug);
  const city        = cityLabel(slug);
  const bizName     = `${service} ${city} — Calgary Appliance Repair Near You`;
  const schemaDesc  = desc || `Professional ${service} in ${city}. Same-day service, upfront pricing. Book online.`;

  const schemaJson = buildCalgarySchema(
    canonical,
    bizName,
    schemaDesc,
    heroImg,
    service
  );
  html = replaceOrInjectSchema(html, schemaJson);

  // Fix breadcrumb .html leak
  html = fixBreadcrumbHtmlLeak(html);

  return html;
}

// ─── Redirect map builder ─────────────────────────────────────────────────────

const redirectMap = {};

function addRedirect(slug) {
  // Map NEARY path → NAR equivalent (nappliancerepair.com)
  redirectMap[`/${slug}`] = `https://nappliancerepair.com/${slug}`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

const htmlFiles = fs.readdirSync(BASE).filter(f => f.endsWith('.html') && !f.includes('service-template'));

const counts = { homepage: 0, calgary: 0, edmonton: 0, gta: 0, generic: 0, breadcrumbFixed: 0 };

htmlFiles.forEach(file => {
  const slug    = file.replace('.html', '');
  const region  = classify(slug);
  const srcPath = path.join(BASE, file);

  let html = fs.readFileSync(srcPath, 'utf8');

  // Track breadcrumb fixes
  const beforeFix = html;

  if (region === 'homepage') {
    html = transformHomepage(html);
    counts.homepage++;
  } else if (region === 'calgary') {
    html = transformCalgary(html, slug);
    counts.calgary++;
  } else if (region === 'edmonton') {
    // Fix breadcrumb .html leak first (ALL pages requirement)
    html = fixBreadcrumbHtmlLeak(html);
    html = injectNoindex(html);
    counts.edmonton++;
  } else if (region === 'gta') {
    html = fixBreadcrumbHtmlLeak(html);
    html = injectNoindex(html);
    addRedirect(slug);
    counts.gta++;
  } else {
    // generic — fix breadcrumb .html leak only
    html = fixBreadcrumbHtmlLeak(html);
    counts.generic++;
  }

  // Track breadcrumb fixes across all pages
  if (html !== beforeFix && region !== 'homepage' && region !== 'calgary') {
    // For edmonton/gta/generic, count if breadcrumb fixed
    if (beforeFix.match(/("item"\s*:\s*"https:\/\/appliancerepairneary\.com\/[^"]+?)\.html"/)) {
      counts.breadcrumbFixed++;
    }
  }

  if (!DRY_RUN) {
    fs.writeFileSync(srcPath, html, 'utf8');
  }
});

// ─── Breadcrumb fix count (for calgary+homepage) ──────────────────────────────
// Count all files that had .html in breadcrumb
let totalBreadcrumbFixed = 0;
htmlFiles.forEach(file => {
  const html = fs.readFileSync(path.join(BASE, file), 'utf8');
  // We check original — read before write, so in dry-run original is still there
  // After --dry-run: count from current state; after real run: already fixed
  if (!DRY_RUN) {
    // Already written — count 0 (already done)
  }
});

console.log('\n=== migrate-neary-calgary.js ===');
console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (no files written)' : 'LIVE RUN'}`);
console.log(`\nFiles processed:`);
console.log(`  Homepage:             ${counts.homepage}`);
console.log(`  Calgary CMA (full):   ${counts.calgary}`);
console.log(`  Edmonton/non-Calgary: ${counts.edmonton} → noindex`);
console.log(`  GTA/Toronto:          ${counts.gta} → noindex + redirect map`);
console.log(`  Generic:              ${counts.generic}`);
console.log(`  TOTAL HTML:           ${htmlFiles.length}`);
console.log(`\nRedirects collected:  ${Object.keys(redirectMap).length} GTA paths`);

// ─── Write redirects-gta-to-nar.json ─────────────────────────────────────────
if (!DRY_RUN) {
  fs.writeFileSync(
    path.join(BASE, 'redirects-gta-to-nar.json'),
    JSON.stringify(redirectMap, null, 2),
    'utf8'
  );
  console.log('\nWrote: redirects-gta-to-nar.json');
  console.log('Done. Review redirects-gta-to-nar.json then run update-vercel-redirects.js');
} else {
  console.log('\nDRY-RUN: No files written. Run without --dry-run to apply.');
  // Show sample of redirects
  const sample = Object.entries(redirectMap).slice(0, 5);
  console.log('\nSample redirects:');
  sample.forEach(([src, dst]) => console.log(`  ${src} → ${dst}`));
}
