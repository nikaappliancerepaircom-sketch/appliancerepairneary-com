// expand-content.js — NEARY Calgary content expander
// Adds content sections to service pages under 1500 words
// Run from C:/appliancerepairneary/

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.resolve(__dirname);
const CITY = 'Calgary';

function toTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function extractInfo(filename) {
  const base = path.basename(filename, '.html');
  if (/^dishwasher-repair-.+/.test(base)) return { service: 'dishwasher', neighborhood: toTitle(base.replace('dishwasher-repair-', '')) };
  if (/^washer-repair-.+/.test(base)) return { service: 'washer', neighborhood: toTitle(base.replace('washer-repair-', '')) };
  if (/^fridge-repair-.+/.test(base)) return { service: 'fridge', neighborhood: toTitle(base.replace('fridge-repair-', '')) };
  if (/^(lg|samsung|whirlpool|bosch|ge|frigidaire|kenmore|maytag|kitchenaid|electrolux)-/.test(base)) return { service: 'brand', neighborhood: CITY };
  return null;
}

function countWords(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w.length > 0).length;
}

function injectBeforeFaq(html, injection) {
  const marker = '<section class="faq-section fade-in">';
  const idx = html.indexOf(marker);
  if (idx !== -1) return html.slice(0, idx) + injection + '\n' + html.slice(idx);
  const alt = html.lastIndexOf('</main>');
  if (alt !== -1) return html.slice(0, alt) + injection + '\n' + html.slice(alt);
  return html + injection;
}

