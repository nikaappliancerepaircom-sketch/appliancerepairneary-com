/**
 * inject-dishwasher-last2.js
 * Final fix for trinity-bellwoods and wychwood.
 * Both have Template B (hero-capsule, About h2, faq-q/faq-a, city-context block).
 */

const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const BASE_DIR = 'C:/appliancerepairneary';

const CITIES = ['trinity-bellwoods', 'wychwood'];

async function callGemini(prompt) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
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
      if (!resp.ok) throw new Error(`Gemini ${resp.status}: ${await resp.text()}`);
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No text in response');
      const json = JSON.parse(
        text.trim().replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'').trim()
      );
      if (!json.hero_p || !json.h2 || !json.intro_p || !Array.isArray(json.faq) || json.faq.length < 4) {
        throw new Error(`Missing fields or faq len=${json.faq?.length}`);
      }
      return json;
    } catch (e) {
      console.error(`  Attempt ${attempt}/4: ${e.message.substring(0,120)}`);
      if (attempt < 4) await new Promise(r => setTimeout(r, 5000));
    }
  }
  return null;
}

function esc(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function injectB(html, d) {
  let out = html;
  let n = 0;

  // 1. Replace hero-capsule entire content
  // Pattern: <div class="hero-capsule">\n    <strong>...</strong> ...text...\n  </div>
  out = out.replace(
    /(<div class="hero-capsule">)[\s\S]*?(<\/div>)/,
    (m, open, close) => {
      n++;
      return `${open}\n    <strong>Expert dishwasher repair near you.</strong> ${esc(d.hero_p)} Call <strong>(437) 524-1053</strong>, available Mon–Sat 8am–8pm, Sun 9am–6pm. Same-day service, 90-day warranty, all major brands serviced.\n  ${close}`;
    }
  );

  // 2. Replace "About X" h2 text — greedy match the full h2 tag text
  out = out.replace(/<h2>About [^<]+<\/h2>/, `<h2>${esc(d.h2)}</h2>`);
  if (out !== html) n++;

  // 3. Replace city-context unique content block
  const ctxNew = out.replace(
    /(<p class="city-context"><!-- UNIQUE-CITY-CONTENT -->)[\s\S]*?(<!-- END-UNIQUE-CITY-CONTENT --><\/p>)/,
    (m, open, close) => { n++; return open + esc(d.intro_p) + close; }
  );
  if (ctxNew !== out) out = ctxNew;

  // 4. Replace all faq-items inside the FAQ section
  const faqBlock = d.faq.map(item => `    <div class="faq-item">
      <button class="faq-q" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'">
        ${esc(item.q)} <span>+</span>
      </button>
      <div class="faq-a" style="display:none">${esc(item.a)}</div>
    </div>`).join('\n');

  // Find FAQ section by its h2 pattern and replace the div containing all faq-items
  const faqNew = out.replace(
    /(Frequently Asked Questions[^<]*<\/h2>\s*<div[^>]*>)([\s\S]*?)(<\/div>\s*<\/div><\/section>)/,
    (m, before, _old, after) => { n++; return before + '\n' + faqBlock + '\n  ' + after; }
  );
  if (faqNew !== out) out = faqNew;

  return { html: out, changes: n };
}

async function main() {
  for (const slug of CITIES) {
    const displayName = slug.split('-').map(w => w[0].toUpperCase()+w.slice(1)).join(' ');
    const filePath = path.join(BASE_DIR, `dishwasher-repair-${slug}.html`);

    console.log(`\nProcessing ${slug} (${displayName})...`);

    const prompt = `Generate unique dishwasher repair page content for "${displayName}", Toronto, Ontario Canada (inner-city neighbourhood).
For "Appliance Repair Neary" phone (437) 524-1053.
Water: Toronto municipal water from Lake Ontario — moderate hardness, calcium deposits accumulate in dishwashers over 3-5 years.
Housing: Victorian and Edwardian semi-detached homes (1880s-1920s), renovated with modern kitchens. Often have European-brand dishwashers (Bosch, Miele).

Return ONLY compact valid JSON with these exact 4 keys:
{
  "hero_p": "One sentence, 20-30 words. Unique hook about ${displayName} dishwasher challenges. Do NOT start with the neighbourhood name.",
  "h2": "8-12 word heading mentioning ${displayName} and dishwasher repair service.",
  "intro_p": "160-180 word paragraph about dishwasher repair in ${displayName}. Include: 2-3 specific streets or sub-areas within ${displayName}, Toronto water quality (Lake Ontario, moderate hardness), Victorian/Edwardian housing era, common brands (Bosch, Miele, LG in renovated homes), and the #1 failure cause (calcium scale on heating elements common in older homes with original pipes).",
  "faq": [
    {"q": "Question mentioning ${displayName} about water/mineral scale", "a": "2-3 sentence answer"},
    {"q": "Question mentioning ${displayName} about dishwasher repair cost", "a": "2-3 sentence answer"},
    {"q": "Question mentioning ${displayName} about same-day availability", "a": "2-3 sentence answer"},
    {"q": "Question mentioning ${displayName} about Victorian homes or European brands", "a": "2-3 sentence answer"}
  ]
}

No markdown. No code fences. Pure JSON.`;

    const cityData = await callGemini(prompt);
    if (!cityData) {
      console.error(`FAIL: Could not generate content for ${slug}`);
      continue;
    }

    const original = fs.readFileSync(filePath, 'utf8');
    const { html, changes } = injectB(original, cityData);

    if (changes === 0 || html === original) {
      console.error(`FAIL: 0 changes applied to ${slug}. Debug:`);
      console.log('  has hero-capsule:', original.includes('hero-capsule'));
      console.log('  has About h2:', /About [A-Z]/.test(original));
      console.log('  has city-context:', original.includes('city-context'));
      console.log('  has Frequently Asked:', original.includes('Frequently Asked'));
    } else {
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`OK: ${slug} — ${changes} sections replaced`);
    }
  }
  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
