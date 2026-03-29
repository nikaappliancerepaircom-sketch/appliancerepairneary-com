#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const SITE_DIR = 'C:/appliancerepairneary';
const CONTENT_CACHE = 'C:/appliancerepairneary/dryer-content-v3.json';
const BATCH_SIZE = 7;

const GEMINI_API_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_MODEL = 'gemini-2.5-flash';

// ── Collect target files ─────────────────────────────────────────────────────
const allFiles = fs.readdirSync(SITE_DIR)
  .filter(f => f.startsWith('dryer-repair-') && f.endsWith('.html'))
  .filter(f => !f.includes('near-me') && !f.includes('not-heating'));

const cities = allFiles.map(f => f.replace('dryer-repair-', '').replace('.html', ''));

console.log(`Found ${cities.length} target files`);

// ── Alberta detection ─────────────────────────────────────────────────────────
const ALBERTA_CITIES = new Set([
  'airdrie','beaumont','calgary','canmore','chestermere','cochrane',
  'devon','edmonton','fort-saskatchewan','high-river','langdon',
  'leduc','okotoks','sherwood-park','spruce-grove','st-albert',
  'stony-plain','strathmore'
]);

function isAlberta(slug) { return ALBERTA_CITIES.has(slug); }

function slugToTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Gemini API ───────────────────────────────────────────────────────────────
async function generateBatch(batchCities) {
  const cityRegions = batchCities.map(c => {
    const title = slugToTitle(c);
    const region = isAlberta(c)
      ? 'Alberta (dry climate, chinook winds, gas dryers prevalent, no Lake Ontario humidity)'
      : 'GTA/Ontario (Lake Ontario humidity, condo venting challenges, mix of gas/electric)';
    return `${title} [${region}]`;
  }).join(', ');

  const prompt = `Write unique dryer repair page content for Canadian cities/neighbourhoods. Return ONLY valid JSON — no markdown fences, no preamble.

Each city needs exactly:
- "hero_p": 20-30 words. Unique opening about dryer repair for this specific location. Vary structure. Do NOT start with the city name or "In [city]".
- "h2": 8-12 words. Include city name + specific repair context. Make each structurally different from others.
- "intro_p": 150-200 words. Rich paragraph: 2-3 real local neighbourhoods, housing type (condos/townhomes/detached), climate/humidity impact on dryers, common brands in area, 1-2 specific repair issues. Be genuinely specific — no generic text.
- "faq": Array of exactly 4 objects {"q","a"}. Questions mention the city. Answers 2-3 sentences. Topics vary per city from: gas vs electric cost, condo venting rules, common brands, seasonal maintenance, drying time differences, warranty, repair vs replace, same-day availability.

Context:
- GTA/Ontario: Lake Ontario humidity, cold winters, condo shared exhaust ducts, Samsung/LG in condos, Whirlpool/Maytag in older homes.
- Alberta: dry chinook climate, gas dryers dominant, sprawling suburbs, Whirlpool/Maytag/Kenmore common.
- Toronto neighbourhoods: specific street names, older Victorian/Edwardian stock, mix of semis and new condos.

Cities: ${cityRegions}

Return format (use slug as key):
{"cities":{"city-slug":{"hero_p":"...","h2":"...","intro_p":"...","faq":[{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]}}}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error(`Unexpected Gemini response: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const text = data.candidates[0].content.parts[0].text;

  // Strip markdown fences if present
  const stripped = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/,'')
    .trim();

  try { return JSON.parse(stripped); }
  catch (_) {
    const match = stripped.match(/\{[\s\S]+\}/);
    if (match) {
      try { return JSON.parse(match[0]); }
      catch (e2) { throw new Error(`JSON parse failed: ${e2.message}\nRaw:\n${stripped.slice(0, 600)}`); }
    }
    throw new Error(`No JSON found:\n${stripped.slice(0, 600)}`);
  }
}

// ── HTML injection helpers ───────────────────────────────────────────────────

