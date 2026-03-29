#!/usr/bin/env node
'use strict';

/**
 * inject-fridge-remaining.js
 * Re-runs content injection for the 48 cities that failed in the first pass.
 * Uses batch size of 5 to avoid JSON truncation with gemini-2.5-flash.
 */

const fs   = require('fs');
const path = require('path');

const SITE_DIR   = 'C:/appliancerepairneary';
const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const BATCH_SIZE = 5;
const PHONE      = '(437) 524-1053';

// Cities that failed in pass 1 (batches 2, 4, 5, 6)
const REMAINING_SLUGS = [
  'chestermere','chinatown','cochrane','corso-italia','danforth-village',
  'davisville-village','devon','don-mills','dufferin-grove','east-york',
  'edmonton','etobicoke-village',
  'leduc','leslieville','liberty-village','little-italy','little-portugal',
  'markham','midtown','mississauga','newmarket','north-york','oakville','okotoks',
  'oshawa','ossington','parkdale','pickering','richmond-hill','riverdale',
  'roncesvalles','rosedale','scarborough-village','scarborough','sherwood-park',
  'spruce-grove',
  'st-albert','st-lawrence','stony-plain','strathmore','swansea','the-annex',
  'the-beaches','the-junction','thorncliffe-park','toronto','trinity-bellwoods',
  'vaughan'
];

function slugToCity(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function isAlbertaCity(slug) {
  const AB = [
    'airdrie','beaumont','calgary','canmore','chestermere','cochrane',
    'devon','edmonton','fort-saskatchewan','high-river','langdon',
    'leduc','okotoks','sherwood-park','spruce-grove','st-albert',
    'stony-plain','strathmore'
  ];
  return AB.includes(slug);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callGemini(prompt) {
  const resp = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 8192 }
    })
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Gemini API error ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const json = await resp.json();
  const finishReason = json.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== 'STOP') {
    console.warn(`    Warning: finishReason=${finishReason}`);
  }
  return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractJSON(raw) {
  // Remove ```json ... ``` fences  (handle both with and without the json tag)
  let src = raw.trim();
  // Remove leading fence
  src = src.replace(/^```(?:json)?\s*/i, '');
  // Remove trailing fence
  src = src.replace(/\s*```\s*$/, '');
  src = src.trim();
  return JSON.parse(src);
}

function buildPrompt(cities) {
  const cityList = cities.map(c => `${c.slug} (${c.name}, ${c.province})`).join(', ');

  return `You are writing SEO content for appliance repair service pages. Generate unique refrigerator/fridge repair content for these cities in Canada. Return ONLY valid JSON — absolutely NO explanation, NO markdown code fences, NO backticks. Start your response directly with { and end with }.

IMPORTANT RULES:
- Each city content must be completely distinct. Different angle, tone, focus.
- Never start hero_p with the city name itself.
- intro_p MUST mention 2-3 REAL local neighbourhood names specific to that exact city.
- Keep brand names from: Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Kenmore, Maytag.
- Keep phone number: ${PHONE}
- Keep pricing: $65 diagnostic, $120-$350 range, 90-day warranty.
- GTA/Ontario cities: mention Lake Ontario humidity or hard water or Ontario winters or condo vs house mix.
- Alberta cities: mention dry chinook climate or prairie winters or Bow/North Saskatchewan River hard water.
- FAQ: 4 questions total, city-specific (mention city in at least 2 questions). Answers 2-3 sentences each.
- intro_p: 150-200 words. Include real neighbourhoods, climate impact on fridges, housing age/type, common brands, typical failures.
- h2: 8-12 words, unique structure for each city.

Cities: ${cityList}

Return ONLY this JSON structure (no backticks, no markdown):
{"cities": {"slug-here": {"hero_p": "20-30 word sentence", "h2": "8-12 word heading", "intro_p": "150-200 word paragraph", "faq": [{"q": "Question?", "a": "Answer 2-3 sentences."}, {"q": "Question?", "a": "Answer."}, {"q": "Question?", "a": "Answer."}, {"q": "Question?", "a": "Answer."}]}}}`;
}

function escHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── New GTA template (has CITY-CONTENT-v2 marker) ─────────────────────────────
function patchNewTemplate(html, data) {
  let out = html;

  // 1. Replace CITY-CONTENT-v2 block
  const v2Start = '<!-- CITY-CONTENT-v2 -->';
  const v2End   = '<!-- END-CITY-CONTENT-v2 -->';
  const s = out.indexOf(v2Start);
  const e = out.indexOf(v2End);
  if (s !== -1 && e !== -1) {
    const repl = `${v2Start}\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escHtml(data.intro_p)}</p>\n    ${v2End}`;
    out = out.slice(0, s) + repl + out.slice(e + v2End.length);
  }

  // 2. Replace H2 in content-body (first h2 immediately in that div)
  out = out.replace(
    /(<div class="content-body reveal">\s*)(<h2>)[^<]*(<\/h2>)/,
    (_, pre, open, close) => `${pre}${open}${escHtml(data.h2)}${close}`
  );

  // 3. Replace FAQ items — spans with faq-question-text + answers in faq-answer-inner
  const faqItemRe = /(<div class="faq-item">[\s\S]*?<span class="faq-question-text">)([\s\S]*?)(<\/span>[\s\S]*?<div class="faq-answer-inner"><p>)([\s\S]*?)(<\/p><\/div>[\s\S]*?<\/div>)/g;
  let faqIdx = 0;
  out = out.replace(faqItemRe, (match, pre, _oldQ, mid, _oldA, post) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${pre}${escHtml(f.q)}${mid}${escHtml(f.a)}${post}`;
  });

  return out;
}

// ── Old Toronto neighborhood template (no CITY-CONTENT-v2, uses faq-q button) ─
function patchOldToroTemplate(html, data) {
  let out = html;

  // 1. Replace UNIQUE-CITY-CONTENT paragraph
  const ucStart = '<!-- UNIQUE-CITY-CONTENT -->';
  const ucEnd   = '<!-- END-UNIQUE-CITY-CONTENT -->';
  const us = out.indexOf(ucStart);
  const ue = out.indexOf(ucEnd);
  if (us !== -1 && ue !== -1) {
    out = out.slice(0, us) + ucStart + escHtml(data.intro_p) + ucEnd + out.slice(ue + ucEnd.length);
  }

  // 2. Replace "About [City]" H2
  out = out.replace(
    /(<h2>About [^<]+<\/h2>)/,
    `<h2>${escHtml(data.h2)}</h2>`
  );

  // 3. Replace faq-q buttons (this template uses onclick buttons)
  const faqRe = /(<button class="faq-q"[^>]*>)([\s\S]*?)(<span>[+\-]<\/span>\s*<\/button>\s*<div class="faq-a"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>)/g;
  let faqIdx = 0;
  out = out.replace(faqRe, (match, btnOpen, _oldQ, btnClose, _oldA, endDiv) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${btnOpen}\n        ${escHtml(f.q)} <span>+</span>\n      </button>\n      <div class="faq-a" style="display:none">${escHtml(f.a)}${endDiv}`;
  });

  return out;
}

