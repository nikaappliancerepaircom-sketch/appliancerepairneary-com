'use strict';
const fs   = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname);
const TEMPLATE   = fs.readFileSync(path.join(OUTPUT_DIR, 'service-template.html'), 'utf8');

// ─── DATA ────────────────────────────────────────────────────────────────────

const CITIES = [
  {name:"Toronto",        slug:"toronto",        region:"GTA",              area:"the Greater Toronto Area"},
  {name:"Scarborough",    slug:"scarborough",    region:"East Toronto",     area:"Scarborough and East Toronto"},
  {name:"North York",     slug:"north-york",     region:"North Toronto",    area:"North York and North Toronto"},
  {name:"Etobicoke",      slug:"etobicoke",      region:"West Toronto",     area:"Etobicoke and West Toronto"},
  {name:"Mississauga",    slug:"mississauga",    region:"Peel Region",      area:"Mississauga and Peel Region"},
  {name:"Brampton",       slug:"brampton",       region:"Peel Region",      area:"Brampton and Peel Region"},
  {name:"Vaughan",        slug:"vaughan",        region:"York Region",      area:"Vaughan and York Region"},
  {name:"Richmond Hill",  slug:"richmond-hill",  region:"York Region",      area:"Richmond Hill and York Region"},
  {name:"Markham",        slug:"markham",        region:"York Region",      area:"Markham and York Region"},
  {name:"Oakville",       slug:"oakville",       region:"Halton Region",    area:"Oakville and Halton Region"},
  {name:"Burlington",     slug:"burlington",     region:"Halton Region",    area:"Burlington and Halton Region"},
  {name:"Pickering",      slug:"pickering",      region:"Durham Region",    area:"Pickering and Durham Region"},
  {name:"Ajax",           slug:"ajax",           region:"Durham Region",    area:"Ajax and Durham Region"},
  {name:"Whitby",         slug:"whitby",         region:"Durham Region",    area:"Whitby and Durham Region"},
  {name:"Oshawa",         slug:"oshawa",         region:"Durham Region",    area:"Oshawa and Durham Region"}
];

