#!/usr/bin/env node
/**
 * BMAD Audit v2026 — appliancerepairneary.com (ALL folders)
 * Updated for 2026 reality:
 * - Word count: 500-1200w target (NOT 2500+, no correlation per Surfer SEO study)
 * - Keyword density: checked as spam risk (>2% = bad), NOT as target metric
 * - Focus: topical completeness, E-E-A-T, answer capsule, local uniqueness
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const FOLDERS = [
  { dir: ROOT, label: 'root', isBlog: false },
  { dir: path.join(ROOT, '_pages_queue'), label: '_pages_queue', isBlog: false },
  { dir: path.join(ROOT, 'blog'), label: 'blog', isBlog: true },
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

// Check keyword density (spam risk check, not target)
function keywordDensity(text, keyword) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const count = words.filter(w => w.includes(keyword.toLowerCase())).length;
  return { count, pct: (count / words.length * 100).toFixed(2) };
}

function auditPage(file, isBlog) {
  const html = fs.readFileSync(file, 'utf8');
  const filename = path.basename(file);
  const issues = [];    // critical fails
  const warnings = []; // non-critical
  let score = 0;
  let total = 0;

  function check(label, pass, critical = false) {
    total++;
    if (pass) { score++; }
    else { (critical ? issues : warnings).push(label); }
  }

  // Extract body text once
  const bodyText = stripHtml(html).toLowerCase();
  const words = wordCount(bodyText);

  // --- TECHNICAL SEO (CRITICAL) ---
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  check('Title exists', title.length > 0, true);
  check('Title 45-65 chars', title.length >= 45 && title.length <= 65);

  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
    || html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  check('Meta desc exists', desc.length > 0, true);
  check('Meta desc 130-165 chars', desc.length >= 130 && desc.length <= 165);

  const h1count = (html.match(/<h1[\s>]/gi) || []).length;
  check('Exactly 1 H1', h1count === 1, true);

  const h2count = (html.match(/<h2[\s>]/gi) || []).length;
  check('H2 count 3+', h2count >= 3);

  check('Canonical tag', /<link\s+rel="canonical"/i.test(html), true);
  check('Viewport meta', /<meta\s+name="viewport"/i.test(html), true);
  check('HTML lang attr', /html\s+lang="/i.test(html));
  check('Robots meta index', /name="robots"\s+content="index/i.test(html) || /content="index.*follow"/i.test(html));
  check('No insecure http://', (html.match(/href="http:\/\//g) || []).length === 0);
  check('Preconnect hints', /rel="preconnect"/i.test(html));

  // --- SCHEMA ---
  check('LocalBusiness schema', /"@type"\s*:\s*"LocalBusiness"/.test(html), true);
  check('FAQPage schema', /"@type"\s*:\s*"FAQPage"/.test(html));
  check('Service schema', /"@type"\s*:\s*"Service"/.test(html));
  check('AggregateRating schema', /"aggregateRating"/.test(html));
  check('OG tags', /og:title/i.test(html) && /og:description/i.test(html));

  // --- LOCAL SEO (CRITICAL for service pages) ---
  const phoneCount = (html.match(/437|524-1053|\(437\)/g) || []).length;
  if (!isBlog) {
    check('Phone 4+ mentions', phoneCount >= 4, true);
    check('Phone 8+ mentions', phoneCount >= 8);
    check('Tel: link (click-to-call)', /href="tel:/i.test(html), true);
  } else {
    check('Phone present', phoneCount >= 1);
  }

  // --- WORD COUNT 2026 ---
  // Service pages: 500-1400w optimal. Blog: 900-1500w.
  // FAIL only below 400. WARN below 600 (service) or 900 (blog).
  check('Word count 400+ (minimum)', words >= 400, true);
  if (isBlog) {
    check('Blog word count 900+', words >= 900);
    check('Blog word count 1200+', words >= 1200);
  } else {
    check('Service page 600+', words >= 600);
    check('Service page 1000+', words >= 1000);
  }
  // Warn if over 1600 (dilution risk for service pages)
  if (!isBlog && words > 1600) {
    warnings.push(`Over 1600w (${words}w) — check for filler`);
  }

  // --- KEYWORD DENSITY — spam check (NOT a target) ---
  // Extract service keyword from filename
  const base = filename.replace('.html', '');
  const servicePart = base.split('-repair-')[0] || base.split('-')[0];
  if (servicePart && servicePart.length > 2) {
    const kd = keywordDensity(bodyText, servicePart);
    if (parseFloat(kd.pct) > 2.0) {
      warnings.push(`Keyword "${servicePart}" density ${kd.pct}% — above 2% spam risk`);
    }
    check('Keyword density <2% (spam check)', parseFloat(kd.pct) <= 2.0);
  } else {
    total++; score++; // skip for non-service pages
  }

  // --- TOPICAL COMPLETENESS 2026 ---
  const bodyNoScript = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ');

  // Answer capsule: phone in first paragraph
  const firstPara = (html.match(/<p[^>]*>([\s\S]{0,500}?)<\/p>/i) || [])[1] || '';
  check('Answer capsule (phone in 1st para)', /437|524-1053/.test(firstPara), !isBlog);

  // Pricing info
  check('Pricing visible ($)', /\$\d+/.test(bodyNoScript));

  // Warranty
  check('Warranty/guarantee mentioned', /warranty|90.day|guarantee/i.test(html));

  // Same-day/urgency
  check('Same-day/urgency signal', /same.day|emergency|24\/7/i.test(html));

  // FAQ visible (not just schema)
  check('FAQ visible on page', /faq|frequently asked/i.test(bodyNoScript));

  // Specific brands mentioned
  const brands = ['lg', 'samsung', 'whirlpool', 'bosch', 'frigidaire', 'ge ', 'kenmore', 'miele', 'maytag'];
  const brandCount = brands.filter(b => bodyText.includes(b)).length;
  check('Brand names mentioned (3+)', brandCount >= 3);

  // Specific symptoms/parts (semantic depth)
  const symptoms = ['not draining', 'not heating', 'leaking', 'not spinning', 'not cooling',
    'not starting', 'noisy', 'error code', 'drum', 'gasket', 'pump', 'bearing', 'thermostat', 'compressor'];
  const symptomCount = symptoms.filter(s => bodyText.includes(s)).length;
  check('Specific symptoms/parts (3+)', symptomCount >= 3);

  // --- CONVERSION ---
  check('Booking iframe (fixlify)', /fixlify/i.test(html));
  check('Internal links 8+', (html.match(/href="\/[^"]*"/g) || []).length >= 8);
  check('Lazy loading', /loading="lazy"/i.test(html));
  check('No empty alt tags', (html.match(/alt=""/g) || []).length === 0);

  return {
    file: filename,
    score,
    total,
    pct: Math.round(score / total * 100),
    issues,
    warnings,
    words,
    phoneCount,
    titleLen: title.length,
    descLen: desc.length,
    h1: h1count,
    h2: h2count,
    brandCount,
    symptomCount,
  };
}

// --- RUN ---
const allResults = {};
let grandTotal = 0, grandPassed = 0;

for (const { dir, label, isBlog } of FOLDERS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort();
  const results = files.map(f => auditPage(path.join(dir, f), isBlog));
  allResults[label] = results;
  grandTotal += results.length;
  grandPassed += results.filter(r => r.pct >= 85).length;
}

// --- AGGREGATE STATS ---
const issueMap = {};
const warnMap = {};
for (const results of Object.values(allResults)) {
  for (const r of results) {
    for (const i of r.issues) { const k = i.split(':')[0].split('(')[0].trim(); issueMap[k] = (issueMap[k]||0)+1; }
    for (const w of r.warnings) { const k = w.split(':')[0].split('(')[0].trim(); warnMap[k] = (warnMap[k]||0)+1; }
  }
}

console.log(`\n🔍 BMAD Audit v2026 — appliancerepairneary.com`);
console.log(`${'='.repeat(55)}`);
console.log(`📋 Config: word count target 600-1200w | density: spam check only (<2%)`);
console.log(`📄 Total pages: ${grandTotal} | Pass ≥85%: ${grandPassed}/${grandTotal}\n`);

for (const [label, results] of Object.entries(allResults)) {
  const avg = Math.round(results.reduce((s,r) => s+r.pct, 0) / results.length);
  const pass = results.filter(r => r.pct >= 85).length;
  const avgWords = Math.round(results.reduce((s,r) => s+r.words, 0) / results.length);
  const under600 = results.filter(r => r.words < 600 && r.words >= 400).length;
  const under400 = results.filter(r => r.words < 400).length;
  const noAnswer = results.filter(r => r.issues.includes('Answer capsule (phone in 1st para)')).length;
  const densityWarn = results.filter(r => r.warnings.some(w => w.includes('density'))).length;
  const noBrands = results.filter(r => r.brandCount < 3).length;
  const noSymptoms = results.filter(r => r.symptomCount < 3).length;

  console.log(`📁 [${label.toUpperCase()}] ${results.length} pages | Score avg: ${avg}% | Pass: ${pass}/${results.length} | Avg words: ${avgWords}w`);

  if (under400 > 0) console.log(`   🔴 Under 400w (FAIL): ${under400} pages`);
  if (under600 > 0) console.log(`   🟡 Under 600w (warn): ${under600} pages`);
  if (noAnswer > 0)    console.log(`   ⚠️  No answer capsule: ${noAnswer} pages`);
  if (densityWarn > 0) console.log(`   ⚠️  Keyword density >2% (spam risk): ${densityWarn} pages`);
  if (noBrands > 0)    console.log(`   ⚠️  Less than 3 brands mentioned: ${noBrands} pages`);
  if (noSymptoms > 0)  console.log(`   ⚠️  Less than 3 symptoms/parts: ${noSymptoms} pages`);

  const worst = results.filter(r => r.pct < 75).sort((a,b) => a.pct - b.pct);
  if (worst.length > 0) {
    console.log(`   ❌ Pages <75% (${worst.length} total):`);
    for (const r of worst.slice(0, 8)) {
      console.log(`      ${r.pct}% [${r.words}w] — ${r.file}`);
      if (r.issues.length > 0) console.log(`             Issues: ${r.issues.slice(0,3).join(' | ')}`);
    }
  }
  console.log('');
}

console.log(`🚨 CRITICAL ISSUES across all pages:`);
for (const [k,v] of Object.entries(issueMap).sort((a,b)=>b[1]-a[1])) {
  console.log(`   ${v}x — ${k}`);
}
console.log('');
console.log(`⚠️  WARNINGS across all pages (top 15):`);
for (const [k,v] of Object.entries(warnMap).sort((a,b)=>b[1]-a[1]).slice(0,15)) {
  console.log(`   ${v}x — ${k}`);
}

// Save full report
const report = {
  generated: new Date().toISOString(),
  version: 'BMAD-2026',
  site: 'appliancerepairneary.com',
  config: 'word_count_target: 600-1200w | keyword_density: spam_check_only',
  grandTotal,
  grandPassed,
  passRate: Math.round(grandPassed/grandTotal*100) + '%',
  issueFrequency: issueMap,
  warningFrequency: warnMap,
  folders: Object.fromEntries(
    Object.entries(allResults).map(([label, results]) => [label, {
      count: results.length,
      avgScore: Math.round(results.reduce((s,r)=>s+r.pct,0)/results.length),
      passed: results.filter(r=>r.pct>=85).length,
      avgWords: Math.round(results.reduce((s,r)=>s+r.words,0)/results.length),
      worst: results.filter(r=>r.pct<75).map(r=>({file:r.file, score:r.pct, words:r.words, issues:r.issues, warnings:r.warnings}))
    }])
  )
};
fs.writeFileSync(path.join(ROOT, 'bmad-report-2026.json'), JSON.stringify(report, null, 2));
console.log(`\n✅ Report saved: bmad-report-2026.json`);
console.log(`\n${'='.repeat(55)}`);
const verdict = grandPassed/grandTotal >= 0.85;
console.log(`VERDICT: ${verdict ? '✅ PASS' : '❌ NEEDS WORK'} — ${grandPassed}/${grandTotal} pages ≥85% (${Math.round(grandPassed/grandTotal*100)}%)`);
console.log(`${'='.repeat(55)}\n`);
