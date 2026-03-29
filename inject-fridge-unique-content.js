#!/usr/bin/env node
'use strict';

/**
 * inject-fridge-unique-content.js
 * Rewrites fridge-repair-[city].html content sections for 80-90% uniqueness.
 * Uses Gemini 2.0 Flash API (batch of 15 cities per call).
 *
 * Targets 3 replacement zones in each file:
 *   Zone A  — the <!-- CITY-CONTENT-v2 --> block (3 generic <p> tags)
 *   Zone B  — visible FAQ items (<span class="faq-question-text"> or <button class="faq-q"> variants)
 *   Zone C  — the UNIQUE-CITY-CONTENT paragraph (city-context p tag)
 *
 * For Alberta/old-template files that lack CITY-CONTENT-v2, it rewrites
 *   the .content-intro h2 + p + p  and the <details> FAQ items.
 */

const fs   = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const SITE_DIR  = 'C:/appliancerepairneary';
const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const BATCH_SIZE = 5;    // cities per API call (small to avoid truncation)
const PHONE      = '(437) 524-1053';

// ── Helpers ──────────────────────────────────────────────────────────────────
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

// ── API call ─────────────────────────────────────────────────────────────────
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
  return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ── Extract JSON from LLM response ──────────────────────────────────────────
function extractJSON(raw) {
  // strip ```json ... ``` fences if present
  const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const src = m ? m[1].trim() : raw.trim();
  return JSON.parse(src);
}

// ── Build prompt ─────────────────────────────────────────────────────────────
function buildPrompt(cities) {
  const cityList = cities.map(c => `${c.slug} (${c.name}, ${c.province})`).join(', ');

  return `You are writing SEO content for appliance repair service pages. Generate unique refrigerator/fridge repair content for these cities in Canada. Return ONLY valid JSON — no explanation, no markdown fences.

IMPORTANT RULES:
- Make each city's content completely distinct. Different angle, different tone, different focus.
- Never start hero_p with the city name.
- intro_p MUST mention 2-3 REAL local neighbourhood names specific to that city.
- Keep brand names in this set: Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Kenmore, Maytag.
- Keep phone number: ${PHONE}
- Keep pricing: $65 diagnostic, $120-$350 range, 90-day warranty.
- GTA/Ontario cities: mention Lake Ontario humidity / hard water / Ontario winters / condo vs house mix.
- Alberta cities: mention dry chinook climate / prairie winters / Bow/North Saskatchewan River water / newer suburban builds.
- FAQ: 4 questions total, city-specific (mention city name in at least 2 Qs). Answers 2-3 sentences each.
- intro_p: 150-200 words. Include: 2-3 real local neighbourhoods, climate/humidity impact on fridges, housing type and age, common fridge brands in area, typical failure modes for this region.
- h2: 8-12 words, different structure for every city (not just "Fridge Repair in X — Y").

Cities: ${cityList}

JSON format (return ONLY this JSON):
{
  "cities": {
    "slug-here": {
      "hero_p": "20-30 word unique sentence about fridge issues in this city",
      "h2": "8-12 word unique heading mentioning city and fridge/refrigerator repair",
      "intro_p": "150-200 word paragraph with neighbourhoods, climate, housing, brands, failures",
      "faq": [
        {"q": "Question 1 text?", "a": "Answer 1. Mention city. 2-3 sentences."},
        {"q": "Question 2 text?", "a": "Answer 2. Mention city. 2-3 sentences."},
        {"q": "Question 3 text?", "a": "Answer 3. 2-3 sentences."},
        {"q": "Question 4 text?", "a": "Answer 4. 2-3 sentences."}
      ]
    }
  }
}`;
}

