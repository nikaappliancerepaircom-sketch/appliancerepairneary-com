/**
 * rewrite-stove-content.js
 * Rewrites 4 content sections in all stove-repair-[city].html files on appliancerepairneary.com
 * Uses Gemini 2.5 Flash for content generation.
 *
 * Sections rewritten per page:
 *   1. Hero answer-box paragraph (after H1)
 *   2. Content section H2 heading
 *   3. Content intro paragraphs (replaces CITY-CONTENT-v2 block)
 *   4. FAQ items in #faq section (4 Q&A pairs)
 */

const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

const DIR = 'C:/appliancerepairneary';

// Get stove-repair city files (skip near-me and symptom pages)
const files = fs.readdirSync(DIR)
  .filter(f =>
    f.match(/^stove-repair-.+\.html$/) &&
    !f.includes('near-me') &&
    !f.includes('not-heating') &&
    !f.includes('not-working') &&
    !f.includes('clicking') &&
    !f.includes('burner')
  )
  .map(f => ({ file: f, city: f.replace('stove-repair-', '').replace('.html', '') }));

console.log(`Found ${files.length} stove-repair city pages:`);
files.forEach(f => console.log(`  ${f.city}`));

// ── Gemini API call ────────────────────────────────────────────────────────────
async function generateBatch(cities) {
  const prompt = `Write unique stove repair content for these Canadian cities/neighborhoods for appliancerepairneary.com. Return ONLY valid JSON, no explanation, no markdown code fences.

Each city needs:
- hero_p: 25-35 word unique opener for the answer-box paragraph. VARY the angle per city. Some ideas: gas stove prevalence in older/ethnic neighborhoods, electric/induction in condos, heavy cooking culture, commuter suburb housing era, lakefront humidity effects, mixed housing stock. Do NOT start every city with the same sentence structure.
- h2: 10-14 word unique heading for the main content section. Must include the city name + stove/range repair context.
- intro_p: 150-180 words total. Write as 2 natural paragraphs separated by blank lines (\\n\\n). Include: 2-3 specific real neighborhoods, gas vs electric/induction for this city's housing era, common stove brands (Samsung, LG, GE, Frigidaire, Bosch, Whirlpool, Maytag, KitchenAid), most common failures (igniter in gas, element/coil in electric, control board in induction), brief local context. Plain text — NO HTML tags.
- faq: exactly 4 city-specific objects with "q" and "a" keys. 2 sentences each answer maximum. Mention city name in each question. Topics: (1) coverage/neighborhoods, (2) repair cost for this city's dominant stove type, (3) gas vs electric specific to this area, (4) one unique local angle.

Canadian context for these cities:
- GTA (Greater Toronto Area): diverse cuisine cultures (South Asian, Caribbean, East Asian, Italian, Greek, Somali), older downtown/midtown areas gas, new condos electric/induction
- Peel Region (Brampton, Mississauga): large South Asian/Caribbean population, high gas range usage, Peel water moderately hard
- York Region (Vaughan, Richmond Hill, Markham): high-density new builds with induction/electric, large Italian/Chinese/Persian communities
- Durham Region (Ajax, Whitby, Pickering, Oshawa): 1990s-2000s commuter suburbs, builder-grade gas and electric, Lake Ontario water
- West GTA (Burlington, Oakville): affluent, mix of older gas homes and new condos, KitchenAid/Bosch premium brands common
- Alberta (Calgary, Edmonton): natural gas dominates strongly, drier prairie climate, different cultural demographic
- Inner Toronto neighborhoods (Cabbagetown, Corso Italia, Leslieville, etc.): Victorian/Edwardian semis with older gas, gentrified condos nearby

PRESERVE in all content: phone (437) 524-1053, 90-day warranty, same-day service, $120-$350 repair range, brands: Samsung LG GE Bosch Frigidaire Whirlpool Maytag KitchenAid.

Cities to generate for: ${cities.join(', ')}

Return ONLY this exact JSON structure (no markdown, no code fences, just raw JSON):
{"cities":{"city-name-1":{"hero_p":"...","h2":"...","intro_p":"paragraph1\\n\\nparagraph2\\n\\nparagraph3","faq":[{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]},"city-name-2":{...}}}

Use the exact city names from the input list as JSON keys.`;

  let attempt = 0;
  while (attempt < 3) {
    attempt++;
    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 12000,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`  Gemini API error ${res.status}: ${errText.substring(0, 200)}`);
        if (attempt < 3) { await sleep(3000); continue; }
        return null;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error('  No text in Gemini response:', JSON.stringify(data).substring(0, 200));
        if (attempt < 3) { await sleep(3000); continue; }
        return null;
      }

      // Parse JSON
      const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      try {
        return JSON.parse(cleaned);
      } catch (e) {
        // Try extracting JSON object
        const m = cleaned.match(/\{[\s\S]+\}/);
        if (m) {
          try { return JSON.parse(m[0]); }
          catch (e2) {
            console.error(`  JSON parse error (attempt ${attempt}):`, e2.message);
            console.error('  Raw text (first 300):', cleaned.substring(0, 300));
            if (attempt < 3) { await sleep(2000); continue; }
            return null;
          }
        }
        console.error(`  Cannot extract JSON (attempt ${attempt})`);
        if (attempt < 3) { await sleep(2000); continue; }
        return null;
      }
    } catch (e) {
      console.error(`  Fetch error (attempt ${attempt}):`, e.message);
      if (attempt < 3) { await sleep(3000); continue; }
      return null;
    }
  }
  return null;
}