const SERVICES = [
  {
    name:"Refrigerator", slug:"fridge",
    near:"fridge repair near me",
    display:"Fridge / Refrigerator",
    issues:["not cooling","leaking water","ice maker not working","making noise","freezer not freezing"],
    price:"$150–$400"
  },
  {
    name:"Washer", slug:"washer",
    near:"washer repair near me",
    display:"Washer / Washing Machine",
    issues:["not spinning","not draining","leaking","making loud noise","won't start"],
    price:"$120–$350"
  },
  {
    name:"Dryer", slug:"dryer",
    near:"dryer repair near me",
    display:"Dryer / Clothes Dryer",
    issues:["not heating","not spinning","taking too long to dry","making noise","won't start"],
    price:"$100–$300"
  },
  {
    name:"Dishwasher", slug:"dishwasher",
    near:"dishwasher repair near me",
    display:"Dishwasher",
    issues:["not cleaning dishes","not draining","leaking","won't start","making noise"],
    price:"$120–$350"
  },
  {
    name:"Oven", slug:"oven",
    near:"oven repair near me",
    display:"Oven",
    issues:["not heating","heating unevenly","door won't close","display not working","self-clean not working"],
    price:"$130–$380"
  },
  {
    name:"Stove", slug:"stove",
    near:"stove repair near me",
    display:"Stove / Range",
    issues:["burner not lighting","burner not heating","control knob broken","igniter clicking","gas smell"],
    price:"$100–$350"
  }
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getIntro(service, city, idx) {
  const intros = [
    `<p>Looking for ${service.display.toLowerCase()} repair near you in ${city.name}? You've found a reliable local service. Our licensed technicians cover ${city.area} with same-day availability. We fix all major brands — Samsung, LG, Whirlpool, GE, Bosch and more. Common issues we handle: ${service.issues.slice(0,3).join(', ')}. Typical repair cost: ${service.price}.</p>
<h2>Why Choose Us for ${service.name} Repair in ${city.name}?</h2>
<p>With hundreds of completed repairs in ${city.region}, our technicians understand the specific needs of ${city.name} homeowners. We carry a wide stock of OEM and OEM-equivalent parts for all major brands, which means most repairs are completed on the very first visit — no waiting a week for parts.</p>
<ul>
  <li>Same-day service available throughout ${city.name}</li>
  <li>Transparent upfront pricing — you approve the cost before work begins</li>
  <li>90-day warranty on all parts and labour</li>
  <li>Licensed, background-checked technicians</li>
  <li>All major brands serviced: Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Maytag, KitchenAid, Kenmore</li>
</ul>
<h2>How Our ${city.name} ${service.name} Repair Works</h2>
<p>Booking is simple: call (437) 524-1053 or use the online form on this page. Pick a time that suits you — evenings and Saturdays available. Our technician will arrive on time, diagnose the fault, and give you a written quote. Once approved, most ${service.display.toLowerCase()} repairs are done within the same visit.</p>`,

    `<p>When your ${service.display.toLowerCase()} breaks down in ${city.name}, fast local repair matters. Our certified technicians know ${city.region} well and can often arrive the same day. We carry parts for all major brands and complete most repairs in one visit. Upfront pricing, 90-day warranty on all work.</p>
<h2>Trusted ${service.name} Repair in ${city.region}</h2>
<p>We've built our reputation across ${city.region} by showing up on time, diagnosing accurately, and fixing it right the first time. Our team has completed thousands of ${service.display.toLowerCase()} repairs for homeowners just like you in ${city.name}. Whether your appliance is a few years old or a decade-old workhorse, we can help.</p>
<ul>
  <li>Certified appliance repair technicians</li>
  <li>Same-day and next-day slots available in ${city.name}</li>
  <li>No fix, no fee guarantee on diagnostics (when repair is booked)</li>
  <li>90-day parts and labour warranty</li>
  <li>Evening and weekend availability</li>
</ul>
<h2>Common ${service.name} Problems We Fix in ${city.name}</h2>
<p>The most frequent issues we encounter with ${service.display.toLowerCase()} units in ${city.name} include: ${service.issues.join(', ')}. Our technicians carry diagnostic tools and a broad parts inventory so that in most cases you won't need a second visit.</p>`,

    `<p>Residents of ${city.name} and ${city.region} rely on our appliance repair team for fast, dependable ${service.display.toLowerCase()} service. 4.9★ rated with 5,200+ GTA repairs completed. We fix ${service.issues.slice(0,2).join(' and ')} and all other common ${service.display.toLowerCase()} problems. ${service.price} typical repair cost, 90-day warranty included.</p>
<h2>${service.name} Repair Near You — ${city.name} Coverage</h2>
<p>Our service area covers every neighbourhood in ${city.name} and extends throughout ${city.region}. That means fast dispatch times and no premium travel charges. We know the area and we'll be at your door quickly — usually within 2–4 hours of your call when booking before 2 PM.</p>
<ul>
  <li>Full ${city.name} coverage — all postal codes</li>
  <li>4.9★ average rating from 5,200+ GTA customers</li>
  <li>Most repairs completed same visit, 90-day warranty</li>
  <li>Flat-rate quotes — no surprise charges</li>
  <li>Brands: Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, KitchenAid and more</li>
</ul>
<h2>What to Expect from Your ${city.name} ${service.name} Repair</h2>
<p>After you book, we'll confirm your appointment by text. Our technician will arrive in a marked vehicle, perform a thorough diagnosis, and walk you through the findings. You'll receive a written quote before any repair begins. Once you approve, we get to work — and most jobs are done the same day.</p>`
  ];
  return intros[idx % 3];
}

function getFAQ(service, city) {
  const items = [
    {
      q: `Is there ${service.display.toLowerCase()} repair near me in ${city.name}?`,
      a: `Yes! We offer ${service.display.toLowerCase()} repair throughout ${city.name} and ${city.region}. Same-day appointments available Monday–Saturday 8am–8pm. Call (437) 524-1053 or book online.`
    },
    {
      q: `How much does ${service.display.toLowerCase()} repair cost in ${city.name}?`,
      a: `${service.display} repair in ${city.name} typically costs ${service.price} depending on the problem and parts needed. We provide upfront pricing before any work begins — no hidden fees.`
    },
    {
      q: `How quickly can you come to ${city.name} for ${service.display.toLowerCase()} repair?`,
      a: `We offer same-day service in ${city.name}. Call before 2 PM for same-day appointments. Our technicians typically arrive within 2–4 hours.`
    },
    {
      q: `What ${service.display.toLowerCase()} brands do you repair in ${city.name}?`,
      a: `We repair all major brands in ${city.name} including Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, and KitchenAid.`
    },
    {
      q: `Do you fix ${service.issues[0]} in ${city.name}?`,
      a: `Yes, ${service.issues[0]} is one of the most common ${service.display.toLowerCase()} problems we fix in ${city.name}. Our technicians diagnose the cause and repair it in most cases on the same visit.`
    },
    {
      q: `Is there a warranty on ${service.display.toLowerCase()} repairs in ${city.name}?`,
      a: `All repairs come with a 90-day warranty on parts and labor. If the same issue recurs within 90 days, we fix it at no extra charge.`
    },
    {
      q: `Do you offer ${service.display.toLowerCase()} repair on weekends in ${city.name}?`,
      a: `Yes, we work Monday–Saturday 8am–8pm and Sunday 9am–6pm throughout ${city.name} and ${city.region}.`
    },
    {
      q: `How do I book ${service.display.toLowerCase()} repair near me in ${city.name}?`,
      a: `Book online at the top of this page using our booking form, or call (437) 524-1053. Takes 2 minutes — choose your appliance, date, and time slot.`
    }
  ];
  return items.map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${item.q}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${item.a}</p></div>
  </div>
</div>`).join('\n');
}

function getSchema(service, city) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Appliance Repair Near Me — Toronto & GTA",
        "telephone": "+14375241053",
        "url": "https://appliancerepairneary.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city.name,
          "addressRegion": "Ontario",
          "addressCountry": "CA"
        },
        "aggregateRating": {"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"5200"},
        "areaServed": city.name,
        "openingHours": ["Mo-Sa 08:00-20:00","Su 09:00-18:00"]
      },
      {
        "@type": "Service",
        "name": `${service.name} Repair in ${city.name}`,
        "provider": {"@type":"LocalBusiness","name":"Appliance Repair Near Me"},
        "areaServed": city.name,
        "offers": {
          "@type": "Offer",
          "priceRange": service.price,
          "description": `${service.name} repair in ${city.name} — same-day service, 90-day warranty`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type":"Question",
            "name":`How much does ${service.name.toLowerCase()} repair cost in ${city.name}?`,
            "acceptedAnswer":{"@type":"Answer","text":`${service.name} repair in ${city.name} typically costs ${service.price} depending on the issue.`}
          },
          {
            "@type":"Question",
            "name":`Is same-day ${service.name.toLowerCase()} repair available in ${city.name}?`,
            "acceptedAnswer":{"@type":"Answer","text":`Yes, same-day ${service.name.toLowerCase()} repair is available in ${city.name} when you book before 2 PM.`}
          }
        ]
      }
    ]
  }, null, 2);
}

// Breadcrumb JSON-LD (goes into <script type="application/ld+json">)
function getBreadcrumbSchema(service, city) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"https://appliancerepairneary.com/"},
      {"@type":"ListItem","position":2,"name":`${service.name} Repair Near Me`,"item":`https://appliancerepairneary.com/${service.slug}-repair-near-me.html`},
      {"@type":"ListItem","position":3,"name":`${service.name} Repair in ${city.name}`,"item":`https://appliancerepairneary.com/${service.slug}-repair-${city.slug}.html`}
    ]
  }, null, 2);
}