// ── HTML patching — New GTA template (has CITY-CONTENT-v2) ──────────────────
function patchNewTemplate(html, data) {
  let out = html;

  // 1. Replace the CITY-CONTENT-v2 block (3 generic p tags) with intro_p
  const v2Start = '<!-- CITY-CONTENT-v2 -->';
  const v2End   = '<!-- END-CITY-CONTENT-v2 -->';
  const s = out.indexOf(v2Start);
  const e = out.indexOf(v2End);
  if (s !== -1 && e !== -1) {
    const replacement = `${v2Start}\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escHtml(data.intro_p)}</p>\n    ${v2End}`;
    out = out.slice(0, s) + replacement + out.slice(e + v2End.length);
  }

  // 2. Replace H2 in content-body (first h2 inside content-body div)
  // Pattern: <h2>...text...</h2>  (the main content heading)
  out = out.replace(
    /(<div class="content-body reveal">\s*)(<h2>)[^<]*(<\/h2>)/,
    (_, pre, open, close) => `${pre}${open}${escHtml(data.h2)}${close}`
  );

  // 3. Replace FAQ items — new template uses <span class="faq-question-text">
  //    We have 4-6 FAQ items; replace only the first 4 (or all if ≤4)
  const faqItemRe = /(<div class="faq-item">[\s\S]*?<span class="faq-question-text">)([\s\S]*?)(<\/span>[\s\S]*?<div class="faq-answer-inner"><p>)([\s\S]*?)(<\/p><\/div>[\s\S]*?<\/div>)/g;
  let faqIdx = 0;
  out = out.replace(faqItemRe, (match, pre, _oldQ, mid, _oldA, post) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${pre}${escHtml(f.q)}${mid}${escHtml(f.a)}${post}`;
  });

  return out;
}

// ── HTML patching — Old Toronto neighborhood template ───────────────────────
// (No CITY-CONTENT-v2, uses faq-q button class, city-context p exists)
function patchOldToroTemplate(html, data) {
  let out = html;

  // 1. Replace the UNIQUE-CITY-CONTENT block
  const ucStart = '<!-- UNIQUE-CITY-CONTENT -->';
  const ucEnd   = '<!-- END-UNIQUE-CITY-CONTENT -->';
  const us = out.indexOf(ucStart);
  const ue = out.indexOf(ucEnd);
  if (us !== -1 && ue !== -1) {
    out = out.slice(0, us) + ucStart + escHtml(data.intro_p) + ucEnd + out.slice(ue + ucEnd.length);
  }

  // 2. Replace H2 "About [City]" heading
  out = out.replace(
    /(<h2>About [^<]+<\/h2>)/,
    `<h2>${escHtml(data.h2)}</h2>`
  );

  // 3. Replace FAQ items using faq-q button pattern
  const faqRe = /(<button class="faq-q"[^>]*>)\s*([\s\S]*?)\s*(<span>[\+\-]<\/span>\s*<\/button>\s*<div class="faq-a"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>)/g;
  let faqIdx = 0;
  out = out.replace(faqRe, (match, btnOpen, _oldQ, btnClose, _oldA, endDiv) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${btnOpen}\n        ${escHtml(f.q)} <span>+</span>\n      </button>\n      <div class="faq-a" style="display:none">${escHtml(f.a)}${endDiv}`;
  });

  return out;
}

