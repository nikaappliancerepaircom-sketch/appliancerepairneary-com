#!/usr/bin/env node
/**
 * BMAD Audit — appliancerepairneary.com
 * Checks all HTML pages against BMAD 292-parameter method (automatable subset)
 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const PHONE = '437';  // partial phone match

// Strip HTML tags and get text content
function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Count words in text
function wordCount(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function auditPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  const filename = path.basename(file);
  const issues = [];
  const warnings = [];
  const passes = [];
  let score = 0;
  let total = 0;

  function check(label, pass, isCritical = false) {
    total++;
    if (pass) {
      score++;
      passes.push(label);
    } else {
      (isCritical ? issues : warnings).push(label);
    }
  }

  // --- 1. TITLE TAG ---
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  check('Title exists', title.length > 0, true);
  check('Title length 50-60 chars', title.length >= 50 && title.length <= 65);
  if (title.length > 0 && (title.length < 45 || title.length > 70)) {
    warnings.push(`Title length: ${title.length} chars`);
  }

  // --- 2. META DESCRIPTION ---
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
    || html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  check('Meta description exists', desc.length > 0, true);
  check('Meta description 130-165 chars', desc.length >= 130 && desc.length <= 165);

  // --- 3. H1 ---
  const h1matches = html.match(/<h1[\s>]/gi) || [];
  check('Exactly 1 H1', h1matches.length === 1, true);
  if (h1matches.length !== 1) issues.push(`H1 count: ${h1matches.length}`);

  // --- 4. H2 ---
  const h2matches = html.match(/<h2[\s>]/gi) || [];
  check('H2 count 4-15', h2matches.length >= 4 && h2matches.length <= 15);

  // --- 5. CANONICAL ---
  const hasCanonical = /<link\s+rel="canonical"/i.test(html);
  check('Canonical tag', hasCanonical, true);

  // --- 6. VIEWPORT ---
  const hasViewport = /<meta\s+name="viewport"/i.test(html);
  check('Viewport meta', hasViewport, true);

  // --- 7. LANG ATTRIBUTE ---
  const hasLang = /html\s+lang="/i.test(html);
  check('HTML lang attribute', hasLang);

  // --- 8. SCHEMA - LocalBusiness ---
  const hasLocalBusiness = /"@type"\s*:\s*"LocalBusiness"/.test(html);
  check('LocalBusiness schema', hasLocalBusiness, true);

  // --- 9. SCHEMA - FAQPage ---
  const hasFAQ = /"@type"\s*:\s*"FAQPage"/.test(html);
  check('FAQPage schema', hasFAQ);

  // --- 10. SCHEMA - Service ---
  const hasService = /"@type"\s*:\s*"Service"/.test(html);
  check('Service schema', hasService);

  // --- 11. OG TAGS ---
  const hasOgTitle = /og:title/i.test(html);
  const hasOgDesc = /og:description/i.test(html);
  const hasOgUrl = /og:url/i.test(html);
  check('OG title', hasOgTitle);
  check('OG description', hasOgDesc);
  check('OG url', hasOgUrl);

  // --- 12. PHONE MENTIONS ---
  const phoneCount = (html.match(/437|524-1053|\(437\)/g) || []).length;
  check('Phone 5+ mentions', phoneCount >= 5, true);
  check('Phone 8+ mentions', phoneCount >= 8);
  if (phoneCount < 5) issues.push(`Phone mentions: ${phoneCount}`);

  // --- 13. TEL: LINK ---
  const hasTelLink = /href="tel:/i.test(html);
  check('Tel: link (click-to-call)', hasTelLink, true);

  // --- 14. WORD COUNT ---
  const bodyText = stripHtml(html);
  const words = wordCount(bodyText);
  check('Word count 400+', words >= 400, true);
  check('Word count 700+', words >= 700);
  check('Word count 1200+', words >= 1200);

  // --- 15. INTERNAL LINKS ---
  const internalLinks = (html.match(/href="\/[^"]*"/g) || []).length;
  check('Internal links 8+', internalLinks >= 8);
  check('Internal links 15+', internalLinks >= 15);

  // --- 16. IMAGES ---
  const imgCount = (html.match(/<img\s/gi) || []).length;
  check('Images 3+', imgCount >= 3);

  // --- 17. ALT TEXT (no empty alts) ---
  const emptyAlts = (html.match(/alt=""/g) || []).length;
  check('No empty alt tags', emptyAlts === 0);

  // --- 18. LAZY LOADING ---
  const lazyCount = (html.match(/loading="lazy"/g) || []).length;
  check('Lazy loading used', lazyCount > 0);

  // --- 19. PRECONNECT ---
  const hasPreconnect = /rel="preconnect"/i.test(html);
  check('Preconnect hints', hasPreconnect);

  // --- 20. NO HTTP:// (insecure refs) ---
  // Exclude schema context references
  const httpRefs = (html.match(/href="http:\/\//g) || []).length
    + (html.match(/src="http:\/\//g) || []).length;
  check('No insecure http:// refs', httpRefs === 0);

  // --- 21. CTA PRESENCE ---
  const ctaCount = (html.match(/href="tel:|book|contact|quote|schedule/gi) || []).length;
  check('CTA elements 3+', ctaCount >= 3);

  // --- 22. BOOKING IFRAME OR FORM ---
  const hasBooking = /fixlify|iframe.*workiz|<form/i.test(html);
  check('Booking form/iframe', hasBooking);

  // --- 23. ANSWER CAPSULE (phone in first ~300 chars of body text) ---
  // Look for phone number in the first visible paragraph
  const firstParaMatch = html.match(/<p[^>]*>([\s\S]{0,400}?)<\/p>/i);
  const firstParaText = firstParaMatch ? firstParaMatch[1] : '';
  const hasAnswerCapsule = /437|524-1053/.test(firstParaText);
  check('Answer capsule (phone in 1st para)', hasAnswerCapsule);

  // --- 24. FAQ VISIBLE (not just schema) ---
  const hasFaqVisible = /faq|frequently asked|question/i.test(
    html.replace(/<script[\s\S]*?<\/script>/gi, '')
  );
  check('FAQ visible on page', hasFaqVisible);

  // --- 25. ROBOTS META ---
  const hasRobotsMeta = /name="robots"\s+content="index/i.test(html)
    || /content="index.*follow"/i.test(html);
  check('Robots meta index,follow', hasRobotsMeta);

  // --- 26. AGGREGATE RATING IN SCHEMA ---
  const hasRating = /"aggregateRating"/.test(html);
  check('AggregateRating in schema', hasRating);

  // --- 27. PRICE RANGE / PRICING INFO ---
  const hasPricing = /\$\d+|\bprice|\bprice-range|\bdiagnostic/i.test(
    html.replace(/<script[\s\S]*?<\/script>/gi, '')
  );
  check('Pricing info present', hasPricing);

  // --- 28. WARRANTY MENTION ---
  const hasWarranty = /warranty|90.day|guarantee/i.test(html);
  check('Warranty mentioned', hasWarranty);

  // --- 29. SAME-DAY / EMERGENCY URGENCY ---
  const hasUrgency = /same.day|emergency|24\/7/i.test(html);
  check('Same-day/urgency signal', hasUrgency);

  return {
    file: filename,
    score,
    total,
    pct: Math.round(score / total * 100),
    issues,     // critical fails
    warnings,   // non-critical fails
    wordCount: words,
    phoneCount,
    titleLen: title.length,
    descLen: desc.length,
    h1: h1matches.length,
    h2: h2matches.length,
  };
}

// --- RUN AUDIT ---
const htmlFiles = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

console.log(`\n🔍 BMAD Audit — appliancerepairneary.com`);
console.log(`📄 Total pages: ${htmlFiles.length}\n`);

const results = [];
for (const file of htmlFiles) {
  const result = auditPage(path.join(DIR, file));
  results.push(result);
}

// --- STATS ---
const avgScore = Math.round(results.reduce((s, r) => s + r.pct, 0) / results.length);
const passed = results.filter(r => r.pct >= 85).length;
const failed = results.filter(r => r.pct < 85).length;
const critical = results.filter(r => r.issues.length > 0);

// --- ISSUE SUMMARY ---
const issueMap = {};
for (const r of results) {
  for (const issue of r.issues) {
    const key = issue.split(':')[0];
    issueMap[key] = (issueMap[key] || 0) + 1;
  }
}
const warnMap = {};
for (const r of results) {
  for (const w of r.warnings) {
    const key = w.split(':')[0];
    warnMap[key] = (warnMap[key] || 0) + 1;
  }
}

// --- LOW WORD COUNT PAGES ---
const lowWords = results.filter(r => r.wordCount < 700).sort((a,b) => a.wordCount - b.wordCount);
const veryLowWords = results.filter(r => r.wordCount < 400);

// --- PRINT CONSOLE SUMMARY ---
console.log(`📊 OVERALL RESULTS`);
console.log(`==================`);
console.log(`Average BMAD Score: ${avgScore}%`);
console.log(`Pages ≥85%: ${passed}/${htmlFiles.length}`);
console.log(`Pages <85%: ${failed}/${htmlFiles.length}`);
console.log(`Pages with critical issues: ${critical.length}`);
console.log('');

console.log(`🚨 CRITICAL ISSUES (by frequency):`);
const sortedIssues = Object.entries(issueMap).sort((a,b) => b[1]-a[1]);
for (const [issue, count] of sortedIssues) {
  console.log(`  ${count}x pages — ${issue}`);
}
console.log('');

console.log(`⚠️  WARNINGS (by frequency):`);
const sortedWarns = Object.entries(warnMap).sort((a,b) => b[1]-a[1]);
for (const [warn, count] of sortedWarns.slice(0, 15)) {
  console.log(`  ${count}x pages — ${warn}`);
}
console.log('');

if (veryLowWords.length > 0) {
  console.log(`🔴 VERY LOW WORD COUNT (<400 words) — ${veryLowWords.length} pages:`);
  for (const r of veryLowWords.slice(0, 20)) {
    console.log(`  ${r.wordCount}w — ${r.file}`);
  }
  console.log('');
}

if (lowWords.length > 0) {
  console.log(`🟡 LOW WORD COUNT (<700 words) — ${lowWords.length} pages:`);
  for (const r of lowWords.slice(0, 20)) {
    console.log(`  ${r.wordCount}w — ${r.file}`);
  }
  console.log('');
}

// Show worst scoring pages
const worstPages = results.filter(r => r.pct < 75).sort((a,b) => a.pct - b.pct);
if (worstPages.length > 0) {
  console.log(`❌ WORST PAGES (<75% score) — ${worstPages.length} pages:`);
  for (const r of worstPages.slice(0, 20)) {
    console.log(`  ${r.pct}% (${r.score}/${r.total}) — ${r.file}`);
    if (r.issues.length > 0) {
      console.log(`         Issues: ${r.issues.slice(0,3).join(', ')}`);
    }
  }
  console.log('');
}

// --- WRITE JSON REPORT ---
const report = {
  generated: new Date().toISOString(),
  site: 'appliancerepairneary.com',
  totalPages: htmlFiles.length,
  avgScore,
  passed,
  failed,
  issueFrequency: issueMap,
  warningFrequency: warnMap,
  lowWordCountPages: lowWords.map(r => ({ file: r.file, words: r.wordCount })),
  worstPages: worstPages.map(r => ({
    file: r.file, score: r.pct, issues: r.issues, warnings: r.warnings
  })),
  allResults: results.map(r => ({
    file: r.file,
    score: r.pct,
    words: r.wordCount,
    issues: r.issues,
    warnings: r.warnings.length
  }))
};

fs.writeFileSync(path.join(DIR, 'bmad-report.json'), JSON.stringify(report, null, 2));
console.log(`\n✅ Full report saved: bmad-report.json`);
console.log(`\n${'='.repeat(50)}`);
console.log(`BMAD VERDICT: ${avgScore >= 85 ? '✅ PASS' : '❌ NEEDS WORK'} — ${avgScore}% average`);
console.log(`${'='.repeat(50)}\n`);