// ── Alberta / old city template (details+summary+faq-q-text) ─────────────────
function patchAlbertaTemplate(html, data) {
  let out = html;

  // 1. Replace first h2 + first p inside content-intro
  out = out.replace(
    /(<div class="content-intro[^"]*">\s*<h2>)[^<]*(<\/h2>\s*<p>)[^<]*(<\/p>)/,
    (_, h2open, ph2close, pclose) =>
      `${h2open}${escHtml(data.h2)}${ph2close}${escHtml(data.intro_p)}${pclose}`
  );

  // 2. Replace FAQ items in <details><summary> format with faq-q-text spans
  const detailsRe = /(<details class="faq-item"><summary class="faq-question"><span class="faq-q-text">)([\s\S]*?)(<\/span>[\s\S]*?<\/summary><div class="faq-answer"><p>)([\s\S]*?)(<\/p><\/div><\/details>)/g;
  let faqIdx = 0;
  out = out.replace(detailsRe, (match, pre, _oldQ, mid, _oldA, post) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${pre}${escHtml(f.q)}${mid}${escHtml(f.a)}${post}`;
  });

  return out;
}

function patchFile(html, data) {
  const hasV2   = html.includes('<!-- CITY-CONTENT-v2 -->');
  const hasFaqQ = html.includes('faq-question-text');
  const hasOldQ = html.includes('faq-q-text');

  if (hasV2 && hasFaqQ) return patchNewTemplate(html, data);
  if (hasOldQ)          return patchAlbertaTemplate(html, data);
  return patchOldToroTemplate(html, data);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const cities = REMAINING_SLUGS.map(slug => ({
    slug,
    name: slugToCity(slug),
    province: isAlbertaCity(slug) ? 'Alberta' : 'Ontario',
    file: path.join(SITE_DIR, `fridge-repair-${slug}.html`)
  })).filter(c => fs.existsSync(c.file));

  console.log(`Processing ${cities.length} remaining cities in batches of ${BATCH_SIZE}.`);

  const batches = [];
  for (let i = 0; i < cities.length; i += BATCH_SIZE) {
    batches.push(cities.slice(i, i + BATCH_SIZE));
  }

  let totalSuccess = 0;
  let totalErrors  = 0;
  const errors = [];

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    console.log(`\nBatch ${bi + 1}/${batches.length}: ${batch.map(c => c.name).join(', ')}`);

    let contentMap;
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const raw    = await callGemini(buildPrompt(batch));
        const parsed = extractJSON(raw);
        contentMap   = parsed.cities || parsed;
        console.log(`  API OK (attempt ${attempts}), got keys: ${Object.keys(contentMap).join(', ')}`);
        break;
      } catch (err) {
        console.error(`  Attempt ${attempts} failed: ${err.message.slice(0, 120)}`);
        if (attempts < 3) {
          console.log('  Retrying in 6s...');
          await sleep(6000);
        }
      }
    }

    if (!contentMap) {
      console.error(`  ALL ATTEMPTS FAILED for batch ${bi + 1}. Skipping.`);
      for (const c of batch) errors.push(`${c.slug}: API failure`);
      totalErrors += batch.length;
      continue;
    }

    for (const city of batch) {
      const data = contentMap[city.slug]
        || contentMap[city.name]
        || contentMap[city.name.toLowerCase()];

      if (!data || !data.h2 || !data.intro_p || !Array.isArray(data.faq)) {
        console.warn(`  SKIP ${city.slug}: missing/incomplete data`);
        errors.push(`${city.slug}: incomplete API data`);
        totalErrors++;
        continue;
      }

      try {
        const original = fs.readFileSync(city.file, 'utf8');
        const patched  = patchFile(original, data);

        if (patched === original) {
          console.warn(`  WARN ${city.slug}: no changes (pattern mismatch?)`);
          errors.push(`${city.slug}: no pattern match`);
          totalErrors++;
          continue;
        }

        fs.writeFileSync(city.file, patched, 'utf8');
        console.log(`  OK  ${city.slug}`);
        totalSuccess++;
      } catch (err) {
        console.error(`  ERROR ${city.slug}: ${err.message}`);
        errors.push(`${city.slug}: ${err.message}`);
        totalErrors++;
      }
    }

    if (bi < batches.length - 1) {
      console.log('  Pausing 3s...');
      await sleep(3000);
    }
  }

  console.log('\n══════════════════════════════════════════');
  console.log(`DONE. Success: ${totalSuccess}  |  Errors/Skipped: ${totalErrors}`);
  if (errors.length) {
    console.log('\nIssues:');
    errors.forEach(e => console.log('  -', e));
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
