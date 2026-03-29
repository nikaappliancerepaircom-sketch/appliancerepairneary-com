/**
 * rewrite-stove-alt-template.js
 * Updates the 20 stove-repair pages that use the ALTERNATE template structure:
 *   - .hero-capsule paragraph (instead of .answer-box)
 *   - .faq-q / .faq-a buttons (instead of .faq-question / .faq-answer)
 *   - No .content-body.reveal h2 to target
 *
 * These pages already had their CITY-CONTENT-v2 block updated by the main script.
 * This script updates the remaining 2 sections: hero capsule text and FAQ items.
 */

const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

const DIR = 'C:/appliancerepairneary';

// These 20 pages use the alternate template
const ALT_CITIES = [
  'bloor-west-village', 'chinatown', 'corso-italia', 'dufferin-grove', 'east-york',
  'etobicoke-village', 'greektown', 'high-park', 'king-west', 'little-italy',
  'little-portugal', 'midtown', 'ossington', 'roncesvalles', 'st-lawrence',
  'swansea', 'the-beaches', 'thorncliffe-park', 'trinity-bellwoods', 'wychwood'
];

const files = ALT_CITIES.map(city => ({
  file: `stove-repair-${city}.html`,
  city
}));

console.log(`Processing ${files.length} alternate-template pages`);

