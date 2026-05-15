#!/usr/bin/env node
/**
 * gen-sitemap-ab.js — Full indexable sitemap for appliancerepairneary.com
 * Scans all HTML files, excludes noindex pages, includes all indexable pages.
 * Also updates sitemap-published.json drip feed to match.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DOMAIN = 'https://appliancerepairneary.com';
const DIR = path.join('C:', 'appliancerepairneary');
const SITEMAP_FILE = path.join(DIR, 'sitemap.xml');
const PUBLISHED_FILE = path.join(DIR, 'sitemap-published.json');

const SKIP_FILES = new Set(['404.html', 'service-template.html', 'ajax.html', 'book.html', 'preview.html', 'sitemap.html']);
const SKIP_DIRS = new Set(['node_modules', '.git', '_queue', 'assets', 'css', 'js', 'images', 'fonts', 'components', 'templates', 'styles', 'backups', 'backup', 'old', 'archive', 'reports', 'tools']);

function walk(dir, prefix = '') {
  const out = [];
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const item of items) {
    if (item.isDirectory()) {
      if (SKIP_DIRS.has(item.name)) continue;
      out.push(...walk(path.join(dir, item.name), prefix + item.name + '/'));
    } else if (item.name.endsWith('.html') && !item.name.includes('.bak')) {
      if (!SKIP_FILES.has(item.name) && !item.name.startsWith('landing-')) {
        out.push(prefix + item.name);
      }
    }
  }
  return out;
}

function hasNoindex(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8').slice(0, 2000);
    return /noindex/.test(content);
  } catch { return false; }
}

function gitMtime(relPath) {
  try {
    const result = execFileSync(
      'git', ['log', '-1', '--format=%ci', '--', path.join(DIR, relPath)],
      { cwd: DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    if (result) return result.slice(0, 10);
  } catch { }
  try {
    return fs.statSync(path.join(DIR, relPath)).mtime.toISOString().slice(0, 10);
  } catch { return new Date().toISOString().slice(0, 10); }
}

function priority(urlPath) {
  if (urlPath === '/') return '1.0';
  if (/\/(calgary|edmonton)\/?$/.test(urlPath)) return '0.95';
  if (/\/(airdrie|cochrane|okotoks|chestermere|strathmore|canmore)\/?$/.test(urlPath)) return '0.9';
  if (/\/(dishwasher|washer|fridge|dryer|oven|stove|range|freezer|microwave)-repair-(calgary|airdrie|cochrane|okotoks|chestermere|strathmore|canmore)/.test(urlPath)) return '0.9';
  if (urlPath.includes('/blog/')) return '0.7';
  return '0.8';
}

const allFiles = walk(DIR);
const indexable = allFiles.filter(f => !hasNoindex(path.join(DIR, f)));

console.log(`Total HTML: ${allFiles.length}, Indexable (no noindex): ${indexable.length}`);

const entries = indexable.map(f => {
  const urlPath = f === 'index.html' ? '/' : '/' + f.replace(/\.html$/, '');
  return {
    url: DOMAIN + urlPath,
    lastmod: gitMtime(f),
    priority: priority(urlPath)
  };
});

// Sort: home first, then by priority desc, then alpha
entries.sort((a, b) => {
  if (a.url === DOMAIN + '/') return -1;
  if (b.url === DOMAIN + '/') return 1;
  const pd = parseFloat(b.priority) - parseFloat(a.priority);
  if (pd !== 0) return pd;
  return a.url.localeCompare(b.url);
});

// Write sitemap.xml
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(SITEMAP_FILE, xml);
console.log(`sitemap.xml: ${entries.length} URLs`);

// Update sitemap-published.json
fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(entries, null, 2));
console.log(`sitemap-published.json: ${entries.length} URLs`);

// Print AB counts
const abUrls = entries.filter(e => /calgary|airdrie|cochrane|okotoks|chestermere|strathmore|canmore/.test(e.url));
console.log(`AB (Calgary) pages in sitemap: ${abUrls.length}`);
