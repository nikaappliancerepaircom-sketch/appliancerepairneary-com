#!/usr/bin/env node
/**
 * add-faqpage-schema.js
 * Adds FAQPage JSON-LD schema to eligible HTML files by extracting visible FAQ content.
 */

const fs = require('fs');
const path = require('path');

const SKIP_FILES = new Set(['index.html', 'about.html', '404.html']);
const MIN_QA_PAIRS = 2;

function getAllHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .trim();
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '').trim();
}

function extractDetailsQAs(content) {
  const pairs = [];
  const detailsRe = /<details[^>]*class="faq-item"[^>]*>([\s\S]*?)<\/details>/gi;
  let detailsMatch;
  while ((detailsMatch = detailsRe.exec(content)) !== null) {
    const block = detailsMatch[1];
    const qTextMatch = block.match(/<span[^>]*class="faq-q-text"[^>]*>([\s\S]*?)<\/span>/i);
    if (!qTextMatch) continue;
    const question = decodeHtmlEntities(stripTags(qTextMatch[1]));
    const answerMatch = block.match(/<div[^>]*class="faq-answer"[^>]*>([\s\S]*?)<\/div>/i);
    if (!answerMatch) continue;
    const answer = decodeHtmlEntities(stripTags(answerMatch[1]));
    if (question && answer) {
      pairs.push({ question, answer });
    }
  }
  return pairs;
}

function extractH3QAs(content) {
  const pairs = [];
  const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  let h3Match;
  while ((h3Match = h3Re.exec(content)) !== null) {
    const questionRaw = decodeHtmlEntities(stripTags(h3Match[1]));
    if (!questionRaw.includes('?')) continue;
    const afterH3 = content.slice(h3Match.index + h3Match[0].length);
    const pMatch = afterH3.match(/^[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!pMatch) continue;
    const answer = decodeHtmlEntities(stripTags(pMatch[1]));
    if (questionRaw && answer) {
      pairs.push({ question: questionRaw, answer });
    }
  }
  return pairs;
}

function extractQAs(content) {
  let pairs = extractDetailsQAs(content);
  if (pairs.length >= MIN_QA_PAIRS) return pairs;
  const h3Pairs = extractH3QAs(content);
  const seen = new Set(pairs.map(function(p) { return p.question; }));
  for (const p of h3Pairs) {
    if (!seen.has(p.question)) {
      pairs.push(p);
      seen.add(p.question);
    }
  }
  return pairs;
}

function buildFAQSchema(pairs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pairs.map(function(pair) {
      return {
        "@type": "Question",
        "name": pair.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": pair.answer
        }
      };
    })
  };
  return '<script type="application/ld+json">\n' + JSON.stringify(schema, null, 2) + '\n</script>';
}

function main() {
  const dir = __dirname;
  const allFiles = getAllHtmlFiles(dir);

  let added = 0;
  let skipped = 0;
  let noQAs = 0;

  for (const filePath of allFiles) {
    const filename = path.basename(filePath);
    if (SKIP_FILES.has(filename)) {
      skipped++;
      continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('FAQPage')) {
      skipped++;
      continue;
    }
    const pairs = extractQAs(content);
    if (pairs.length < MIN_QA_PAIRS) {
      noQAs++;
      console.log('  - No FAQ (' + pairs.length + ' pairs) -> ' + filename);
      continue;
    }
    if (!content.includes('</head>')) {
      console.warn('  WARN: No </head> in ' + filename + ', skipping');
      skipped++;
      continue;
    }
    const schemaBlock = buildFAQSchema(pairs);
    content = content.replace('</head>', schemaBlock + '\n</head>');
    fs.writeFileSync(filePath, content, 'utf8');
    added++;
    console.log('  + FAQPage (' + pairs.length + ' Q&As) -> ' + filename);
  }

  console.log('\nDone. FAQPage added: ' + added + ' | No FAQ content: ' + noQAs + ' | Skipped: ' + skipped);
}

main();
