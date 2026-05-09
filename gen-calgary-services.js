#!/usr/bin/env node
/**
 * gen-calgary-services.js
 *
 * Generates 8 high-quality Calgary service pages (~2000+ words each).
 * No external API dependencies — pure Node.js / fs.
 *
 * Usage:
 *   node gen-calgary-services.js              # generate all 8
 *   node gen-calgary-services.js dishwasher   # generate one
 *   node gen-calgary-services.js --check      # word counts and uniqueness
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;

const SERVICES = [
  {
    slug: 'dishwasher-repair-calgary',
    appliance: 'dishwasher',
    h1: 'Dishwasher Repair Calgary',
    title: 'Dishwasher Repair Calgary | Same-Day | From $65',
    metaDesc: 'Same-day dishwasher repair across Calgary, Airdrie, Cochrane, Okotoks. Licensed technicians. Hard-water specialists. Diagnostic from $65. Book online.',
    keyword: 'dishwasher repair calgary',
    serviceLong: 'Dishwasher Repair'
  },
  {
    slug: 'washer-repair-calgary',
    appliance: 'washer',
    h1: 'Washer Repair Calgary',
    title: 'Washer Repair Calgary | Same-Day Service | From $65',
    metaDesc: 'Calgary washer repair done right — front-load, top-load, HE. Same-day across Calgary CMA. Drain pump, bearings, control boards. Book online.',
    keyword: 'washer repair calgary',
    serviceLong: 'Washer Repair'
  },
  {
    slug: 'dryer-repair-calgary',
    appliance: 'dryer',
    h1: 'Dryer Repair Calgary',
    title: 'Dryer Repair Calgary | Same-Day Service | From $65',
    metaDesc: 'Calgary dryer repair — gas and electric. Heating elements, igniters, drum belts, blocked vents. Same-day Calgary CMA. From $65 diagnostic.',
    keyword: 'dryer repair calgary',
    serviceLong: 'Dryer Repair'
  },
  {
    slug: 'fridge-repair-calgary',
    appliance: 'fridge',
    h1: 'Fridge Repair Calgary',
    title: 'Fridge Repair Calgary | Same-Day Service | From $65',
    metaDesc: 'Calgary fridge repair: not cooling, leaking, ice maker, compressor. Same-day across Calgary, Airdrie, Cochrane, Okotoks. From $65 diagnostic.',
    keyword: 'fridge repair calgary',
    serviceLong: 'Fridge Repair'
  },
  {
    slug: 'oven-repair-calgary',
    appliance: 'oven',
    h1: 'Oven Repair Calgary',
    title: 'Oven Repair Calgary | Same-Day Service | From $65',
    metaDesc: 'Calgary oven repair gas and electric ovens, wall ovens, double ovens. Igniters, elements, control boards. Same-day Calgary CMA. From $65.',
    keyword: 'oven repair calgary',
    serviceLong: 'Oven Repair'
  },
  {
    slug: 'stove-repair-calgary',
    appliance: 'stove',
    h1: 'Stove Repair Calgary',
    title: 'Stove Repair Calgary | Same-Day Service | From $65',
    metaDesc: 'Calgary stove repair induction, electric coil, smoothtop. Burner failure, control board, switches. Same-day Calgary CMA. From $65 diagnostic.',
    keyword: 'stove repair calgary',
    serviceLong: 'Stove Repair'
  },
  {
    slug: 'freezer-repair-calgary',
    appliance: 'freezer',
    h1: 'Freezer Repair Calgary',
    title: 'Freezer Repair Calgary | Same-Day Service | From $65',
    metaDesc: 'Calgary freezer repair chest, upright, garage. Not freezing, frost build-up, compressor failure. Cold-climate specialists. From $65 diagnostic.',
    keyword: 'freezer repair calgary',
    serviceLong: 'Freezer Repair'
  },
  {
    slug: 'gas-stove-repair-calgary',
    appliance: 'gas stove',
    h1: 'Gas Stove Repair Calgary',
    title: 'Gas Stove Repair Calgary | Licensed | Same-Day',
    metaDesc: 'Licensed Calgary gas stove repair pilot light, igniter, regulator, gas line. ATCO-aware technicians. Same-day Calgary CMA. From $65 diagnostic.',
    keyword: 'gas stove repair calgary',
    serviceLong: 'Gas Stove Repair'
  }
];

const SERVICE_CONTENT = require('./gen-calgary-content.js');

function loadCalgaryAreas() {
  const fallback = [
    'Beltline', 'Mission', 'Inglewood', 'Hillhurst', 'Tuscany', 'Sage Hill',
    'Cranston', 'Auburn Bay', 'Mahogany', 'Walden', 'Legacy', 'McKenzie Lake',
    'Saddle Ridge', 'Panorama Hills', 'Country Hills', 'Royal Oak', 'Bowness',
    'Montgomery', 'Varsity', 'Brentwood', 'Dalhousie', 'Edgemont', 'Marda Loop',
    'Altadore', 'Killarney', 'Currie Barracks', 'West Springs', 'Aspen Woods',
    'Signal Hill', 'Springbank Hill', 'Bridgeland', 'Mount Royal', 'Britannia',
    'Bel-Aire', 'Roxboro', 'Hamptons', 'Evanston', 'Ranchlands', 'Kincora',
    'Citadel', 'Hidden Valley'
  ];
  try {
    const data = JSON.parse(fs.readFileSync('C:/NikaApplianceRepair/.tmp-dfs/geo-calgary.json', 'utf8'));
    const names = data
      .filter(d => d.parent_city === 'Calgary' && d.type === 'neighborhood')
      .map(d => d.display_name)
      .slice(0, 40);
    return names.length > 20 ? names : fallback;
  } catch (e) {
    return fallback;
  }
}

const CALGARY_AREAS = loadCalgaryAreas();

const BRANDS_LIST = [
  'Bosch', 'LG', 'Samsung', 'Whirlpool', 'KitchenAid', 'Miele', 'GE Profile',
  'Maytag', 'Frigidaire', 'Electrolux', 'Kenmore', 'Sub-Zero', 'Wolf',
  'Viking', 'Thermador', 'Jenn-Air', 'Fisher Paykel', 'Dacor', 'Speed Queen', 'Asko'
];

const SUBURBS = [
  ['airdrie', 'Airdrie'],
  ['cochrane', 'Cochrane'],
  ['okotoks', 'Okotoks'],
  ['chestermere', 'Chestermere'],
  ['strathmore', 'Strathmore'],
  ['high-river', 'High River'],
  ['langdon', 'Langdon'],
  ['bragg-creek', 'Bragg Creek']
];

function buildBodyContent(svc) {
  const c = SERVICE_CONTENT[svc.appliance];
  const applianceTitle = svc.appliance.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const problemsHtml = c.problems.map(([name, desc]) =>
    `    <div class="problem-card"><div class="problem-name">${name}</div><div class="problem-desc">${desc}</div></div>`
  ).join('\n');

  const pricingHtml = c.pricing.map(([item, cost]) =>
    `      <tr><td>${item}</td><td>${cost}</td></tr>`
  ).join('\n');

  const brandsHtml = BRANDS_LIST.map(b =>
    `    <div class="brand-chip">${b}</div>`
  ).join('\n');

  const areasHtml = CALGARY_AREAS.map(a =>
    `    <li>${a}</li>`
  ).join('\n');

  const faqVisibleHtml = c.faq.map(([q, a]) =>
    `      <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">${q}</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${a}</p></div></details>`
  ).join('\n');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': c.faq.map(([q, a]) => ({
      '@type': 'Question',
      'name': q,
      'acceptedAnswer': { '@type': 'Answer', 'text': a }
    }))
  };

  const suburbLinksHtml = SUBURBS.map(([slug, name]) =>
    `      <li><a href="/${svc.appliance.replace(' ', '-')}-repair-${slug}">${applianceTitle} Repair in ${name}</a></li>`
  ).join('\n');

  return `<main class="page-main container" id="main-content">
  <div class="content-intro fade-in">
<h1 class="page-h1">${svc.h1}</h1>
<p class="hero-subline" style="font-size:1.15rem;color:#374151;margin-bottom:24px;line-height:1.65;">Same-day ${svc.appliance} service across Calgary, Airdrie, Cochrane, and Okotoks. Book online diagnostic from $65.</p>

<div class="quick-answer" style="background:#eff6ff;border-left:4px solid #2563eb;padding:18px 22px;margin:0 0 32px;border-radius:0 8px 8px 0;font-size:1rem;line-height:1.7;color:#1e40af">
  <strong>Who repairs ${svc.appliance}s in Calgary?</strong> Appliance Repair Near You Calgary handles ${svc.appliance} repair across Calgary, Airdrie, Cochrane, Okotoks, Chestermere, and Strathmore. Book online or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#1d4ed8;font-weight:600">calgary@appliancerepairneary.com</a>. Service from $65 diagnostic, available Mon-Sat 8AM-8PM and Sun 10AM-6PM Mountain Time.
</div>

<div class="page-hero-ctas" style="margin-bottom:32px">
  <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary" target="_blank" rel="noopener">Book Online</a>
  <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email calgary@appliancerepairneary.com</a>
</div>

<h2>${svc.h1} Calgary's Trusted Specialists</h2>
${c.intro}
</div>

<section class="service-details fade-in" aria-label="Common ${svc.appliance} problems we fix in Calgary">
  <div class="section-label">Common issues</div>
  <h2 class="section-title">Common ${applianceTitle} Problems We Fix in Calgary</h2>
  <p style="max-width:760px;margin-bottom:24px;color:#374151;line-height:1.7">Below are the ${svc.appliance} failures we see most often on Calgary service calls, with brief diagnostics for each. Our technicians arrive with the parts inventory required for these specific issues, so most calls are completed in a single visit.</p>
  <div class="problems-grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
${problemsHtml}
  </div>
</section>

<section class="brands-section fade-in" style="padding:48px 0;border-top:1px solid #e5e7eb">
  <div class="section-label">Brands</div>
  <h2 class="section-title">${applianceTitle} Brands We Service in Calgary</h2>
  <p style="max-width:760px;margin-bottom:24px;color:#374151;line-height:1.7">We carry parts and brand-specific tools for every major manufacturer sold into the Calgary market from mass-market Whirlpool and Samsung to high-end Wolf, Viking, and Sub-Zero installations common in Calgary's premium subdivisions.</p>
  <div class="brands-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:16px">
    <style>.brand-chip{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;font-size:.9375rem;font-weight:600;color:#0a0a0a;text-align:center;transition:border-color .15s}.brand-chip:hover{border-color:#2563eb;color:#2563eb}</style>
${brandsHtml}
  </div>
</section>

<section class="pricing-section fade-in" style="padding:48px 0;border-top:1px solid #e5e7eb">
  <div class="section-label">Pricing</div>
  <h2 class="section-title">${applianceTitle} Repair Pricing in Calgary</h2>
  <p style="max-width:760px;margin-bottom:16px;color:#374151;line-height:1.7">Honest, transparent pricing for the most common ${svc.appliance} repairs in Calgary. We provide a firm written quote before any work begins. The $65 diagnostic fee is waived when you proceed with the repair, and OEM parts come with a 90-day parts and labour warranty.</p>
  <table class="pricing-table" aria-label="${applianceTitle} repair pricing in Calgary">
    <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
    <tbody>
${pricingHtml}
    </tbody>
  </table>
  <p class="pricing-note" style="font-size:.875rem;color:#6b7280;margin-top:14px;line-height:1.6"><strong>Why our pricing is honest:</strong> We do not charge by the hour, and we do not pad invoices with mystery line items. The diagnostic fee is the only charge before the repair begins, and we waive it when you approve the repair. Every quote includes parts, labour, and the 90-day warranty in one number no surprise add-ons. If we cannot fix the unit economically, we tell you directly and recommend replacement.</p>
</section>

<section class="local-section fade-in" style="padding:48px 0;border-top:1px solid #e5e7eb">
  <div class="section-label">Calgary-specific</div>
${c.localAngle}
</section>

<section class="areas-section fade-in" style="padding:48px 0;border-top:1px solid #e5e7eb">
  <div class="section-label">Service area</div>
  <h2 class="section-title">Calgary Neighbourhoods We Cover for ${applianceTitle} Repair</h2>
  <p style="max-width:760px;margin-bottom:24px;color:#374151;line-height:1.7">Our Calgary technicians dispatch from the city core and reach every quadrant of the city, plus the Calgary CMA satellite communities. Below are the Calgary neighbourhoods we service most regularly. If your area is not listed, we very likely still cover you call to confirm.</p>
  <ul class="areas-grid" style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">
    <style>.areas-grid li{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:8px 14px;font-size:.875rem;color:#374151}</style>
${areasHtml}
  </ul>
  <h3 style="margin-top:32px;font-size:1.125rem;font-weight:700">Calgary CMA Communities Outside the City Limits</h3>
  <p style="margin-top:12px;color:#374151;line-height:1.7">In addition to Calgary itself, our ${svc.appliance} repair coverage extends across the Calgary metropolitan area: <strong>Airdrie</strong> (15 minutes north), <strong>Cochrane</strong> (25 minutes northwest), <strong>Okotoks</strong> (20 minutes south), <strong>Chestermere</strong> (15 minutes east), <strong>Strathmore</strong> (40 minutes east), <strong>High River</strong> (40 minutes south), <strong>Langdon</strong>, <strong>Bragg Creek</strong>, and <strong>DeWinton</strong>. Travel times can vary in winter weather; same-day windows still apply when you book before noon.</p>
</section>

<section class="booking-section fade-in" aria-label="Book your ${svc.appliance} repair in Calgary">
  <div class="section-label">Online booking</div>
  <h2>Book ${svc.h1} Online</h2>
  <p>Real-time availability, instant confirmation, no phone wait. Most Calgary postcodes can book a same-day appointment.</p>
  <iframe id="fixlify-booking-${svc.slug}" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book ${applianceTitle} Repair in Calgary" loading="lazy" allowtransparency="true"></iframe>
  <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-${svc.slug}');if(el)el.style.height=e.data.height+'px'}});</script>
  <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> Mon-Sat 8 AM to 8 PM, Sun 10 AM to 6 PM Mountain Time.</p>
</section>

<section class="faq-section fade-in" aria-label="Frequently asked questions">
  <h2>Frequently Asked Questions ${svc.h1}</h2>
  <div class="faq-list">
${faqVisibleHtml}
  </div>
</section>

<section class="cta-final fade-in" style="padding:48px 0;border-top:1px solid #e5e7eb;text-align:center">
  <h2 style="font-size:1.5rem;font-weight:700;color:#0a0a0a;margin-bottom:12px">Ready to Book Your ${applianceTitle} Repair in Calgary?</h2>
  <p style="color:#6b7280;margin-bottom:24px;font-size:1rem">Same-day service. Licensed technicians. 90-day warranty. Diagnostic from $65.</p>
  <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
    <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary" target="_blank" rel="noopener">Book Online Now</a>
    <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
  </div>
</section>

<section class="related-section" id="related" style="padding:48px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container" style="padding:0">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">${applianceTitle} Repair in Calgary CMA Communities</h2>
    <ul class="related-links" style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">
${suburbLinksHtml}
    </ul>
  </div>
</section>

<script type="application/ld+json">
${JSON.stringify(faqSchema, null, 2)}
</script>

</main>`;
}

function processPage(svc) {
  const filePath = path.join(DIR, svc.slug + '.html');
  const exists = fs.existsSync(filePath);

  let html;
  if (exists) {
    html = fs.readFileSync(filePath, 'utf8');
  } else {
    html = fs.readFileSync(path.join(DIR, 'stove-repair-calgary.html'), 'utf8');
    const applianceTitle = svc.appliance.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    html = html.replace(/<a href="\/stove-repair">[^<]*<\/a>/, `<a href="/${svc.appliance.replace(' ', '-')}-repair">${applianceTitle} Repair</a>`);
    html = html.replace(/"@id": "https:\/\/appliancerepairneary\.com\/stove-repair-calgary#business"/, `"@id": "https://appliancerepairneary.com/${svc.slug}#business"`);
    html = html.replace(/"name": "Stove Repair Calgary[^"]*"/, `"name": "${svc.h1} Calgary Appliance Repair Near You"`);
    html = html.replace(/"url": "https:\/\/appliancerepairneary\.com\/stove-repair-calgary"/g, `"url": "https://appliancerepairneary.com/${svc.slug}"`);
    html = html.replace(/"serviceType": "Stove Repair"/, `"serviceType": "${svc.serviceLong}"`);
  }

  // Replace title and meta
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${svc.title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${svc.metaDesc}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://appliancerepairneary.com/${svc.slug}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${svc.title}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${svc.metaDesc}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://appliancerepairneary.com/${svc.slug}">`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${svc.title}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${svc.metaDesc}">`);

  const newBody = buildBodyContent(svc);

  const mainOpenRegex = /<main class="page-main"[\s\S]*?<\/main>/m;
  if (mainOpenRegex.test(html)) {
    html = html.replace(mainOpenRegex, newBody);
  } else {
    const mainRegex = /<main[\s\S]*?<\/main>/m;
    if (mainRegex.test(html)) {
      html = html.replace(mainRegex, newBody);
    }
  }

  html = removeDuplicateFaqSchemas(html);

  fs.writeFileSync(filePath, html, 'utf8');
  return { filePath, exists };
}

function removeDuplicateFaqSchemas(html) {
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
  if (!mainMatch) return html;
  const mainStart = mainMatch.index;
  const mainEnd = mainStart + mainMatch[0].length;

  const scriptRe = /<script[^>]+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g;
  let result = html;
  const matches = [];
  let m;
  scriptRe.lastIndex = 0;
  while ((m = scriptRe.exec(html)) !== null) {
    if (m[0].includes('"FAQPage"') || m[0].includes("'FAQPage'")) {
      matches.push({ start: m.index, end: m.index + m[0].length });
    }
  }
  for (let i = matches.length - 1; i >= 0; i--) {
    const mt = matches[i];
    if (mt.start < mainStart || mt.end > mainEnd) {
      result = result.slice(0, mt.start) + result.slice(mt.end);
    }
  }
  return result;
}

function countBodyWords(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.split(' ').filter(w => w.length > 1).length;
}

function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getNgrams(text, n) {
  const tokens = text.split(' ').filter(t => t.length > 1);
  const grams = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.add(tokens.slice(i, i + n).join(' '));
  }
  return grams;
}

function uniquenessCheck(slugs) {
  const grams = {};
  for (const slug of slugs) {
    const html = fs.readFileSync(path.join(DIR, slug + '.html'), 'utf8');
    grams[slug] = getNgrams(extractText(html), 8);
  }
  const results = [];
  const ks = Object.keys(grams);
  for (let i = 0; i < ks.length; i++) {
    for (let j = i + 1; j < ks.length; j++) {
      const a = grams[ks[i]], b = grams[ks[j]];
      let overlap = 0;
      for (const g of a) if (b.has(g)) overlap++;
      const total = Math.min(a.size, b.size);
      const overlapPct = total === 0 ? 0 : (overlap / total) * 100;
      const uniq = 100 - overlapPct;
      results.push({ a: ks[i], b: ks[j], uniqueness: uniq.toFixed(1) });
    }
  }
  return results;
}

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--check') {
    console.log('Word counts:');
    for (const svc of SERVICES) {
      const fp = path.join(DIR, svc.slug + '.html');
      if (fs.existsSync(fp)) {
        const w = countBodyWords(fs.readFileSync(fp, 'utf8'));
        console.log(`  ${svc.slug.padEnd(35)} = ${w} words`);
      } else {
        console.log(`  ${svc.slug.padEnd(35)} = MISSING`);
      }
    }
    console.log('\nUniqueness check (8-gram, body text):');
    const slugs = SERVICES.filter(s => fs.existsSync(path.join(DIR, s.slug + '.html'))).map(s => s.slug);
    const u = uniquenessCheck(slugs);
    let min = 100, sum = 0;
    for (const r of u) {
      console.log(`  ${r.a.padEnd(30)} vs ${r.b.padEnd(30)} ${r.uniqueness}%`);
      const v = parseFloat(r.uniqueness);
      sum += v;
      if (v < min) min = v;
    }
    console.log(`\nAvg uniqueness: ${(sum / u.length).toFixed(1)}% min: ${min}%`);
    return;
  }

  const target = args[0];
  const services = target ? SERVICES.filter(s => s.appliance === target || s.slug === target) : SERVICES;
  if (target && services.length === 0) {
    console.error('Unknown service:', target);
    process.exit(1);
  }

  for (const svc of services) {
    const r = processPage(svc);
    const wc = countBodyWords(fs.readFileSync(r.filePath, 'utf8'));
    console.log(`${r.exists ? 'UPDATED' : 'CREATED'}: ${r.filePath} (${wc} words)`);
  }
}

main();
