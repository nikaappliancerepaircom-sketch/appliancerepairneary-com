'use strict';
const fs = require('fs');
const path = require('path');

// Use Gemini API (has working key)
const GEMINI_API_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_MODEL = 'gemini-2.5-flash';

const DIR = 'C:/appliancerepairneary';

// Collect files
const files = fs.readdirSync(DIR)
  .filter(f => f.match(/^oven-repair-.+\.html$/) && !f.includes('near-me'));

console.log(`Found ${files.length} files to process`);

// Extract city name from filename
function cityFromFile(filename) {
  return filename.replace(/^oven-repair-/, '').replace(/\.html$/, '');
}

// Convert slug to display name
function displayName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const ALBERTA_CITIES = new Set([
  'calgary','edmonton','airdrie','beaumont','canmore','chestermere','cochrane',
  'devon','fort-saskatchewan','high-river','langdon','leduc','okotoks',
  'sherwood-park','spruce-grove','st-albert'
]);

// Determine template type by inspecting HTML
function getTemplateType(html) {
  if (html.includes('faq-question-text')) {
    const count = (html.match(/faq-question-text/g) || []).length;
    if (count >= 10) return 'A'; // Large GTA cities (ajax, brampton, etc.)
    return 'B'; // Smaller Toronto neighborhoods (bayview-village etc.)
  }
  if (html.includes('class="faq-q"') || html.includes("class='faq-q'")) return 'C'; // Toronto neighborhoods (bloor-west-village etc.)
  return 'D'; // Alberta (calgary, edmonton)
}

// API call for a batch of cities
async function generateBatch(cities) {
  const albertaCities = cities.filter(c => ALBERTA_CITIES.has(c));
  const gtaCities = cities.filter(c => !ALBERTA_CITIES.has(c));

  const cityNote = albertaCities.length > 0
    ? `Alberta cities (gas-dominant, harder water, chinook climate): ${albertaCities.join(', ')}. GTA/Ontario cities (mix of gas/electric, condos often electric, older homes often gas): ${gtaCities.join(', ')}.`
    : `GTA/Ontario cities (mix of gas/electric, condos often electric, older homes often gas): ${gtaCities.join(', ')}.`;

  const prompt = `Write unique oven repair page content for Canadian cities. Return ONLY valid JSON, no markdown, no code fences.

Each city needs:
- hero_p: 20-30 words. Unique opener for oven repair in this city. Theme: cooking culture, building type, gas vs electric. Vary sentence structure per city. No leading "Oven repair in [City]:" phrase.
- h2: 8-12 words. Unique heading about city + oven repair service. Must mention city name.
- intro_p: 150-200 words. Must include: 2-3 real local neighborhoods, housing age/type, gas vs electric oven split for this area, common oven brands (GE, Samsung, Bosch, LG, Frigidaire, Whirlpool — pick 3-4 relevant for this area), typical failures (igniters in gas ovens, bake element in electric, control boards in newer models). Must mention (437) 524-1053 naturally. City-specific and factual.
- faq: exactly 4 objects with {q, a}. Each Q must mention the city name. Each A must be 2-3 sentences. Topics must vary: pick 4 from {gas_vs_electric_cost, response_time, common_brands, seasonal_baking, warranty, booking_process, repair_vs_replace, typical_failures}. No duplicate topics across cities in this batch.

${cityNote}

Important constraints:
- Keep: (437) 524-1053, $65 diagnostic, 90-day warranty, price range $120-$350
- Keep brand names: Samsung, LG, GE, Bosch, Frigidaire, Whirlpool, Miele
- Each city MUST have genuinely different content — different neighborhoods, different angles, different FAQ topics

Cities to generate: ${cities.map(c => displayName(c)).join(', ')}

Return JSON format (use display names as keys, e.g. "Ajax" not "ajax"):
{
  "cities": {
    "CityName": {
      "hero_p": "...",
      "h2": "...",
      "intro_p": "...",
      "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]
    }
  }
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 65536, temperature: 0.8 }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (!data.candidates || !data.candidates[0]) throw new Error('Empty API response');

  const text = (data.candidates[0].content?.parts?.[0]?.text || '').trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to extract JSON with greedy match
    const m = cleaned.match(/(\{[\s\S]+\})/);
    if (m) {
      try { return JSON.parse(m[1]); } catch (e2) {
        console.error('JSON parse failed after extraction:', e2.message);
        console.error('Extracted snippet:', m[1].substring(0, 300));
      }
    }
    console.error('JSON parse failed. Raw response length:', text.length);
    console.error('First 600 chars:', text.substring(0, 600));
    console.error('Last 200 chars:', text.substring(text.length - 200));
    return null;
  }
}

// --- Template A injection (large GTA cities: ajax, brampton, mississauga, etc.) ---
function injectTemplateA(html, city, data) {
  let result = html;
  const cityDisplay = displayName(city);

  // 1. Hero paragraph (answer-box <p>)
  result = result.replace(
    /(<div class="answer-box"[^>]*>\s*<p>)[^<]*(<\/p>\s*<\/div>)/,
    `$1${escapeHtml(data.hero_p)}$2`
  );

  // 2. Content H2 (first h2 in content-body, before CITY-CONTENT-v2)
  result = result.replace(
    /(<div class="content-body reveal">\s*)<h2>[^<]*<\/h2>/,
    `$1<h2>${escapeHtml(data.h2)}</h2>`
  );

  // 3. Intro paragraph: replace the CITY-CONTENT-v2 block
  result = result.replace(
    /<!-- CITY-CONTENT-v2 -->[\s\S]*?<!-- END-CITY-CONTENT-v2 -->/,
    `<!-- CITY-CONTENT-v2 -->\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(data.intro_p)}</p>\n    <!-- END-CITY-CONTENT-v2 -->`
  );

  // 4. FAQ items - replace the 4 faq-item blocks in the main faq-section
  // Find the faq-list div and replace the items inside it
  const faqSection = html.match(/(<section class="faq-section"[\s\S]*?<div class="faq-list">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/);
  if (faqSection && data.faq && data.faq.length >= 4) {
    const newFaqItems = data.faq.slice(0, 4).map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${escapeHtml(item.q)}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${escapeHtml(item.a)}</p></div>
  </div>
</div>
`).join('');

    result = result.replace(
      /(<section class="faq-section"[\s\S]*?<div class="faq-list">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/,
      `$1\n      <!-- FAQ_ITEMS are injected by the page generator -->\n      ${newFaqItems}\n$3`
    );
  }

  return result;
}

