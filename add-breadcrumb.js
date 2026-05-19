#!/usr/bin/env node
/**
 * add-breadcrumb.js
 * Adds BreadcrumbList JSON-LD schema to all eligible HTML files.
 * Skips: index.html, about.html, 404.html, files already containing "BreadcrumbList"
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://appliancerepairneary.com';
const SKIP_FILES = new Set(['index.html', 'about.html', '404.html']);

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

function extractTitle(content) {
  const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : '';
}

function buildBreadcrumb(slug, title) {
  const pageUrl = `${DOMAIN}/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${DOMAIN}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title,
        "item": pageUrl
      }
    ]
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function main() {
  const dir = __dirname;
  const allFiles = getAllHtmlFiles(dir);

  let added = 0;
  let skipped = 0;

  for (const filePath of allFiles) {
    const filename = path.basename(filePath);

    // Skip designated files
    if (SKIP_FILES.has(filename)) {
      skipped++;
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has BreadcrumbList
    if (content.includes('BreadcrumbList')) {
      skipped++;
      continue;
    }

    // Derive slug from filename (strip .html extension)
    const slug = filename.replace(/\.html$/, '');

    // Extract title
    const title = extractTitle(content) || slug;

    // Build schema block
    const schemaBlock = buildBreadcrumb(slug, title);

    // Inject just before </head>
    if (!content.includes('</head>')) {
      console.warn(`  WARN: No </head> found in ${filename}, skipping`);
      skipped++;
      continue;
    }

    content = content.replace('</head>', `${schemaBlock}\n</head>`);
    fs.writeFileSync(filePath, content, 'utf8');
    added++;
    console.log(`  + BreadcrumbList → ${filename}`);
  }

  console.log(`\nDone. BreadcrumbList added: ${added} | Skipped: ${skipped}`);
}

main();
