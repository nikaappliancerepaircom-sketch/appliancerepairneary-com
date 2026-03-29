/**
 * inject-dishwasher-remaining.js
 * Fixes the 17 remaining cities that failed in the main run.
 *
 * Template B cities (neighbourhood pages - ossington, roncesvalles, st-lawrence, thorncliffe-park):
 *   - hero: <div class="hero-capsule"><strong>Need dishwasher repair in X?</strong> TEXT </div>
 *   - about h2: <h2>About [City]</h2> + first <p> after it
 *   - faq: <button class="faq-q" onclick="...">Q <span>+</span></button><div class="faq-a" style="display:none">A</div>
 *
 * Template A retry cities (normal template, retry individually to avoid truncation):
 *   corso-italia, danforth-village, davisville-village, devon, don-mills,
 *   dufferin-grove, east-york, edmonton, etobicoke, etobicoke-village,
 *   trinity-bellwoods, vaughan, wychwood
 */

const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const BASE_DIR = 'C:/appliancerepairneary';

const TEMPLATE_B_CITIES = ['ossington', 'roncesvalles', 'st-lawrence', 'thorncliffe-park'];

const RETRY_CITIES = [
  'corso-italia', 'danforth-village', 'davisville-village', 'devon', 'don-mills',
  'dufferin-grove', 'east-york', 'edmonton', 'etobicoke', 'etobicoke-village',
  'trinity-bellwoods', 'vaughan', 'wychwood'
];

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
    const err = await resp.text();
    throw new Error(`Gemini ${resp.status}: ${err}`);
  }
  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No text in Gemini response');
  return text;
}

function parseJson(raw) {
  return JSON.parse(
    raw.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
  );
}