// ── HTML injection ─────────────────────────────────────────────────────────────
function injectContent(html, city, content) {
  let modified = html;

  // 1. Hero answer-box paragraph
  const answerBoxRegex = /(<div class="answer-box" itemprop="description">\s*<p>)([\s\S]*?)(<\/p>\s*<\/div>)/;
  if (answerBoxRegex.test(modified)) {
    modified = modified.replace(answerBoxRegex, (_match, open, _old, close) =>
      `${open}${escapeHtml(content.hero_p)}${close}`
    );
  } else {
    console.warn(`  [${city}] WARNING: answer-box pattern not found`);
  }

  // 2. Content section first H2 (inside .content-body.reveal)
  const contentH2Regex = /(<div class="content-body reveal">\s*<h2>)([\s\S]*?)(<\/h2>)/;
  if (contentH2Regex.test(modified)) {
    modified = modified.replace(contentH2Regex, (_match, open, _old, close) =>
      `${open}${escapeHtml(content.h2)}${close}`
    );
  } else {
    console.warn(`  [${city}] WARNING: content-body h2 not found`);
  }

  // 3. Replace CITY-CONTENT-v2 block with new intro paragraphs
  //    Also remove the old city-context paragraph that follows it
  const cityContentBlockRegex = /(<!-- CITY-CONTENT-v2 -->)([\s\S]*?)(<!-- END-CITY-CONTENT-v2 -->)/;
  const cityContextRegex = /\s*<p class="city-context"><!-- UNIQUE-CITY-CONTENT -->[\s\S]*?<!-- END-UNIQUE-CITY-CONTENT --><\/p>/;

  const introParagraphs = formatIntroParagraphs(content.intro_p);

  if (cityContentBlockRegex.test(modified)) {
    modified = modified.replace(cityContentBlockRegex, (_match, open, _old, close) =>
      `${open}\n    ${introParagraphs}\n    ${close}`
    );
    // Remove old city-context paragraph
    if (cityContextRegex.test(modified)) {
      modified = modified.replace(cityContextRegex, '');
    }
  } else {
    // Fallback: replace city-context paragraph only
    const fallbackRegex = /(<p class="city-context"><!-- UNIQUE-CITY-CONTENT -->)([\s\S]*?)(<!-- END-UNIQUE-CITY-CONTENT --><\/p>)/;
    if (fallbackRegex.test(modified)) {
      modified = modified.replace(fallbackRegex, `<p>${introParagraphs}</p>`);
    } else {
      console.warn(`  [${city}] WARNING: no CITY-CONTENT-v2 or city-context block found — intro_p not injected`);
    }
  }

  // 4. FAQ items — replace content of <div class="faq-list"> in #faq section
  //    We identify the faq-section by id="faq" and replace faq-list content
  const faqListRegex = /(<section class="faq-section" id="faq">[\s\S]*?<div class="faq-list">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/;
  if (faqListRegex.test(modified) && content.faq && content.faq.length >= 4) {
    const newFaqHtml = buildFaqHtml(content.faq.slice(0, 4));
    modified = modified.replace(faqListRegex, (_match, open, _old, close) =>
      `${open}\n\n${newFaqHtml}\n\n    ${close}`
    );
  } else {
    if (!faqListRegex.test(modified)) {
      console.warn(`  [${city}] WARNING: faq-section/faq-list pattern not found`);
    }
    if (!content.faq || content.faq.length < 4) {
      console.warn(`  [${city}] WARNING: expected 4 FAQ items, got ${content.faq ? content.faq.length : 0}`);
    }
  }

  return modified;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatIntroParagraphs(text) {
  if (!text) return '';
  const paragraphs = text
    .split(/\n\n+/)
    .map(p => p.replace(/\n/g, ' ').trim())
    .filter(p => p.length > 0);

  if (paragraphs.length === 0) return '';
  if (paragraphs.length === 1) {
    // Split long single paragraph roughly in half at sentence boundary
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [];
    if (sentences.length >= 4) {
      const mid = Math.floor(sentences.length / 2);
      const p1 = sentences.slice(0, mid).join('').trim();
      const p2 = sentences.slice(mid).join('').trim();
      return [p1, p2].filter(Boolean)
        .map(p => `<p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(p)}</p>`)
        .join('\n    ');
    }
    return `<p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(text.trim())}</p>`;
  }
  return paragraphs
    .map(p => `<p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escapeHtml(p)}</p>`)
    .join('\n    ');
}

function buildFaqHtml(faqItems) {
  return faqItems.map(item => `<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${escapeHtml(item.q)}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${escapeHtml(item.a)}</p></div>
  </div>
</div>`).join('\n\n');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main run ───────────────────────────────────────────────────────────────────
async function run() {
  let totalSuccess = 0;
  let totalErrors = 0;
  const errorFiles = [];

  const BATCH_SIZE = 6; // Keep batches small to avoid truncation

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const cities = batch.map(b => b.city);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);

    console.log(`\n[Batch ${batchNum}/${totalBatches}] Generating: ${cities.join(', ')}`);

    const contentData = await generateBatch(cities);

    if (!contentData || !contentData.cities) {
      console.error(`  FAILED batch — skipping ${batch.length} files`);
      batch.forEach(b => errorFiles.push(b.file));
      totalErrors += batch.length;
      continue;
    }

    // Find content for each city (with fuzzy key matching)
    for (const { file, city } of batch) {
      let content = contentData.cities?.[city];
      if (!content) {
        // Fuzzy match: normalize spaces/hyphens
        const normalizedCity = city.toLowerCase().replace(/[\s-]/g, '');
        const altKey = Object.keys(contentData.cities).find(
          k => k.toLowerCase().replace(/[\s-]/g, '') === normalizedCity
        );
        if (altKey) {
          console.log(`  [${city}] Using alt key "${altKey}"`);
          content = contentData.cities[altKey];
        }
      }

      if (!content) {
        console.warn(`  [${city}] No content returned (available keys: ${Object.keys(contentData.cities).join(', ')})`);
        errorFiles.push(file);
        totalErrors++;
        continue;
      }

      try {
        let html = fs.readFileSync(path.join(DIR, file), 'utf8');
        html = injectContent(html, city, content);
        fs.writeFileSync(path.join(DIR, file), html);
        console.log(`  ✓ Updated ${file}`);
        totalSuccess++;
      } catch (e) {
        console.error(`  ✗ Error updating ${file}: ${e.message}`);
        errorFiles.push(file);
        totalErrors++;
      }
    }

    // Rate limit delay between batches
    if (i + BATCH_SIZE < files.length) {
      console.log('  Waiting 1.5s...');
      await sleep(1500);
    }
  }

  console.log('\n============================');
  console.log(`COMPLETE: ${totalSuccess} updated, ${totalErrors} errors, ${files.length} total`);
  if (errorFiles.length > 0) {
    console.log('Failed files:');
    errorFiles.forEach(f => console.log(`  - ${f}`));
  }
}

run().catch(console.error);