function esc(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Detect template type
function detectTemplate(html) {
  // Template A: has .answer-box with itemprop="description" + <p> inside it, has .content-body.reveal, CITY-CONTENT-v2 block
  if (/class="answer-box"[^>]*itemprop/.test(html) && /class="content-body reveal"/.test(html)) return 'A';
  // Template B: has .answer-box without p tag inside (bare text), has content-intro class
  if (/class="answer-box"/.test(html) && /class="content-intro/.test(html)) return 'B';
  // Template C: hero-capsule, CITY-CONTENT-v2 marker, faq-q class (no faq-list wrapper for the section H2)
  if (/class="hero-capsule"/.test(html) && /CITY-CONTENT-v2/.test(html)) return 'C';
  // Template D: hero-capsule, UNIQUE-CITY-CONTENT inline, faq-q class
  if (/class="hero-capsule"/.test(html)) return 'D';
  return 'UNKNOWN';
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE A: classic (mississauga, brampton, etc.)
// ────────────────────────────────────────────────────────────────────────────

function injectTemplateA(html, content) {
  const results = { answerBox: false, h2: false, introP: false, faq: false };

  // 1. Answer-box paragraph
  {
    const pat = /(<div class="answer-box"[^>]*>\s*<p[^>]*>)([\s\S]*?)(<\/p>\s*<\/div>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `$1${content.hero_p}$3`);
      results.answerBox = true;
    }
  }

  // 2. Content H2 (first h2 inside .content-body.reveal)
  {
    const pat = /(<div class="content-body reveal">\s*<h2[^>]*>)([\s\S]*?)(<\/h2>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `$1${content.h2}$3`);
      results.h2 = true;
    }
  }

  // 3. Replace CITY-CONTENT-v2 block + everything after it until closing div of left column
  {
    const startMarker = '<!-- CITY-CONTENT-v2 -->';
    const endMarker = '<!-- END-CITY-CONTENT-v2 -->';
    const startIdx = html.indexOf(startMarker);
    const endIdx = html.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1) {
      const afterEnd = endIdx + endMarker.length;
      // Find closing of left content column: look for </div>\n  <!-- Repeated side card
      const tail = html.slice(afterEnd);
      const closeMatch = tail.match(/\s*<\/div>\s*\n\s*<!-- Repeated side card/);
      const endPos = closeMatch ? afterEnd + closeMatch.index : afterEnd;

      const newBlock = `${startMarker}\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${content.intro_p}</p>\n    ${endMarker}`;
      html = html.slice(0, startIdx) + newBlock + html.slice(endPos);
      results.introP = true;
    }
  }

  // 4. FAQ items (inside .faq-list wrapper, uses faq-question/faq-answer classes)
  {
    const r = replaceFAQListWrapper(html, content.faq);
    if (r.replaced) { html = r.html; results.faq = true; }
  }

  return { html, results };
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE B: newer Alberta/v2 (airdrie, beaumont, etc.)
// ────────────────────────────────────────────────────────────────────────────

function injectTemplateB(html, content) {
  const results = { answerBox: false, h2: false, introP: false, faq: false };

  // 1. answer-box div with direct text (no p tag)
  {
    const pat = /(<div class="answer-box">)([\s\S]*?)(<\/div>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `$1${content.hero_p}$3`);
      results.answerBox = true;
    }
  }

  // 2. H2 inside content-intro (first h2)
  {
    // Match content-intro with any extra classes (e.g. "content-intro fade-in")
    const pat = /(<div class="content-intro[^>]*>\s*<h2[^>]*>)([\s\S]*?)(<\/h2>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `$1${content.h2}$3`);
      results.h2 = true;
    } else {
      // Try to find first h2 inside main content area
      const mainPat = /(<main[^>]*>[\s\S]*?<h2[^>]*>)([\s\S]*?)(<\/h2>)/i;
      if (mainPat.test(html)) {
        html = html.replace(mainPat, `$1${content.h2}$3`);
        results.h2 = true;
      }
    }
  }

  // 3. First paragraph inside content-intro (after H2)
  {
    const pat = /(<div class="content-intro[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*>)([\s\S]*?)(<\/p>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `$1${content.intro_p}$3`);
      results.introP = true;
    }
  }

  // 4. FAQ items
  {
    const r = replaceFAQListWrapper(html, content.faq);
    if (r.replaced) { html = r.html; results.faq = true; }
  }

  return { html, results };
}

// ────────────────────────────────────────────────────────────────────────────
// TEMPLATE C & D: Toronto neighbourhood pages (bloor-west-village, roncesvalles, etc.)
// ────────────────────────────────────────────────────────────────────────────