function getSections(service, N, idx) {
  const C = CITY;

  const dishwasher = [
    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Common Dishwasher Problems We Fix in ${N}</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">${C}'s water supply from the Bow River and Elbow River carries 150–200 ppm of dissolved minerals — significantly harder than the national average of 120 mg/L. Over time, this mineral load builds up in spray arms, heating elements, and detergent dispensers in ${N} dishwashers, causing issues that appear mechanical but often start with water chemistry.</p>
<ul style="list-style:none;padding:0;display:grid;gap:10px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Dishes coming out cloudy or dirty</strong> — mineral-blocked spray arms reduce water pressure to the nozzles. We clear the arms and run a full citric acid descaling service to restore wash performance.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Water pooling at the bottom after the cycle</strong> — a clogged filter or failed drain pump. This is one of the most common dishwasher calls we receive from ${N} homeowners.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Door leaking onto kitchen floor</strong> — worn door gaskets or failed hinge springs. Gasket replacement in ${N} typically runs $80–$140 all-in including labour.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Dishes not drying properly</strong> — a failed heating element or vent fan. ${C}'s hard water deposits on the element accelerate failure. Replacement: $150–$240 all-in.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>F2, E24, or other error codes</strong> — sensor faults or control board failures. We carry replacement boards for Whirlpool, GE, Samsung, LG, and Bosch on our service vehicles.</li>
</ul>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">Most dishwasher repairs in ${N} are completed in a single visit. We carry OEM parts on our trucks and provide a written quote before any work begins.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">How Our Dishwasher Repair Works in ${N}</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">Booking a dishwasher repair in ${N} with Appliance Repair Neary takes less than 5 minutes online, and most repairs are completed the same day you call. Here is what to expect from start to finish:</p>
<div style="display:grid;gap:14px;margin:0 0 14px">
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Step 1 — Book Online</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">Select your ${N} address, describe the dishwasher symptom, and choose a same-day or next-day window. Instant email confirmation with your technician's estimated arrival time.</p>
  </div>
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Step 2 — Flat $65 Diagnostic</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">The technician arrives at your ${N} home, diagnoses at the component level, and provides a written quote. The $65 diagnostic fee is waived when you proceed with the repair — no call-out fees or hidden charges.</p>
  </div>
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Step 3 — Repair with OEM Parts</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We stock the most common dishwasher parts in our ${C} service vehicles — drain pumps, heating elements, door latches, spray arm assemblies, control boards, and detergent dispensers. Factory-spec parts, not generic substitutes.</p>
  </div>
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Step 4 — Test &amp; 90-Day Warranty</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We run a full wash cycle to confirm performance before leaving your ${N} home. Every repair includes a 90-day parts and labour warranty — same fault returns within 90 days, we come back at no charge.</p>
  </div>
</div>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Dishwasher Repair or Replace? A Guide for ${N} Homeowners</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">When your dishwasher breaks down in ${N}, the repair-vs-replace decision comes down to three factors: the age of the unit, the cost of the repair, and current replacement prices. Here is the framework our technicians use when advising ${N} customers:</p>
<div style="background:#eff6ff;border-radius:8px;padding:20px 24px;margin-bottom:16px">
  <p style="margin:0 0 8px;font-weight:700;color:#1e40af">The 50% Rule</p>
  <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">If the repair cost exceeds 50% of the replacement cost of a comparable new dishwasher, replacing usually makes more financial sense. A basic entry-level dishwasher in ${C} runs $550–$900 installed. If your repair quote is under $350, repairing is almost always the right decision.</p>
</div>
<p style="color:#374151;line-height:1.75;margin-bottom:12px"><strong>Repair is the better choice when</strong> the unit is under 10 years old, the repair involves a single component (drain pump, door latch, heating element), and the brand is Bosch, KitchenAid, Miele, or Electrolux — brands with higher replacement costs and longer service lives.</p>
<p style="color:#374151;line-height:1.75;margin-bottom:12px"><strong>Replacement may make more sense when</strong> the dishwasher is 12–15+ years old, you are facing multiple simultaneous failures, or the control board on a budget-brand unit costs $300+ to replace.</p>
<p style="color:#374151;line-height:1.75">Our ${N} technicians give you an honest assessment during the diagnostic visit. We will tell you when replacement is the smarter financial decision rather than recommending an expensive repair on a unit near the end of its service life.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Dishwasher Maintenance Tips for ${N} Homes</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">${C}'s Bow River water supply delivers 150–200 ppm of dissolved calcium and magnesium to ${N} taps — well above the national average. ${N} homeowners who follow a simple maintenance routine extend their dishwasher's life by 3–5 years compared to those who don't. Here is what our technicians recommend based on the repairs they see most often in ${N}:</p>
<ul style="list-style:none;padding:0;display:grid;gap:12px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Monthly:</span> Run an empty hot cycle with white vinegar or a citric-acid tablet (Finish or Cascade dishwasher cleaner). This dissolves mineral deposits in spray arms, the heating element, and the detergent dispenser — the most effective single step for ${C} hard water.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Every 2 months:</span> Remove and rinse the filter basket under the tap. A clogged filter is the leading cause of draining failures and poor wash performance in ${N} dishwashers. Takes 2 minutes.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Quarterly:</span> Check the door gasket for cracks or hardening. ${C}'s Chinook winds create dramatic temperature swings in winter — the door seal experiences thermal cycling that accelerates deterioration.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Always:</span> Use rinse aid — in ${C}'s hard water, rinse aid is not optional. It prevents scale spotting on glassware and helps the drying cycle perform correctly. Refill every 3–4 weeks.</li>
</ul>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">If you notice any change in cleaning quality, draining, or unusual sounds from your ${N} dishwasher, call us early. A $65 diagnostic caught before failure is far less expensive than a $280 pump replacement after it seizes.</p>
</section>`
  ];

  const washer = [
    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Common Washer Problems We Repair in ${N}</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">Washing machines in ${N} face a combination of regular wear and ${C}-specific challenges — hard water mineral buildup from the Bow River supply at 150–200 ppm, and ${C}'s Chinook temperature swings that stress seals and hoses throughout the year. These are the washer faults our technicians see most often:</p>
<ul style="list-style:none;padding:0;display:grid;gap:10px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Drum not spinning</strong> — a failed lid switch (top-loaders) or door latch (front-loaders) prevents the spin cycle from engaging. Common on HE washers over 5 years old in ${N} homes.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Excessive vibration or grinding during spin</strong> — worn drum bearings are the usual cause. A bearing caught early (grinding noise) costs $200–$380 to fix; left untreated, the drum shaft fails and costs significantly more.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Water not draining after the cycle</strong> — a blocked pump filter or failed drain pump. Front-loaders are particularly prone to small-item blockages in ${N} laundry rooms.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Water leaking onto the floor</strong> — door boot seals on front-loaders and hose connections at the back of the unit. ${C}'s hard water and temperature cycling accelerate seal deterioration.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>F21, E3, or UL error codes</strong> — these indicate specific component failures. We diagnose and resolve with a definitive repair, not a reset workaround.</li>
</ul>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">Most ${N} washer repairs are resolved in one visit. Call us at the first grinding noise — a bearing caught early saves you from a much more expensive drum shaft replacement later.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Washer Repair Cost Guide for ${N} Homeowners</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:16px">What you pay for washer repair in ${N} depends on the failed component and the brand of machine. Here is what ${N} homeowners typically pay for the most common repairs, all-in with parts, labour, and 90-day warranty:</p>
<table style="width:100%;border-collapse:collapse;max-width:700px;font-size:.9rem;margin-bottom:16px">
  <thead><tr style="background:#f9fafb"><th style="padding:10px 14px;border-bottom:2px solid #e5e7eb;text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Repair Type</th><th style="padding:10px 14px;border-bottom:2px solid #e5e7eb;text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Typical Cost</th></tr></thead>
  <tbody>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Drum bearing replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$200–$380</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Drain pump replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$110–$210</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Door boot seal (front-loader)</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$130–$240</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Lid switch / door latch</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$80–$150</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Motor coupling</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$80–$160</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Water inlet valve</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$90–$170</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Control board replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$220–$420</td></tr>
  </tbody>
</table>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">All prices include the flat $65 diagnostic (waived with repair), parts, labour, and 90-day warranty. ${N} customers receive a written quote before any work begins.</p>
<p style="color:#374151;line-height:1.75;font-size:.9375rem;margin-top:10px">Drum bearing replacements on front-loaders require full drum removal — 2–3 hours of labour. If the quote seems high, it reflects the labour involved, not a parts markup.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Our Washer Repair Process in ${N}</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">We keep the washer repair process straightforward for ${N} homeowners — from booking to a working machine in one visit in most cases:</p>
<div style="display:grid;gap:14px;margin:0 0 14px">
  <div style="display:flex;gap:16px;align-items:flex-start"><div style="width:32px;height:32px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:.875rem">1</div><div><p style="margin:0;font-weight:600;color:#0a0a0a;margin-bottom:4px">Book online in 2 minutes</p><p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">Select washer repair, describe the symptom, and pick a same-day or next-day arrival window. Instant email confirmation — no phone calls required.</p></div></div>
  <div style="display:flex;gap:16px;align-items:flex-start"><div style="width:32px;height:32px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:.875rem">2</div><div><p style="margin:0;font-weight:600;color:#0a0a0a;margin-bottom:4px">Flat $65 diagnostic, waived with repair</p><p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">Our technician arrives at your ${N} home and diagnoses the root cause at the component level. Written quote provided before any work begins. No extra charge for weekends or evenings.</p></div></div>
  <div style="display:flex;gap:16px;align-items:flex-start"><div style="width:32px;height:32px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:.875rem">3</div><div><p style="margin:0;font-weight:600;color:#0a0a0a;margin-bottom:4px">Repair with OEM parts, same visit</p><p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We carry drum bearings, pump assemblies, door boot seals, lid switches, and control boards for all major platforms in our ${C} service vehicles. Most ${N} washer repairs are completed in one visit.</p></div></div>
  <div style="display:flex;gap:16px;align-items:flex-start"><div style="width:32px;height:32px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;color:#fff;font-size:.875rem">4</div><div><p style="margin:0;font-weight:600;color:#0a0a0a;margin-bottom:4px">Test + 90-day parts and labour warranty</p><p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We run a full wash and spin cycle before leaving your ${N} home. 90-day warranty on every repair — same fault returns, we come back at no charge.</p></div></div>
</div>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Washer Care Guide for ${N} Homeowners</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">A well-maintained washer lasts 12–15 years. One that is not typically fails at 7–9 years. ${C}'s hard water (150–200 ppm from the Bow River) and temperature cycling create extra wear — here is how ${N} homeowners can extend their washer's life based on the repairs our technicians see most often:</p>
<ul style="list-style:none;padding:0;display:grid;gap:12px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Monthly:</span> Run a hot maintenance cycle with a washer cleaner tablet (Affresh or equivalent). This removes detergent residue and mineral deposits that accumulate in the drum and pump filter from ${C}'s hard water supply.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Monthly:</span> Leave the front-loader door ajar between cycles to prevent mould growth in the drum. Wipe the door boot gasket with a damp cloth — this is where most front-loader odours and seal deterioration begin in ${N} homes.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Quarterly:</span> Check hose connections at the back of the unit. ${C}'s Chinook temperature swings can stress hose connections — slow leaks at the connection point often go undetected until they cause floor damage.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Always:</span> Use HE detergent in HE washers. Standard detergent over-suds in low-water machines and leaves residue that accelerates drum bearing wear — one of the most common causes of the grinding noise we repair in ${N} homes.</li>
</ul>
</section>`
  ];

  const fridge = [
    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Common Fridge Problems We Fix in ${N}</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">Refrigerator repair calls in ${N} peak in summer when compressors work harder, and in winter when ${C}'s dramatic Chinook temperature swings — from −20°C to +15°C in 24 hours — stress door seals, defrost systems, and compressor components. These are the faults our technicians encounter most often in ${N}:</p>
<ul style="list-style:none;padding:0;display:grid;gap:10px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Fridge not cooling or not cold enough</strong> — compressor, evaporator fan, or thermostat failure. The evaporator fan is the most common single-point failure on modern frost-free units in ${N}.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Ice building on the back wall</strong> — a failed defrost heater or defrost thermostat causes ice to accumulate on the evaporator coil, blocking airflow. The fridge gradually warms up. More common in ${N} during cold snaps.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Water dispenser or ice maker not working</strong> — a failed water inlet valve or frozen fill line. ${C}'s cold snaps can freeze water lines in poorly insulated spaces.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Fridge running constantly</strong> — a worn door gasket lets cold air escape and forces the compressor to run non-stop. ${C}'s Chinook cycles rapidly expand and contract rubber gaskets, accelerating deterioration.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Clicking at startup or not starting</strong> — a failing start relay is a $60–$110 fix that prevents a full compressor replacement at $450–$750. Catching it early is critical.</li>
</ul>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">A non-functioning fridge is a food safety emergency. We prioritize same-day service for fridge calls in ${N} — book before noon Monday through Saturday.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Fridge Repair Costs in ${N} — Complete Price Guide</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:16px">Refrigerator repair costs in ${N} vary significantly by the type of failure and the brand of unit. Here is what ${N} homeowners typically pay for the most common repairs, all-in with parts, labour, and the 90-day warranty:</p>
<table style="width:100%;border-collapse:collapse;max-width:700px;font-size:.9rem;margin-bottom:16px">
  <thead><tr style="background:#f9fafb"><th style="padding:10px 14px;border-bottom:2px solid #e5e7eb;text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Repair Type</th><th style="padding:10px 14px;border-bottom:2px solid #e5e7eb;text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:#6b7280">Typical Cost</th></tr></thead>
  <tbody>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Evaporator fan replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$130–$240</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Defrost heater + thermostat</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$110–$200</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Door gasket replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$90–$170</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Start relay replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$60–$110</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Water inlet valve</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$90–$170</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Thermostat / temperature sensor</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$100–$200</td></tr>
    <tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#374151">Compressor replacement</td><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#2563eb;font-weight:600">$400–$750</td></tr>
  </tbody>
</table>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">All prices include the $65 diagnostic (waived with repair), parts, labour, and 90-day warranty. If your fridge is over 12 years old and needs a compressor, we will tell you honestly if replacement makes more economic sense for your ${N} home.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Refrigerators and ${C}'s Chinook Climate — What ${N} Homeowners Need to Know</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">${C} is famous for Chinook winds that can raise temperatures by 20–30°C in just a few hours — from −20°C in the morning to +10°C by afternoon. For refrigerators in ${N} garages, unheated mudrooms, and basement utility spaces, these rapid temperature swings create a unique set of stress conditions our technicians deal with every winter.</p>
<ul style="list-style:none;padding:0;display:grid;gap:12px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Door gasket fatigue:</span> Rubber gaskets expand and contract with each Chinook cycle. In ${N} garages that swing between −20°C and +10°C multiple times per winter, gaskets deteriorate 2–3× faster than in climate-controlled spaces. A failing gasket causes the compressor to run continuously and can shorten its life by years.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Garage fridges stopping cooling:</span> Most refrigerators are designed to operate between 10°C and 43°C. When your ${N} garage drops below 10°C, the compressor shuts off — the fridge thinks it's already cold — while the freezer warms up. A garage kit (available for select Whirlpool and GE models) corrects this.</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">Compressor start relay failures:</span> Rapid temperature swings stress the start relay more than steady cold. A relay approaching failure will give out during the first extreme cold snap of a ${C} winter. Preemptive replacement ($60–$110) is far less disruptive than a January no-cooling emergency.</li>
</ul>
<p style="color:#374151;line-height:1.75;font-size:.9375rem">If your ${N} fridge starts behaving oddly in October or November as Chinook season begins, call us for a diagnostic visit before it becomes a full failure during the coldest months.</p>
</section>`,

    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Our Fridge Repair Service in ${N}</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">A malfunctioning refrigerator is a food safety emergency. Here is how we handle fridge repair in ${N} from booking to completed repair:</p>
<div style="display:grid;gap:14px;margin:0 0 14px">
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Same-Day Priority for Fridge Calls</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We prioritize same-day dispatch for fridge repairs in ${N}. Book before 12 PM Monday–Saturday and we aim to arrive the same afternoon. Food safety doesn't wait.</p>
  </div>
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Component-Level Diagnosis</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We diagnose at the component level, not just the symptom. A fridge "not cooling" could be the evaporator fan, defrost heater, compressor, or start relay. We identify the exact part before quoting — no guesswork.</p>
  </div>
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">On-Truck Parts for Fast Repairs</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">Our ${N} service vehicles carry evaporator fans, defrost heaters, door gaskets, start relays, and water inlet valves for the most common platforms — Whirlpool, Samsung, LG, GE, Maytag, and Frigidaire. Most ${N} fridge repairs are done in one visit.</p>
  </div>
  <div style="padding:16px 20px;background:#f9fafb;border-radius:6px;border-left:3px solid #2563eb">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#2563eb;margin-bottom:6px">Temperature Verification + 90-Day Warranty</div>
    <p style="margin:0;color:#374151;font-size:.9375rem;line-height:1.65">We verify the unit is holding temperature before we leave — a thermometer reading of both fridge and freezer compartments. Every ${N} fridge repair includes a 90-day parts and labour warranty.</p>
  </div>
</div>
</section>`
  ];

  const brandSections = [
    `<section style="margin-top:48px;padding-top:40px;border-top:1px solid #e5e7eb">
<h2 style="font-size:1.375rem;font-weight:700;letter-spacing:-.02em;color:#0a0a0a;margin-bottom:16px">Why ${C} Homeowners Choose Appliance Repair Neary</h2>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">Appliance Repair Neary has been serving ${C} and surrounding communities since 2017. Our certified technicians carry OEM parts for the most common appliance platforms and complete most repairs in a single visit.</p>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">Every ${C} repair includes:</p>
<ul style="list-style:none;padding:0;display:grid;gap:10px;margin:0 0 14px">
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Same-day service</strong> — book before noon Monday through Saturday and we aim to arrive that afternoon</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Flat $65 diagnostic</strong> — waived when you proceed with repair; no hidden call-out fees</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>Written quote before any work</strong> — you approve the price before we touch the appliance</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>OEM parts</strong> — factory-specification components, not generic substitutes</li>
  <li style="padding-left:22px;position:relative;color:#374151;line-height:1.65;font-size:.9375rem"><span style="position:absolute;left:0;top:0;color:#2563eb;font-weight:700">→</span><strong>90-day parts and labour warranty</strong> — same fault returns within 90 days, we come back at no charge</li>
</ul>
<p style="color:#374151;line-height:1.75;margin-bottom:14px">We service dishwashers, washers, dryers, refrigerators, ovens, and ranges from all major brands including LG, Samsung, Whirlpool, Bosch, GE, Frigidaire, Kenmore, Maytag, KitchenAid, and Electrolux.</p>
<p style="color:#374151;line-height:1.75">${C}'s Bow River water supply carries 150–200 ppm of dissolved minerals. Many appliance failures in ${C} are accelerated by this mineral load — our technicians factor in water chemistry when diagnosing and recommend descaling service alongside primary repairs to prevent recurrence.</p>
</section>`
  ];

  let pool;
  if (service === 'dishwasher') pool = dishwasher;
  else if (service === 'washer') pool = washer;
  else if (service === 'fridge') pool = fridge;
  else return brandSections;

  const start = idx % 4;
  return [pool[start], pool[(start + 1) % 4], pool[(start + 2) % 4], pool[(start + 3) % 4]];
}