// --- Template B injection (smaller Toronto neighborhoods with faq-question-text, 6 items) ---
function injectTemplateB(html, city, data) {
  let result = html;

  // 1. Hero paragraph (answer-box <p>)
  result = result.replace(
    /(<div class="answer-box"[^>]*>\s*<p>)[^<]*(<\/p>\s*<\/div>)/,
    `$1${escapeHtml(data.hero_p)}$2`
  );

  // 2. Content H2 (first h2 in content-body)
  result = result.replace(
    /(<div class="content-body reveal">\s*)<h2>[^<]*<\/h2>/,
    `$1<h2>${escapeHtml(data.h2)}</h2>`
  );

  // 3. Intro paragraph: replace the CITY-CONTENT-v2 block
  result = result.replace(
    /<!-- CITY-CONTENT-v2 -->[\s\S]*?<!-- END-CITY-CONTENT-v2 -->/,
    `<!-- CITY-CONTENT-v2 -->\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(data.intro_p)}</p>\n    <!-- END-CITY-CONTENT-v2 -->`
  );

  // 4. FAQ items - find faq-section and replace items
  if (data.faq && data.faq.length >= 4) {
    const newFaqItems = data.faq.slice(0, 4).map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${escapeHtml(item.q)}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${escapeHtml(item.a)}</p></div>
  </div>
</div>
`).join('');

    result = result.replace(
      /(<section class="faq-section"[\s\S]*?<div class="faq-list">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/,
      `$1\n      <!-- FAQ_ITEMS are injected by the page generator -->\n      ${newFaqItems}\n$3`
    );
  }

  return result;
}

// --- Template C injection (Toronto neighborhood pages with faq-q class) ---
function injectTemplateC(html, city, data) {
  let result = html;

  // 1. Hero paragraph: answer-box is a <div class="answer-box"> (no <p> inside)
  // Pattern: <div class="answer-box">TEXT</div>
  result = result.replace(
    /(<div class="answer-box">)[^<]*(<\/div>)/,
    `$1${escapeHtml(data.hero_p)}$2`
  );

  // 2. Content H2: first <h2> inside the content area (after breadcrumb)
  // It's typically the first <h2> in the main section (not in head styles)
  // Pattern: <h2>SOMETHING_WITH_CITY</h2> after <!-- CITY-CONTENT-v2 --> parent
  result = result.replace(
    /(<section[^>]*>\s*<div class="container">\s*<div class="two-col">\s*<div>\s*)<h2>[^<]*<\/h2>/,
    `$1<h2>${escapeHtml(data.h2)}</h2>`
  );

  // 3. Intro paragraph: CITY-CONTENT-v2 block
  result = result.replace(
    /<!-- CITY-CONTENT-v2 -->[\s\S]*?<!-- END-CITY-CONTENT-v2 -->/,
    `<!-- CITY-CONTENT-v2 -->\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(data.intro_p)}</p>\n    <!-- END-CITY-CONTENT-v2 -->`
  );

  // 4. FAQ items (faq-q class template)
  // Find the FAQ section and replace items
  if (data.faq && data.faq.length >= 4) {
    // Find the "Frequently Asked Questions" h2 and the faq-item blocks after it
    const faqHeaderMatch = html.match(/<h2[^>]*>Frequently Asked Questions[^<]*<\/h2>([\s\S]*?)(?=<section|<footer|$)/);
    if (faqHeaderMatch) {
      const newFaqItems = data.faq.slice(0, 4).map(item => `
    <div class="faq-item">
      <button class="faq-q" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'">${escapeHtml(item.q)}</button>
      <div class="faq-a" style="display:none">${escapeHtml(item.a)}</div>
    </div>`).join('');

      // Replace the old FAQ items block
      result = result.replace(
        /(<h2[^>]*>Frequently Asked Questions[^<]*<\/h2>)([\s\S]*?)(?=<section|<footer|<div class="cta-block")/,
        `$1\n${newFaqItems}\n`
      );
    }
  }

  return result;
}

// --- Template D injection (Alberta pages) ---
function injectTemplateD(html, city, data) {
  let result = html;

  // 1. Hero paragraph: answer-box is <div class="answer-box">TEXT</div>
  result = result.replace(
    /(<div class="answer-box">)[^<]*(<\/div>)/,
    `$1${escapeHtml(data.hero_p)}$2`
  );

  // 2. Content H2: first <h2> in content-intro area
  result = result.replace(
    /(<div class="content-intro[^"]*"[^>]*>\s*)<h2>[^<]*<\/h2>/,
    `$1<h2>${escapeHtml(data.h2)}</h2>`
  );

  // 3. Intro paragraph: CITY-CONTENT-v2 block
  result = result.replace(
    /<!-- CITY-CONTENT-v2 -->[\s\S]*?<!-- END-CITY-CONTENT-v2 -->/,
    `<!-- CITY-CONTENT-v2 -->\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(data.intro_p)}</p>\n    <!-- END-CITY-CONTENT-v2 -->`
  );

  // Alberta pages don't have FAQ sections in same format — add after city-context p if no FAQ found
  // Check if there's any FAQ section
  if (data.faq && data.faq.length >= 4) {
    const hasFaq = html.includes('faq-item') || html.includes('faq-section') || html.includes('Frequently Asked');
    if (!hasFaq) {
      // Inject FAQ before </main> or before related-links section
      const faqBlock = `
