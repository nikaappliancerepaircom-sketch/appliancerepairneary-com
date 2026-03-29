/**
 * inject-dishwasher-unique.js
 * Rewrites dishwasher-repair-[city].html files on appliancerepairneary.com
 * Uses Gemini 2.5 Flash to generate 80-90% unique content per city
 * Processes cities in batches of 5 to avoid token overflow
 */

const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const BASE_DIR = 'C:/appliancerepairneary';

// Cities that were already successfully updated (skip them)
const ALREADY_DONE = new Set(['whitby', 'willowdale']);

// All cities to process (skipping near-me and installation pages)
const ALL_CITIES = [
  'airdrie', 'ajax', 'bayview-village', 'beaumont', 'birchcliff',
  'bloor-west-village', 'bradford', 'brampton', 'burlington', 'cabbagetown',
  'calgary', 'canmore', 'chestermere', 'chinatown', 'cochrane',
  'corso-italia', 'danforth-village', 'davisville-village', 'devon', 'don-mills',
  'dufferin-grove', 'east-york', 'edmonton', 'etobicoke', 'etobicoke-village',
  'forest-hill', 'fort-saskatchewan', 'greektown', 'high-park', 'high-river',
  'humber-valley', 'islington-village', 'king-west', 'langdon', 'lawrence-park',
  'leaside', 'leduc', 'leslieville', 'liberty-village', 'little-italy',
  'little-portugal', 'markham', 'midtown', 'mississauga', 'newmarket',
  'north-york', 'oakville', 'okotoks', 'oshawa', 'ossington',
  'parkdale', 'pickering', 'richmond-hill', 'riverdale', 'roncesvalles',
  'rosedale', 'scarborough', 'scarborough-village', 'sherwood-park', 'spruce-grove',
  'st-albert', 'st-lawrence', 'stony-plain', 'strathmore', 'swansea',
  'the-annex', 'the-beaches', 'the-junction', 'thorncliffe-park', 'toronto',
  'trinity-bellwoods', 'vaughan', 'wychwood'
].filter(c => !ALREADY_DONE.has(c));

// Cities in Alberta
const ALBERTA_CITIES = new Set([
  'airdrie', 'beaumont', 'calgary', 'canmore', 'chestermere', 'cochrane',
  'devon', 'edmonton', 'fort-saskatchewan', 'high-river', 'langdon',
  'leduc', 'okotoks', 'sherwood-park', 'spruce-grove', 'st-albert',
  'stony-plain', 'strathmore'
]);

function toDisplayName(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    .replace('St ', 'St. ');
}

async function callGemini(prompt) {
  const resp = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 65535,
        responseMimeType: 'application/json'
      }
    })
  });
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error ${resp.status}: ${errText}`);
  }
  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No text in Gemini response');
  return text;
}

async function generateBatch(cities) {
  const cityInfoList = cities.map(slug => {
    const name = toDisplayName(slug);
    const province = ALBERTA_CITIES.has(slug) ? 'Alberta' : 'Ontario';
    const region = ALBERTA_CITIES.has(slug)
      ? 'Alberta (prairie housing, harder well/municipal water, newer subdivisions, oil industry workers)'
      : 'Greater Toronto Area / Ontario (Lake Ontario water treatment, GTA housing mix, commuter communities, diverse demographics)';
    return `- ${slug}: "${name}", ${province} — ${region}`;
  }).join('\n');

  const prompt = `You are writing SEO content for dishwasher repair service pages for "Appliance Repair Neary" (phone: (437) 524-1053, website: appliancerepairneary.com).

Generate unique dishwasher repair content for EACH city listed. Each city MUST have completely different content — no shared sentences or angles.

For each city slug, provide:
1. "hero_p": One sentence (20-30 words). A unique hook about that city's dishwasher challenge. Do NOT start with the city name. Vary structure.
2. "h2": Unique 8-12 word heading mentioning city and dishwasher repair/service. Do NOT use "Nearest Dishwasher Technician to" as the opener.
3. "intro_p": 160-180 word paragraph. MUST include: 2-3 real neighbourhoods specific to that exact city, local water quality details (Alberta: harder municipal/well water from prairie aquifers; GTA/Ontario: Lake Ontario treatment, moderate hardness), typical housing era and type, most common dishwasher brands in that housing era, the #1 failure cause for that city's specific conditions. Each paragraph must be genuinely different from all others.
4. "faq": Array of exactly 4 objects with "q" and "a". Rules: each question mentions the city name; answers are 2-3 sentences; cover: (1) water/mineral issue specific to this city, (2) pricing for this city, (3) availability/timing, (4) a city-specific question about brands or housing type. All 4 questions must be DIFFERENT from every other city's questions.

CITIES TO PROCESS:
${cityInfoList}