// ── HTML patching — Alberta / old-template ───────────────────────────────────
function patchAlbertaTemplate(html, data) {
  let out = html;

  // 1. Replace content-intro section: the h2 + first p inside .content-intro
  //    Pattern: <div class="content-intro fade-in">\n<h2>...</h2>\n<p>...</p>
  out = out.replace(
    /(<div class="content-intro fade-in">\s*<h2>)[^<]*(<\/h2>\s*<p>)[^<]*(<\/p>)/,
    (_, h2open, ph2close, pclose) =>
      `${h2open}${escHtml(data.h2)}${ph2close}${escHtml(data.intro_p)}${pclose}`
  );

  // Fallback if above didn't match — try without class
  if (out === html) {
    out = out.replace(
      /(<h2>Fridge Repair in [^<]+<\/h2>\s*<p>)[^<]*(<\/p>)/,
      (_, open, close) => `${open}${escHtml(data.intro_p)}${close}`
    );
  }

  // 2. Replace FAQ items — Alberta uses <details><summary><span class="faq-q-text">
  const detailsRe = /(<details class="faq-item"><summary class="faq-question"><span class="faq-q-text">)([\s\S]*?)(<\/span>[\s\S]*?<\/summary><div class="faq-answer"><p>)([\s\S]*?)(<\/p><\/div><\/details>)/g;
  let faqIdx = 0;
  out = out.replace(detailsRe, (match, pre, _oldQ, mid, _oldA, post) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${pre}${escHtml(f.q)}${mid}${escHtml(f.a)}${post}`;
  });

  return out;
}

// ── HTML patching — dispatch ─────────────────────────────────────────────────
function patchFile(html, data, slug) {
  const hasV2   = html.includes('<!-- CITY-CONTENT-v2 -->');
  const hasFaqQ = html.includes('faq-question-text');
  const hasOldQ = html.includes('faq-q-text');

  if (hasV2 && hasFaqQ) return patchNewTemplate(html, data);
  if (hasOldQ)          return patchAlbertaTemplate(html, data);
  return patchOldToroTemplate(html, data);   // old Toronto template
}

function escHtml(str) {
  // Only escape the few problematic chars; keep apostrophes readable
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Collect all fridge-repair-[city].html files, skip near-me
  const files = fs.readdirSync(SITE_DIR)
    .filter(f => f.startsWith('fridge-repair-') && f.endsWith('.html') && f !== 'fridge-repair-near-me.html')
    .sort();

  const cities = files.map(f => {
    const slug = f.replace('fridge-repair-', '').replace('.html', '');
    return {
      slug,
      name: slugToCity(slug),
      province: isAlbertaCity(slug) ? 'Alberta' : 'Ontario',
      file: path.join(SITE_DIR, f)
    };
  });

  console.log(`Found ${cities.length} cities to process.`);

  // Split into batches
  const batches = [];
  for (let i = 0; i < cities.length; i += BATCH_SIZE) {
    batches.push(cities.slice(i, i + BATCH_SIZE));
  }

  let totalProcessed = 0;
  let totalSuccess   = 0;
  let totalErrors    = 0;
  const errors = [];

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi];
    console.log(`\nBatch ${bi + 1}/${batches.length}: ${batch.map(c => c.name).join(', ')}`);

    // Generate content via Gemini
    let contentMap;
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const prompt = buildPrompt(batch);
        const raw    = await callGemini(prompt);
        const parsed = extractJSON(raw);
        contentMap   = parsed.cities || parsed;
        console.log(`  API call OK (attempt ${attempts}), got data for: ${Object.keys(contentMap).join(', ')}`);
        break;
      } catch (err) {
        console.error(`  API attempt ${attempts} failed: ${err.message}`);
        if (attempts < 3) {
          console.log(`  Retrying in 5s...`);
          await sleep(5000);
        }
      }
    }

    if (!contentMap) {
      console.error(`  FAILED all attempts for batch ${bi + 1}. Skipping.`);
      for (const c of batch) errors.push(`${c.slug}: API failure`);
      totalErrors += batch.length;
      continue;
    }

    // Inject into each file
    for (const city of batch) {
      totalProcessed++;
      const data = contentMap[city.slug] || contentMap[city.name] || contentMap[city.name.toLowerCase()];

      if (!data) {
        console.warn(`  SKIP ${city.slug}: no data returned from API`);
        errors.push(`${city.slug}: missing from API response`);
        totalErrors++;
        continue;
      }

      // Validate data has required fields
      if (!data.h2 || !data.intro_p || !data.faq || !Array.isArray(data.faq)) {
        console.warn(`  SKIP ${city.slug}: incomplete data (missing h2/intro_p/faq)`);
        errors.push(`${city.slug}: incomplete API data`);
        totalErrors++;
        continue;
      }

      try {
        const original = fs.readFileSync(city.file, 'utf8');
        const patched  = patchFile(original, data, city.slug);

        if (patched === original) {
          console.warn(`  WARN ${city.slug}: no changes made (pattern mismatch?)`);
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

    // Rate-limit pause between batches
    if (bi < batches.length - 1) {
      console.log('  Pausing 3s before next batch...');
      await sleep(3000);
    }
  }

  console.log('\n══════════════════════════════════════════');
  console.log(`DONE.  Processed: ${totalProcessed}  |  Success: ${totalSuccess}  |  Errors/Skipped: ${totalErrors}`);
  if (errors.length) {
    console.log('\nErrors / warnings:');
    errors.forEach(e => console.log('  -', e));
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