function injectTemplateCD(html, content) {
  const results = { answerBox: false, h2: false, introP: false, faq: false };

  // 1. hero-capsule content
  {
    // Replace content between <strong>...</strong> intro and </div> of hero-capsule
    // The hero capsule contains: <strong>Need X in Y?</strong> TEXT
    const pat = /(<div class="hero-capsule">[\s\S]*?<\/strong>)([\s\S]*?)(<\/div>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `$1 ${content.hero_p}$3`);
      results.answerBox = true;
    }
  }

  // 2. H2 "About [City]" — replace just the text inside it
  {
    const pat = /(<h2>About )([\s\S]*?)(<\/h2>)/i;
    if (pat.test(html)) {
      html = html.replace(pat, `<h2>${content.h2}</h2>`);
      results.h2 = true;
    }
  }

  // 3. CITY-CONTENT-v2 block (Template C) or UNIQUE-CITY-CONTENT (Template D / willowdale)
  const hasCv2 = html.indexOf('<!-- CITY-CONTENT-v2 -->') !== -1;

  if (hasCv2) {
    const startMarker = '<!-- CITY-CONTENT-v2 -->';
    const endMarker = '<!-- END-CITY-CONTENT-v2 -->';
    const startIdx = html.indexOf(startMarker);
    const endIdx = html.indexOf(endMarker);

    if (startIdx !== -1 && endIdx !== -1) {
      const afterEnd = endIdx + endMarker.length;
      // Find the end of the enclosing <div> for the left column
      // Pattern: next <p>...<strong>Who lives here... or next </div> closing the two-col left column
      // We replace from startMarker to endMarker (inclusive)
      const newBlock = `${startMarker}\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${content.intro_p}</p>\n    ${endMarker}`;
      html = html.slice(0, startIdx) + newBlock + html.slice(afterEnd);
      results.introP = true;
    }
  } else {
    // Template D: replace UNIQUE-CITY-CONTENT inline
    const ucStart = '<!-- UNIQUE-CITY-CONTENT -->';
    const ucEnd = '<!-- END-UNIQUE-CITY-CONTENT -->';
    const si = html.indexOf(ucStart);
    const ei = html.indexOf(ucEnd);
    if (si !== -1 && ei !== -1) {
      html = html.slice(0, si) + ucStart + content.intro_p + ucEnd + html.slice(ei + ucEnd.length);
      results.introP = true;
    }
  }

  // 4. FAQ: Template C/D use inline faq-q/faq-a pattern (no faq-list wrapper)
  {
    const r = replaceFAQInlineStyle(html, content.faq);
    if (r.replaced) { html = r.html; results.faq = true; }
  }

  return { html, results };
}

// ── FAQ replacement helpers ──────────────────────────────────────────────────

