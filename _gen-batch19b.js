const fs = require('fs');
const path = require('path');
const DIR = 'C:/appliancerepairneary';

// Read the CSS from the already-generated script inline (abbreviated since same template)
const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Instrument Sans',-apple-system,sans-serif;background:#fff;color:#0a0a0a;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 24px}.breadcrumb{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fafafa}.breadcrumb .container{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.breadcrumb a{font-size:.8125rem;font-weight:500;color:#6b7280}.breadcrumb-sep{font-size:.8125rem;color:#d1d5db}.breadcrumb-current{font-size:.8125rem;font-weight:600;color:#0a0a0a}.page-hero{padding:56px 0 48px;background:#fff;border-bottom:1px solid #e5e7eb}.page-hero .container{max-width:800px}.page-hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:16px}.page-hero-eyebrow::before{content:'';display:block;width:16px;height:2px;background:#2563eb}h1.page-h1{font-size:clamp(1.875rem,4vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:24px}.answer-box{background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;padding:20px 24px;margin-bottom:32px;font-size:1rem;color:#1e40af;line-height:1.7;font-weight:500}.page-hero-ctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:700;padding:14px 24px;border-radius:4px;white-space:nowrap}.btn-secondary{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#2563eb;font-size:1rem;font-weight:700;padding:13px 22px;border-radius:4px;border:1.5px solid #2563eb;white-space:nowrap}.trust-bar{background:#0a0a0a;padding:14px 0}.trust-bar-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0}.trust-item{display:flex;align-items:center;gap:8px;padding:4px 24px;border-right:1px solid rgba(255,255,255,.1);font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap}.trust-item:last-child{border-right:none}.section-label{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#2563eb;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section-title{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;line-height:1.15;margin-bottom:16px}main.page-main{padding:56px 0 0}.content-intro{max-width:760px;font-size:1.0625rem;color:#374151;line-height:1.75;margin-bottom:56px}.content-intro h2{font-size:1.375rem;font-weight:700;color:#0a0a0a;letter-spacing:-.02em;margin-top:32px;margin-bottom:12px}.content-intro p{margin-bottom:16px}.content-intro ul{margin:16px 0;padding-left:0;list-style:none}.content-intro ul li{padding:6px 0 6px 20px;position:relative;font-size:1rem;color:#374151}.content-intro ul li::before{content:'→';position:absolute;left:0;color:#2563eb;font-weight:700}.service-details{padding:48px 0;border-top:1px solid #e5e7eb}.pricing-table{width:100%;border-collapse:collapse;margin-top:24px;font-size:.9375rem}.pricing-table th,.pricing-table td{padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:left}.pricing-table th{background:#f9fafb;font-weight:600;color:#0a0a0a;font-size:.8125rem;text-transform:uppercase;letter-spacing:.05em}.pricing-table td:last-child{font-weight:600;color:#2563eb;white-space:nowrap}.pricing-note{font-size:.8125rem;color:#6b7280;margin-top:12px;line-height:1.5}.booking-section{padding:56px 0;border-top:1px solid #e5e7eb;text-align:center}.booking-section h2{font-size:1.75rem;font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:12px}.booking-alt{font-size:.9375rem;color:#6b7280;margin-top:16px}.booking-alt a{color:#2563eb;font-weight:600}.faq-section{padding:56px 0;border-top:1px solid #e5e7eb}.faq-section h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:32px}.faq-item{border-bottom:1px solid #e5e7eb}.faq-question{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;gap:16px;list-style:none;font-weight:600;font-size:1rem;color:#0a0a0a}.faq-question::-webkit-details-marker{display:none}.faq-icon{font-size:1.25rem;color:#2563eb;flex-shrink:0;transition:transform .2s}details[open] .faq-icon{transform:rotate(45deg)}.faq-answer{padding:0 0 18px;font-size:.9375rem;color:#374151;line-height:1.7}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.related-link{display:block;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;font-weight:500;color:#2563eb;transition:border-color .15s}.related-link:hover{border-color:#2563eb}footer.site-footer{background:#0a0a0a;color:rgba(255,255,255,.7);padding:40px 0;margin-top:80px}footer .container{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}footer p{font-size:.875rem;line-height:1.6}footer a{color:#93c5fd;font-weight:500}.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:10px}.sticky-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:50px;font-size:.9375rem;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap}.sticky-book{background:#2563eb;color:#fff}.fade-in{opacity:0;transition:opacity .35s ease}.fade-in.visible{opacity:1}@media(max-width:768px){.related-grid{grid-template-columns:1fr}}@media(max-width:640px){.page-hero{padding:40px 0 36px}h1.page-h1{font-size:1.75rem}.sticky-cta{display:none}}`;