function getRelatedServices(currentService, city) {
  const others = SERVICES.filter(s => s.slug !== currentService.slug);
  return others.map(s =>
    `<li><a href="/${s.slug}-repair-${city.slug}.html">${s.name} Repair in ${city.name}</a></li>`
  ).join('\n');
}

function getRelatedCities(service, currentCity) {
  const others = CITIES.filter(c => c.slug !== currentCity.slug).slice(0, 8);
  return others.map(c =>
    `<li><a href="/${service.slug}-repair-${c.slug}.html">${service.name} Repair in ${c.name}</a></li>`
  ).join('\n');
}

function renderPage(vars) {
  let html = TEMPLATE;
  for (const [key, val] of Object.entries(vars)) {
    html = html.split(`{{${key}}}`).join(val);
  }
  return html;
}

// ─── 1. SERVICE × CITY (90 pages) ───────────────────────────────────────────

let count = 0;

CITIES.forEach((city, ci) => {
  SERVICES.forEach((service, si) => {
    const filename = `${service.slug}-repair-${city.slug}.html`;
    const canonical = `https://appliancerepairneary.com/${filename}`;

    const vars = {
      META_TITLE:       `${service.name} Repair Near Me in ${city.name} | Same-Day | (437) 524-1053`,
      META_DESC:        `Need ${service.name.toLowerCase()} repair near you in ${city.name}? Same-day service available. ${service.price} typical cost. 4.9★ rated, 90-day warranty. Call (437) 524-1053.`,
      CANONICAL:        canonical,
      H1:               `${service.name} Repair Near You in ${city.name}`,
      ANSWER_BOX:       `${service.name} repair near you in ${city.name}: Same-day service available across ${city.region}. We fix all brands including Samsung, LG, Whirlpool, and Bosch. Typical cost ${service.price}. Call (437) 524-1053 or book online. 90-day warranty on all repairs.`,
      BREADCRUMB:       getBreadcrumbSchema(service, city),
      CONTENT_INTRO:    getIntro(service, city, ci + si),
      SERVICE_NAME:     service.name,
      CITY_NAME:        city.name,
      FAQ_ITEMS:        getFAQ(service, city),
      RELATED_SERVICES: getRelatedServices(service, city),
      RELATED_CITIES:   getRelatedCities(service, city),
      SCHEMA_JSON:      getSchema(service, city)
    };

    fs.writeFileSync(path.join(OUTPUT_DIR, filename), renderPage(vars), 'utf8');
    count++;
    console.log(`[${count}] ${filename}`);
  });
});

// ─── 2. "NEAR ME" SERVICE PAGES (7 pages) ───────────────────────────────────

const NEAR_ME_PAGES = [
  {service: SERVICES[0], slug: 'fridge-repair-near-me'},
  {service: SERVICES[1], slug: 'washer-repair-near-me'},
  {service: SERVICES[1], slug: 'washer-dryer-repair-near-me', titleOverride: 'Washer & Dryer Repair Near Me', h1Override: 'Washer & Dryer Repair Near Me — Toronto & GTA'},
  {service: SERVICES[2], slug: 'dryer-repair-near-me'},
  {service: SERVICES[3], slug: 'dishwasher-repair-near-me'},
  {service: SERVICES[4], slug: 'oven-repair-near-me'},
  {service: SERVICES[5], slug: 'stove-repair-near-me'}
];

