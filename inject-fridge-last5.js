#!/usr/bin/env node
'use strict';

// Fix last 5 failed cities: little-italy, little-portugal, markham, midtown, mississauga
// Process 2 at a time to avoid JSON truncation issues

const fs   = require('fs');
const path = require('path');

const SITE_DIR   = 'C:/appliancerepairneary';
const GEMINI_KEY = 'AIzaSyC7seu4cNdPy1w_Q0B8BQqHTXd4Hnxao1E';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
const PHONE      = '(437) 524-1053';

// Process individually to avoid any JSON size issues
const TARGETS = ['little-italy','little-portugal','markham','midtown','mississauga'];

function slugToCity(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function callGemini(prompt) {
  const resp = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 4096 }
    })
  });
  if (!resp.ok) throw new Error(`API error ${resp.status}: ${(await resp.text()).slice(0,200)}`);
  const j = await resp.json();
  return j.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractJSON(raw) {
  let s = raw.trim();
  s = s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  s = s.replace(/\s*```\s*$/, '');
  s = s.trim();
  return JSON.parse(s);
}

function buildSinglePrompt(slug, city, province) {
  const isAlberta = province === 'Alberta';
  const climateNote = isAlberta
    ? 'Alberta dry chinook climate, prairie winters, Bow/North Saskatchewan River hard water, newer suburban developments'
    : 'Lake Ontario humidity, Ontario winters, hard water, mix of older homes and condos';

  return `Write unique refrigerator repair page content for ${city}, ${province}, Canada. Return ONLY valid JSON — no markdown, no backticks, no code fences. Start with { and end with }.

Context: ${climateNote}

Requirements:
- hero_p: 20-30 words, unique angle, do NOT start with "${city}"
- h2: 8-12 words, include "${city}" and fridge/refrigerator
- intro_p: 150-200 words. Mention 2-3 real local neighborhoods in ${city}. Discuss climate impact on fridges, housing age/type, common brands (Samsung/LG/Whirlpool/GE/Frigidaire), typical failure modes.
- faq: 4 items. Mention "${city}" in at least 2 questions. Each answer 2-3 sentences. Cover: cost ($65 diagnostic, $120-$350 range), response time, brands, 90-day warranty.

JSON (start immediately with {):
{"${slug}": {"hero_p": "...", "h2": "...", "intro_p": "...", "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]}}`;
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function patchNewTemplate(html, data) {
  let out = html;
  const v2Start = '<!-- CITY-CONTENT-v2 -->';
  const v2End   = '<!-- END-CITY-CONTENT-v2 -->';
  const s = out.indexOf(v2Start);
  const e = out.indexOf(v2End);
  if (s !== -1 && e !== -1) {
    const repl = `${v2Start}\n    <p style="margin:0 0 14px;color:#374151;line-height:1.7;font-size:0.9375rem;">${escHtml(data.intro_p)}</p>\n    ${v2End}`;
    out = out.slice(0, s) + repl + out.slice(e + v2End.length);
  }
  out = out.replace(
    /(<div class="content-body reveal">\s*)(<h2>)[^<]*(<\/h2>)/,
    (_, pre, open, close) => `${pre}${open}${escHtml(data.h2)}${close}`
  );
  const faqItemRe = /(<div class="faq-item">[\s\S]*?<span class="faq-question-text">)([\s\S]*?)(<\/span>[\s\S]*?<div class="faq-answer-inner"><p>)([\s\S]*?)(<\/p><\/div>[\s\S]*?<\/div>)/g;
  let faqIdx = 0;
  out = out.replace(faqItemRe, (match, pre, _oldQ, mid, _oldA, post) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${pre}${escHtml(f.q)}${mid}${escHtml(f.a)}${post}`;
  });
  return out;
}

function patchOldToroTemplate(html, data) {
  let out = html;
  const ucStart = '<!-- UNIQUE-CITY-CONTENT -->';
  const ucEnd   = '<!-- END-UNIQUE-CITY-CONTENT -->';
  const us = out.indexOf(ucStart);
  const ue = out.indexOf(ucEnd);
  if (us !== -1 && ue !== -1) {
    out = out.slice(0, us) + ucStart + escHtml(data.intro_p) + ucEnd + out.slice(ue + ucEnd.length);
  }
  out = out.replace(/(<h2>About [^<]+<\/h2>)/, `<h2>${escHtml(data.h2)}</h2>`);
  const faqRe = /(<button class="faq-q"[^>]*>)([\s\S]*?)(<span>[+\-]<\/span>\s*<\/button>\s*<div class="faq-a"[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>)/g;
  let faqIdx = 0;
  out = out.replace(faqRe, (match, btnOpen, _oldQ, btnClose, _oldA, endDiv) => {
    if (faqIdx >= data.faq.length) return match;
    const f = data.faq[faqIdx++];
    return `${btnOpen}\n        ${escHtml(f.q)} <span>+</span>\n      </button>\n      <div class="faq-a" style="display:none">${escHtml(f.a)}${endDiv}`;
  });
  return out;
}

function patchFile(html, data) {
  const hasV2   = html.includes('<!-- CITY-CONTENT-v2 -->');
  const hasFaqQ = html.includes('faq-question-text');
  const hasOldQ = html.includes('faq-q-text');
  if (hasV2 && hasFaqQ) return patchNewTemplate(html, data);
  if (hasOldQ) return html; // Alberta - skip for now, handle separately
  return patchOldToroTemplate(html, data);
}

async function main() {
  let success = 0;
  let errors = [];

  for (const slug of TARGETS) {
    const city     = slugToCity(slug);
    const province = 'Ontario'; // all 5 are Ontario
    const file     = path.join(SITE_DIR, `fridge-repair-${slug}.html`);

    if (!fs.existsSync(file)) {
      console.log(`SKIP ${slug}: file not found`);
      continue;
    }

    console.log(`\nProcessing ${city}...`);
    let data = null;
    let attempts = 0;

    while (attempts < 4) {
      attempts++;
      try {
        const raw    = await callGemini(buildSinglePrompt(slug, city, province));
        const parsed = extractJSON(raw);
        data = parsed[slug] || parsed[city] || Object.values(parsed)[0];
        if (!data?.h2 || !data?.intro_p || !Array.isArray(data?.faq)) {
          throw new Error('Incomplete data');
        }
        console.log(`  API OK (attempt ${attempts})`);
        break;
      } catch (err) {
        console.error(`  Attempt ${attempts} failed: ${err.message.slice(0, 100)}`);
        if (attempts < 4) await sleep(5000);
      }
    }

    if (!data) {
      console.error(`  FAILED all attempts for ${slug}`);
      errors.push(slug);
      continue;
    }

    try {
      const original = fs.readFileSync(file, 'utf8');
      const patched  = patchFile(original, data);
      if (patched === original) {
        console.warn(`  WARN ${slug}: no changes made`);
        errors.push(`${slug}: no pattern match`);
        continue;
      }
      fs.writeFileSync(file, patched, 'utf8');
      console.log(`  OK  ${slug}`);
      success++;
    } catch (err) {
      console.error(`  ERROR ${slug}: ${err.message}`);
      errors.push(slug);
    }

    await sleep(2000);
  }

  console.log(`\nDONE. Success: ${success}/${TARGETS.length}`);
  if (errors.length) console.log('Failed:', errors.join(', '));
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
