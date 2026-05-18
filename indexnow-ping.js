/**
 * IndexNow ping — NEARY (appliancerepairneary.com)
 *
 * Reads sitemap-published.json, takes top 200 URLs by priority,
 * and submits them to IndexNow in batches of 100.
 *
 * Usage:
 *   node indexnow-ping.js
 *
 * Key file: neary2026indexnow.txt (value: neary2026indexnow)
 * Endpoint: https://api.indexnow.org/indexnow
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const INDEXNOW_KEY = 'neary2026indexnow';
const HOST = 'appliancerepairneary.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const ENDPOINT_HOST = 'api.indexnow.org';
const ENDPOINT_PATH = '/indexnow';
const BATCH_SIZE = 100;
const TOP_N = 200;

function pingBatch(urlList, batchNum) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    });

    const options = {
      hostname: ENDPOINT_HOST,
      path: ENDPOINT_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ batch: batchNum, status: res.statusCode, body: data.trim(), count: urlList.length });
      });
    });

    req.on('error', (e) => {
      resolve({ batch: batchNum, status: 'ERR', body: e.message, count: urlList.length });
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  // Read and sort sitemap-published.json
  const sitemapPath = path.join(__dirname, 'sitemap-published.json');
  const raw = JSON.parse(fs.readFileSync(sitemapPath, 'utf-8'));

  const sorted = raw
    .sort((a, b) => {
      const pd = parseFloat(b.priority || 0) - parseFloat(a.priority || 0);
      if (pd !== 0) return pd;
      return (b.lastmod || '').localeCompare(a.lastmod || '');
    });

  const topUrls = sorted.slice(0, TOP_N).map((x) => x.url);

  console.log('IndexNow — NEARY Calgary Pages');
  console.log(`Host: ${HOST}`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log(`Key location: ${KEY_LOCATION}`);
  console.log(`Total URLs to ping: ${topUrls.length} (top ${TOP_N} by priority)`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log('');

  // Split into batches
  const batches = [];
  for (let i = 0; i < topUrls.length; i += BATCH_SIZE) {
    batches.push(topUrls.slice(i, i + BATCH_SIZE));
  }

  let totalSubmitted = 0;
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Batch ${i + 1}/${batches.length}: submitting ${batch.length} URLs...`);
    batch.forEach((u) => console.log(`  ${u}`));

    const result = await pingBatch(batch, i + 1);
    const ok = result.status === 200 || result.status === 202;
    console.log(`  -> Status: ${result.status} ${ok ? '[OK]' : '[CHECK]'}`);
    if (result.body) console.log(`  -> Response: ${result.body}`);
    if (ok) totalSubmitted += batch.length;
    console.log('');
  }

  console.log(`Done. ${totalSubmitted}/${topUrls.length} URLs successfully submitted to IndexNow.`);
  console.log('Note: 200 = submitted immediately, 202 = accepted for batch processing.');
  console.log('Bing/DuckDuckGo will crawl within 24-48 hours.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