Return ONLY valid compact JSON. No markdown. No code fences. No explanation. Exactly this structure:
{"cities":{"city-slug":{"hero_p":"...","h2":"...","intro_p":"...","faq":[{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]}}}`;

  const raw = await callGemini(prompt);

  // Strip markdown fences if present
  let jsonText = raw.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.error('JSON parse error. First 600 chars:', jsonText.substring(0, 600));
    throw new Error(`Failed to parse Gemini JSON: ${e.message}`);
  }
}

function escapeForHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectContent(html, cityData) {
  let modified = html;
  let changeCount = 0;

  // 1. Replace hero answer-box paragraph
  const heroReplaced = modified.replace(
    /(<div class="answer-box"[^>]*>[\s\S]*?<p>)[^<]+(<\/p>)/,
    (match, before, after) => {
      changeCount++;
      return before + escapeForHtml(cityData.hero_p) + after;
    }
  );
  if (heroReplaced !== modified) modified = heroReplaced;

  // 2. Replace the main H2 in content-body
  const h2Replaced = modified.replace(
    /(<div class="content-body reveal">[\s\S]*?<h2>)[^<]+(<\/h2>)/,
    (match, before, after) => {
      changeCount++;
      return before + escapeForHtml(cityData.h2) + after;
    }
  );
  if (h2Replaced !== modified) modified = h2Replaced;

  // 3. Replace CITY-CONTENT-v2 block
  const introHtml = `\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeForHtml(cityData.intro_p)}</p>\n    `;
  const introReplaced = modified.replace(
    /<!-- CITY-CONTENT-v2 -->[\s\S]*?<!-- END-CITY-CONTENT-v2 -->/,
    `<!-- CITY-CONTENT-v2 -->${introHtml}<!-- END-CITY-CONTENT-v2 -->`
  );
  if (introReplaced !== modified) { modified = introReplaced; changeCount++; }

  // 4. Replace FAQ items
  const faqItems = cityData.faq.map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${escapeForHtml(item.q)}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${escapeForHtml(item.a)}</p></div>
  </div>
</div>`).join('\n');

  // Replace from the FAQ comment marker through all faq-item blocks up to the closing divs
  const faqReplaced = modified.replace(
    /(<!-- FAQ_ITEMS are injected by the page generator -->)([\s\S]*?)(\s*<\/div>\s*\n\s*<\/div>\s*\n<\/section>\s*\n\s*<!-- ============================\s*\n\s*RELATED)/,
    (match, before, _items, after) => {
      changeCount++;
      return before + '\n      ' + faqItems + '\n</div>\n</div>\n</section>\n\n<!-- ============================\n     RELATED';
    }
  );
  if (faqReplaced !== modified) modified = faqReplaced;

  return { html: modified, changes: changeCount };
}

async function processAllCities() {
  const BATCH_SIZE = 5;
  const results = { success: [], failed: [] };

  for (let i = 0; i < ALL_CITIES.length; i += BATCH_SIZE) {
    const batch = ALL_CITIES.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(ALL_CITIES.length / BATCH_SIZE);

    console.log(`\n--- Batch ${batchNum}/${totalBatches}: ${batch.join(', ')} ---`);

    let contentData = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        contentData = await generateBatch(batch);
        const cityCount = Object.keys(contentData.cities || {}).length;
        console.log(`  Gemini returned content for ${cityCount} cities`);
        break;
      } catch (err) {
        console.error(`  Attempt ${attempt} failed: ${err.message}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 4000));
        else {
          batch.forEach(c => results.failed.push({ city: c, reason: err.message.substring(0, 120) }));
        }
      }
    }

    if (!contentData) continue;

    for (const slug of batch) {
      const filePath = path.join(BASE_DIR, `dishwasher-repair-${slug}.html`);

      if (!fs.existsSync(filePath)) {
        console.warn(`  SKIP: File not found: dishwasher-repair-${slug}.html`);
        results.failed.push({ city: slug, reason: 'File not found' });
        continue;
      }

      const cityContent = contentData.cities?.[slug];
      if (!cityContent) {
        const keys = Object.keys(contentData.cities || {});
        console.warn(`  SKIP: No content for "${slug}". Available: ${keys.join(', ')}`);
        results.failed.push({ city: slug, reason: 'Not in API response' });
        continue;
      }

      if (!cityContent.hero_p || !cityContent.h2 || !cityContent.intro_p || !Array.isArray(cityContent.faq) || cityContent.faq.length < 4) {
        console.warn(`  SKIP: Incomplete content for "${slug}"`);
        results.failed.push({ city: slug, reason: 'Incomplete fields' });
        continue;
      }

      try {
        const original = fs.readFileSync(filePath, 'utf8');
        const { html: updated, changes } = injectContent(original, cityContent);

        if (updated === original || changes === 0) {
          console.warn(`  WARN: No changes made to ${slug} (patterns may not match)`);
          results.failed.push({ city: slug, reason: 'No HTML patterns matched' });
          continue;
        }

        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`  OK: ${slug} (${changes} sections replaced)`);
        results.success.push(slug);
      } catch (err) {
        console.error(`  ERROR: ${slug}: ${err.message}`);
        results.failed.push({ city: slug, reason: err.message });
      }
    }

    if (i + BATCH_SIZE < ALL_CITIES.length) {
      console.log('  Waiting 3s...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\n========== FINAL RESULTS ==========');
  console.log(`SUCCESS: ${results.success.length} files updated`);
  console.log(`FAILED:  ${results.failed.length} files`);
  if (results.success.length > 0) console.log('\nSucceeded:', results.success.join(', '));
  if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach(f => console.log(`  - ${f.city}: ${f.reason}`));
  }
}

processAllCities().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