// Template A/B: faq-list wrapper with faq-question/faq-answer classes
function replaceFAQListWrapper(html, faqItems) {
  const faqListStart = html.indexOf('<div class="faq-list">');
  if (faqListStart === -1) return { html, replaced: false };

  // Find closing </div> by counting depth
  let depth = 0, i = faqListStart, insideFirst = false;
  while (i < html.length) {
    if (html.slice(i, i + 4) === '<div') { depth++; insideFirst = true; i += 4; }
    else if (html.slice(i, i + 6) === '</div>') {
      depth--;
      if (depth === 0 && insideFirst) {
        const endPos = i + 6;
        const newItems = faqItems.map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${esc(item.q)}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${esc(item.a)}</p></div>
  </div>
</div>`).join('\n');
        const newBlock = `<div class="faq-list">\n      <!-- FAQ_ITEMS are injected by the page generator -->\n      ${newItems}\n</div>`;
        return { html: html.slice(0, faqListStart) + newBlock + html.slice(endPos), replaced: true };
      }
      i += 6;
    } else i++;
  }
  return { html, replaced: false };
}

// Template C/D: inline faq-q/faq-a pattern
function replaceFAQInlineStyle(html, faqItems) {
  // Find the FAQ section: <section>...<h2>Frequently Asked Questions...
  // The faq items are inside <div style="margin-top:20px">...</div>
  const faqSectionMatch = html.match(/<h2>Frequently Asked Questions[^<]*<\/h2>\s*<div[^>]*>/i);
  if (!faqSectionMatch) return { html, replaced: false };

  const faqStart = faqSectionMatch.index + faqSectionMatch[0].length;

  // Find the closing </div> of the faq wrapper div
  let depth = 1, i = faqStart;
  while (i < html.length && depth > 0) {
    if (html.slice(i, i + 4) === '<div') { depth++; i += 4; }
    else if (html.slice(i, i + 6) === '</div>') { depth--; if (depth === 0) break; i += 6; }
    else i++;
  }

  if (depth !== 0) return { html, replaced: false };

  const newItems = faqItems.map(item => `    <div class="faq-item">
      <button class="faq-q" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'">
        ${esc(item.q)} <span>+</span>
      </button>
      <div class="faq-a" style="display:none">${esc(item.a)}</div>
    </div>`).join('\n');

  const newBlock = `\n${newItems}\n  `;

  return {
    html: html.slice(0, faqStart) + newBlock + html.slice(i),
    replaced: true
  };
}

// ── Master injection ─────────────────────────────────────────────────────────

function injectContent(html, content) {
  const tpl = detectTemplate(html);
  if (tpl === 'A') return injectTemplateA(html, content);
  if (tpl === 'B') return injectTemplateB(html, content);
  if (tpl === 'C' || tpl === 'D') return injectTemplateCD(html, content);
  return { html, results: { answerBox: false, h2: false, introP: false, faq: false }, template: 'UNKNOWN' };
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Load or init cache
  let cache = {};
  if (fs.existsSync(CONTENT_CACHE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CONTENT_CACHE, 'utf8'));
      console.log(`Loaded cache with ${Object.keys(cache).length} cities`);
    } catch (_) { console.log('Cache corrupt, starting fresh'); }
  }

  // Generate missing
  const needsGen = cities.filter(c => !cache[c]);
  console.log(`\nNeed to generate: ${needsGen.length} cities`);

  for (let i = 0; i < needsGen.length; i += BATCH_SIZE) {
    const batch = needsGen.slice(i, i + BATCH_SIZE);
    console.log(`\nGenerating batch ${Math.floor(i/BATCH_SIZE)+1}: ${batch.join(', ')}`);

    let result = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await generateBatch(batch);
        break;
      } catch (e) {
        console.log(`  Attempt ${attempt} failed: ${e.message.slice(0, 120)}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 3000 * attempt));
        else console.error(`  All retries failed for this batch`);
      }
    }

    if (!result) { continue; }

    try {
      const cityData = result.cities || result;
      for (const [slug, data] of Object.entries(cityData)) {
        const normalized = slug.toLowerCase().replace(/\s+/g, '-');
        cache[normalized] = data;
        console.log(`  ✓ ${slug}`);
      }
      fs.writeFileSync(CONTENT_CACHE, JSON.stringify(cache, null, 2));
      console.log(`  Cache saved (${Object.keys(cache).length} total)`);
      if (i + BATCH_SIZE < needsGen.length) await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`  Cache merge error: ${err.message}`);
      fs.writeFileSync(CONTENT_CACHE, JSON.stringify(cache, null, 2));
    }
  }

  // ── Inject ──────────────────────────────────────────────────────────────────
  console.log('\n── Injecting content into HTML files ──');

  let totalFiles = 0, successes = 0, fullyDone = 0, skipped = 0, errors = 0;
  const sectionStats = { answerBox: 0, h2: 0, introP: 0, faq: 0 };
  const tplCounts = { A: 0, B: 0, C: 0, D: 0, UNKNOWN: 0 };
  const warnings = [];

  for (const slug of cities) {
    totalFiles++;
    const filePath = path.join(SITE_DIR, `dryer-repair-${slug}.html`);

    const content = cache[slug];
    if (!content) {
      console.log(`  SKIP ${slug} — no content`);
      warnings.push(`${slug}: no content in cache`);
      skipped++;
      continue;
    }
    if (!content.hero_p || !content.h2 || !content.intro_p || !content.faq || content.faq.length < 4) {
      console.log(`  SKIP ${slug} — incomplete content`);
      warnings.push(`${slug}: incomplete content`);
      skipped++;
      continue;
    }

    try {
      let html = fs.readFileSync(filePath, 'utf8');
      const tpl = detectTemplate(html);
      tplCounts[tpl] = (tplCounts[tpl] || 0) + 1;

      const { html: newHtml, results } = injectContent(html, content);
      fs.writeFileSync(filePath, newHtml, 'utf8');

      const allGood = Object.values(results).every(v => v);
      const summary = Object.entries(results).map(([k,v]) => v ? `✓${k}` : `✗${k}`).join(' ');

      if (allGood) { fullyDone++; console.log(`  ✓ ${slug} [${tpl}] [${summary}]`); }
      else {
        const missed = Object.entries(results).filter(([,v]) => !v).map(([k]) => k);
        console.log(`  ~ ${slug} [${tpl}] [${summary}]`);
        warnings.push(`${slug}: ✗ ${missed.join(', ')}`);
      }
      successes++;
      for (const [k, v] of Object.entries(results)) { if (v) sectionStats[k]++; }
    } catch (err) {
      console.error(`  ERROR ${slug}: ${err.message}`);
      errors++;
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log('           INJECTION SUMMARY          ');
  console.log('══════════════════════════════════════');
  console.log(`Total files:   ${totalFiles}`);
  console.log(`Processed:     ${successes}`);
  console.log(`Fully done:    ${fullyDone}`);
  console.log(`Skipped:       ${skipped}`);
  console.log(`Errors:        ${errors}`);
  console.log(`\nTemplates: A=${tplCounts.A} B=${tplCounts.B} C=${tplCounts.C} D=${tplCounts.D} UNKNOWN=${tplCounts.UNKNOWN}`);
  console.log(`\nSection counts:`);
  console.log(`  answer-box: ${sectionStats.answerBox}/${totalFiles}`);
  console.log(`  content H2: ${sectionStats.h2}/${totalFiles}`);
  console.log(`  intro para: ${sectionStats.introP}/${totalFiles}`);
  console.log(`  FAQ items:  ${sectionStats.faq}/${totalFiles}`);
  if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  console.log('══════════════════════════════════════');
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