const pages = [
  {
    file: 'washer-repair-country-hills-village.html',
    slug: 'country-hills-village', display: 'Country Hills Village', eyebrow: 'Calgary NE · Country Hills Village',
    serviceSlug: 'washer', serviceName: 'Washer Repair', serviceShort: 'washer',
    para: 'Country Hills Village is a compact 1990s NE Calgary community with a higher proportion of condominiums and townhouses than the surrounding suburbs. Washer repair here predominantly involves stacked or front-load configurations in condo laundry closets. Whirlpool and LG stacked front-load units are the most common, with LG developing drum bearing noise and door seal failures in the 8–12 year range. Older townhouse units have Maytag top-loaders nearing the end of their service life. We handle condo building access coordination and bring all needed tooling for compact laundry formats on Country Hills Village calls.',
    issues: ['LG stacked front-load drum bearing noise and door seal replacement', 'Whirlpool stacked washer drain pump blockages and motor diagnostics', 'Maytag top-loader lid switch and agitator coupler failures in townhouse units', 'Control board error codes in Samsung front-load compact washers'],
    nearby: ['dishwasher-repair-country-hills-village|Dishwasher Repair — Country Hills Village', 'fridge-repair-country-hills-village|Fridge Repair — Country Hills Village', 'washer-repair-coventry-hills|Washer Repair — Coventry Hills', 'washer-repair-harvest-hills|Washer Repair — Harvest Hills'],
  },
  {
    file: 'fridge-repair-country-hills-village.html',
    slug: 'country-hills-village', display: 'Country Hills Village', eyebrow: 'Calgary NE · Country Hills Village',
    serviceSlug: 'fridge', serviceName: 'Fridge Repair', serviceShort: 'fridge',
    para: 'Refrigerator repair in Country Hills Village covers the full range of unit types typical of a 1990s NE Calgary mixed-use community. Townhouse kitchens tend toward mid-range Samsung and LG French-door models, while condo units often have compact counter-depth Frigidaire or Whirlpool refrigerators. Ice maker water valve failures are the leading repair type across all fridge formats here. We carry OEM ice maker assemblies for Samsung, LG, Whirlpool, and Frigidaire and typically complete repairs on the first visit to Country Hills Village.',
    issues: ['Samsung and LG French-door ice maker water valve and assembly failures', 'Frigidaire and Whirlpool compact fridge compressor diagnostics', 'Counter-depth refrigerator condenser coil cleaning and airflow restoration', 'LG French-door ice dispenser actuator and door seal replacement'],
    nearby: ['dishwasher-repair-country-hills-village|Dishwasher Repair — Country Hills Village', 'washer-repair-country-hills-village|Washer Repair — Country Hills Village', 'fridge-repair-coventry-hills|Fridge Repair — Coventry Hills', 'fridge-repair-harvest-hills|Fridge Repair — Harvest Hills'],
  },
  {
    file: 'washer-repair-eagle-ridge.html',
    slug: 'eagle-ridge', display: 'Eagle Ridge', eyebrow: 'Calgary SW · Eagle Ridge',
    serviceSlug: 'washer', serviceName: 'Washer Repair', serviceShort: 'washer',
    para: 'Eagle Ridge is one of Calgary\'s most exclusive SW enclaves, and washer repair here means working with premium European brands almost exclusively. Miele W1 series front-load washers are standard in estate laundry rooms, alongside V-ZUG and Electrolux Grand models in the most recently renovated homes. These premium machines require specialized OEM parts and diagnostic protocols not used for mass-market brands. Common failures include Miele drum bearing wear, door boot seal deterioration from hard water chemistry, and electronic control board faults requiring Miele-specific diagnostic software. We carry Miele OEM parts on all SW Calgary runs covering Eagle Ridge.',
    issues: ['Miele W1 drum bearing, door seal, and control board failures', 'V-ZUG and Electrolux Grand front-load diagnostic and repair', 'Premium front-load OEM part sourcing for estate laundry rooms', 'Hard water chemistry accelerating seal deterioration in Miele machines'],
    nearby: ['dishwasher-repair-eagle-ridge|Dishwasher Repair — Eagle Ridge', 'fridge-repair-eagle-ridge|Fridge Repair — Eagle Ridge', 'washer-repair-pump-hill|Washer Repair — Pump Hill', 'washer-repair-bel-aire|Washer Repair — Bel-Aire'],
  },
  {
    file: 'fridge-repair-eagle-ridge.html',
    slug: 'eagle-ridge', display: 'Eagle Ridge', eyebrow: 'Calgary SW · Eagle Ridge',
    serviceSlug: 'fridge', serviceName: 'Fridge Repair', serviceShort: 'fridge',
    para: 'Fridge repair in Eagle Ridge is premium-brand work almost without exception. Sub-Zero built-in column refrigerators and French-door units are the standard in this ultra-luxury SW Calgary enclave. Wolf and Thermador complementary refrigerator drawers are also encountered in the most fully appointed estate kitchens. Sub-Zero sealed system diagnostics, compressor assessments, and ice maker replacements are the leading service types. We carry Sub-Zero OEM gasket kits, ice maker assemblies, and water inlet valves and provide written service documentation for insurance and warranty purposes. Gaggenau integrated fridge columns requiring European part sourcing are handled via our premium parts network.',
    issues: ['Sub-Zero built-in compressor and sealed system assessment', 'Sub-Zero ice maker assembly and water valve replacement', 'Gaggenau and Thermador refrigerator diagnostic and repair', 'Wolf refrigerator drawer mechanism and cooling system failures'],
    nearby: ['dishwasher-repair-eagle-ridge|Dishwasher Repair — Eagle Ridge', 'washer-repair-eagle-ridge|Washer Repair — Eagle Ridge', 'fridge-repair-pump-hill|Fridge Repair — Pump Hill', 'fridge-repair-bel-aire|Fridge Repair — Bel-Aire'],
  },
];

