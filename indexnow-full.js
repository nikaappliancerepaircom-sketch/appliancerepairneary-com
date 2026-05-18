const https = require('https');
const fs = require('fs');

const sitemap = fs.readFileSync('C:/appliancerepairneary/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

const keyFiles = fs.readdirSync('C:/appliancerepairneary').filter(f => f.endsWith('.txt') && !['robots.txt','llms.txt'].includes(f));
const key = keyFiles[0].replace('.txt','');

console.log(`Pinging ${urls.length} URLs with key: ${key}`);

async function pingBatch(batch, n) {
  return new Promise(resolve => {
    const body = JSON.stringify({ host:'appliancerepairneary.com', key, keyLocation:`https://appliancerepairneary.com/${key}.txt`, urlList:batch });
    const req = https.request({ hostname:'api.indexnow.org', path:'/indexnow', method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)} }, res => { console.log(`Batch ${n}: HTTP ${res.statusCode} — ${batch.length} URLs`); resolve(); });
    req.on('error', e => { console.error(`Batch ${n}:`, e.message); resolve(); });
    req.write(body); req.end();
  });
}

(async () => {
  for (let i = 0; i < urls.length; i += 100) await pingBatch(urls.slice(i, i+100), Math.floor(i/100)+1);
  console.log('Done.');
})();