function getNearMeFAQ(service) {
  const items = [
    {
      q: `Where can I find ${service.display.toLowerCase()} repair near me in the GTA?`,
      a: `We cover all of the Greater Toronto Area including Toronto, Scarborough, North York, Etobicoke, Mississauga, Brampton, Vaughan, Richmond Hill, Markham, Oakville, Burlington, Pickering, Ajax, Whitby, and Oshawa. Call (437) 524-1053 for same-day service.`
    },
    {
      q: `How much does ${service.display.toLowerCase()} repair near me cost?`,
      a: `${service.display} repair near you in the GTA typically costs ${service.price} depending on the problem and parts. We provide upfront pricing before work begins — no hidden fees.`
    },
    {
      q: `Is there same-day ${service.display.toLowerCase()} repair near me?`,
      a: `Yes! We offer same-day ${service.display.toLowerCase()} repair across the GTA. Call before 2 PM to book a same-day appointment. Our technicians typically arrive within 2–4 hours.`
    },
    {
      q: `What brands of ${service.display.toLowerCase()} do you repair near me?`,
      a: `We repair all major brands near you including Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, KitchenAid, Miele, and more.`
    },
    {
      q: `How do I find a reliable ${service.display.toLowerCase()} repair technician near me?`,
      a: `We're a licensed, 4.9★-rated appliance repair company serving the GTA with 5,200+ completed repairs. Book online or call (437) 524-1053. We arrive on time, diagnose accurately, and back our work with a 90-day warranty.`
    },
    {
      q: `Do you offer a warranty on ${service.display.toLowerCase()} repairs near me?`,
      a: `All repairs come with a 90-day warranty on parts and labor. If the same issue recurs within 90 days, we'll fix it at no charge.`
    },
    {
      q: `What are the most common ${service.display.toLowerCase()} problems you fix?`,
      a: `The most common issues we repair are: ${service.issues.join(', ')}. We diagnose the root cause and fix it right the first time.`
    },
    {
      q: `How do I book ${service.display.toLowerCase()} repair near me?`,
      a: `Use the booking form on this page or call (437) 524-1053. It takes under 2 minutes. We'll confirm your appointment by text and send a reminder before the technician arrives.`
    }
  ];
  return items.map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${item.q}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${item.a}</p></div>
  </div>
</div>`).join('\n');
}

function getNearMeRelatedServices(currentService) {
  const others = SERVICES.filter(s => s.slug !== currentService.slug);
  return others.map(s =>
    `<li><a href="/${s.slug}-repair-near-me.html">${s.name} Repair Near Me</a></li>`
  ).join('\n');
}

function getNearMeRelatedCities(service) {
  return CITIES.slice(0, 8).map(c =>
    `<li><a href="/${service.slug}-repair-${c.slug}.html">${service.name} Repair in ${c.name}</a></li>`
  ).join('\n');
}

function getNearMeBreadcrumbSchema(slug, label) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"Home","item":"https://appliancerepairneary.com/"},
      {"@type":"ListItem","position":2,"name":label,"item":`https://appliancerepairneary.com/${slug}.html`}
    ]
  }, null, 2);
}

function getNearMeSchema(service, titleLabel) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Appliance Repair Near Me — Toronto & GTA",
        "telephone": "+14375241053",
        "url": "https://appliancerepairneary.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Toronto",
          "addressRegion": "Ontario",
          "addressCountry": "CA"
        },
        "aggregateRating": {"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"5200"},
        "areaServed": "Greater Toronto Area",
        "openingHours": ["Mo-Sa 08:00-20:00","Su 09:00-18:00"]
      },
      {
        "@type": "Service",
        "name": titleLabel,
        "provider": {"@type":"LocalBusiness","name":"Appliance Repair Near Me"},
        "areaServed": "Greater Toronto Area",
        "offers": {
          "@type": "Offer",
          "priceRange": service.price,
          "description": `${titleLabel} — same-day service across the GTA, 90-day warranty`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type":"Question",
            "name":`How much does ${service.name.toLowerCase()} repair near me cost?`,
            "acceptedAnswer":{"@type":"Answer","text":`${service.name} repair near you typically costs ${service.price} depending on the issue.`}
          },
          {
            "@type":"Question",
            "name":`Is same-day ${service.name.toLowerCase()} repair near me available?`,
            "acceptedAnswer":{"@type":"Answer","text":`Yes, same-day ${service.name.toLowerCase()} repair is available across the GTA when you book before 2 PM.`}
          }
        ]
      }
    ]
  }, null, 2);
}

NEAR_ME_PAGES.forEach(entry => {
  const service  = entry.service;
  const filename = `${entry.slug}.html`;
  const h1       = entry.h1Override || `${service.name} Repair Near Me — Toronto & GTA`;
  const title    = entry.titleOverride || `${service.name} Repair Near Me`;

  const vars = {
    META_TITLE:       `${title} | Same-Day GTA Service | (437) 524-1053`,
    META_DESC:        `Looking for ${service.display.toLowerCase()} repair near you? We cover all of the GTA with same-day service. ${service.price} typical cost. 4.9★ rated, 90-day warranty. Call (437) 524-1053.`,
    CANONICAL:        `https://appliancerepairneary.com/${filename}`,
    H1:               h1,
    ANSWER_BOX:       `${title} in Toronto & GTA: We provide same-day ${service.display.toLowerCase()} repair across all GTA cities — Toronto, Mississauga, Brampton, Vaughan, Markham, Oakville and more. All major brands serviced including Samsung, LG, Whirlpool, and Bosch. Typical cost ${service.price}. 90-day warranty on all repairs. Call (437) 524-1053.`,
    BREADCRUMB:       getNearMeBreadcrumbSchema(entry.slug, h1),
    CONTENT_INTRO:    `<p>Searching for <strong>${service.display.toLowerCase()} repair near me</strong> in the Toronto area? We have certified technicians stationed across the GTA ready to come to your home same-day. We service Toronto, Scarborough, North York, Etobicoke, Mississauga, Brampton, Vaughan, Richmond Hill, Markham, Oakville, Burlington, Pickering, Ajax, Whitby, and Oshawa.</p>
<h2>Why We're the Best ${service.name} Repair Near You</h2>
<p>Our 4.9-star rating comes from more than 5,200 completed GTA repairs. We show up on time, diagnose accurately, and fix it right the first time. All our technicians are licensed, insured, and background-checked. We back every repair with a 90-day warranty on parts and labour.</p>
<ul>
  <li>Same-day availability across all GTA cities</li>
  <li>4.9★ rated — 5,200+ satisfied GTA customers</li>
  <li>All brands: Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Maytag, KitchenAid, Kenmore</li>
  <li>Transparent pricing — quote approved before any work begins</li>
  <li>90-day parts and labour warranty on every repair</li>
</ul>
<h2>Common ${service.name} Problems We Fix Near You</h2>
<p>We repair the full range of ${service.display.toLowerCase()} issues including: ${service.issues.join(', ')}. Most repairs are completed on the first visit. If we can't fix it, you don't pay a repair fee.</p>`,
    SERVICE_NAME:     service.name,
    CITY_NAME:        "Toronto & GTA",
    FAQ_ITEMS:        getNearMeFAQ(service),
    RELATED_SERVICES: getNearMeRelatedServices(service),
    RELATED_CITIES:   getNearMeRelatedCities(service),
    SCHEMA_JSON:      getNearMeSchema(service, title)
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, filename), renderPage(vars), 'utf8');
  count++;
  console.log(`[${count}] ${filename}`);
});