// Main
const report = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'word-count-report.json'), 'utf8').replace(/^﻿/, ''));
const underThreshold = report.filter(p => p.Words < 1500 && p.File !== '404.html');

console.log(`Processing ${underThreshold.length} pages under 1500 words...`);

let processed = 0, skipped = 0, alreadyOk = 0;

for (let i = 0; i < underThreshold.length; i++) {
  const item = underThreshold[i];
  const filePath = path.join(SITE_DIR, item.File);

  if (!fs.existsSync(filePath)) { skipped++; continue; }

  const info = extractInfo(item.File);
  if (!info) { skipped++; continue; }

  let html = fs.readFileSync(filePath, 'utf8');
  const currentWords = countWords(html);

  if (currentWords >= 1500) { alreadyOk++; continue; }

  const wordsNeeded = 1600 - currentWords;
  const sectionsNeeded = Math.min(4, Math.max(1, Math.ceil(wordsNeeded / 280)));

  const allSections = getSections(info.service, info.neighborhood, i);
  const sectionsToAdd = allSections.slice(0, sectionsNeeded).join('\n');

  const updated = injectBeforeFaq(html, sectionsToAdd);
  const newWords = countWords(updated);

  fs.writeFileSync(filePath, updated, 'utf8');
  processed++;

  if (processed % 100 === 0 || processed <= 5) {
    console.log(`  [${processed}/${underThreshold.length}] ${item.File}: ${currentWords} → ${newWords} words`);
  }
}

console.log(`\nDone. Processed: ${processed} | Already OK: ${alreadyOk} | Skipped (no match): ${skipped}`);