// ── Gemini API ─────────────────────────────────────────────────────────────────
async function generateBatch(cities) {
  const prompt = `Write unique stove repair content for these Toronto neighborhood pages for appliancerepairneary.com. Return ONLY valid JSON.

Each city/neighborhood needs:
- hero_capsule: 50-65 word paragraph for the hero section. Must mention: city name, (437) 524-1053, 90-day warranty, same-day service. Vary the angle — gas stoves in older Victorian/Edwardian homes, Italian/Greek/Portuguese cooking culture with high gas use, condo electric ranges, gentrified neighborhoods with mixed housing, artistic/trendy communities. Do NOT use the same sentence opener for every city.
- faq: exactly 4 city-specific objects with "q" and "a" keys. 2 sentences max each answer. Questions must mention the neighborhood name. Topics: (1) service coverage in this neighborhood, (2) repair cost for this area's typical stove type, (3) gas vs electric specific to this neighborhood's housing mix, (4) one local angle — cooking culture, Victorian home gas stoves, condo rules, heritage building considerations, or evening slots for residents.

Toronto neighborhood context:
- Bloor West Village: Victorian/Edwardian semis, strong community, mix of gas (older homes) and electric (renovated/infill), older Kenmore/GE gas ranges
- Chinatown: dense apartments, electric glass-top dominant, high-volume wok cooking, Samsung/LG electric most common
- Corso Italia: strong Italian cooking culture, high gas range usage, older 1950s-60s homes, Moffat/GE gas + newer Samsung/LG
- Dufferin Grove: eclectic mix, older semis with gas, some newer builds with electric, community garden culture = lots of cooking
- East York: post-war bungalows, older GE/Moffat gas ranges, some newer Samsung electric in renovated homes
- Etobicoke Village: older 1960s-70s homes, electric coil-burner dominant, GE/Moffat, affordable area
- Greektown (Danforth): strong Greek cooking culture, high gas use, older semis, Samsung/LG newer installs alongside older ranges
- High Park: mix of Victorian detached + newer infill, gas in older homes, induction in renovated kitchens, KitchenAid/Bosch in upscale renovations
- King West: modern condos, electric/induction dominant, young professional demographic, Bosch/AEG/GE Profile common
- Little Italy: Italian cooking culture, gas dominant in older homes, heavy daily use, Maytag/GE gas + newer Samsung slide-in
- Little Portugal: Portuguese cooking culture, older semis with gas ranges, Maytag/Moffat older models, newer LG gas in renovated kitchens
- Midtown (Yonge & Eglinton area): high-rise condos + older detached, electric glass-top in condos, gas in houses, Samsung/LG condo, GE/Bosch houses
- Ossington: gentrified arts district, mix of older gas in converted rowhouses and electric in new-build condos, Bosch/AEG premium in renovated spaces
- Roncesvalles: Polish/multicultural, Victorian rowhouses, gas dominant, heavy cooking culture, GE/Maytag older gas + newer Samsung
- St. Lawrence: historic market district, condos dominant, electric/induction, premium brands like Miele/Bosch/GE Profile
- Swansea: residential lakefront, older 1950s-60s homes, electric coil dominant, quiet family area, GE/Moffat/Kenmore
- The Beaches: lakefront community, mix of 1920s cottages + newer builds, gas in older homes, electric/induction in newer, KitchenAid popular
- Thorncliffe Park: dense apartments, diverse immigrant community (Middle Eastern, South Asian), heavy cooking, electric dominant, Samsung/LG
- Trinity Bellwoods: hipster/artistic, renovated Victorian semis, mix of gas (original) and induction (renovated), premium brands in renovated spaces
- Wychwood: quiet residential, older 1920s-30s homes, gas dominant, Moffat/GE older ranges, some newer Samsung in renovated kitchens

Cities: ${cities.join(', ')}

Return ONLY this JSON (no markdown, no code fences):
{"cities":{"city-name":{"hero_capsule":"...","faq":[{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]}}}`;

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
        console.error(`  Gemini error ${res.status}: ${errText.substring(0, 150)}`);
        if (attempt < 3) { await sleep(3000); continue; }
        return null;
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error('  No text in response');
        if (attempt < 3) { await sleep(3000); continue; }
        return null;
      }

      const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      try {
        return JSON.parse(cleaned);
      } catch (e) {
        const m = cleaned.match(/\{[\s\S]+\}/);
        if (m) {
          try { return JSON.parse(m[0]); }
          catch (e2) {
            console.error(`  JSON parse error (attempt ${attempt}):`, e2.message);
            if (attempt < 3) { await sleep(2000); continue; }
            return null;
          }
        }
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildAltFaqHtml(faqItems) {
  // Alternate template uses .faq-q and .faq-a with inline onclick
  return faqItems.map(item => `    <div class="faq-item">
      <button class="faq-q" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'">
        ${escapeHtml(item.q)} <span>+</span>
      </button>
      <div class="faq-a" style="display:none">${escapeHtml(item.a)}</div>
    </div>`).join('\n');
}

function injectAltContent(html, city, content) {
  let modified = html;

  // 1. Hero capsule paragraph
  // Pattern: <div class="hero-capsule">...(text)...</div>
  const heroCapsuleRegex = /(<div class="hero-capsule">)([\s\S]*?)(<\/div>)/;
  if (heroCapsuleRegex.test(modified)) {
    modified = modified.replace(heroCapsuleRegex, (_match, open, _old, close) =>
      `${open}\n    ${escapeHtml(content.hero_capsule)}\n  ${close}`
    );
  } else {
    console.warn(`  [${city}] WARNING: hero-capsule not found`);
  }

  // 2. FAQ items — replace content between <div id="faq-section"> or the faq-item block
  // The alt template has faq-items inside a <section><div class="container"> block with an h2 containing "FAQ"
  // Find the block of faq-items and replace them all
  const faqBlockRegex = /((?:<div class="faq-item">[\s\S]*?<\/div>\s*){3,})/;
  if (faqBlockRegex.test(modified) && content.faq && content.faq.length >= 4) {
    const newFaqHtml = buildAltFaqHtml(content.faq.slice(0, 4));
    // Replace only the first match (the main FAQ section, not if there are extras)
    modified = modified.replace(faqBlockRegex, newFaqHtml + '\n');
  } else {
    if (!faqBlockRegex.test(modified)) {
      console.warn(`  [${city}] WARNING: faq-item block not found`);
    }
  }

  return modified;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  let totalSuccess = 0;
  let totalErrors = 0;
  const errorFiles = [];

  const BATCH_SIZE = 5;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const cities = batch.map(b => b.city);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(files.length / BATCH_SIZE);

    console.log(`\n[Batch ${batchNum}/${totalBatches}] Generating: ${cities.join(', ')}`);

    const contentData = await generateBatch(cities);

    if (!contentData || !contentData.cities) {
      console.error(`  FAILED batch`);
      batch.forEach(b => errorFiles.push(b.file));
      totalErrors += batch.length;
      continue;
    }

    for (const { file, city } of batch) {
      let content = contentData.cities?.[city];
      if (!content) {
        const normalized = city.toLowerCase().replace(/[\s-]/g, '');
        const altKey = Object.keys(contentData.cities).find(
          k => k.toLowerCase().replace(/[\s-]/g, '') === normalized
        );
        if (altKey) {
          content = contentData.cities[altKey];
          console.log(`  [${city}] Using alt key "${altKey}"`);
        }
      }

      if (!content) {
        console.warn(`  [${city}] No content (keys: ${Object.keys(contentData.cities).join(', ')})`);
        errorFiles.push(file);
        totalErrors++;
        continue;
      }

      try {
        let html = fs.readFileSync(path.join(DIR, file), 'utf8');
        html = injectAltContent(html, city, content);
        fs.writeFileSync(path.join(DIR, file), html);
        console.log(`  ✓ Updated ${file}`);
        totalSuccess++;
      } catch (e) {
        console.error(`  ✗ Error: ${e.message}`);
        errorFiles.push(file);
        totalErrors++;
      }
    }

    if (i + BATCH_SIZE < files.length) {
      console.log('  Waiting 1.5s...');
      await sleep(1500);
    }
  }

  console.log('\n============================');
  console.log(`COMPLETE: ${totalSuccess} updated, ${totalErrors} errors`);
  if (errorFiles.length > 0) {
    console.log('Failed:', errorFiles.join(', '));
  }
}

run().catch(console.error);