// ─── 3. PROBLEM "NEAR ME" PAGES (8 pages) ────────────────────────────────────

const PROBLEM_PAGES = [
  {
    slug: 'dryer-not-heating-near-me',
    service: SERVICES[2],
    h1: 'Dryer Not Heating Near Me — Same-Day Repair GTA',
    title: 'Dryer Not Heating Near Me',
    problem: 'dryer not heating',
    answerBox: 'Dryer not heating near you in the GTA? Our technicians diagnose and fix dryer heating issues same-day. Common causes include a failed heating element, blown thermal fuse, tripped breaker, or defective thermostat. We serve all GTA cities. Typical repair cost $100–$300. 90-day warranty. Call (437) 524-1053.',
    faqSpecific: [
      {q:'Why is my dryer not heating?', a:'The most common causes of a dryer not heating are a burnt-out heating element, a blown thermal fuse, a faulty thermostat, or a tripped circuit breaker. Our technicians can diagnose and fix the issue on the same visit.'},
      {q:'How much does it cost to fix a dryer that is not heating near me?', a:'Fixing a dryer that is not heating typically costs $100–$300 in the GTA, depending on which part has failed. We provide upfront pricing before any work begins.'},
      {q:'Can you fix my dryer not heating the same day?', a:'Yes, we offer same-day dryer repair across the GTA. Call before 2 PM for a same-day slot. Our technicians usually arrive within 2–4 hours.'},
      {q:'Is it worth repairing a dryer that is not heating?', a:'In most cases, yes. Heating element and thermal fuse replacements are cost-effective repairs that restore your dryer to full function. We\'ll advise you honestly if the repair isn\'t worthwhile.'},
      {q:'What brands of dryers do you repair near me?', a:'We repair all major brands including Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Maytag, Kenmore, and KitchenAid.'},
      {q:'Do you offer a warranty on dryer not heating repairs?', a:'All repairs come with a 90-day warranty on parts and labor. If the same issue occurs within 90 days, we return and fix it at no extra charge.'},
      {q:'How do I book same-day dryer repair near me?', a:'Call (437) 524-1053 or use the booking form above. Select dryer repair, choose your time slot, and we\'ll confirm by text. Monday–Saturday 8am–8pm, Sunday 9am–6pm.'},
      {q:'What if the technician can\'t fix my dryer not heating on the first visit?', a:'In the rare case a part needs ordering, we\'ll complete the repair as soon as the part arrives — usually the next business day — at no additional diagnostic charge.'}
    ]
  },
  {
    slug: 'fridge-not-cooling-near-me',
    service: SERVICES[0],
    h1: 'Fridge Not Cooling Near Me — Same-Day Repair GTA',
    title: 'Fridge Not Cooling Near Me',
    problem: 'fridge not cooling',
    answerBox: 'Fridge not cooling near you? We provide same-day refrigerator repair across the GTA. Common causes: dirty condenser coils, failed compressor, faulty evaporator fan, or refrigerant leak. Typical repair $150–$400. 90-day warranty. Don\'t lose your food — call (437) 524-1053 now.',
    faqSpecific: [
      {q:'Why is my fridge not cooling?', a:'A fridge that is not cooling is usually caused by dirty condenser coils, a faulty evaporator fan, a failing compressor, a refrigerant leak, or a defective thermostat. Our technicians carry diagnostic tools to identify the exact cause on the first visit.'},
      {q:'How much does it cost to fix a fridge that is not cooling near me?', a:'Refrigerator repair for a cooling issue typically costs $150–$400 in the GTA depending on the fault. Condenser coil cleaning or fan replacement is on the lower end; compressor work is higher. Upfront quote before we start.'},
      {q:'Can you come today for a fridge not cooling repair?', a:'Yes, we offer same-day service across the GTA. A fridge not cooling is urgent — food safety is at risk. Call (437) 524-1053 before 2 PM for a same-day appointment.'},
      {q:'Is a fridge not cooling worth repairing?', a:'In most cases yes, unless the fridge is very old and the compressor has failed. We\'ll give you an honest assessment before any work begins.'},
      {q:'What brands of fridge do you repair near me?', a:'We repair Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, KitchenAid, Sub-Zero, and other brands throughout the GTA.'},
      {q:'What happens if my fridge is low on refrigerant?', a:'Refrigerant issues require a licensed technician to diagnose and recharge. We carry the necessary equipment and will advise if a recharge is the right solution for your specific unit.'},
      {q:'Do you offer a warranty on fridge not cooling repairs?', a:'Yes, all repairs come with a 90-day warranty on parts and labor.'},
      {q:'How do I book same-day fridge repair near me?', a:'Call (437) 524-1053 or use the online booking form above. We\'ll confirm your slot by text and arrive on time.'}
    ]
  },
  {
    slug: 'washer-not-draining-near-me',
    service: SERVICES[1],
    h1: 'Washer Not Draining Near Me — Same-Day Repair GTA',
    title: 'Washer Not Draining Near Me',
    problem: 'washer not draining',
    answerBox: 'Washer not draining near you? We fix washing machine drain problems same-day across the GTA. Common causes: blocked drain hose, clogged pump filter, failed drain pump, or lid switch fault. Typical repair $120–$350. 90-day warranty. Call (437) 524-1053.',
    faqSpecific: [
      {q:'Why is my washer not draining?', a:'The most common causes of a washer not draining are a clogged drain pump filter, a blocked drain hose, a failed drain pump motor, a faulty lid switch, or a control board issue. We diagnose and fix on the same visit.'},
      {q:'How much does washer not draining repair cost near me?', a:'Washer drain repair in the GTA typically costs $120–$350. Clearing a clog or replacing a pump filter is on the lower end; replacing the drain pump motor is higher. You\'ll get a firm quote before we start.'},
      {q:'Can you fix a washer not draining the same day?', a:'Yes. We offer same-day washing machine repair across the GTA. Call before 2 PM for same-day service. Technicians typically arrive within 2–4 hours.'},
      {q:'Can I fix a washer not draining myself?', a:'You can try cleaning the pump filter — it\'s accessible on most front-loaders and is sometimes the only cause. However, if the drain pump has failed or there\'s an electrical fault, a professional repair is safer and more reliable.'},
      {q:'What brands of washers do you repair near me?', a:'We repair all brands including Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, and KitchenAid throughout the GTA.'},
      {q:'Is there a warranty on washer not draining repairs?', a:'Yes, all repairs include a 90-day warranty on parts and labor.'},
      {q:'What if my washer has water in it when you arrive?', a:'Our technicians carry towels and a wet-dry capability. We\'ll safely remove standing water as part of the repair process.'},
      {q:'How do I book washer repair near me?', a:'Call (437) 524-1053 or use the online booking form on this page. Monday–Saturday 8am–8pm, Sunday 9am–6pm.'}
    ]
  },
  {
    slug: 'dishwasher-not-draining-near-me',
    service: SERVICES[3],
    h1: 'Dishwasher Not Draining Near Me — Same-Day Repair GTA',
    title: 'Dishwasher Not Draining Near Me',
    problem: 'dishwasher not draining',
    answerBox: 'Dishwasher not draining near you in the GTA? We fix dishwasher drain issues same-day. Common causes: blocked filter basket, failed drain pump, kinked drain hose, or faulty check valve. Typical repair $120–$350. 90-day warranty. Call (437) 524-1053.',
    faqSpecific: [
      {q:'Why is my dishwasher not draining?', a:'Dishwashers fail to drain due to a clogged filter basket, a blocked or kinked drain hose, a failed drain pump, a faulty check valve, or a garbage disposal connection issue. We identify the exact cause and fix it same-day.'},
      {q:'How much does it cost to fix a dishwasher not draining near me?', a:'Dishwasher drain repair typically costs $120–$350 in the GTA. Clearing a filter clog is quick and inexpensive; replacing a drain pump is more involved. Firm quote before any work starts.'},
      {q:'Can the dishwasher not draining be fixed the same day?', a:'Yes, we offer same-day dishwasher repair across the GTA. Call (437) 524-1053 before 2 PM for a same-day appointment.'},
      {q:'Can I clear the dishwasher drain myself?', a:'You can clean the filter basket and check the drain hose for kinks — these are simple DIY steps. If that doesn\'t resolve it, call us to check the drain pump and check valve.'},
      {q:'What brands of dishwashers do you repair near me?', a:'We repair Samsung, LG, Bosch, KitchenAid, Whirlpool, GE, Frigidaire, Miele, Maytag, and Kenmore dishwashers throughout the GTA.'},
      {q:'Do you warranty dishwasher not draining repairs?', a:'Yes, 90-day warranty on all parts and labor. Same issue within 90 days? We fix it free.'},
      {q:'Could the garbage disposal be causing my dishwasher not to drain?', a:'Yes! If your dishwasher drains into the garbage disposal and the knockout plug was never removed, or the disposal is clogged, water won\'t drain. Our technicians check this as part of the diagnostic.'},
      {q:'How do I book dishwasher repair near me?', a:'Call (437) 524-1053 or use the booking form above. Under 2 minutes to schedule.'}
    ]
  },
  {
    slug: 'oven-not-heating-near-me',
    service: SERVICES[4],
    h1: 'Oven Not Heating Near Me — Same-Day Repair GTA',
    title: 'Oven Not Heating Near Me',
    problem: 'oven not heating',
    answerBox: 'Oven not heating near you? We repair electric and gas ovens same-day across the GTA. Common causes: failed bake element, faulty igniter (gas), blown thermal fuse, or defective control board. Typical repair $130–$380. 90-day warranty. Call (437) 524-1053.',
    faqSpecific: [
      {q:'Why is my oven not heating?', a:'Electric ovens typically fail to heat because of a burnt-out bake or broil element, a faulty temperature sensor, or a defective control board. Gas ovens usually fail due to a weak igniter, a faulty gas valve, or a safety thermostat issue.'},
      {q:'How much does it cost to fix an oven not heating near me?', a:'Oven not heating repair in the GTA typically costs $130–$380. Replacing a bake element is on the lower end; control board replacement is higher. Upfront quote before we start.'},
      {q:'Can you fix an oven not heating the same day?', a:'Yes, we offer same-day oven repair across the GTA. Most bake element replacements and igniter repairs are completed on the first visit.'},
      {q:'Is an oven element replacement worth it?', a:'Yes — bake elements are relatively affordable parts and the repair is straightforward. An oven in good condition is well worth a $130–$200 element replacement.'},
      {q:'Do you repair both gas and electric ovens near me?', a:'Yes, we repair both gas and electric ovens throughout the GTA, including ranges, wall ovens, and double ovens.'},
      {q:'What oven brands do you repair near me?', a:'We repair Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, KitchenAid, Maytag, Miele, Wolf, and more.'},
      {q:'Is there a warranty on oven not heating repairs?', a:'Yes, all repairs come with a 90-day warranty on parts and labor.'},
      {q:'How do I book oven repair near me same-day?', a:'Call (437) 524-1053 or use the booking form on this page. Monday–Saturday 8am–8pm, Sunday 9am–6pm across the GTA.'}
    ]
  },
  {
    slug: 'washer-making-noise-near-me',
    service: SERVICES[1],
    h1: 'Washer Making Noise Near Me — Same-Day Repair GTA',
    title: 'Washer Making Noise Near Me',
    problem: 'washer making noise',
    answerBox: 'Washer making loud noise near you? We diagnose and fix washing machine noise problems same-day across the GTA. Common causes: worn drum bearings, damaged drive belt, foreign object in drum, or failing motor coupling. Typical repair $120–$350. 90-day warranty. Call (437) 524-1053.',
    faqSpecific: [
      {q:'Why is my washer making a loud noise?', a:'Loud noises in a washer are commonly caused by worn drum bearings (rumbling/grinding), a damaged or loose drive belt (squealing), a foreign object caught in the drum or pump (banging/rattling), or a failing motor coupling.'},
      {q:'How much does it cost to fix a noisy washer near me?', a:'Fixing a noisy washing machine in the GTA typically costs $120–$350. Bearing replacement is more involved and on the higher end; clearing a foreign object or replacing a belt is less expensive.'},
      {q:'Can you fix a noisy washer the same day?', a:'Yes, we offer same-day washing machine repair across the GTA. Most noise issues are diagnosed and repaired on the first visit.'},
      {q:'Is it worth fixing a washer with bad bearings?', a:'It depends on the age and model of the washer. We\'ll give you an honest quote and recommendation — if the repair cost approaches the replacement cost of the appliance, we\'ll tell you.'},
      {q:'What kinds of noises do you fix?', a:'We repair grinding, squealing, banging, thumping, rattling, and humming noises in washing machines. Each sound pattern points to a different fault, which we diagnose with precision.'},
      {q:'What brands of washers do you repair near me?', a:'We repair Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, KitchenAid, and all other major brands throughout the GTA.'},
      {q:'Is there a warranty on noisy washer repairs?', a:'Yes, all repairs come with a 90-day warranty on parts and labor.'},
      {q:'How do I book washer repair near me?', a:'Call (437) 524-1053 or use the booking form above. Monday–Saturday 8am–8pm, Sunday 9am–6pm.'}
    ]
  },
  {
    slug: 'fridge-leaking-near-me',
    service: SERVICES[0],
    h1: 'Fridge Leaking Water Near Me — Same-Day Repair GTA',
    title: 'Fridge Leaking Near Me',
    problem: 'fridge leaking',
    answerBox: 'Fridge leaking water near you? We fix refrigerator water leaks same-day across the GTA. Common causes: blocked defrost drain, cracked water line, faulty door seal, or ice maker leak. Typical repair $150–$400. 90-day warranty. Call (437) 524-1053.',
    faqSpecific: [
      {q:'Why is my fridge leaking water?', a:'Refrigerators leak due to a blocked defrost drain tube (most common), a cracked or loose water supply line, a faulty water inlet valve, a worn door gasket, or an ice maker issue. We identify the source and fix it same-day.'},
      {q:'How much does it cost to fix a leaking fridge near me?', a:'Fridge leak repair in the GTA typically costs $150–$400. Clearing a blocked defrost drain is on the lower end; replacing a water inlet valve or ice maker components is higher.'},
      {q:'Is a leaking fridge dangerous?', a:'A water leak can damage your floors and cabinets and create a slip hazard. It\'s best to address it promptly. Call us for same-day service.'},
      {q:'Can you fix a leaking fridge the same day?', a:'Yes, we offer same-day refrigerator repair across the GTA. Call before 2 PM for a same-day appointment. Technicians arrive within 2–4 hours.'},
      {q:'How do I stop the fridge from leaking until the technician arrives?', a:'If you have a water line connected (for ice maker/water dispenser), shut off the supply valve under the sink or behind the fridge. Place towels around the base to protect your floor. Don\'t unplug the fridge unless there is an electrical hazard.'},
      {q:'What brands of fridges do you repair for leaks near me?', a:'We repair all brands including Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, KitchenAid, and Sub-Zero throughout the GTA.'},
      {q:'Is there a warranty on fridge leak repairs?', a:'Yes, 90-day warranty on all parts and labor.'},
      {q:'How do I book fridge repair near me?', a:'Call (437) 524-1053 or use the booking form above. Takes under 2 minutes.'}
    ]
  },
  {
    slug: 'freezer-not-working-near-me',
    service: SERVICES[0],
    h1: 'Freezer Not Working Near Me — Same-Day Repair GTA',
    title: 'Freezer Not Working Near Me',
    problem: 'freezer not working',
    answerBox: 'Freezer not working near you? We provide same-day freezer repair across the GTA for all brands. Common causes: failed evaporator fan, defrost system failure, compressor fault, or refrigerant issue. Typical repair $150–$400. Don\'t lose your food — call (437) 524-1053 now.',
    faqSpecific: [
      {q:'Why is my freezer not working or not freezing?', a:'A freezer that won\'t freeze is usually caused by a failed evaporator fan motor (cold air can\'t circulate), a defrost system failure causing ice buildup on coils, a faulty thermostat, a failing compressor, or a refrigerant leak.'},
      {q:'How much does it cost to fix a freezer not working near me?', a:'Freezer repair in the GTA typically costs $150–$400. Evaporator fan replacement or defrost heater repair is on the lower end; compressor or refrigerant issues are higher. Upfront quote before any work starts.'},
      {q:'Can you fix a freezer not working the same day?', a:'Yes, freezer failures are urgent — frozen food is at risk. We offer same-day service across the GTA. Call (437) 524-1053 before 2 PM for a same-day appointment.'},
      {q:'Is it worth repairing a freezer or should I replace it?', a:'For most freezers under 10–12 years old, repair is cost-effective. We\'ll give you an honest assessment and a firm quote. If replacement makes more sense, we\'ll tell you.'},
      {q:'My freezer is running but not freezing — what does that mean?', a:'If the freezer runs but doesn\'t freeze, the most likely culprits are a blocked evaporator coil (frost build-up from a defrost failure), a stuck evaporator fan, or a low refrigerant charge. Our technicians diagnose this quickly.'},
      {q:'What brands of freezers do you repair near me?', a:'We repair all brands including Samsung, LG, Whirlpool, GE, Frigidaire, Kenmore, Maytag, KitchenAid, Miele, and Sub-Zero throughout the GTA.'},
      {q:'Do you repair chest freezers and upright freezers?', a:'Yes, we repair chest freezers, upright freezers, and the freezer compartment in refrigerator-freezer combos.'},
      {q:'How do I book same-day freezer repair near me?', a:'Call (437) 524-1053 or use the online booking form on this page. Monday–Saturday 8am–8pm, Sunday 9am–6pm.'}
    ]
  }
];