function buildPage(p) {
  const { slug, display, eyebrow, serviceSlug, serviceName, serviceShort, para, issues, nearby } = p;
  const idSuffix = `${slug.replace(/-/g,'_')}-${serviceSlug.charAt(0)}`;
  const canonical = `https://appliancerepairneary.com/${serviceSlug}-repair-${slug}`;
  const title = `${serviceName} ${display} Calgary | Neary Appliance`;
  const metaDesc = `${serviceName} in ${display}, Calgary — same-day, flat $65 diagnostic, 90-day warranty. Book online or email calgary@appliancerepairneary.com.`;
  const issuesHtml = issues.map(i => `<li><strong>${i}</strong></li>`).join('\n      ');
  const nearbyHtml = nearby.map(n => {
    const [href, label] = n.split('|');
    return `<a href="/${href}" class="related-link">${label}</a>`;
  }).join('\n      ');
  const serviceType = serviceSlug === 'fridge' ? 'Refrigerator Repair' : serviceName;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>${CSS}</style>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"${canonical}#business","name":"${serviceType} ${display} — Calgary Appliance Repair","description":"Same-day ${serviceType} in ${display}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"${canonical}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${display}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"${serviceType}"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer><\/script>
<nav class="breadcrumb"><div class="container"><a href="/">Home</a><span class="breadcrumb-sep">/</span><a href="/${serviceSlug}-repair-calgary">${serviceName} Calgary</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">${display}</span></div></nav>
<section class="page-hero"><div class="container">
  <div class="page-hero-eyebrow">${eyebrow}</div>
  <h1 class="page-h1">${serviceName} in ${display}, Calgary</h1>
  <div class="answer-box">Same-day ${serviceShort} repair in ${display}, Calgary. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Kenmore, KitchenAid, Miele, GE &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.</div>
  <div class="page-hero-ctas">
    <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary">Book Online</a>
    <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
  </div>
</div></section>
<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6">Need ${serviceShort} repair in ${display}? Same-day available, flat $65 diagnostic. <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#2563eb;font-weight:600">calgary@appliancerepairneary.com</a>. 7 days a week.</p>
</div>
<div class="trust-bar"><div class="trust-bar-inner"><div class="trust-item">&#128205; Local Technicians</div><div class="trust-item">&#11088; 4.9/5 Rating</div><div class="trust-item">&#9873; Same-Day Available</div><div class="trust-item">&#10003; 90-Day Warranty</div></div></div>
<main class="page-main container" id="main-content">
  <div class="content-intro fade-in">
    <h2>${serviceName} in ${display} — Fast, Reliable, Local</h2>
    <p>${para}</p>
    <h2>Common ${serviceName} Issues in ${display}</h2>
    <ul>
      ${issuesHtml}
    </ul>
    <h2>Repair Cost in ${display}</h2>
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most ${serviceShort} repairs in ${display}: $120–$380 parts and labour. Written quote before any work. 90-day parts and labour warranty on all repairs.</p>
  </div>
  <section class="service-details fade-in">
    <div class="section-label">Pricing</div>
    <h2 class="section-title">${serviceName} Cost in ${display}</h2>
    <table class="pricing-table"><thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
    <tbody>
      <tr><td>Diagnostic visit (waived when repair proceeds)</td><td>$65</td></tr>
      <tr><td>Standard repair — common component failures</td><td>$120 – $240</td></tr>
      <tr><td>Complex repair — control board, motor, sealed system</td><td>$240 – $380</td></tr>
    </tbody></table>
    <p class="pricing-note">Firm written quote before any work. OEM or OEM-equivalent parts. 90-day warranty.</p>
  </section>
  <section class="booking-section fade-in">
    <div class="section-label">Online booking</div>
    <h2>Book ${serviceName} in ${display}</h2>
    <iframe id="fixlify-${idSuffix}" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book ${serviceName} in ${display}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-${idSuffix}');if(el)el.style.height=e.data.height+'px'}});<\/script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>
  <section class="faq-section fade-in"><div class="container" style="padding:0">
    <h2>FAQ — ${serviceName} in ${display}</h2>
    <div class="faq-list">
      <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Do you offer same-day ${serviceShort} repair in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>Yes — same-day ${serviceShort} repair in ${display}, Calgary. Book before noon on weekdays. We dispatch from 700 6th Ave SW.</p></div></details>
      <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">What does ${serviceShort} repair cost in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>Most repairs run $120–$380 CAD. The $65 diagnostic fee is waived when you proceed. Written quote before any work.</p></div></details>
      <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Which brands do you repair in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>We repair Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, Electrolux, KitchenAid, Kenmore, Miele, and most other brands found in ${display} homes.</p></div></details>
    </div>
  </div></section>
</main>
<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb"><div class="container">
  <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair in ${display} &amp; Calgary</h2>
  <div class="related-grid">
      ${nearbyHtml}
    <a href="/${serviceSlug}-repair-calgary" class="related-link">All Calgary ${serviceName}</a>
  </div>
</div></div>
<footer class="site-footer" data-footer-region="calgary"><div class="container">
  <p><strong>Calgary Appliance Repair</strong> | Serving ${display} and all Calgary</p>
  <p>700 6th Avenue SW Suite 1700, Calgary, AB T2P 0T8</p>
  <p>Email: <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> | <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a></p>
  <p>Mon&ndash;Sat 8 AM&ndash;8 PM &nbsp;|&nbsp; Sun 10 AM&ndash;6 PM (Mountain Time)</p>
  <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
  <p>&copy; <span id="fy-${idSuffix}"></span> Appliance Repair Near You — Calgary</p>
</div></footer>
<script>(function(){var el=document.getElementById('fy-${idSuffix}');if(el)el.textContent=new Date().getFullYear()})();<\/script>
<div class="sticky-cta"><a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="sticky-btn sticky-book">Book Online &rarr;</a></div>
<script>document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('visible')})}});<\/script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do you offer same-day ${serviceShort} repair in ${display}?","acceptedAnswer":{"@type":"Answer","text":"Yes — same-day ${serviceShort} repair in ${display}, Calgary. Book before noon on weekdays."}},{"@type":"Question","name":"What does ${serviceShort} repair cost in ${display}?","acceptedAnswer":{"@type":"Answer","text":"Most repairs run $120–$380 CAD. The $65 diagnostic fee is waived when you proceed. Written quote before any work."}},{"@type":"Question","name":"Which brands do you repair in ${display}?","acceptedAnswer":{"@type":"Answer","text":"We repair Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, Electrolux, KitchenAid, Kenmore, Miele, and most other brands."}}]}
</script>
</body>
</html>`;
}

for (const p of pages) {
  fs.writeFileSync(path.join(DIR, p.file), buildPage(p), 'utf8');
  console.log(`Created: ${p.file}`);
}
console.log('Done.');
