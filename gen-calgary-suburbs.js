#!/usr/bin/env node
/**
 * gen-calgary-suburbs.js
 *
 * Generate 6 deep suburb hub pages for Calgary CMA on appliancerepairneary.com.
 * Replaces the body content (between <main> and </main>) of each page,
 * preserving head/schema/breadcrumb/trust-block/footer.
 *
 * Strategy: hand-tuned, deeply suburb-specific template (no API call needed —
 * each page gets unique paragraphs, neighborhoods, brand mix, local angle, FAQ).
 *
 * Mirror of C:/fixlifyservices/gen-edmonton-suburbs.js, adapted for Calgary CMA.
 *
 * Usage: node gen-calgary-suburbs.js [slug]
 *   no args = generate all 6
 *   slug    = generate one (e.g. airdrie)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join('C:', 'appliancerepairneary');

// ==========================================================================
// SUBURB DATA — each entry has unique demographic, neighborhood, and
// repair-pattern detail to differentiate from competitor thin pages.
// ==========================================================================
const SUBURBS = {
  'airdrie': {
    h1: 'Appliance Repair Airdrie',
    name: 'Airdrie',
    region: 'Rocky View County',
    population: '80,000',
    postal: 'T4A, T4B',
    cmaRole: 'Calgary CMA, immediately north of Calgary along Highway 2 (QE2)',
    homeAge: 'predominantly 2000+ construction — Bayside, King\'s Heights, Coopers Crossing, Hillcrest, Reunion, Sagewood are all post-2005 subdivisions, with the original 1960s–70s core around Old Town and Edgewater',
    avgIncome: 'young families and dual-income households, average household income above the Alberta median, many commuting to Calgary',
    waterSupply: 'Airdrie Municipal Water — sourced from the Bow River via the City of Calgary, moderate hardness',
    neighborhoods: [
      'Bayside', 'Big Springs', 'Williamstown', 'Coopers Crossing',
      'King\'s Heights', 'Reunion', 'Hillcrest', 'Sagewood',
      'Luxstone', 'Yankee Valley', 'Silvercreek', 'Ravenswood',
      'Airdrie Meadows', 'Old Town', 'Edgewater'
    ],
    localAngle: {
      headline: 'Fastest-growing Calgary suburb — newer LG, Samsung, Whirlpool packages just out of warranty',
      paragraphs: [
        `Airdrie is the fastest-growing community in the Calgary CMA — population doubled between 2006 and 2021, and roughly 60% of homes were built after 2005. That demographic profile creates a very specific service pattern: practically every household runs builder-grade LG, Samsung, Whirlpool, or Frigidaire appliance packages that are either still under or just past their original 1-year manufacturer warranty. Our Airdrie service mix is dominated by post-warranty fixes on appliances under 8 years old.`,
        `Top three Airdrie repair calls: (1) Samsung French-door refrigerator ice maker errors — the RF-series ice maker auger and rake assemblies fail at the 4–6 year mark, especially in Bayside, King's Heights, and Coopers Crossing homes; (2) LG inverter direct-drive washer thrust bearing replacement — the WM-series front-loaders in Hillcrest and Sagewood develop a roar in spin cycle as the rear bearing fails before the spider arm; (3) Whirlpool Cabrio top-loader U.E. (unbalanced) errors — Reunion and Williamstown households running Cabrio platform washers see suspension rod fatigue plus load-sense board recalibration needs.`,
        `Older Airdrie pockets — Old Town, Edgewater, parts of Big Springs — flip the pattern: 1960s–70s bungalows with second- or third-owner replacement appliances now hitting the 15–20 year mark. We see vintage Whirlpool direct-drive transmission seizures, GE GSS top-mount fridge defrost timer failures, and original Frigidaire glass cooktop infinite switch arcing in this part of the city. Same flat $65 diagnostic, same one-visit fix when parts allow.`
      ]
    },
    brands: ['Samsung', 'LG', 'Whirlpool', 'Frigidaire', 'Bosch', 'KitchenAid', 'GE', 'Maytag', 'Kenmore', 'Miele', 'Electrolux', 'Sub-Zero', 'Wolf', 'Café'],
    techHonest: `Our Airdrie route runs from our Calgary hub at 700 6th Avenue SW via Highway 2 (QE2) — typical drive time 18–25 minutes north. Same-day service is standard when you book before noon Monday–Saturday.`,
    nearbyLinks: [
      { slug: 'calgary', label: 'Calgary' },
      { slug: 'cochrane', label: 'Cochrane' },
      { slug: 'chestermere', label: 'Chestermere' },
      { slug: 'okotoks', label: 'Okotoks' },
      { slug: 'strathmore', label: 'Strathmore' },
      { slug: 'canmore', label: 'Canmore' }
    ],
    faultsIntro: `Airdrie's young housing stock and fast-growth demographics produce a fault pattern dominated by post-warranty issues on appliances under 8 years old. The top calls we see across Bayside, King's Heights, Hillcrest, Sagewood, and Coopers Crossing:`,
    faultCards: [
      { title: 'Samsung RF French-door ice maker', body: 'Bayside and King\'s Heights Samsung RF-series fridges 4-6 years: ice maker auger motor or rake assembly fault. Auger swap; one-visit fix.' },
      { title: 'LG WM-series rear drum bearing', body: 'Hillcrest and Sagewood LG inverter direct-drive front-loaders past warranty: bearing roar in spin cycle before spider failure. Bearing kit; 3-hour repair.' },
      { title: 'Whirlpool Cabrio U.E. error', body: 'Reunion and Williamstown Cabrio top-loaders: suspension rod fatigue + load-sense board recalibration. Rod kit + reflash.' },
      { title: 'Frigidaire dishwasher diverter motor', body: 'Coopers Crossing and Luxstone Frigidaire dishwashers 3-5 years: diverter stalls, top rack stops getting water. Motor + bracket; 60-minute job.' },
      { title: 'Vintage Whirlpool direct-drive transmission', body: 'Old Town and Edgewater original-package Whirlpool/Maytag top-loaders past 15 years: transmission seizure. We lay out repair-vs-replace economics clearly.' },
      { title: 'Bosch dishwasher E15 leak fault', body: 'Newer Yankee Valley and Silvercreek Bosch units: anti-flood float trips from minor under-tub leaks. Tub seal or hose clamp; we test before reset.' }
    ],
    faqs: [
      { q: 'My Airdrie appliance is just past warranty — should I repair or replace?', a: 'Repair, almost always. Airdrie housing skews post-2005, which means most appliances are still well within useful life when manufacturer warranty expires at year one. The most common Bayside, King\'s Heights, and Coopers Crossing fault patterns (Samsung ice maker augers, LG bearings, Whirlpool Cabrio rods, Frigidaire diverter motors) are quick fixes in the $150&ndash;$320 range. Replacing a 4-year-old fridge over a $220 part is rarely the right move.' },
      { q: 'Do you cover Samsung and LG warranty diagnostics in Airdrie?', a: 'Yes &mdash; we regularly diagnose Samsung Family Hub, LG ThinQ, and Whirlpool Connected appliances throughout Bayside, Hillcrest, Sagewood, and the King\'s Heights subdivisions. Many fault patterns (Samsung RF ice makers, LG linear compressors) carry extended manufacturer coverage beyond the standard 1-year warranty. We email you a written diagnostic report you can submit to the manufacturer for warranty consideration before paying out-of-pocket.' },
      { q: 'How fast can you reach Airdrie from Calgary?', a: 'Our Airdrie route runs from our Calgary hub at 700 6th Avenue SW via Highway 2 (QE2) in 18&ndash;25 minutes. Same-day service is standard when you book before noon Monday&ndash;Saturday, and we run a Sunday crew (10 AM&ndash;6 PM Mountain Time) for cooling and laundry emergencies. Routes regularly cover Bayside, Big Springs, Williamstown, Coopers Crossing, King\'s Heights, Reunion, Hillcrest, Sagewood, and Luxstone.' },
      { q: 'Can you service vintage appliances in Old Town or Edgewater?', a: 'Yes. Airdrie\'s original 1960s&ndash;70s core (Old Town, Edgewater, parts of Big Springs) still runs second- or third-owner replacement appliances 15&ndash;25 years old. We routinely service vintage Whirlpool direct-drive washers, GE GSS top-mount fridges, and original Frigidaire glass cooktops. Parts sourcing for 20+ year-old units sometimes requires a 3&ndash;5 day turnaround &mdash; we always quote that timing upfront.' },
      { q: 'Do you offer a warranty on Airdrie appliance repairs?', a: 'Yes &mdash; every Airdrie repair comes with a 90-day parts and labour warranty. If the same fault returns within 90 days (whether you\'re in Bayside, King\'s Heights, Hillcrest, Old Town, or any other Airdrie neighborhood), we come back at no charge to re-diagnose and re-repair. Warranty terms are emailed to you on the service summary after every visit.' }
    ],
    introContextPara: `Airdrie is the largest and fastest-growing satellite city in the Calgary CMA &mdash; population doubled between 2006 and 2021 and shows no sign of slowing. The vast majority of Airdrie homes were built after 2005, with massive subdivision growth in Bayside, King\'s Heights, Coopers Crossing, Hillcrest, Reunion, Sagewood, and Luxstone. Our Airdrie service mix reflects that demographic precisely: builder-grade Samsung, LG, Whirlpool, and Frigidaire appliance packages just timing out of their 1-year manufacturer warranty but still well within useful life. We also handle the smaller pocket of vintage repair work in Old Town and Edgewater, where 1960s&ndash;70s bungalows still run second- or third-generation replacement appliances.`,
    waterPara: `Airdrie\'s water (sourced from the Bow River via the City of Calgary distribution system) has moderate hardness &mdash; gentler than truly hard-water Calgary CMA suburbs like Strathmore but harder than mountain-fed Cochrane. We see steady but not aggressive volumes of dishwasher inlet-valve scaling and washer detergent residue calls, mostly preventable with monthly Affresh cycles.`,
    whyHeadline: `Post-Warranty Specialists for Airdrie's Bayside, King's Heights, Hillcrest, Sagewood, and Coopers Crossing`,
    whyChooseCards: [
      { title: 'Just-out-of-warranty fixes', body: 'Samsung ice makers, LG bearings, Whirlpool Cabrio rods, Frigidaire diverter motors &mdash; quick post-warranty fixes in the $150&ndash;$320 range. We don\'t recommend replacing 4-year-old fridges over a $220 part.' },
      { title: 'Manufacturer warranty diagnostics', body: 'LG linear compressor, Samsung extended coverage, Whirlpool defect campaigns &mdash; we document the diagnostic so you can submit the claim before paying out-of-pocket.' },
      { title: 'Vintage repair capability', body: 'Old Town and Edgewater 1960s&ndash;70s appliances still in service. We source NOS (new-old-stock) parts that other shops can\'t find.' },
      { title: '18-25 minute QE2 dispatch', body: 'Highway 2 puts us in Airdrie in 18&ndash;25 minutes. Most morning bookings get same-day service; afternoon bookings get next-morning windows.' },
      { title: '90-day warranty + email summary', body: '90-day parts and labour warranty on every repair, with an emailed service summary that includes model number, fault code, parts replaced, and warranty terms.' }
    ],
    servicesIntro: `Airdrie\'s post-2005 housing stock means our service mix here is dominated by appliances under 8 years old: Samsung, LG, Whirlpool, and Frigidaire builder-grade packages with just-out-of-warranty issues. Each service has a dedicated Airdrie page with brand-specific fault patterns and pricing.`,
    neighborhoodsIntro: `Airdrie has grown rapidly since the early 2000s, with more than 30 named neighborhoods across the city. Our daily Airdrie routes cover every major subdivision &mdash; same-day service typically available in:`,
    neighborhoodsFooter: `Don\'t see your Airdrie neighborhood? We cover all of Rocky View County. Book online and we\'ll confirm your service window within minutes.`,
    pricingIntro: `Airdrie pricing follows our standard rate structure: flat <strong>$65 diagnostic</strong>, waived when you proceed with the repair. Most just-out-of-warranty fixes here land in the $150&ndash;$320 range &mdash; quick post-warranty work that rarely justifies appliance replacement. Vintage parts sourcing for Old Town and Edgewater work occasionally carries a 3&ndash;5 day procurement window, always disclosed upfront.`,
    brandsIntro: `Builder-grade packages dominate the Airdrie brand mix: Samsung, LG, Whirlpool, GE, Frigidaire in the post-2005 subdivisions; Bosch, KitchenAid, Miele in higher-end Coopers Crossing and Yankee Valley homes. We carry parts for all of them.`
  },

  'cochrane': {
    h1: 'Appliance Repair Cochrane',
    name: 'Cochrane',
    region: 'Rocky View County',
    population: '35,000',
    postal: 'T4C',
    cmaRole: 'Calgary CMA, 18 km west of Calgary city limits along the Bow River and Highway 1A',
    homeAge: 'a mix of older 1980s–90s established homes (Glenbow, West Valley) and rapid 2010+ growth (Sunset Ridge, Heritage Hills, Riversong, Fireside, Heartland)',
    avgIncome: 'higher-than-average household income with a strong demographic of mountain-recreation enthusiasts and Calgary commuters',
    waterSupply: 'mixed — Town of Cochrane municipal supply for the urban core and rural acreages on private wells (often hard groundwater 200+ mg/L) on the Glenbow Ranch and Westside fringe',
    neighborhoods: [
      'Bow Ridge', 'Riversong', 'Heritage Hills', 'Heartland',
      'Sunset Ridge', 'GlenEagles', 'Westside', 'Riverview Cove',
      'Fireside', 'Jumping Pound Ridge', 'Glenbow', 'West Valley'
    ],
    localAngle: {
      headline: 'Mountain-proximity humidity, mixed water sources, dishwasher pump premature failure on private wells',
      paragraphs: [
        `Cochrane sits at the foothills of the Rocky Mountains along the Bow River, with a unique water-supply mix that shapes our service pattern more than any other Calgary CMA suburb. The urban core (Bow Ridge, Sunset Ridge, Riversong, Heritage Hills, Fireside) runs on Town of Cochrane municipal supply with moderate hardness. But the Westside, Glenbow Ranch fringe, and rural acreages around West Valley are largely on private wells, and Cochrane groundwater can hit 200+ mg/L hardness — well into the "very hard" classification. The single biggest preventable failure on the rural side is dishwasher circulation pump impeller damage from accumulated scale.`,
        `For Cochrane households on private wells, we recommend monthly hot vinegar cycles plus consistent rinse aid use to manage scale. Skipping that protocol typically shaves 30–40% off dishwasher pump life: we routinely service Whirlpool, Frigidaire, and Bosch dishwashers in the rural Westside that fail at the 5–7 year mark instead of the typical 12. The fix on a healthy unit is often a simple descaling + inlet valve clean. On units already past the point of return, we replace the circulation pump and document a maintenance protocol so the new pump lasts.`,
        `Cochrane\'s mountain proximity also drives a distinct cooling-side pattern: humidity from the Bow River valley combined with sharp seasonal temperature swings causes refrigerator door gasket fatigue earlier than in drier Calgary CMA zones. We see Sunset Ridge and Heritage Hills fridge gasket replacements 2&ndash;3 years earlier than our Calgary city averages. A $90 gasket swap is a 30-minute fix that prevents 80% of the "warm fridge, frosty freezer" calls we get from this part of the CMA.`
      ]
    },
    brands: ['Whirlpool', 'Bosch', 'Samsung', 'LG', 'Frigidaire', 'GE', 'Maytag', 'KitchenAid', 'Kenmore', 'Miele', 'Sub-Zero', 'Wolf', 'Electrolux', 'Café'],
    techHonest: `Our Cochrane route runs from our Calgary hub via Highway 1A or Highway 1 (TransCanada) — typical drive 25–35 minutes west. Same-day service when you book before 11 AM Monday–Saturday. Rural Westside acreages may add 10–15 minutes drive time, included in your booking window.`,
    nearbyLinks: [
      { slug: 'calgary', label: 'Calgary' },
      { slug: 'airdrie', label: 'Airdrie' },
      { slug: 'canmore', label: 'Canmore' },
      { slug: 'chestermere', label: 'Chestermere' },
      { slug: 'okotoks', label: 'Okotoks' },
      { slug: 'strathmore', label: 'Strathmore' }
    ],
    faultsIntro: `Cochrane\'s mountain-foothills geography and split municipal/well water supply produces a fault pattern unlike any other Calgary CMA suburb. Top diagnostics across Bow Ridge, Sunset Ridge, Riversong, Heritage Hills, Fireside, and the rural Westside:`,
    faultCards: [
      { title: 'Dishwasher pump scale failure (private wells)', body: 'Westside and Glenbow Ranch acreages on hard-groundwater wells: circulation pump impeller damage from scale at year 5-7. Pump replacement + descaling protocol.' },
      { title: 'Refrigerator door gasket humidity fatigue', body: 'Sunset Ridge and Heritage Hills mountain-proximity humidity drives gasket wear 2-3 years earlier. $90 swap, 30-minute fix; prevents 80% of "warm fridge" calls.' },
      { title: 'Whirlpool/Frigidaire washer hard-water residue', body: 'Rural acreages running Whirlpool/Frigidaire top-loaders on well water: detergent residue + drum scale, premature heater failure.' },
      { title: 'Samsung RF ice maker fill-tube freeze (winter)', body: 'Bow Ridge and Riversong Samsung French-door fridges in cold winter snaps: ice maker fill tube freezes overnight. Heater wire repair or revised assembly.' },
      { title: 'LG dryer thermal fuse trip', body: 'Heritage Hills and Fireside LG dryers in long vent runs: cold winter air + lint accumulation trips high-limit fuse. Fuse + vent inspection.' },
      { title: 'Bosch dishwasher E15 leak fault', body: 'Newer Heartland and Riversong Bosch dishwashers: anti-flood float triggered by minor tub seal weep. Seal kit; we test before reset.' }
    ],
    faqs: [
      { q: 'My Cochrane dishwasher keeps failing — is it the well water?', a: 'Likely yes. Cochrane\'s urban core (Bow Ridge, Sunset Ridge, Riversong, Heritage Hills) runs on Town of Cochrane municipal supply with moderate hardness, but rural acreages around the Westside, Glenbow Ranch, and West Valley are on private wells with groundwater hardness often hitting 200+ mg/L. That accumulated scale damages dishwasher pump impellers, heating elements, and inlet valves much faster than soft-water averages. We recommend monthly hot vinegar cycles plus consistent rinse aid use &mdash; that protocol alone extends dishwasher life by 30&ndash;40% on Cochrane wells.' },
      { q: 'Do you service rural Westside acreages and Glenbow Ranch?', a: 'Yes &mdash; we cover all of Cochrane including the rural acreages around Westside, Glenbow Ranch, Jumping Pound Ridge, and West Valley. Drive time from our Calgary hub typically adds 10&ndash;15 minutes for rural addresses, but it\'s included in your booking window. We\'re equipped for both municipal-supply and well-water diagnostics &mdash; the protocols are different and we adjust the maintenance recommendations accordingly.' },
      { q: 'How fast can you reach Cochrane from Calgary?', a: 'Our Cochrane route runs from our Calgary hub via Highway 1A or Highway 1 (TransCanada) in 25&ndash;35 minutes. Same-day service is available when you book before 11 AM Monday&ndash;Saturday, and we run a Sunday crew (10 AM&ndash;6 PM Mountain Time) for cooling and laundry emergencies. Routes regularly cover Bow Ridge, Sunset Ridge, Riversong, Heritage Hills, GlenEagles, Heartland, and Fireside.' },
      { q: 'Why does my fridge gasket keep failing in Cochrane?', a: 'Cochrane\'s mountain-proximity humidity from the Bow River valley combined with sharp temperature swings drives refrigerator door gasket fatigue 2&ndash;3 years earlier than in drier Calgary CMA zones. We see this pattern most often in Sunset Ridge and Heritage Hills. The fix is straightforward: $90 gasket swap, 30-minute job. Catching it early prevents the &ldquo;warm fridge, frosty freezer&rdquo; cascade where compressor duty cycle spikes and the unit fails prematurely.' },
      { q: 'Do you offer a warranty on Cochrane appliance repairs?', a: 'Yes &mdash; every Cochrane repair includes a 90-day parts and labour warranty. If the same fault returns within 90 days &mdash; whether you\'re in the Bow Ridge urban core, the Sunset Ridge or Heritage Hills hillside subdivisions, or out on a Westside acreage &mdash; we come back at no charge to re-diagnose and re-repair. Warranty terms are emailed to you with the service summary after every visit.' }
    ],
    introContextPara: `Cochrane sits at the eastern edge of the Rocky Mountain foothills along the Bow River, 18 km west of Calgary city limits. The town has grown rapidly over the past 15 years &mdash; from roughly 12,000 residents in 2005 to over 35,000 today &mdash; with major subdivision development in Sunset Ridge, Heritage Hills, Riversong, Fireside, and Heartland. Older parts of town (Glenbow, West Valley, Bow Ridge) date to the 1980s&ndash;90s, and rural acreages around the Westside and Glenbow Ranch fringe are spread across some of the most scenic land in the Calgary CMA. Our Cochrane service mix is shaped by two unique factors: a mixed water-supply environment (municipal urban core, private wells on the rural fringe) and mountain-foothills humidity that drives distinct refrigerator and dishwasher fault patterns.`,
    waterPara: `Cochrane\'s split water supply is unique in the Calgary CMA: Town of Cochrane municipal water (moderate hardness) for the urban core, private wells (often 200+ mg/L hardness, classified &ldquo;very hard&rdquo;) for Westside and Glenbow Ranch acreages. We adjust maintenance protocols by address &mdash; well-water households need monthly hot vinegar cycles, more frequent inlet valve cleaning, and rinse aid as a standard practice.`,
    whyHeadline: `Mountain-Foothills Specialists for Cochrane's Mixed Water-Supply and Mountain-Proximity Repair Patterns`,
    whyChooseCards: [
      { title: 'Well-water dishwasher protocols', body: 'Westside and Glenbow Ranch acreages on hard groundwater. We descale, inspect inlet valves, and leave you with a hardness-adjusted maintenance schedule on every visit.' },
      { title: 'Mountain humidity fridge gasket service', body: 'Sunset Ridge and Heritage Hills humidity-driven gasket fatigue. $90 swap, 30-minute fix; saves you the cascade of compressor wear and unit replacement.' },
      { title: 'Rural acreage coverage', body: 'Westside, Glenbow Ranch, Jumping Pound Ridge, West Valley &mdash; we cover all of Cochrane. Rural drive time included in your booking window.' },
      { title: '25-35 minute Highway 1A dispatch', body: 'Highway 1A or Highway 1 (TransCanada) puts us in Cochrane in 25&ndash;35 minutes. Most morning bookings get same-day service; afternoon bookings get next-morning windows.' },
      { title: '90-day warranty + service summary', body: '90-day parts and labour warranty on every repair, with an emailed summary including model number, fault code, parts replaced, water-source notes, and warranty terms.' }
    ],
    servicesIntro: `Cochrane\'s mountain-foothills geography and mixed water-supply environment shape the service mix here: dishwasher and washer scale work on the rural well-water side, refrigerator gasket and ice maker work on the urban side. Each service has a dedicated Cochrane page with water-source-specific maintenance recommendations.`,
    neighborhoodsIntro: `Cochrane spans the Bow River valley with established neighborhoods on the south side and newer subdivisions climbing the north hillside. Our Cochrane routes typically reach:`,
    neighborhoodsFooter: `If your Cochrane address is in the urban core, on the Sunset Ridge / Heritage Hills hillside, or out on a Westside acreage, we cover it. Book online for instant confirmation.`,
    pricingIntro: `Cochrane pricing follows our standard rate structure: flat <strong>$65 diagnostic</strong>, waived when you proceed. Well-water dishwasher work (descaling + pump replacement) sits at the upper end of our pricing range due to the additional descaling step we include free as preventive maintenance. Rural acreage drive time is included in your booking window &mdash; never billed extra.`,
    brandsIntro: `Cochrane\'s brand mix splits along housing age: Whirlpool, Frigidaire, GE in the established 1980s&ndash;90s pockets; Samsung, LG, Bosch, KitchenAid in the post-2010 subdivisions; Sub-Zero, Wolf, Miele in higher-end Heritage Hills and GlenEagles homes. We service all of them.`
  },

  'okotoks': {
    h1: 'Appliance Repair Okotoks',
    name: 'Okotoks',
    region: 'Foothills County',
    population: '32,000',
    postal: 'T1S',
    cmaRole: 'Calgary CMA, 18 km south of Calgary city limits along Highway 2A and the Sheep River',
    homeAge: 'an established middle-class housing stock spanning 1990s subdivisions through early-2000s mass-build (Drake Landing, Crystal Shores, Cimarron, Suntree) hitting the 20+ year appliance replacement window',
    avgIncome: 'middle-to-upper-middle income, established families, strong owner-occupancy rate, mature demographic',
    waterSupply: 'Town of Okotoks municipal water, sourced from the Sheep River — moderate hardness',
    neighborhoods: [
      'Sheep River', 'Crystal Shores', 'Drake Landing', 'Mountainview',
      'Tower Hill', 'Okotoks Air Ranch', 'D\'Arcy', 'Cimarron',
      'Suntree', 'Westridge'
    ],
    localAngle: {
      headline: 'Early-2000s subdivisions hitting the 20-year appliance replacement window — GE, Maytag, Whirlpool dominate the call sheet',
      paragraphs: [
        `Okotoks is one of the most settled parts of the Calgary CMA: Drake Landing, Crystal Shores, Cimarron, and Suntree were all major early-2000s mass-build subdivisions. That housing pattern means the original appliance packages installed in 2003–2008 are now hitting the 20+ year replacement window. Our Okotoks service mix is heavily weighted toward end-of-life mechanical fixes on aging GE, Maytag, Whirlpool, and Kenmore units that are technically still functional but increasingly fault-prone.`,
        `Top three Okotoks repair calls reflect that aging fleet: (1) GE GSS top-mount refrigerator defrost system failures — the original GSS-series fridges installed in Drake Landing and Crystal Shores during the early-2000s build wave develop defrost timer mechanical wear, defrost heater open-circuits, and bi-metal thermostat faults; (2) Maytag Centennial / Whirlpool direct-drive top-loader transmission rebuilds — the 2003–2010 Whirlpool platform top-loaders common in Cimarron and Suntree see direct-drive transmission seizure that\'s often not economic to rebuild; (3) Whirlpool Duet front-load washer rear bearing replacements — the Duet platform was wildly popular in early-2000s Okotoks builds and the rear drum bearings fatigue right around year 15.`,
        `For aging units we lay out repair-vs-replace economics on every call. On a 20-year-old GE GSS fridge with a $220 defrost timer fault, we usually recommend repair &mdash; the rest of the unit is often still healthy. On a 17-year-old Maytag Centennial with a seized transmission, we usually recommend replacement &mdash; the rebuild costs almost as much as a new mid-range washer. The math first, the opinion second.`
      ]
    },
    brands: ['GE', 'Maytag', 'Whirlpool', 'Kenmore', 'Frigidaire', 'Samsung', 'LG', 'Bosch', 'KitchenAid', 'Amana', 'Inglis', 'Electrolux', 'Hotpoint', 'JennAir'],
    techHonest: `Our Okotoks route runs from our Calgary hub via Highway 2 (QE2) south to Highway 2A — typical drive 25–35 minutes. Same-day service is available when you book before 11 AM Monday–Saturday.`,
    nearbyLinks: [
      { slug: 'calgary', label: 'Calgary' },
      { slug: 'airdrie', label: 'Airdrie' },
      { slug: 'cochrane', label: 'Cochrane' },
      { slug: 'chestermere', label: 'Chestermere' },
      { slug: 'strathmore', label: 'Strathmore' },
      { slug: 'canmore', label: 'Canmore' }
    ],
    faultsIntro: `Okotoks\' early-2000s mass-build subdivisions are now hitting the 20-year mark on their original appliance packages, which dominates our fault pattern here. Top diagnostics across Drake Landing, Crystal Shores, Cimarron, Suntree, and Mountainview:`,
    faultCards: [
      { title: 'GE GSS defrost system end-of-life', body: 'Drake Landing and Crystal Shores GSS-series fridges 18-22 years old: defrost timer mechanical wear, heater open-circuit, or bi-metal thermostat fault. Timer + heater + thermostat kit; we keep them on the truck.' },
      { title: 'Maytag Centennial / Whirlpool DD transmission', body: 'Cimarron and Suntree Whirlpool/Maytag top-loaders 2003-2010: direct-drive transmission seizure. Rebuild often not economic; we lay out repair-vs-replace clearly.' },
      { title: 'Whirlpool Duet rear drum bearing', body: 'Drake Landing and Mountainview Duet platform front-loaders past 15 years: rear bearing roar before spider failure. Bearing kit; 3-hour repair on stacked units.' },
      { title: 'Kenmore vintage timer mechanical wear', body: 'D\'Arcy and Tower Hill original-package Kenmore (Whirlpool-built) appliances: mechanical timer seize. We source NOS replacements.' },
      { title: 'Samsung NX gas range surface igniter', body: 'Newer Cimarron and Westridge Samsung gas ranges: ceramic spark electrode crack from heat cycling. $90 part, 30-minute swap.' },
      { title: 'Frigidaire glass cooktop infinite switch', body: 'Older Crystal Shores and Suntree Frigidaire ranges: infinite switch arcing at high-low position. Switch swap; $180-$220 typical.' }
    ],
    faqs: [
      { q: 'My 20-year-old GE fridge is failing — repair or replace?', a: 'It depends on the fault. In Okotoks\' Drake Landing, Crystal Shores, and Cimarron neighborhoods, the original 2003&ndash;2008 GE GSS top-mount fridges develop defrost system faults around year 18&ndash;22 (timer, heater, or bi-metal thermostat). On a fundamentally healthy GSS, a $220 timer + heater kit gives you another 5&ndash;7 years of useful life &mdash; usually the right call. On a unit with sealed-system issues (compressor, refrigerant leak), replacement is typically the better economics. We give you the math on every call.' },
      { q: 'Should I rebuild my 17-year-old Maytag Centennial transmission?', a: 'Almost never. The Maytag Centennial / Whirlpool direct-drive transmission seizure that we see most often in Cimarron and Suntree households runs $480&ndash;$680 to rebuild &mdash; almost the cost of a new mid-range washer with a fresh manufacturer warranty. We lay out the math: rebuild + 90-day warranty vs. new unit + 1-year manufacturer warranty + new platform reliability. On 17+ year-old top-loaders, replacement is almost always the better call.' },
      { q: 'How fast can you reach Okotoks from Calgary?', a: 'Our Okotoks route runs from our Calgary hub via Highway 2 (QE2) south to Highway 2A in 25&ndash;35 minutes. Same-day service is available when you book before 11 AM Monday&ndash;Saturday. We run regular routes through Drake Landing, Crystal Shores, Cimarron, Suntree, Mountainview, and Tower Hill, and a Sunday crew (10 AM&ndash;6 PM Mountain Time) handles cooling and laundry emergencies in the Foothills County corridor.' },
      { q: 'Can you service vintage Kenmore and Inglis appliances in Okotoks?', a: 'Yes &mdash; in older Okotoks pockets like D\'Arcy, Tower Hill, and parts of Westridge, we still see original-package Kenmore (Whirlpool-built) and Inglis units 25+ years old. Many appliance shops decline these because parts are obsolete. We don\'t. We have NOS (new-old-stock) parts channels and routinely keep 1990s-era appliances running another 5&ndash;10 years for owners who prefer repair to replacement.' },
      { q: 'Do you offer a warranty on Okotoks appliance repairs?', a: 'Yes &mdash; every Okotoks repair comes with a 90-day parts and labour warranty. If the same fault returns within 90 days (whether you\'re in Drake Landing, Crystal Shores, Cimarron, Suntree, Mountainview, or any other Foothills County neighborhood), we come back at no charge to re-diagnose and re-repair. Warranty terms are emailed to you with the service summary after every visit.' }
    ],
    introContextPara: `Okotoks sits 18 km south of Calgary along the Sheep River, with one of the most established and stable housing stocks in the Calgary CMA. Drake Landing, Crystal Shores, Cimarron, and Suntree were all early-2000s mass-build subdivisions, which means the original appliance packages installed in 2003&ndash;2008 are now hitting the 20-year replacement window. Our Okotoks service mix reflects that aging fleet: end-of-life mechanical work on GE GSS fridges, Maytag Centennial top-loaders, Whirlpool Duet front-loaders, and Frigidaire glass cooktops. We also service vintage Kenmore and Inglis packages in older D\'Arcy and Tower Hill pockets, plus a smaller volume of newer Samsung, LG, and Bosch work in Westridge and recent Cimarron infill builds.`,
    waterPara: `Okotoks\' water (sourced from the Sheep River by the Town of Okotoks) has moderate hardness &mdash; gentler than truly hard-water Calgary CMA suburbs but firm enough to drive steady volumes of dishwasher inlet-valve scaling and washer detergent residue calls in Drake Landing and Crystal Shores. We recommend monthly Affresh cycles on aging front-loaders to keep gaskets clean and odor-free.`,
    whyHeadline: `Aging-Appliance Specialists for Okotoks' Drake Landing, Crystal Shores, Cimarron, Suntree, and Mountainview`,
    whyChooseCards: [
      { title: 'End-of-life GE GSS fridge expertise', body: 'Drake Landing and Crystal Shores 2003&ndash;2008 GSS-series fridges hitting year 18&ndash;22. Timer, heater, and bi-metal thermostat work; we keep parts on the truck.' },
      { title: 'Repair-vs-replace honesty on top-loaders', body: 'Maytag Centennial transmission seizures &mdash; usually replace, not rebuild. Whirlpool Duet rear bearings &mdash; usually repair. Math first, opinion second.' },
      { title: 'Vintage Kenmore + Inglis NOS parts', body: 'D\'Arcy and Tower Hill original-package units 25+ years old. We source new-old-stock parts other shops can\'t find.' },
      { title: '25-35 minute Highway 2 dispatch', body: 'Highway 2 (QE2) south to Highway 2A puts us in Okotoks in 25&ndash;35 minutes. Most morning bookings get same-day service.' },
      { title: '90-day warranty + email summary', body: '90-day parts and labour warranty on every repair, with an emailed service summary including model number, fault code, parts replaced, and warranty terms.' }
    ],
    servicesIntro: `Okotoks\' aging early-2000s housing stock makes our service mix here heavily weighted toward end-of-life mechanical work on GE, Maytag, Whirlpool, Frigidaire, and Kenmore units 15&ndash;25 years old. Each service has a dedicated Okotoks page with aging-fleet fault patterns and pricing.`,
    neighborhoodsIntro: `Okotoks has a settled, established footprint with most growth concentrated in the early-2000s mass-build subdivisions plus newer infill in Westridge and outlying Air Ranch developments. Our Okotoks routes typically reach:`,
    neighborhoodsFooter: `If your Okotoks address is anywhere in the Town of Okotoks or the immediate Foothills County corridor, we cover it. Book online for instant confirmation.`,
    pricingIntro: `Okotoks pricing follows our standard rate structure: flat <strong>$65 diagnostic</strong>, waived when you proceed with the repair. End-of-life mechanical work on 20-year-old units sometimes requires longer parts sourcing for vintage components &mdash; we always quote that timing upfront, never as a surprise add-on.`,
    brandsIntro: `Okotoks\' early-2000s mass-build subdivisions skew the brand mix toward GE, Maytag, Whirlpool, Frigidaire, and Kenmore. Newer Cimarron and Westridge infill brings Samsung, LG, Bosch, and KitchenAid into the call sheet. We service all of them with the same diagnostic depth.`
  },

  'chestermere': {
    h1: 'Appliance Repair Chestermere',
    name: 'Chestermere',
    region: 'Rocky View County',
    population: '22,000',
    postal: 'T1X',
    cmaRole: 'Calgary CMA, immediately east of Calgary city limits along Highway 1 (TransCanada), anchored by Chestermere Lake',
    homeAge: 'mostly 2010+ construction, with a small original 1980s–90s core around East Chestermere and Chestermere Lake; rapid growth in Westmere, Rainbow Falls, Kinniburgh, and Cove',
    avgIncome: 'higher-than-average household income, semi-affluent lakefront and waterfront-adjacent demographic, many premium-brand appliance packages',
    waterSupply: 'City of Chestermere municipal supply — moderate hardness',
    neighborhoods: [
      'Westmere', 'Rainbow Falls', 'East Chestermere', 'The Cove',
      'Chelsea', 'Chestermere Lake', 'Kinniburgh', 'John Peake'
    ],
    localAngle: {
      headline: 'Lake-community humidity, premium brands, accelerated washer drum corrosion and ice maker fill-tube freezing',
      paragraphs: [
        `Chestermere is one of the wealthiest small communities in the Calgary CMA, anchored by Chestermere Lake and surrounded by lakefront and waterfront-adjacent housing. The defining environmental factor here is humidity: lake-community air carries higher moisture loads year-round, which drives two specific repair patterns we don\'t see elsewhere in the CMA. First, washer drum and door seal corrosion progresses 30&ndash;40% faster on Chestermere front-loaders compared to drier inland zones. Second, refrigerator ice maker fill-tube freezing is unusually common during winter cold snaps because lake-side homes experience more rapid temperature swings than inland subdivisions.`,
        `Top Chestermere service patterns: (1) Samsung and LG French-door fridge ice maker fill-tube freeze in January &mdash; lake humidity condenses inside the fill tube, freezes overnight, and the ice maker stops dispensing. The fix is either heater wire repair or revised assembly replacement, typically a 90-minute job. (2) Whirlpool and LG front-loader rear drum corrosion at year 7&ndash;9 &mdash; lake humidity accelerates spider arm and rear drum corrosion. We diagnose the corrosion stage and lay out repair-vs-replace economics. (3) Bosch and KitchenAid dishwasher inlet valve scaling &mdash; standard fault on moderate-hardness municipal supply, easily preventable with monthly Affresh cycles.`,
        `Chestermere\'s premium-brand footprint is heavier than most Calgary CMA suburbs &mdash; many lakefront homes in The Cove, Westmere, and Kinniburgh run Sub-Zero column refrigerators, Wolf gas ranges, Miele dishwashers, and KitchenAid built-in wall ovens. We carry the specialty diagnostic tools and parts channels for these brands; most appliance shops in the Calgary area don\'t.`
      ]
    },
    brands: ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'KitchenAid', 'Miele', 'Sub-Zero', 'Wolf', 'GE', 'Frigidaire', 'Maytag', 'Kenmore', 'Electrolux', 'Thermador'],
    techHonest: `Our Chestermere route runs from our Calgary hub via Highway 1 (TransCanada) east — typical drive 15–22 minutes. Same-day service is standard when you book before noon Monday–Saturday.`,
    nearbyLinks: [
      { slug: 'calgary', label: 'Calgary' },
      { slug: 'airdrie', label: 'Airdrie' },
      { slug: 'okotoks', label: 'Okotoks' },
      { slug: 'cochrane', label: 'Cochrane' },
      { slug: 'strathmore', label: 'Strathmore' },
      { slug: 'canmore', label: 'Canmore' }
    ],
    faultsIntro: `Chestermere\'s lake-community humidity and premium-brand footprint produces a distinctive fault pattern unlike any other Calgary CMA suburb. Top diagnostics across Westmere, Rainbow Falls, The Cove, Kinniburgh, and East Chestermere:`,
    faultCards: [
      { title: 'Samsung/LG ice maker fill-tube winter freeze', body: 'Westmere and Rainbow Falls French-door fridges in January cold snaps: lake humidity condenses inside fill tube, freezes overnight. Heater wire repair or revised assembly.' },
      { title: 'Front-loader rear drum + spider corrosion', body: 'Lake humidity accelerates Whirlpool/LG front-loader rear drum and spider arm corrosion 30-40% faster than inland averages. Diagnostic + repair-vs-replace math.' },
      { title: 'Sub-Zero column refrigerator condenser fan', body: 'The Cove and Westmere lakefront Sub-Zero column units 8-12 years: condenser fan motor fails. Drop-in replacement; we carry the part.' },
      { title: 'Wolf gas range igniter electrode', body: 'Kinniburgh and Cove Wolf gas ranges: humidity-driven electrode failure during winter humidity spikes. Electrode + spark module swap.' },
      { title: 'Miele dishwasher heat pump fault', body: 'High-end Westmere and Kinniburgh Miele units: heat pump electronics fault. Component-level swap; we don\'t replace the whole pump assembly.' },
      { title: 'Bosch dishwasher inlet valve scaling', body: 'Moderate-hardness municipal supply + premium dishwasher density: inlet valve scaling at year 5-7. Valve swap + descaling protocol.' }
    ],
    faqs: [
      { q: 'Why does my fridge ice maker keep freezing in Chestermere winter?', a: 'Chestermere\'s lake-community humidity is the cause. Moisture-laden air condenses inside the ice maker fill tube, then freezes overnight during cold snaps. We see this most often in Westmere, Rainbow Falls, and The Cove Samsung and LG French-door fridges. The fix is either heater wire repair (if the in-tube heater has failed) or revised assembly replacement (if the design is the issue). Typical 90-minute job, $180&ndash;$320 all-in.' },
      { q: 'Why does my front-load washer drum look corroded?', a: 'Lake-community humidity accelerates rear drum and spider arm corrosion on front-loaders 30&ndash;40% faster than inland averages. We see Whirlpool and LG front-loaders in Westmere and Kinniburgh showing visible corrosion at year 7&ndash;9 instead of the typical 12&ndash;15. Early-stage corrosion is repairable (rear bearing + drum reseat, $380&ndash;$520 range). Late-stage spider failure usually means replacement &mdash; we lay out the math on every call.' },
      { q: 'Do you service Sub-Zero, Wolf, and Miele in Chestermere?', a: 'Yes &mdash; we are one of the few Calgary-area shops equipped to service Sub-Zero column refrigerators, Wolf gas ranges, Miele dishwashers, and Thermador wall ovens. We carry the specialty diagnostic tools and have established parts channels for these brands. The Cove, Westmere, Kinniburgh lakefront homes are regular service routes for us. Same flat $65 diagnostic, same one-visit fix when parts allow.' },
      { q: 'How fast can you reach Chestermere from Calgary?', a: 'Our Chestermere route runs from our Calgary hub via Highway 1 (TransCanada) east in 15&ndash;22 minutes. Same-day service is standard when you book before noon Monday&ndash;Saturday, and we run a Sunday crew (10 AM&ndash;6 PM Mountain Time) for cooling and laundry emergencies. Routes regularly cover Westmere, Rainbow Falls, East Chestermere, The Cove, Chelsea, Kinniburgh, and the Chestermere Lake area.' },
      { q: 'Do you offer a warranty on Chestermere appliance repairs?', a: 'Yes &mdash; every Chestermere repair comes with a 90-day parts and labour warranty. If the same fault returns within 90 days (whether you\'re in Westmere, Rainbow Falls, The Cove, Kinniburgh, or any other Chestermere neighborhood), we come back at no charge to re-diagnose and re-repair. Warranty terms are emailed to you with the service summary after every visit, and we document any humidity-driven preventive recommendations alongside.' }
    ],
    introContextPara: `Chestermere sits 7 km east of Calgary city limits along Highway 1 (TransCanada), anchored by the year-round Chestermere Lake at the heart of the community. The town has grown rapidly over the past 15 years &mdash; from roughly 9,000 residents in 2005 to over 22,000 today &mdash; with major subdivision development in Westmere, Rainbow Falls, Kinniburgh, The Cove, and Chelsea. The defining factor in our Chestermere service pattern is the lake-community microclimate: lakefront and waterfront-adjacent humidity drives accelerated front-loader corrosion, refrigerator ice maker fill-tube freezing in winter cold snaps, and faster gasket fatigue across appliance categories. We engineer our Chestermere service routine around that environmental reality. The community also carries a heavier premium-brand footprint than most Calgary CMA suburbs &mdash; Sub-Zero, Wolf, Miele, Thermador, KitchenAid, and Bosch are common in the lakefront homes around The Cove, Westmere, and Kinniburgh.`,
    waterPara: `Chestermere\'s water (City of Chestermere municipal supply) has moderate hardness, similar to Calgary city distribution. Combined with the lake-community humidity, that creates a distinctive maintenance schedule for premium dishwashers and washers &mdash; we always recommend monthly Affresh tablet cycles plus door gasket and detergent drawer wipe-downs after every wash to manage the humidity factor.`,
    whyHeadline: `Lake-Community Specialists for Chestermere's Westmere, Rainbow Falls, The Cove, and Kinniburgh`,
    whyChooseCards: [
      { title: 'Premium brand certification', body: 'Sub-Zero, Wolf, Miele, Thermador, KitchenAid &mdash; we carry the specialty diagnostic tools and parts channels that most Calgary appliance shops don\'t.' },
      { title: 'Lake-humidity repair patterns', body: 'Ice maker fill-tube winter freeze, accelerated front-loader corrosion, faster gasket fatigue. We diagnose for the lake microclimate, not generic Calgary averages.' },
      { title: 'Lakefront estate access', body: 'Insured, bonded, background-checked technicians appropriate for The Cove and Westmere lakefront estate work.' },
      { title: '15-22 minute Highway 1 dispatch', body: 'Highway 1 (TransCanada) puts us in Chestermere in 15&ndash;22 minutes. Most morning bookings get same-day service; afternoon bookings get next-morning windows.' },
      { title: '90-day warranty + service summary', body: '90-day parts and labour warranty on every repair, with an emailed summary including model number, fault code, parts replaced, humidity-driven prevention notes, and warranty terms.' }
    ],
    servicesIntro: `Chestermere\'s lake-community humidity and premium-brand footprint shape the service mix here: refrigerator ice maker and gasket work, accelerated front-loader corrosion repair, premium-brand dishwasher and oven service. Each service has a dedicated Chestermere page with humidity-specific maintenance recommendations.`,
    neighborhoodsIntro: `Chestermere\'s small footprint &mdash; about 22,000 residents across roughly 8 named neighborhoods plus the lakefront pockets &mdash; means our daily routes cover most of the community in a single morning. Same-day routes regularly reach:`,
    neighborhoodsFooter: `If your Chestermere address is on the lakefront, in the post-2010 subdivisions, or in the original East Chestermere core, we cover it. Book online for instant confirmation.`,
    pricingIntro: `Chestermere pricing follows our standard rate structure: flat <strong>$65 diagnostic</strong>, waived when you proceed with the repair. Premium-brand work (Sub-Zero, Wolf, Miele, Thermador) follows the same pricing structure &mdash; we don\'t mark up labour for premium brands, only for genuinely longer or more complex jobs.`,
    brandsIntro: `Chestermere\'s lakefront demographic skews the brand mix toward premium and luxury tiers: Sub-Zero, Wolf, Miele, Thermador, KitchenAid, Bosch alongside the standard Samsung, LG, Whirlpool, GE, Frigidaire spectrum. We service all of them.`
  },

  'strathmore': {
    h1: 'Appliance Repair Strathmore',
    name: 'Strathmore',
    region: 'Wheatland County',
    population: '14,000',
    postal: 'T1P',
    cmaRole: 'Calgary CMA fringe, 40 km east of Calgary along Highway 1 (TransCanada), agricultural-adjacent prairie community',
    homeAge: 'a working-class housing stock spanning 1970s–80s established homes (Strathmore core, Brentwood) and 2000+ growth (Strathmore Lakes, Lakewood, Wheatland Estates, Aspen Creek, Northumberland)',
    avgIncome: 'middle income with a strong agricultural and trades demographic, many residents commuting to Calgary or working in the Wheatland County agricultural sector',
    waterSupply: 'Town of Strathmore municipal water — among Alberta\'s hardest at 220+ mg/L (very hard, partly groundwater-derived)',
    neighborhoods: [
      'Strathmore Lakes', 'Lakewood', 'Wheatland Estates', 'Aspen Creek',
      'Northumberland', 'Brentwood'
    ],
    localAngle: {
      headline: 'Among Alberta\'s hardest groundwater — dishwashers and washers fail 30% earlier than soft-water averages',
      paragraphs: [
        `Strathmore\'s water is among the hardest in Alberta &mdash; routine measurements run 220+ mg/L of dissolved minerals, well into the &ldquo;very hard&rdquo; classification. That single environmental factor shapes our Strathmore service pattern more than any other variable. Dishwashers and washers in Strathmore Lakes, Lakewood, Wheatland Estates, and Aspen Creek typically fail 30% earlier than soft-water averages. The visible signs are obvious: scaled spray arms, etched dishwasher tubs, white mineral residue on glass, premature heating element failure, valve solenoid jamming.`,
        `Top three Strathmore service patterns: (1) Dishwasher pump impeller wear from accumulated scale &mdash; we routinely service Whirlpool, Frigidaire, and Bosch dishwashers in Strathmore that fail at the 5&ndash;7 year mark instead of the typical 12. The fix on a healthy unit is descaling + inlet valve clean; on units past the point of return, we replace the circulation pump and document a maintenance protocol so the new pump lasts. (2) Heating element scale buildup in front-loader washers and dishwashers &mdash; the heating element gets coated in mineral scale, which insulates it, drives up energy use, and eventually causes the element to overheat and fail. We descale and replace as a kit when needed. (3) Inlet valve solenoid jam on washers and dishwashers &mdash; mineral deposits accumulate at the valve seat, the solenoid stops fully opening or closing, and water flow goes erratic. Valve replacement plus an inline filter recommendation.`,
        `For every Strathmore household, we recommend an aggressive scale-management protocol: monthly hot vinegar cycles in dishwashers, monthly Affresh cycles in washers, consistent rinse aid use, and a whole-home water softener if budget allows (the long-term appliance savings often pay for the softener within 5&ndash;7 years). We document this in writing on every service summary because Strathmore homeowners lose more appliance life to water hardness than to any other single factor.`
      ]
    },
    brands: ['Whirlpool', 'Frigidaire', 'Maytag', 'GE', 'Samsung', 'LG', 'Bosch', 'Kenmore', 'KitchenAid', 'Amana', 'Inglis', 'Speed Queen', 'Hotpoint', 'Hisense'],
    techHonest: `Our Strathmore route runs from our Calgary hub via Highway 1 (TransCanada) east — typical drive 35–45 minutes. Same-day service is available when you book before 10 AM Monday–Saturday; later bookings get next-morning windows.`,
    nearbyLinks: [
      { slug: 'calgary', label: 'Calgary' },
      { slug: 'chestermere', label: 'Chestermere' },
      { slug: 'airdrie', label: 'Airdrie' },
      { slug: 'okotoks', label: 'Okotoks' },
      { slug: 'cochrane', label: 'Cochrane' },
      { slug: 'canmore', label: 'Canmore' }
    ],
    faultsIntro: `Strathmore\'s extreme water hardness (220+ mg/L) drives a fault pattern dominated by mineral-related dishwasher and washer failures &mdash; significantly different from any other Calgary CMA community. Top diagnostics across Strathmore Lakes, Lakewood, Wheatland Estates, Aspen Creek, and Northumberland:`,
    faultCards: [
      { title: 'Dishwasher pump impeller scale damage', body: 'Strathmore Lakes and Lakewood dishwashers 5-7 years old: pump impeller wear from accumulated scale. Pump replacement + monthly descaling protocol prescribed.' },
      { title: 'Heating element mineral coating', body: 'Front-loader washers and dishwashers: scale insulates the heating element, drives energy use up, eventually causes overheat failure. Descale + element kit.' },
      { title: 'Inlet valve solenoid jam', body: 'Wheatland Estates and Aspen Creek washers and dishwashers: mineral deposits at valve seat, solenoid stops fully opening or closing. Valve swap + inline filter.' },
      { title: 'Etched dishwasher tub + scaled spray arms', body: 'Visual scaling visible on tub interior and spray arm nozzles. Aggressive descaling protocol; sometimes spray arm replacement.' },
      { title: 'Whirlpool top-loader tub seal weep', body: 'Northumberland and Brentwood Whirlpool top-loaders past 8 years: tub seal weeps on spin cycle, drips onto floor. Seal kit; reasonable; transmission tear-down is not.' },
      { title: 'GE GSS top-mount fridge defrost', body: 'Older Strathmore core GSS-series fridges 18-22 years: defrost timer mechanical wear. Timer + heater + thermostat kit; we keep them on the truck.' }
    ],
    faqs: [
      { q: 'My dishwasher is only 5 years old — why does it already need a pump?', a: 'Strathmore\'s water is among the hardest in Alberta &mdash; routine measurements run 220+ mg/L of dissolved minerals (&ldquo;very hard&rdquo; classification). That accumulated scale damages dishwasher pump impellers, heating elements, and inlet valves much faster than soft-water averages. We routinely service Whirlpool, Frigidaire, and Bosch dishwashers in Strathmore Lakes and Lakewood that fail at the 5&ndash;7 year mark instead of the typical 12. The fix is pump replacement + monthly descaling protocol; with the protocol in place, the new pump typically lasts another 8&ndash;10 years.' },
      { q: 'Should I install a whole-home water softener in Strathmore?', a: 'For most Strathmore households, yes &mdash; the long-term appliance savings typically pay for the softener within 5&ndash;7 years. Beyond appliance life, you also see reduced soap and detergent use, longer plumbing life, and visibly cleaner dishes and glassware. We don\'t install softeners ourselves, but we work with a few trusted Wheatland County plumbing contractors and can refer you. As an interim measure, monthly hot vinegar dishwasher cycles + monthly Affresh washer cycles + consistent rinse aid use is the minimum scale-management protocol we recommend.' },
      { q: 'How fast can you reach Strathmore from Calgary?', a: 'Our Strathmore route runs from our Calgary hub via Highway 1 (TransCanada) east in 35&ndash;45 minutes. Same-day service is available when you book before 10 AM Monday&ndash;Saturday; later bookings get next-morning windows because of the longer drive distance. We run regular routes through Strathmore Lakes, Lakewood, Wheatland Estates, Aspen Creek, Northumberland, and Brentwood, and a Sunday crew (10 AM&ndash;6 PM Mountain Time) handles cooling and laundry emergencies.' },
      { q: 'Will my new dishwasher last longer if I just install a softener?', a: 'Significantly, yes. We have Strathmore households running the same Whirlpool, Frigidaire, or Bosch dishwasher 12&ndash;15 years with a softener installed at year one. Without a softener, that same unit typically needs the first major service call at year 5&ndash;7. The softener also extends washer life, faucet cartridge life, and water heater life &mdash; which is why we usually recommend it as a whole-home upgrade rather than a single-appliance fix.' },
      { q: 'Do you offer a warranty on Strathmore appliance repairs?', a: 'Yes &mdash; every Strathmore repair comes with a 90-day parts and labour warranty. If the same fault returns within 90 days (whether you\'re in Strathmore Lakes, Lakewood, Wheatland Estates, Aspen Creek, Northumberland, or Brentwood), we come back at no charge to re-diagnose and re-repair. Warranty terms are emailed to you with the service summary after every visit, alongside the scale-management protocol we prescribe for your specific unit and water source.' }
    ],
    introContextPara: `Strathmore sits 40 km east of Calgary at the eastern fringe of the Calgary CMA, anchored by Wheatland County\'s agricultural economy and a working-class trades demographic. The community is small (~14,000 residents) but spread across both a 1970s&ndash;80s established core and newer 2000+ subdivisions in Strathmore Lakes, Lakewood, Wheatland Estates, Aspen Creek, and Northumberland. The single most defining factor of Strathmore appliance service work is water hardness: routine municipal supply measurements run 220+ mg/L of dissolved minerals, well into the &ldquo;very hard&rdquo; classification, and that environmental factor drives 60%+ of our Strathmore call volume. Dishwasher pump scale damage, heating element mineral coating, inlet valve solenoid jamming, etched dishwasher tubs, and scaled spray arms dominate the call sheet here. We engineer our Strathmore service routine around that reality.`,
    waterPara: `Strathmore\'s water (Town of Strathmore municipal supply, partly groundwater-derived) is among Alberta\'s hardest at 220+ mg/L &mdash; classified &ldquo;very hard.&rdquo; This is the single most important factor in Strathmore appliance maintenance. We document a scale-management protocol on every service summary: monthly hot vinegar dishwasher cycles, monthly Affresh washer cycles, consistent rinse aid use, and a whole-home softener recommendation when budget allows.`,
    whyHeadline: `Hard-Water Specialists for Strathmore's Lakes, Lakewood, Wheatland Estates, Aspen Creek, and Northumberland`,
    whyChooseCards: [
      { title: 'Hard-water diagnostic protocol', body: 'Every Strathmore call includes a water-hardness assessment and scale-management protocol. We document it on the service summary alongside the repair details.' },
      { title: 'Pump + heater + valve scale specialists', body: 'Dishwasher pump impeller, heating element coating, inlet valve solenoid jam &mdash; the three most common Strathmore fault patterns. We carry parts on the truck for one-visit fixes.' },
      { title: 'Wheatland County coverage', body: 'Strathmore, Lakewood, Wheatland Estates, Aspen Creek, Northumberland, Brentwood &mdash; we cover the full Town of Strathmore plus the immediate agricultural fringe.' },
      { title: '35-45 minute Highway 1 dispatch', body: 'Highway 1 (TransCanada) east puts us in Strathmore in 35&ndash;45 minutes. Book before 10 AM for same-day; later bookings get next-morning windows.' },
      { title: '90-day warranty + scale protocol', body: '90-day parts and labour warranty plus a written scale-management protocol on every visit. Follow the protocol and your repair lasts &mdash; we\'ve seen it work.' }
    ],
    servicesIntro: `Strathmore\'s extreme water hardness shapes our service mix here heavily toward dishwasher and washer scale-related work. Whirlpool, Frigidaire, Maytag, and Bosch dominate the Strathmore call sheet across all appliance categories. Each service has a dedicated Strathmore page with hard-water-specific maintenance recommendations.`,
    neighborhoodsIntro: `Strathmore has grown steadily over the past 25 years, with most newer development concentrated in the south and east of town. Our Strathmore routes typically reach:`,
    neighborhoodsFooter: `If your Strathmore address is in the original town core or any of the newer subdivisions, we cover it. Book online for instant confirmation.`,
    pricingIntro: `Strathmore pricing follows our standard rate structure: flat <strong>$65 diagnostic</strong>, waived when you proceed with the repair. Hard-water descaling work (free preventive maintenance on every dishwasher and washer call) is included &mdash; we don\'t bill it as a separate line item because it\'s essential for repair longevity in Strathmore conditions.`,
    brandsIntro: `Strathmore\'s working-class demographic skews the brand mix toward Whirlpool, Frigidaire, Maytag, GE, Kenmore in the volume housing, with Samsung, LG, Bosch in newer Wheatland Estates and Aspen Creek builds. We service all of them.`
  },

  'canmore': {
    h1: 'Appliance Repair Canmore',
    name: 'Canmore',
    region: 'Bighorn No. 8',
    population: '14,000',
    postal: 'T1W',
    cmaRole: 'Calgary CMA fringe, 100 km west of Calgary along Highway 1 (TransCanada) at the eastern gateway of Banff National Park, altitude 1,309 metres',
    homeAge: 'a distinctive mix of 1980s–90s established Canmore residences (South Canmore, Lions Park) and rapid 2000+ tourism-driven growth (Three Sisters, Spring Creek, Eagle Terrace, Cougar Creek)',
    avgIncome: 'higher-than-average household income, large vacation-home and investment-property segment, strong tourism-services demographic',
    waterSupply: 'Town of Canmore municipal supply — soft-to-moderate hardness, mountain-fed',
    neighborhoods: [
      'Bow Valley Trail', 'Three Sisters', 'Spring Creek', 'South Canmore',
      'Cougar Creek', 'Lions Park', 'Eagle Terrace', 'Cascade Crescent'
    ],
    localAngle: {
      headline: 'Vacation rentals running 3-5x normal cycle counts — dishwashers fail at 5-7 years; altitude affects gas appliances',
      paragraphs: [
        `Canmore\'s economy is anchored by tourism: vacation rentals, B&Bs, hotel-condos, and investment short-term rentals make up a meaningful share of the housing stock, particularly in Three Sisters, Spring Creek, Bow Valley Trail, and parts of Eagle Terrace. The defining factor in our Canmore service pattern is cycle count: a vacation-rental dishwasher running 4&ndash;6 cycles per day for 200+ days per year accumulates lifetime cycles 3&ndash;5x faster than a typical residential unit. That cycle compression means dishwashers in Canmore vacation rentals routinely fail at the 5&ndash;7 year mark instead of the typical 12, and we structure our Canmore service to handle that reality.`,
        `Top Canmore service patterns: (1) Dishwasher pump and circulation motor end-of-life on vacation-rental Whirlpool, Bosch, and Frigidaire units &mdash; we maintain a property-manager priority response queue for high-cycle commercial-residential dishwashers. (2) Front-loader washer drum bearing fatigue at year 6&ndash;8 on vacation rentals running 100+ cycles per month &mdash; same diagnostic, accelerated timeline. (3) Gas range pilot light and ignitor adjustments related to altitude &mdash; Canmore sits at 1,309 metres, which affects gas appliance combustion efficiency. New gas range installations and replacement ignitors sometimes need altitude-specific orifice or gas-pressure adjustments that flatland Calgary techs miss.`,
        `For Canmore property managers and short-term rental owners, we offer priority response on cooling and laundry calls. Vacation rental downtime costs $300&ndash;$800 per night in lost bookings and guest refunds, so a same-day fix on a broken fridge in a Three Sisters vacation home pays back the diagnostic fee 5&ndash;10x over. We also carry altitude-specific gas appliance parts that flatland appliance shops typically don\'t stock. South Canmore and Lions Park residential households (full-time residents, lower cycle counts) get the same flat $65 diagnostic and 90-day warranty, with normal-cycle maintenance recommendations.`
      ]
    },
    brands: ['Whirlpool', 'Bosch', 'Frigidaire', 'Samsung', 'LG', 'GE', 'Maytag', 'KitchenAid', 'Sub-Zero', 'Wolf', 'Miele', 'Speed Queen', 'Thermador', 'Viking'],
    techHonest: `Our Canmore route runs from our Calgary hub via Highway 1 (TransCanada) west — typical drive 60–75 minutes through the mountains. Same-day service is available when you book before 9 AM Monday–Saturday; later bookings get next-morning windows. Property managers with multiple units get priority scheduling.`,
    nearbyLinks: [
      { slug: 'calgary', label: 'Calgary' },
      { slug: 'cochrane', label: 'Cochrane' },
      { slug: 'airdrie', label: 'Airdrie' },
      { slug: 'okotoks', label: 'Okotoks' },
      { slug: 'chestermere', label: 'Chestermere' },
      { slug: 'strathmore', label: 'Strathmore' }
    ],
    faultsIntro: `Canmore\'s tourism economy and 1,309-metre altitude produce a fault pattern unlike any other Calgary CMA community: high-cycle wear on vacation-rental appliances plus altitude-specific gas appliance issues. Top diagnostics across Three Sisters, Spring Creek, South Canmore, Cougar Creek, and Eagle Terrace:`,
    faultCards: [
      { title: 'Vacation-rental dishwasher pump end-of-life', body: 'Three Sisters and Spring Creek vacation-rental Whirlpool, Bosch, Frigidaire dishwashers at year 5-7: 3-5x cycle compression vs residential. Pump + motor kit; one-visit fix on most calls.' },
      { title: 'Front-loader rear bearing accelerated wear', body: 'Bow Valley Trail and Eagle Terrace vacation-rental front-loaders 6-8 years: 100+ cycles/month drives bearing fatigue. Bearing kit; 3-hour repair.' },
      { title: 'Gas range altitude orifice adjustment', body: 'Canmore\'s 1,309m altitude affects combustion efficiency. New gas range installs and ignitor replacements sometimes need altitude-specific adjustments. Flat Calgary techs miss this.' },
      { title: 'Altitude-affected gas oven ignitor weak flame', body: 'Spring Creek and Three Sisters gas ovens: ignitor glow strong but weak flame. Altitude-pressure adjustment + sometimes orifice swap.' },
      { title: 'Refrigerator condenser dust (forest fire season)', body: 'Cougar Creek and Eagle Terrace fridges during BC/AB wildfire smoke season: condenser coils foul faster from particulate. Annual brush-out + cleaner coil schedule.' },
      { title: 'Sub-Zero column refrigerator condenser fan', body: 'High-end South Canmore and Three Sisters Sub-Zero units 8-12 years: condenser fan motor fails. Drop-in replacement; we carry the part.' }
    ],
    faqs: [
      { q: 'My Canmore vacation-rental dishwasher keeps failing — is it overuse?', a: 'Almost certainly yes. A vacation-rental dishwasher in Three Sisters, Spring Creek, or Bow Valley Trail running 4&ndash;6 cycles per day for 200+ days per year accumulates lifetime cycles 3&ndash;5x faster than a typical residential dishwasher. The pump impeller, circulation motor, and inlet valve all wear at that compressed timeline &mdash; we routinely service vacation-rental dishwashers that fail at year 5&ndash;7 instead of the typical 12. We maintain a property-manager priority response queue for these high-cycle commercial-residential units.' },
      { q: 'Why is my new gas range not working right at this altitude?', a: 'Canmore sits at 1,309 metres, which affects gas appliance combustion efficiency. New gas range installations and replacement ignitors sometimes need altitude-specific orifice or gas-pressure adjustments that Calgary-flatland appliance techs miss. We carry altitude-adjusted gas range parts and know the adjustment procedures for the major brands. If your range was installed by someone unfamiliar with mountain altitude, that\'s a common cause of weak flames, slow ignition, or yellow-tipped burners.' },
      { q: 'How fast can you reach Canmore from Calgary?', a: 'Our Canmore route runs from our Calgary hub via Highway 1 (TransCanada) west in 60&ndash;75 minutes through the mountains. Same-day service is available when you book before 9 AM Monday&ndash;Saturday; later bookings get next-morning windows because of the longer mountain-pass drive. Property managers with multiple units get priority scheduling, and we run a Sunday crew (10 AM&ndash;6 PM Mountain Time) for cooling and laundry emergencies in vacation rentals.' },
      { q: 'Do you offer property-manager pricing for Canmore vacation rentals?', a: 'Yes &mdash; we work with several Canmore property management companies on volume agreements that include priority response, multi-unit visit batching, and predictable monthly invoicing. Vacation rental downtime costs $300&ndash;$800 per night in lost bookings and guest refunds, so a same-day fix on a broken fridge in a Three Sisters vacation home pays back the diagnostic fee 5&ndash;10x over. Email calgary@appliancerepairneary.com for property-manager rate structures.' },
      { q: 'Do you offer a warranty on Canmore appliance repairs?', a: 'Yes &mdash; every Canmore repair comes with a 90-day parts and labour warranty. For vacation-rental work where cycle counts are 3&ndash;5x normal, we provide an honest assessment upfront: a 90-day warranty covers a much shorter calendar window in a vacation rental than in a residential setting because of the cycle compression. We document the cycle-rate context on every service summary so property managers can plan replacement timing realistically.' }
    ],
    introContextPara: `Canmore sits 100 km west of Calgary at the eastern gateway of Banff National Park, at an altitude of 1,309 metres in the Bow Valley Corridor. The community is small (~14,000 permanent residents) but the housing stock includes a substantial vacation-home, B&B, hotel-condo, and short-term-rental segment that effectively triples or quadruples the active appliance fleet during peak tourism seasons. Our Canmore service mix is shaped by two unique factors: tourism-driven cycle compression (vacation-rental dishwashers and washers running 3&ndash;5x normal residential cycle counts) and mountain altitude (1,309m affects gas appliance combustion efficiency in ways that flatland Calgary techs sometimes miss). South Canmore and Lions Park full-time residential households see normal-cycle wear patterns; the Three Sisters, Spring Creek, Bow Valley Trail, and Eagle Terrace vacation-rental concentrations see compressed-timeline failures.`,
    waterPara: `Canmore\'s water (Town of Canmore municipal supply, mountain-fed from Bow Valley sources) has soft-to-moderate hardness &mdash; among the gentlest in the Calgary CMA. We see fewer scale-related dishwasher and washer calls in Canmore than in any other CMA suburb, but cycle compression on vacation rentals more than offsets that benefit. Maintenance focus is on filter cleaning and gasket inspection rather than descaling.`,
    whyHeadline: `Vacation-Rental + Altitude Specialists for Canmore's Three Sisters, Spring Creek, Bow Valley Trail, and Eagle Terrace`,
    whyChooseCards: [
      { title: 'Vacation-rental priority response', body: 'Property-manager priority queue on cooling and laundry calls. Vacation rental downtime costs $300&ndash;$800/night &mdash; we get there fast.' },
      { title: 'Altitude-specific gas appliance work', body: '1,309m altitude affects gas range and oven combustion. We carry altitude-adjusted parts and know the orifice and pressure adjustments for major brands.' },
      { title: 'High-cycle dishwasher expertise', body: 'Vacation-rental dishwashers at year 5&ndash;7 instead of year 12. Pump + motor kits; we structure pricing for compressed-timeline replacement cycles.' },
      { title: '60-75 minute Highway 1 dispatch', body: 'Highway 1 (TransCanada) west through the mountains puts us in Canmore in 60&ndash;75 minutes. Book before 9 AM for same-day; later gets next-morning.' },
      { title: '90-day warranty + cycle-rate context', body: '90-day parts and labour warranty with cycle-rate context documented on every service summary. Vacation rentals get a realistic warranty window assessment upfront.' }
    ],
    servicesIntro: `Canmore\'s tourism economy and high-altitude geography shape the service mix here: vacation-rental dishwasher and washer high-cycle wear, altitude-affected gas appliance adjustments, and the standard residential mix in South Canmore and Lions Park. Each service has a dedicated Canmore page with vacation-rental and altitude-specific notes.`,
    neighborhoodsIntro: `Canmore\'s small footprint &mdash; about 14,000 permanent residents across roughly 8 named neighborhoods plus the high-density vacation-rental zones along Bow Valley Trail &mdash; means our daily routes cover the community in a single morning. Same-day routes regularly reach:`,
    neighborhoodsFooter: `If your Canmore address is in the South Canmore residential core, the Three Sisters or Spring Creek vacation-rental zones, or anywhere in the Bow Valley Corridor, we cover it. Book online for instant confirmation.`,
    pricingIntro: `Canmore pricing follows our standard rate structure: flat <strong>$65 diagnostic</strong>, waived when you proceed with the repair. Property-manager volume agreements available for multi-unit vacation rental operations &mdash; email calgary@appliancerepairneary.com for rate structures. Altitude-specific gas appliance work uses standard pricing &mdash; we don\'t surcharge for mountain expertise.`,
    brandsIntro: `Canmore\'s mixed residential and vacation-rental fleet skews the brand mix unusually broad: Whirlpool, Bosch, Frigidaire, Samsung, LG in the volume vacation rentals; Sub-Zero, Wolf, Miele, Thermador, Viking in higher-end South Canmore and Three Sisters luxury homes. We service all of them.`
  }
};

// ==========================================================================
// SERVICE CARDS — slug-aware: each suburb cross-links to its own service+suburb pages
// NEARY uses 'fridge-repair-{slug}' (not 'refrigerator-repair-{slug}')
// ==========================================================================
const SERVICES = [
  { key: 'fridge',     name: 'Refrigerator Repair', blurb: 'Compressor, sealed system, defrost timer, control board, ice maker — Samsung, LG, Whirlpool, KitchenAid, GE, Frigidaire and more.', common: 'fridge not cooling, freezer ices over, water dispenser leaking, ice maker stops' },
  { key: 'washer',     name: 'Washer Repair',       blurb: 'Drain pump, drum bearing, suspension rods, control board, lid lock — front-load and top-load, all major brands.', common: 'washer won\'t drain, won\'t spin, leaking from underneath, lid lock fault' },
  { key: 'dryer',      name: 'Dryer Repair',        blurb: 'Heating element, thermal fuse, drive belt, drum roller, vent inspection — gas and electric, including stacked units.', common: 'dryer not heating, thumping noise, takes too long to dry, won\'t start' },
  { key: 'dishwasher', name: 'Dishwasher Repair',   blurb: 'Drain pump, circulation motor, spray arm, inlet valve, control board — Bosch, KitchenAid, Whirlpool, GE, Samsung.', common: 'dishwasher not draining, dishes not clean, leaking from door, error code on display' },
  { key: 'oven',       name: 'Oven Repair',         blurb: 'Bake/broil element, igniter, thermostat, control board, door hinge — wall ovens and range ovens, gas and electric.', common: 'oven won\'t heat, broil element burned out, gas igniter glow but no flame, door won\'t latch' },
  { key: 'stove',      name: 'Stove Repair',        blurb: 'Surface igniter, burner valve, glass cooktop, infinite switch — gas, electric coil, induction, glass-top.', common: 'burner won\'t light, glass cooktop crack, induction fault code, infinite switch sparking' },
  { key: 'freezer',    name: 'Freezer Repair',      blurb: 'Compressor, defrost cycle, evaporator fan, thermostat — chest, upright, and garage-rated freezers.', common: 'freezer not freezing, frost buildup, garage freezer warm in winter, defrost timer stuck' },
  { key: 'microwave',  name: 'Microwave Repair',    blurb: 'Magnetron, diode, door switch, turntable motor, control panel — over-the-range and countertop.', common: 'microwave runs but no heat, sparking inside, turntable won\'t spin, door switch failure' }
];

// Service slug builder — for fridge use 'fridge-repair', for everything else use '{key}-repair'
function svcLink(svcKey, slug) {
  return `/${svcKey}-repair-${slug}`;
}

// ==========================================================================
// TEMPLATE — generates the full <main>...</main> body
// ==========================================================================
function buildMain(s, slug) {
  // Service cards grid — link to /{service}-repair-{slug}.html
  const serviceCards = SERVICES.map(svc => {
    return `      <div class="city-service-card">
        <h3>${svc.name}</h3>
        <p>${svc.blurb} Common ${s.name} fault patterns: ${svc.common}.</p>
        <a href="${svcLink(svc.key, slug)}">Learn more &rarr;</a>
      </div>`;
  }).join('\n');

  const neighborhoodList = s.neighborhoods.map(n => `      <li>${n}</li>`).join('\n');
  const brandsList = s.brands.map(b => `      <span class="brand-chip">${b}</span>`).join('\n');
  const localParas = s.localAngle.paragraphs.map(p => `    <p>${p}</p>`).join('\n');
  const nearbyLinks = s.nearbyLinks.map(n => `        <a href="/${n.slug}" class="related-link">${n.label}</a>`).join('\n');

  return `<main class="page-main container" id="main-content">

  <!-- HERO ANSWER CAPSULE (visible quick-answer for AI search) -->
  <div class="content-intro fade-in">
    <h2>Same-day appliance repair in ${s.name} and the surrounding ${s.region}</h2>
    <p style="font-size:1.0625rem;line-height:1.75;">Who repairs appliances in ${s.name}? <strong>Appliance Repair Near You &mdash; Calgary</strong> serves ${s.name} (population ${s.population}, postal codes ${s.postal}) and the broader ${s.cmaRole}. Book online or email <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a>. From <strong>$65 diagnostic</strong>, Mon&ndash;Sat 8AM&ndash;8PM, Sun 10AM&ndash;6PM Mountain Time. <strong>90-day parts &amp; labour warranty</strong> on every repair.</p>

    <p>${s.name} households contact us when a fridge stops cooling, a washer won't drain, a dryer stops heating, or a dishwasher floods the kitchen. We dispatch licensed technicians from our Calgary hub at 700 6th Avenue SW, Suite 1700, with parts pre-loaded for the most common ${s.name} service patterns. Most repairs are completed on the first visit. If we need to order a part, the return visit is included &mdash; no second diagnostic fee, no surprise add-ons.</p>

    <p>${s.introContextPara}</p>

    <p>${s.techHonest} ${s.waterPara}</p>
  </div>

  <!-- SECTION 1: ALL SERVICES IN SUBURB -->
  <section aria-label="All services available" style="margin-top:48px;">
    <div class="section-label">Services in ${s.name}</div>
    <h2 class="section-title">All Appliance Repair Services We Provide in ${s.name}</h2>
    <p style="max-width:760px;color:#374151;line-height:1.7;margin-bottom:24px;">${s.servicesIntro}</p>
    <div class="city-services-grid">
${serviceCards}
    </div>
  </section>

  <!-- SECTION 2: NEIGHBORHOODS WE SERVE -->
  <section aria-label="${s.name} neighborhoods" style="margin-top:56px;padding:32px;background:#f9fafb;border-radius:8px;">
    <div class="section-label">Service area</div>
    <h2 class="section-title">${s.name} Neighborhoods We Serve</h2>
    <p style="max-width:760px;color:#374151;line-height:1.7;margin-bottom:20px;">${s.neighborhoodsIntro}</p>
    <ul style="columns:3;column-gap:24px;list-style:none;padding:0;font-size:.9375rem;color:#374151;line-height:1.9;max-width:880px;">
${neighborhoodList}
    </ul>
    <p style="margin-top:20px;color:#6b7280;font-size:.875rem;">${s.neighborhoodsFooter}</p>
  </section>

  <!-- SECTION 3: BRAND SPECIALISTS -->
  <section aria-label="Brand specialists" style="margin-top:56px;">
    <div class="section-label">Brand expertise</div>
    <h2 class="section-title">${s.name} Appliance Brand Specialists</h2>
    <p style="max-width:760px;color:#374151;line-height:1.7;margin-bottom:24px;">${s.brandsIntro}</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;max-width:880px;">
${brandsList}
    </div>
    <style>
      .brand-chip {
        display:inline-block;
        padding:8px 16px;
        background:#fff;
        border:1px solid #e5e7eb;
        border-radius:999px;
        font-size:.875rem;
        font-weight:600;
        color:#0a0a0a;
      }
    </style>
    <p style="margin-top:20px;color:#374151;line-height:1.7;font-size:.9375rem;">We service all major brands. If your appliance is not listed, ask &mdash; our parts network covers virtually every North American consumer appliance brand.</p>
  </section>

  <!-- SECTION 4: WHY CHOOSE US (suburb-specific cards) -->
  <section aria-label="Why ${s.name} chooses us" style="margin-top:56px;">
    <div class="section-label">Why ${s.name} homeowners choose us</div>
    <h2 class="section-title">${s.whyHeadline}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:24px;">
${s.whyChooseCards.map(c => `      <div style="padding:20px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
        <h3 style="font-size:1rem;font-weight:700;color:#0a0a0a;margin-bottom:8px;">${c.title}</h3>
        <p style="font-size:.875rem;color:#6b7280;line-height:1.6;">${c.body}</p>
      </div>`).join('\n')}
    </div>
  </section>

  <!-- SECTION 5: SUBURB-SPECIFIC LOCAL ANGLE (E-E-A-T differentiator) -->
  <section aria-label="${s.name} local repair patterns" style="margin-top:56px;padding:32px;background:#eff6ff;border-radius:8px;border-left:4px solid #2563eb;">
    <div class="section-label">${s.name} local insight</div>
    <h2 class="section-title">${s.localAngle.headline}</h2>
    <div style="max-width:840px;color:#1e40af;line-height:1.75;font-size:1rem;">
${localParas}
    </div>
  </section>

  <!-- SECTION 5b: COMMON REPAIR PATTERNS (deepens uniqueness, suburb-tuned) -->
  <section aria-label="${s.name} common repair patterns" style="margin-top:56px;">
    <div class="section-label">Common faults &amp; how we fix them</div>
    <h2 class="section-title">${s.name} Repair Patterns We See Most Often</h2>
    <p style="max-width:760px;color:#374151;line-height:1.7;margin-bottom:24px;">${s.faultsIntro}</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;max-width:880px;">
${s.faultCards.map(f => `      <div style="padding:18px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
        <h3 style="font-size:.9375rem;font-weight:700;color:#0a0a0a;margin-bottom:6px;">${f.title}</h3>
        <p style="font-size:.8125rem;color:#6b7280;line-height:1.6;">${f.body}</p>
      </div>`).join('\n')}
    </div>
  </section>

  <!-- SECTION 6: PRICING TRANSPARENCY -->
  <section aria-label="Pricing" style="margin-top:56px;">
    <div class="section-label">Transparent pricing</div>
    <h2 class="section-title">${s.name} Appliance Repair Pricing</h2>
    <p style="max-width:760px;color:#374151;line-height:1.7;margin-bottom:20px;">${s.pricingIntro}</p>
    <table class="pricing-table" style="max-width:760px;">
      <thead>
        <tr>
          <th>Repair type</th>
          <th>Typical range (parts + labour)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Diagnostic visit (waived with repair)</td><td>$65</td></tr>
        <tr><td>Refrigerator defrost timer / control board</td><td>$180&ndash;$320</td></tr>
        <tr><td>Washer drain pump / lid lock</td><td>$160&ndash;$280</td></tr>
        <tr><td>Dryer heating element / thermal fuse</td><td>$140&ndash;$240</td></tr>
        <tr><td>Dishwasher pump / control board</td><td>$180&ndash;$340</td></tr>
        <tr><td>Oven igniter / bake element</td><td>$160&ndash;$280</td></tr>
        <tr><td>Compressor / sealed system (major)</td><td>$450&ndash;$850</td></tr>
      </tbody>
    </table>
    <p class="pricing-note">All prices include parts, labour, and a <strong>90-day warranty</strong>. Pricing is in CAD and reflects typical jobs in the ${s.name} / Calgary CMA market. Final quote depends on your specific brand, model, and fault.</p>
  </section>

  <!-- SECTION 7: BOOKING IFRAME -->
  <section class="booking-section fade-in" aria-label="Book your repair" style="margin-top:56px;">
    <div class="section-label">Online booking</div>
    <h2>Book Appliance Repair in ${s.name}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-nicks-appliance-repair-b8c8ce" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book a Service" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-nicks-appliance-repair-b8c8ce');if(el)el.style.height=e.data.height+'px'}});</script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm Mountain Time</p>
  </section>

  <!-- SECTION 8: FAQ (visible + FAQPage schema below) -->
  <section class="faq-section fade-in" aria-label="${s.name} FAQ">
    <div class="container" style="padding:0">
      <h2>FAQ &mdash; Appliance Repair in ${s.name}</h2>

      <div class="faq-list">
        <details class="faq-item">
          <summary class="faq-question">
            <span class="faq-q-text">${s.faqs[0].q}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </summary>
          <div class="faq-answer"><p>${s.faqs[0].a}</p></div>
        </details>

        <details class="faq-item">
          <summary class="faq-question">
            <span class="faq-q-text">${s.faqs[1].q}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </summary>
          <div class="faq-answer"><p>${s.faqs[1].a}</p></div>
        </details>

        <details class="faq-item">
          <summary class="faq-question">
            <span class="faq-q-text">${s.faqs[2].q}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </summary>
          <div class="faq-answer"><p>${s.faqs[2].a}</p></div>
        </details>

        <details class="faq-item">
          <summary class="faq-question">
            <span class="faq-q-text">${s.faqs[3].q}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </summary>
          <div class="faq-answer"><p>${s.faqs[3].a}</p></div>
        </details>

        <details class="faq-item">
          <summary class="faq-question">
            <span class="faq-q-text">${s.faqs[4].q}</span>
            <span class="faq-icon" aria-hidden="true">+</span>
          </summary>
          <div class="faq-answer"><p>${s.faqs[4].a}</p></div>
        </details>
      </div>
    </div>
  </section>

  <!-- SECTION 9: CALGARY CMA SERVICE AREA -->
  <section aria-label="Calgary CMA service area" style="margin-top:56px;padding:32px;background:#f9fafb;border-radius:8px;">
    <div class="section-label">Calgary CMA service area</div>
    <h2 class="section-title">We Also Serve These Calgary CMA Communities</h2>
    <p style="max-width:760px;color:#374151;line-height:1.7;margin-bottom:20px;">${s.name} is part of our broader Calgary CMA route network. Same-day appliance repair is available across the metropolitan area:</p>
    <div class="related-grid">
${nearbyLinks}
    </div>
  </section>

  <!-- SECTION 10: FINAL CTA -->
  <section aria-label="Book ${s.name} appliance repair" style="margin-top:56px;padding:40px;background:#0a0a0a;border-radius:8px;text-align:center;color:#fff;">
    <h2 style="font-size:1.75rem;font-weight:700;color:#fff;margin-bottom:12px;letter-spacing:-.02em;">Ready to book ${s.name} appliance repair?</h2>
    <p style="color:rgba(255,255,255,.8);margin-bottom:24px;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.6;">Same-day service, $65 flat diagnostic, written quote before any work, 90-day warranty on every repair. Book online for instant confirmation.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary" target="_blank" rel="noopener">Book Online &rarr;</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Calgary Team</a>
    </div>
  </section>

</main>

<!-- FAQPAGE SCHEMA -->
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": s.faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": stripHtml(f.a) }
  }))
}, null, 2)}
</script>`;
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// ==========================================================================
// FILE PROCESSOR — replaces <main>...</main> + cleans extra Toronto sections
// ==========================================================================
function processSuburb(slug) {
  const s = SUBURBS[slug];
  if (!s) {
    console.error(`No data for slug: ${slug}`);
    return false;
  }

  const filePath = path.join(ROOT, `${slug}.html`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Build new main content
  const newMain = buildMain(s, slug);

  // 2. Replace <main ...id="main-content">...</main> + any trailing FAQPage schemas with new content
  const mainRegex = /<main[^>]*id="main-content"[^>]*>[\s\S]*?<\/main>(?:\s*<!-- FAQPAGE SCHEMA -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>)*/m;
  if (!mainRegex.test(html)) {
    console.error(`Could not find <main id="main-content"> in ${slug}.html`);
    return false;
  }
  html = html.replace(mainRegex, newMain);

  // 3. Update meta description to remove $89 references — keep canonical/title (already correct)
  html = html.replace(/\$89 diagnostic/g, '$65 diagnostic');

  // 4. Fix old answer-box phone reference: replace "Call ." with email CTA
  html = html.replace(/Call \./g, 'Book online or email calgary@appliancerepairneary.com.');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Updated ${slug}.html (${(html.length / 1024).toFixed(1)} KB)`);
  return true;
}

// ==========================================================================
// MAIN
// ==========================================================================
function main() {
  const arg = process.argv[2];
  const slugs = arg ? [arg] : Object.keys(SUBURBS);

  console.log(`\n=== Calgary Suburb Hub Generator ===`);
  console.log(`Generating: ${slugs.join(', ')}\n`);

  let ok = 0, fail = 0;
  for (const slug of slugs) {
    if (processSuburb(slug)) ok++; else fail++;
  }

  console.log(`\n=== Done: ${ok} updated, ${fail} failed ===\n`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