<!-- FAQ SECTION -->
<section style="padding:40px 0;background:#F8FAFF;">
  <div style="max-width:920px;margin:0 auto;padding:0 24px;">
    <h2 style="font-size:clamp(18px,2.5vw,24px);color:#1E3A5F;margin:0 0 24px;font-weight:700;">Frequently Asked Questions — Oven Repair in ${escapeHtml(displayName(city))}</h2>
    ${data.faq.slice(0, 4).map(item => `
    <div style="border:1px solid #E5E7EB;border-radius:8px;margin-bottom:12px;overflow:hidden;">
      <div style="background:#F8FAFC;padding:14px 18px;font-size:.95rem;font-weight:600;color:#111;">${escapeHtml(item.q)}</div>
      <div style="padding:14px 18px;font-size:.9rem;color:#374151;line-height:1.7;">${escapeHtml(item.a)}</div>
    </div>`).join('')}
  </div>
</section>
`;
      // Try multiple insertion points
      if (result.includes('<div class="related-links"')) {
        result = result.replace(/(<div class="related-links")/, `${faqBlock}\n$1`);
      } else if (result.includes('</main>')) {
        result = result.replace(/(<\/main>)/, `${faqBlock}\n$1`);
      } else {
        // Inject before footer
        result = result.replace(/(<footer)/, `${faqBlock}\n$1`);
      }
    }
  }

  return result;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    // Restore phone number formatting
    .replace(/\(437\) 524-1053/g, '(437) 524-1053')
    // Restore common HTML entities we want preserved
    .replace(/&amp;amp;/g, '&amp;')
    .replace(/&amp;lt;/g, '&lt;')
    .replace(/&amp;gt;/g, '&gt;');
}

// Process a single file
function processFile(filename, cityData) {
  const filepath = path.join(DIR, filename);
  const city = cityFromFile(filename);
  const cityDisplay = displayName(city);

  // Try both the display name and variations as keys
  const possibleKeys = [
    cityDisplay,
    city,
    cityDisplay.replace(/-/g, ' '),
    // Handle special cases
    city.replace(/-/g, ' '),
  ];

  let data = null;
  for (const key of possibleKeys) {
    if (cityData[key]) { data = cityData[key]; break; }
  }
  // Also try case-insensitive match
  if (!data) {
    const lowerKeys = Object.keys(cityData).map(k => k.toLowerCase());
    const idx = lowerKeys.indexOf(cityDisplay.toLowerCase());
    if (idx >= 0) data = cityData[Object.keys(cityData)[idx]];
  }

  if (!data) {
    console.warn(`  [SKIP] No data for city key: ${cityDisplay} (tried: ${possibleKeys.join(', ')})`);
    return false;
  }

  const html = fs.readFileSync(filepath, 'utf8');
  const templateType = getTemplateType(html);

  let newHtml;
  try {
    switch (templateType) {
      case 'A': newHtml = injectTemplateA(html, city, data); break;
      case 'B': newHtml = injectTemplateB(html, city, data); break;
      case 'C': newHtml = injectTemplateC(html, city, data); break;
      case 'D': newHtml = injectTemplateD(html, city, data); break;
      default: console.warn(`  [SKIP] Unknown template for ${filename}`); return false;
    }
  } catch (e) {
    console.error(`  [ERROR] Injection failed for ${filename}: ${e.message}`);
    return false;
  }

  if (newHtml === html) {
    console.warn(`  [WARN] No changes made for ${filename} (template ${templateType}) — patterns may not have matched`);
    return false;
  }

  fs.writeFileSync(filepath, newHtml, 'utf8');
  console.log(`  [OK] ${filename} (template ${templateType})`);
  return true;
}

async function main() {
  const slugs = files.map(cityFromFile);
  const BATCH_SIZE = 8;
  const batches = [];
  for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
    batches.push(slugs.slice(i, i + BATCH_SIZE));
  }

  console.log(`\nProcessing ${slugs.length} cities in ${batches.length} batches of up to ${BATCH_SIZE}...\n`);

  let totalSuccess = 0;
  let totalFail = 0;
  const allCityData = {};

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`\n--- Batch ${b + 1}/${batches.length}: ${batch.map(displayName).join(', ')} ---`);

    let result = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await generateBatch(batch);
        if (result && result.cities) break;
        console.warn(`  Attempt ${attempt}: Invalid response, retrying...`);
      } catch (e) {
        console.warn(`  Attempt ${attempt} failed: ${e.message}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
      }
    }

    if (!result || !result.cities) {
      console.error(`  [FAIL] Could not get data for batch ${b + 1}`);
      totalFail += batch.length;
      continue;
    }

    // Merge batch results
    Object.assign(allCityData, result.cities);

    // Process each file in the batch
    for (const slug of batch) {
      const filename = `oven-repair-${slug}.html`;
      const success = processFile(filename, result.cities);
      if (success) totalSuccess++; else totalFail++;
    }

    // Small delay between batches
    if (b < batches.length - 1) {
      console.log('  (waiting 2s before next batch...)');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n=============================`);
  console.log(`DONE: ${totalSuccess} succeeded, ${totalFail} failed`);
  console.log(`=============================`);
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
