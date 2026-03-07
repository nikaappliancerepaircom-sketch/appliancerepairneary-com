#!/usr/bin/env node
/**
 * add-internal-links.js
 * NEARY satellite site (appliancerepairneary.com) — internal link injection
 *
 * Step 1: Hub pages  → "Services in [City]" grid (all service pages for that city)
 *         Hub pages that already have all links get their grid augmented if any are missing
 * Step 2: Service pages → upgrade breadcrumb (link to city hub) + augment "Other Services" section
 * Step 3: Brand pages  → brand+city page links grid
 *
 * Usage:
 *   node add-internal-links.js --dry-run   # preview only
 *   node add-internal-links.js             # write files
 */

const fs   = require('fs');
const path = require('path');

const DRY_RUN  = process.argv.includes('--dry-run');
const SITE_DIR = __dirname;

// ─── Markers to avoid double-injection ───────────────────────────────────────
const MARKER_HUB_GRID     = '<!-- NEARY-HUB-SERVICES-GRID -->';
const MARKER_BREADCRUMB   = '<!-- NEARY-BREADCRUMB -->';
const MARKER_RELATED      = '<!-- NEARY-RELATED-SERVICES -->';
const MARKER_BRAND_CITIES = '<!-- NEARY-BRAND-CITY-LINKS -->';

// ─── Hub city pages — the 5 city-level hub pages that exist ──────────────────
// Only these have actual .html hub files
const HUB_CITIES = new Set(['toronto', 'calgary', 'edmonton', 'airdrie', 'beaumont']);

// ─── City display names ───────────────────────────────────────────────────────
const CITY_MAP = {
  // Hub cities
  'toronto':       'Toronto',
  'calgary':       'Calgary',
  'edmonton':      'Edmonton',
  'airdrie':       'Airdrie',
  'beaumont':      'Beaumont',
  // GTA cities
  'north-york':    'North York',
  'scarborough':   'Scarborough',
  'etobicoke':     'Etobicoke',
  'mississauga':   'Mississauga',
  'brampton':      'Brampton',
  'vaughan':       'Vaughan',
  'markham':       'Markham',
  'richmond-hill': 'Richmond Hill',
  'newmarket':     'Newmarket',
  'aurora':        'Aurora',
  'ajax':          'Ajax',
  'pickering':     'Pickering',
  'whitby':        'Whitby',
  'oshawa':        'Oshawa',
  'oakville':      'Oakville',
  'burlington':    'Burlington',
  'hamilton':      'Hamilton',
  'barrie':        'Barrie',
  'bradford':      'Bradford',
  // Toronto neighbourhoods
  'bayview-village':     'Bayview Village',
  'birchcliff':          'Birchcliff',
  'bloor-west-village':  'Bloor West Village',
  'cabbagetown':         'Cabbagetown',
  'chinatown':           'Chinatown',
  'corso-italia':        'Corso Italia',
  'danforth-village':    'Danforth Village',
  'davisville-village':  'Davisville Village',
  'don-mills':           'Don Mills',
  'dufferin-grove':      'Dufferin Grove',
  'east-york':           'East York',
  'etobicoke-village':   'Etobicoke Village',
  'forest-hill':         'Forest Hill',
  'greektown':           'Greektown',
  'high-park':           'High Park',
  'humber-valley':       'Humber Valley',
  'islington-village':   'Islington Village',
  'king-west':           'King West',
  'lawrence-park':       'Lawrence Park',
  'leaside':             'Leaside',
  'leslieville':         'Leslieville',
  'liberty-village':     'Liberty Village',
  'little-italy':        'Little Italy',
  'little-portugal':     'Little Portugal',
  'midtown':             'Midtown',
  'ossington':           'Ossington',
  'parkdale':            'Parkdale',
  'riverdale':           'Riverdale',
  'roncesvalles':        'Roncesvalles',
  'rosedale':            'Rosedale',
  'scarborough-village': 'Scarborough Village',
  'st-lawrence':         'St. Lawrence',
  'swansea':             'Swansea',
  'the-annex':           'The Annex',
  'the-beaches':         'The Beaches',
  'the-junction':        'The Junction',
  'thorncliffe-park':    'Thorncliffe Park',
  'trinity-bellwoods':   'Trinity Bellwoods',
  'willowdale':          'Willowdale',
  'wychwood':            'Wychwood',
};