function getProblemFAQHtml(faqItems) {
  return faqItems.map(item => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${item.q}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${item.a}</p></div>
  </div>
</div>`).join('\n');
}

PROBLEM_PAGES.forEach(entry => {
  const service  = entry.service;
  const filename = `${entry.slug}.html`;

  const vars = {
    META_TITLE:       `${entry.title} | Same-Day GTA Repair | (437) 524-1053`,
    META_DESC:        `${entry.title} in the GTA? Same-day repair service available. ${service.price} typical cost. 4.9★ rated, 90-day warranty. Licensed technicians. Call (437) 524-1053.`,
    CANONICAL:        `https://appliancerepairneary.com/${filename}`,
    H1:               entry.h1,
    ANSWER_BOX:       entry.answerBox,
    BREADCRUMB:       getNearMeBreadcrumbSchema(entry.slug, entry.h1),
    CONTENT_INTRO:    `<p>If you're searching for <strong>${entry.problem} repair near me</strong> in the Toronto area, our certified appliance technicians are ready to help — same-day. We cover the entire GTA: Toronto, Scarborough, North York, Etobicoke, Mississauga, Brampton, Vaughan, Richmond Hill, Markham, Oakville, Burlington, Pickering, Ajax, Whitby, and Oshawa.</p>
<h2>How We Diagnose and Fix ${entry.title.replace(' Near Me','')}</h2>
<p>Our technicians carry advanced diagnostic tools to pinpoint the exact fault quickly. We stock parts for all major brands so most repairs are completed on the very first visit. You receive a firm quote before any work begins — no surprises.</p>
<ul>
  <li>Same-day service available across all GTA cities</li>
  <li>4.9★ rated — 5,200+ GTA customers served</li>
  <li>All brands repaired: Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Maytag, KitchenAid, Kenmore</li>
  <li>Upfront written quote before repair begins</li>
  <li>90-day warranty on all parts and labour</li>
</ul>
<h2>What to Expect</h2>
<p>Book online or call (437) 524-1053. We confirm your appointment by text and arrive on time. After diagnosis we explain the problem in plain language, provide a written quote, and fix it — usually on the same visit. Payment is collected after the work is complete to your satisfaction.</p>`,
    SERVICE_NAME:     service.name,
    CITY_NAME:        "Toronto & GTA",
    FAQ_ITEMS:        getProblemFAQHtml(entry.faqSpecific),
    RELATED_SERVICES: getNearMeRelatedServices(service),
    RELATED_CITIES:   getNearMeRelatedCities(service),
    SCHEMA_JSON:      getNearMeSchema(service, entry.title)
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, filename), renderPage(vars), 'utf8');
  count++;
  console.log(`[${count}] ${filename}`);
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

console.log(`\nDone! Generated ${count} pages total.`);
console.log(`  • 90 service×city pages`);
console.log(`  •  7 "near me" service pages`);
console.log(`  •  8 problem "near me" pages`);
console.log(`  Total: ${count}`);