async function generateSingleCity(slug) {
  const name = toDisplayName(slug);
  const isAlberta = ALBERTA_CITIES.has(slug);
  const province = isAlberta ? 'Alberta' : 'Ontario';
  const waterNote = isAlberta
    ? 'harder municipal or well water from prairie aquifers (high mineral content, significant calcium/magnesium)'
    : 'Lake Ontario municipal water (moderate hardness, treated by Toronto/region water systems)';
  const housingNote = isAlberta
    ? 'newer prairie subdivisions (1990s-2010s), suburban detached homes, some acreage properties'
    : 'mix of older Toronto housing stock (Victorian, post-war, 1950s-1980s) and newer condos/semis';

  const prompt = `Generate unique dishwasher repair content for "${name}", ${province} Canada.
For "Appliance Repair Neary" phone (437) 524-1053.

Water: ${waterNote}
Housing: ${housingNote}

REQUIRED JSON fields — ALL 4 must be present and complete:

"hero_p": One sentence, 20-30 words. A unique hook about this specific city's dishwasher challenge. Do NOT begin with the city name.

"h2": A unique heading of 8-12 words that mentions "${name}" and dishwasher repair/service.

"intro_p": A 160-180 word paragraph that MUST include:
- 2-3 real neighbourhood names found within ${name}
- Specific water quality detail for ${name}
- Housing era and type typical of ${name}
- Most common dishwasher brands in that housing era in ${name}
- The most likely failure cause for ${name}'s specific water+housing combination

"faq": An array of EXACTLY 4 objects. Each with "q" (question) and "a" (answer). Rules:
- Each question must mention "${name}" naturally
- Each answer: 2-3 sentences
- Topic 1: water/mineral scale issue specific to ${name}
- Topic 2: pricing/cost in ${name}
- Topic 3: same-day availability in ${name}
- Topic 4: unique concern about ${name} housing or brand

Return ONLY compact valid JSON. No markdown. No explanation:
{"hero_p":"...","h2":"...","intro_p":"...","faq":[{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."},{"q":"...","a":"..."}]}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const raw = await callGemini(prompt);
      const data = parseJson(raw);
      if (!data.hero_p || !data.h2 || !data.intro_p || !Array.isArray(data.faq) || data.faq.length < 4) {
        throw new Error(`Missing fields. Keys: ${Object.keys(data).join(',')}, faq len: ${data.faq?.length}`);
      }
      return data;
    } catch (err) {
      console.error(`    Attempt ${attempt}/3 for ${slug}: ${err.message.substring(0, 120)}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 4000));
    }
  }
  return null;
}

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// -----------------------------------------------------------------------
// Template A injection (standard template)
// -----------------------------------------------------------------------
function injectTemplateA(html, d) {
  let out = html;
  let n = 0;

  // 1. Hero answer-box paragraph
  out = out.replace(
    /(<div class="answer-box"[^>]*>[\s\S]*?<p>)[^<]+(<\/p>)/,
    (m, b, a) => { n++; return b + esc(d.hero_p) + a; }
  );

  // 2. First H2 in content-body
  out = out.replace(
    /(<div class="content-body reveal">[\s\S]*?<h2>)[^<]+(<\/h2>)/,
    (m, b, a) => { n++; return b + esc(d.h2) + a; }
  );

  // 3. CITY-CONTENT-v2 block
  const newIntro = `\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${esc(d.intro_p)}</p>\n    `;
  const outIntro = out.replace(
    /<!-- CITY-CONTENT-v2 -->[\s\S]*?<!-- END-CITY-CONTENT-v2 -->/,
    `<!-- CITY-CONTENT-v2 -->${newIntro}<!-- END-CITY-CONTENT-v2 -->`
  );
  if (outIntro !== out) { out = outIntro; n++; }

  // 4. FAQ items — multiple patterns to handle different file structures
  const faqItems = d.faq.map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${esc(item.q)}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${esc(item.a)}</p></div>
  </div>
</div>`).join('\n');

  // Pattern: from FAQ_ITEMS comment through the faq-list closing divs
  const outFaq = out.replace(
    /(<!-- FAQ_ITEMS are injected by the page generator -->)([\s\S]*?)(\s*<\/div>\s*\n\s*<\/div>\s*\n<\/section>)/,
    (m, before, _old, after) => { n++; return before + '\n' + faqItems + '\n</div>\n</div>\n</section>'; }
  );
  if (outFaq !== out) out = outFaq;

  return { html: out, changes: n };
}

// -----------------------------------------------------------------------
// Template B injection (neighbourhood pages: ossington, roncesvalles, etc.)
// -----------------------------------------------------------------------
function injectTemplateB(html, d) {
  let out = html;
  let n = 0;

  // 1. Replace hero-capsule content (keep the phone number structure)
  // Original: <div class="hero-capsule">\n    <strong>Need dishwasher repair in X?</strong> TEXT\n  </div>
  const heroCapsuleNew = out.replace(
    /(<div class="hero-capsule">)\s*<strong>[^<]*<\/strong>[^<]*(<\/div>)/,
    (m, open, close) => {
      n++;
      return `${open}\n    <strong>Need dishwasher repair nearby?</strong> ${esc(d.hero_p)} Call <strong>(437) 524-1053</strong>, available Mon–Sat 8am–8pm, Sun 9am–6pm. Same-day service, 90-day warranty, all major brands serviced.\n  ${close}`;
    }
  );
  if (heroCapsuleNew !== out) out = heroCapsuleNew;

  // 2. Replace "About [City]" h2 text
  const h2New = out.replace(
    /(<h2>About )[^<]+(< \/h2>|<\/h2>)/,
    (m, open, close) => { n++; return `<h2>${esc(d.h2)}</h2>`; }
  );
  if (h2New !== out) out = h2New;

  // 3. Replace the first <p> after the About heading (city description paragraph)
  // Find the section that starts after "About" heading and replace first <p>
  const aboutParagraphNew = out.replace(
    /(<h2>[^<]*<\/h2>\s*<p>)([^<]*(?:<[^\/][^>]*>[^<]*<\/[^>]*>[^<]*)*)(<\/p>)/,
    (m, open, _content, close) => { n++; return open + esc(d.intro_p) + close; }
  );
  if (aboutParagraphNew !== out) out = aboutParagraphNew;

  // 4. Replace the city-context unique content if present
  const cityCtxNew = out.replace(
    /(<p class="city-context"><!-- UNIQUE-CITY-CONTENT -->)[\s\S]*?(<!-- END-UNIQUE-CITY-CONTENT --><\/p>)/,
    (m, open, close) => { n++; return open + esc(d.intro_p) + close; }
  );
  if (cityCtxNew !== out) out = cityCtxNew;

  // 5. Replace all FAQ items (template B: faq-q/faq-a pattern)
  const newFaqItems = d.faq.map(item => `    <div class="faq-item">
      <button class="faq-q" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'">
        ${esc(item.q)} <span>+</span>
      </button>
      <div class="faq-a" style="display:none">${esc(item.a)}</div>
    </div>`).join('\n');

  // Replace FAQ section content: from <div style="margin-top:20px"> inside FAQ section
  const faqSectionNew = out.replace(
    /(Frequently Asked Questions[^<]*<\/h2>\s*<div[^>]*margin-top:20px[^>]*>)([\s\S]*?)(<\/div>\s*<\/div><\/section>)/,
    (m, open, _old, close) => { n++; return open + '\n' + newFaqItems + '\n  ' + close; }
  );
  if (faqSectionNew !== out) out = faqSectionNew;

  return { html: out, changes: n };
}

async function processCity(slug, templateType) {
  const filePath = path.join(BASE_DIR, `dishwasher-repair-${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  SKIP: File not found: dishwasher-repair-${slug}.html`);
    return false;
  }

  process.stdout.write(`  ${slug}: generating... `);
  const cityData = await generateSingleCity(slug);
  if (!cityData) {
    console.log('FAIL (content generation failed)');
    return false;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const result = templateType === 'B' ? injectTemplateB(original, cityData) : injectTemplateA(original, cityData);

  if (result.html === original || result.changes === 0) {
    console.log(`WARN: 0 sections changed`);
    // Debug: show which patterns were tried
    const hasAnswerBox = original.includes('class="answer-box"');
    const hasContentBody = original.includes('class="content-body reveal"');
    const hasCityContent = original.includes('<!-- CITY-CONTENT-v2 -->');
    const hasHeroCapsule = original.includes('class="hero-capsule"');
    const hasFaqQ = original.includes('class="faq-q"');
    console.log(`    Template markers: answer-box=${hasAnswerBox}, content-body=${hasContentBody}, city-content=${hasCityContent}, hero-capsule=${hasHeroCapsule}, faq-q=${hasFaqQ}`);
    return false;
  }

  fs.writeFileSync(filePath, result.html, 'utf8');
  console.log(`OK (${result.changes} sections)`);
  return true;
}

async function main() {
  const success = [];
  const failed = [];

  console.log('\n=== Template B (neighbourhood pages) ===');
  for (const slug of TEMPLATE_B_CITIES) {
    const ok = await processCity(slug, 'B');
    (ok ? success : failed).push(slug);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n=== Template A (retry individually) ===');
  for (const slug of RETRY_CITIES) {
    const ok = await processCity(slug, 'A');
    (ok ? success : failed).push(slug);
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n========== RESULTS ==========');
  console.log(`SUCCESS: ${success.length} | FAILED: ${failed.length}`);
  if (success.length) console.log('OK:', success.join(', '));
  if (failed.length) console.log('FAIL:', failed.join(', '));
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