// ─── Service slug → display name ─────────────────────────────────────────────
const SERVICE_MAP = {
  'fridge-repair':           'Fridge Repair',
  'washer-repair':           'Washer Repair',
  'dryer-repair':            'Dryer Repair',
  'dishwasher-repair':       'Dishwasher Repair',
  'oven-repair':             'Oven Repair',
  'stove-repair':            'Stove Repair',
  'gas-stove-repair':        'Gas Stove Repair',
  'gas-dryer-repair':        'Gas Dryer Repair',
  'gas-oven-repair':         'Gas Oven Repair',
  'gas-appliance-repair':    'Gas Appliance Repair',
  'dishwasher-installation': 'Dishwasher Installation',
  'microwave-repair':        'Microwave Repair',
  'freezer-repair':          'Freezer Repair',
  'range-repair':            'Range Repair',
};

// ─── Brand slug → display name ────────────────────────────────────────────────
const BRAND_MAP = {
  'samsung-repair':    'Samsung',
  'lg-repair':         'LG',
  'whirlpool-repair':  'Whirlpool',
  'bosch-repair':      'Bosch',
  'frigidaire-repair': 'Frigidaire',
  'ge-repair':         'GE',
  'kenmore-repair':    'Kenmore',
  'maytag-repair':     'Maytag',
  'kitchenaid-repair': 'KitchenAid',
  'miele-repair':      'Miele',
  'electrolux-repair': 'Electrolux',
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = {
  hubGridsAdded:        0,
  hubGridsAugmented:    0,
  breadcrumbsUpgraded:  0,
  relatedAugmented:     0,
  brandCityLinksAdded:  0,
  totalLinksAdded:      0,
  skippedAlreadyDone:   0,
  filesModified:        0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAllHtmlFiles() {
  return fs.readdirSync(SITE_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
}

function getCityName(citySlug) {
  return CITY_MAP[citySlug] ||
    citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getServiceName(serviceSlug) {
  return SERVICE_MAP[serviceSlug] ||
    serviceSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Parse a filename slug into its components
function parseFilename(slug) {
  // Brand+city: e.g. samsung-repair-toronto
  for (const brandSlug of Object.keys(BRAND_MAP)) {
    if (slug.startsWith(brandSlug + '-') && slug !== brandSlug) {
      const city = slug.slice(brandSlug.length + 1);
      return { type: 'brand-city', brandSlug, citySlug: city };
    }
  }

  // Brand page (no city): e.g. samsung-repair
  if (BRAND_MAP[slug]) {
    return { type: 'brand', brandSlug: slug };
  }

  // Service+city: e.g. dishwasher-repair-toronto
  for (const serviceSlug of Object.keys(SERVICE_MAP)) {
    if (slug.startsWith(serviceSlug + '-') && slug !== serviceSlug) {
      const city = slug.slice(serviceSlug.length + 1);
      return { type: 'service-city', serviceSlug, citySlug: city };
    }
  }

  // Pure service: e.g. dishwasher-repair (no city suffix)
  if (SERVICE_MAP[slug]) {
    return { type: 'service', serviceSlug: slug };
  }

  // Hub: one of the 5 hub cities
  if (HUB_CITIES.has(slug)) {
    return { type: 'hub', citySlug: slug };
  }

  return { type: 'other' };
}

// Build index: city → service pages, brand → brand+city pages
function buildIndex(allSlugs) {
  const index = {
    servicePagesForCity: {}, // citySlug → [{serviceSlug, slug}]
    brandCityPages: {},       // brandSlug → [{citySlug, slug}]
  };

  for (const slug of allSlugs) {
    const p = parseFilename(slug);
    if (p.type === 'service-city') {
      if (!index.servicePagesForCity[p.citySlug]) {
        index.servicePagesForCity[p.citySlug] = [];
      }
      index.servicePagesForCity[p.citySlug].push({ serviceSlug: p.serviceSlug, slug });
    }
    if (p.type === 'brand-city') {
      if (!index.brandCityPages[p.brandSlug]) {
        index.brandCityPages[p.brandSlug] = [];
      }
      index.brandCityPages[p.brandSlug].push({ citySlug: p.citySlug, slug });
    }
  }

  return index;
}

// ─── HTML generators ──────────────────────────────────────────────────────────

function buildHubServicesGrid(cityName, servicePages) {
  const links = servicePages.map(({ serviceSlug, slug }) => {
    const serviceName = getServiceName(serviceSlug);
    return `      <a href="/${slug}" style="display:block;padding:12px 16px;background:white;border-radius:8px;border:1px solid #ddd;color:#2563eb;text-decoration:none;font-weight:500;">${serviceName} in ${cityName}</a>`;
  }).join('\n');

  return `
${MARKER_HUB_GRID}
<section style="padding:40px 20px;background:#fff;border-top:1px solid #e5e7eb;">
  <div style="max-width:960px;margin:0 auto;">
    <h2 style="font-size:1.3rem;margin-bottom:20px;color:#111;">Our Appliance Repair Services in ${cityName}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
${links}
    </div>
  </div>
</section>
`;
}

function buildRelatedServicesSection(cityName, servicePages, currentServiceSlug) {
  const others = servicePages
    .filter(p => p.serviceSlug !== currentServiceSlug)
    .slice(0, 8);

  if (others.length === 0) return null;

  const links = others.map(({ serviceSlug, slug }) => {
    const sName = getServiceName(serviceSlug);
    return `      <a href="/${slug}" style="display:block;padding:12px 16px;background:white;border-radius:8px;border:1px solid #ddd;color:#2563eb;text-decoration:none;font-weight:500;">${sName} in ${cityName}</a>`;
  }).join('\n');

  return `
${MARKER_RELATED}
<section style="padding:40px 20px;background:#f0f4ff;">
  <div style="max-width:860px;margin:0 auto;">
    <h2 style="font-size:1.25rem;margin-bottom:16px;color:#111;">More Appliance Repair Services in ${cityName}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
${links}
    </div>
  </div>
</section>
`;
}

function buildBrandCityGrid(brandName, brandCityPages) {
  const links = brandCityPages.map(({ citySlug, slug }) => {
    const cityName = getCityName(citySlug);
    return `      <a href="/${slug}" style="display:block;padding:12px 16px;background:white;border-radius:8px;border:1px solid #ddd;color:#2563eb;text-decoration:none;font-weight:500;">${brandName} Repair in ${cityName}</a>`;
  }).join('\n');

  return `
${MARKER_BRAND_CITIES}
<section style="padding:40px 20px;background:#f0f4ff;">
  <div style="max-width:860px;margin:0 auto;">
    <h2 style="font-size:1.25rem;margin-bottom:16px;color:#111;">${brandName} Appliance Repair — Service Locations</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;">
${links}
    </div>
  </div>
</section>
`;
}

// ─── Injection helpers ────────────────────────────────────────────────────────

// Insert before booking section or before </main>
function insertBeforeBookingOrMain(html, injection) {
  // Try: <section class="booking-section" id="booking">
  let idx = html.indexOf('<section class="booking-section"');
  if (idx === -1) idx = html.indexOf('<section class="booking-section ');
  if (idx !== -1) {
    return html.slice(0, idx) + injection + html.slice(idx);
  }
  // Fallback: before </main>
  const mainEnd = html.lastIndexOf('</main>');
  if (mainEnd !== -1) {
    return html.slice(0, mainEnd) + injection + html.slice(mainEnd);
  }
  return null;
}

// Insert before </main> or before <!-- Footer --> comment (brand pages have no </main>)
function insertBeforeMainEnd(html, injection) {
  const mainEnd = html.lastIndexOf('</main>');
  if (mainEnd !== -1) {
    return html.slice(0, mainEnd) + injection + html.slice(mainEnd);
  }
  // Fallback: before <!-- Footer -->
  const footerIdx = html.indexOf('<!-- Footer -->');
  if (footerIdx !== -1) {
    return html.slice(0, footerIdx) + injection + html.slice(footerIdx);
  }
  // Before footer-placeholder div
  const footerDiv = html.indexOf('<div id="footer-placeholder"');
  if (footerDiv !== -1) {
    return html.slice(0, footerDiv) + injection + html.slice(footerDiv);
  }
  // Before <footer> element
  const footerElem = html.lastIndexOf('<footer');
  if (footerElem !== -1) {
    return html.slice(0, footerElem) + injection + html.slice(footerElem);
  }
  return null;
}

// ─── Step 1: Hub pages → complete services grid ───────────────────────────────
function processHubPage(slug, citySlug, cityName, servicePages) {
  if (servicePages.length === 0) {
    console.log(`  [HUB] ${slug}.html — no service pages found, skipping`);
    return;
  }

  const filePath = path.join(SITE_DIR, slug + '.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Already has our injected grid → skip
  if (html.includes(MARKER_HUB_GRID)) {
    stats.skippedAlreadyDone++;
    console.log(`  [HUB] ${slug}.html — already has NEARY grid, skipping`);
    return;
  }

  // Check which of the service pages are already linked in this hub
  const missingPages = servicePages.filter(({ slug: sSlug }) => {
    return !html.includes(`href="/${sSlug}"`);
  });

  if (missingPages.length === 0) {
    stats.skippedAlreadyDone++;
    console.log(`  [HUB] ${slug}.html — all ${servicePages.length} service pages already linked, skipping`);
    return;
  }

  // Build a grid of ALL service pages for the city
  const grid = buildHubServicesGrid(cityName, servicePages);
  const newHtml = insertBeforeBookingOrMain(html, grid);

  if (!newHtml) {
    console.log(`  [HUB] ${slug}.html — could not find injection point, skipping`);
    return;
  }

  console.log(`  [HUB] ${slug}.html — injecting grid with ${servicePages.length} service links (${missingPages.length} were missing)`);

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newHtml, 'utf8');
    stats.filesModified++;
  }
  stats.hubGridsAdded++;
  stats.totalLinksAdded += servicePages.length;
}

// ─── Step 2: Service+city pages → breadcrumb upgrade + augmented related section
function processServiceCityPage(slug, serviceSlug, citySlug, allServicePagesForCity) {
  const filePath = path.join(SITE_DIR, slug + '.html');
  let html = fs.readFileSync(filePath, 'utf8');

  const cityName    = getCityName(citySlug);
  const serviceName = getServiceName(serviceSlug);
  let modified      = false;
  let linksAdded    = 0;

  const hubExists = HUB_CITIES.has(citySlug) &&
    fs.existsSync(path.join(SITE_DIR, citySlug + '.html'));

  // ── Breadcrumb upgrade ──────────────────────────────────────────────────────
  // Already upgraded by us
  if (html.includes(MARKER_BREADCRUMB)) {
    // already done
  } else if (hubExists) {
    // The existing breadcrumb links to /services — upgrade it to link to the city hub
    // Pattern: <a href="/services">Services</a> ... current page
    // We need to replace the breadcrumb content to include city hub link
    const oldCrumb1 = '<a href="/services">Services</a>';
    const newCrumb1 = `<a href="/services">Services</a>
      <span class="breadcrumb-sep">/</span>
      <a href="/${citySlug}">${cityName}</a>`;

    if (html.includes(oldCrumb1) && !html.includes(`href="/${citySlug}"`)) {
      const newHtml = html.replace(oldCrumb1, newCrumb1);
      if (newHtml !== html) {
        html = newHtml;
        modified = true;
        linksAdded += 1; // added city hub link
        stats.breadcrumbsUpgraded++;
        console.log(`  [SVC] ${slug}.html — breadcrumb upgraded with city hub link`);
      }
    }
  }

  // ── Augment "Other Services" related section ────────────────────────────────
  if (html.includes(MARKER_RELATED)) {
    // Already done by us
  } else {
    // Count how many of the city's service pages are already linked in the related section
    const relatedSection = html.match(/<section[^>]*class="related-section"[^>]*>[\s\S]*?<\/section>/);
    const existingRelatedLinks = new Set();

    if (relatedSection) {
      const matches = relatedSection[0].matchAll(/href="\/([^"]+)"/g);
      for (const m of matches) {
        existingRelatedLinks.add(m[1]);
      }
    }

    // Find service pages for this city that aren't currently linked in related
    const missingRelated = allServicePagesForCity.filter(({ slug: sSlug, serviceSlug: ss }) => {
      return ss !== serviceSlug && !existingRelatedLinks.has(sSlug);
    });

    if (missingRelated.length > 0) {
      const relatedHtml = buildRelatedServicesSection(cityName, missingRelated, serviceSlug);
      if (relatedHtml) {
        const newHtml = insertBeforeBookingOrMain(html, relatedHtml);
        if (newHtml) {
          html = newHtml;
          modified = true;
          linksAdded += missingRelated.length;
          stats.relatedAugmented++;
          console.log(`  [SVC] ${slug}.html — related section: ${missingRelated.length} missing service links added`);
        }
      }
    } else {
      console.log(`  [SVC] ${slug}.html — related section already complete for ${cityName}, skipping`);
      if (!modified) stats.skippedAlreadyDone++;
    }
  }

  if (modified) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, html, 'utf8');
      stats.filesModified++;
    }
    stats.totalLinksAdded += linksAdded;
  }
}

// ─── Step 3: Brand pages → brand+city grid ────────────────────────────────────
function processBrandPage(slug, brandSlug, brandName, brandCityPagesList) {
  if (brandCityPagesList.length === 0) {
    console.log(`  [BRAND] ${slug}.html — no brand+city pages found, skipping`);
    return;
  }

  const filePath = path.join(SITE_DIR, slug + '.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Already has our injected grid
  if (html.includes(MARKER_BRAND_CITIES)) {
    stats.skippedAlreadyDone++;
    console.log(`  [BRAND] ${slug}.html — already has brand city grid, skipping`);
    return;
  }

  // Check how many brand+city pages are already linked
  const alreadyLinked = brandCityPagesList.filter(({ slug: bSlug }) =>
    html.includes(`href="/${bSlug}"`)
  );
  const missing = brandCityPagesList.filter(({ slug: bSlug }) =>
    !html.includes(`href="/${bSlug}"`)
  );

  if (missing.length === 0) {
    stats.skippedAlreadyDone++;
    console.log(`  [BRAND] ${slug}.html — all ${brandCityPagesList.length} city pages already linked, skipping`);
    return;
  }

  // Inject full grid (all brand+city pages)
  const gridHtml = buildBrandCityGrid(brandName, brandCityPagesList);
  const newHtml  = insertBeforeMainEnd(html, gridHtml);

  if (!newHtml) {
    console.log(`  [BRAND] ${slug}.html — could not find injection point, skipping`);
    return;
  }

  console.log(`  [BRAND] ${slug}.html — injecting ${brandCityPagesList.length} city links (${missing.length} were missing)`);

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, newHtml, 'utf8');
    stats.filesModified++;
  }
  stats.brandCityLinksAdded++;
  stats.totalLinksAdded += missing.length;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('\n=== NEARY Internal Link Injector ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no files written)' : 'LIVE (writing files)'}`);
  console.log(`Site: ${SITE_DIR}\n`);

  const allSlugs = getAllHtmlFiles();
  console.log(`Found ${allSlugs.length} HTML files\n`);

  const index = buildIndex(allSlugs);

  // Debug: show discovered cities and brands
  const citiesWithServices = Object.keys(index.servicePagesForCity).sort();
  console.log(`Cities with service pages (${citiesWithServices.length}):`);
  citiesWithServices.forEach(c => {
    console.log(`  ${c}: ${index.servicePagesForCity[c].length} service pages`);
  });
  console.log();

  // ── Step 1: Hub pages → complete services grid ────────────────────────────
  console.log('--- Step 1: Hub pages → services grid ---');
  let hubCount = 0;
  for (const slug of allSlugs) {
    if (!HUB_CITIES.has(slug)) continue;
    if (!fs.existsSync(path.join(SITE_DIR, slug + '.html'))) continue;

    const cityName    = getCityName(slug);
    const servicePages = index.servicePagesForCity[slug] || [];
    hubCount++;
    processHubPage(slug, slug, cityName, servicePages);
  }
  console.log(`Hub pages processed: ${hubCount}\n`);

  // ── Step 2: Service+city pages → breadcrumb + related services ────────────
  console.log('--- Step 2: Service pages → breadcrumb upgrade + related services ---');
  let svcCount = 0;
  for (const slug of allSlugs) {
    const p = parseFilename(slug);
    if (p.type !== 'service-city') continue;
    if (!fs.existsSync(path.join(SITE_DIR, slug + '.html'))) continue;

    const allServicePagesForCity = index.servicePagesForCity[p.citySlug] || [];
    svcCount++;
    processServiceCityPage(slug, p.serviceSlug, p.citySlug, allServicePagesForCity);
  }
  console.log(`Service+city pages processed: ${svcCount}\n`);

  // ── Step 3: Brand pages → brand+city grid ────────────────────────────────
  console.log('--- Step 3: Brand pages → brand+city links ---');
  let brandCount = 0;
  for (const slug of allSlugs) {
    const p = parseFilename(slug);
    if (p.type !== 'brand') continue;
    if (!fs.existsSync(path.join(SITE_DIR, slug + '.html'))) continue;

    const brandName       = BRAND_MAP[p.brandSlug];
    const brandCityPages  = index.brandCityPages[p.brandSlug] || [];
    brandCount++;
    processBrandPage(slug, p.brandSlug, brandName, brandCityPages);
  }
  console.log(`Brand pages processed: ${brandCount}\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('=== SUMMARY ===');
  console.log(`Hub grids added:            ${stats.hubGridsAdded}`);
  console.log(`Breadcrumbs upgraded:       ${stats.breadcrumbsUpgraded}`);
  console.log(`Related sections augmented: ${stats.relatedAugmented}`);
  console.log(`Brand city grids added:     ${stats.brandCityLinksAdded}`);
  console.log(`Total new links added:      ${stats.totalLinksAdded}`);
  console.log(`Pages already up-to-date:   ${stats.skippedAlreadyDone}`);
  if (!DRY_RUN) {
    console.log(`Files modified:             ${stats.filesModified}`);
  }
  console.log(`\nMode: ${DRY_RUN ? 'DRY RUN — no changes written' : 'LIVE — files written'}`);
}

main();
