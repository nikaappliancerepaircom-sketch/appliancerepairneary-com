const fs = require('fs');
const path = require('path');

const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Instrument Sans',-apple-system,sans-serif;background:#fff;color:#0a0a0a;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 24px}.breadcrumb{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fafafa}.breadcrumb .container{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.breadcrumb a{font-size:.8125rem;font-weight:500;color:#6b7280}.breadcrumb-sep{font-size:.8125rem;color:#d1d5db}.breadcrumb-current{font-size:.8125rem;font-weight:600;color:#0a0a0a}.page-hero{padding:56px 0 48px;background:#fff;border-bottom:1px solid #e5e7eb}.page-hero .container{max-width:800px}.page-hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:16px}.page-hero-eyebrow::before{content:'';display:block;width:16px;height:2px;background:#2563eb}h1.page-h1{font-size:clamp(1.875rem,4vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:24px}.answer-box{background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;padding:20px 24px;margin-bottom:32px;font-size:1rem;color:#1e40af;line-height:1.7;font-weight:500}.page-hero-ctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:700;padding:14px 24px;border-radius:4px;white-space:nowrap}.btn-secondary{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#2563eb;font-size:1rem;font-weight:700;padding:13px 22px;border-radius:4px;border:1.5px solid #2563eb;white-space:nowrap}.trust-bar{background:#0a0a0a;padding:14px 0}.trust-bar-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0}.trust-item{display:flex;align-items:center;gap:8px;padding:4px 24px;border-right:1px solid rgba(255,255,255,.1);font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap}.trust-item:last-child{border-right:none}.section-label{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#2563eb;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section-title{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;line-height:1.15;margin-bottom:16px}main.page-main{padding:56px 0 0}.content-intro{max-width:760px;font-size:1.0625rem;color:#374151;line-height:1.75;margin-bottom:56px}.content-intro h2{font-size:1.375rem;font-weight:700;color:#0a0a0a;letter-spacing:-.02em;margin-top:32px;margin-bottom:12px}.content-intro p{margin-bottom:16px}.content-intro ul{margin:16px 0;padding-left:0;list-style:none}.content-intro ul li{padding:6px 0 6px 20px;position:relative;font-size:1rem;color:#374151}.content-intro ul li::before{content:'Arrow';position:absolute;left:0;color:#2563eb;font-weight:700}.service-details{padding:48px 0;border-top:1px solid #e5e7eb}.problems-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}.problem-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px}.problem-name{font-size:.9375rem;font-weight:700;color:#0a0a0a;margin-bottom:6px}.problem-desc{font-size:.875rem;color:#6b7280;line-height:1.5}.pricing-table{width:100%;border-collapse:collapse;margin-top:24px;font-size:.9375rem}.pricing-table th,.pricing-table td{padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:left}.pricing-table th{background:#f9fafb;font-weight:600;color:#0a0a0a;font-size:.8125rem;text-transform:uppercase;letter-spacing:.05em}.pricing-table td:last-child{font-weight:600;color:#2563eb;white-space:nowrap}.pricing-note{font-size:.8125rem;color:#6b7280;margin-top:12px;line-height:1.5}.booking-section{padding:56px 0;border-top:1px solid #e5e7eb;text-align:center}.booking-section h2{font-size:1.75rem;font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:12px}.booking-alt{font-size:.9375rem;color:#6b7280;margin-top:16px}.booking-alt a{color:#2563eb;font-weight:600}.faq-section{padding:56px 0;border-top:1px solid #e5e7eb}.faq-section h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:32px}.faq-item{border-bottom:1px solid #e5e7eb}.faq-question{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;gap:16px;list-style:none;font-weight:600;font-size:1rem;color:#0a0a0a}.faq-question::-webkit-details-marker{display:none}.faq-icon{font-size:1.25rem;color:#2563eb;flex-shrink:0;transition:transform .2s}details[open] .faq-icon{transform:rotate(45deg)}.faq-answer{padding:0 0 18px;font-size:.9375rem;color:#374151;line-height:1.7}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.related-link{display:block;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;font-weight:500;color:#2563eb;transition:border-color .15s}.related-link:hover{border-color:#2563eb}footer.site-footer{background:#0a0a0a;color:rgba(255,255,255,.7);padding:40px 0;margin-top:80px}footer .container{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}footer p{font-size:.875rem;line-height:1.6}footer a{color:#93c5fd;font-weight:500}.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:10px}.sticky-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:50px;font-size:.9375rem;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap}.sticky-book{background:#2563eb;color:#fff}.fade-in{opacity:0;transition:opacity .35s ease}.fade-in.visible{opacity:1}@media(max-width:768px){.problems-grid{grid-template-columns:1fr}}@media(max-width:640px){.page-hero{padding:40px 0 36px}h1.page-h1{font-size:1.75rem}.sticky-cta{display:none}}`;

const data = {
  bankview:{name:'Bankview',slug:'bankview',area:'Inner City SW',lat:51.0364,lng:-114.0964,dist:'8-10',
    washerIntro:"Bankview's steep hillside lots and 1920s-30s character homes create some of Calgary's most interesting laundry room configurations. Many homes have retrofitted laundry in narrow main-floor closets or compact basement utility areas, where stackable front-load washer-dryer combinations from Samsung and LG are common. Others retain original basement setups with full-size top-load washers. Our technicians assess available clearance and access routes before every Bankview washer repair call. Calgary's 150-200 ppm hard water affects drum seals and bearing life in Bankview homes, and the older original plumbing in 1920s bungalows sometimes means slower fill rates that can trigger error codes on newer high-efficiency washers. We account for local plumbing conditions during diagnosis to avoid misidentifying a fill-related error as an electronic fault.",
    washerIssues:['Compact stackable unit repair — Samsung and LG in retrofitted closet laundry rooms','Top-load washer lid switch and pump failure in original basement utility rooms','Hard water effect on drum bearings and detergent residue buildup in Bankview','Slow fill error codes — caused by older narrow supply lines in 1920s homes'],
    fridgeIntro:"Bankview's hillside setting and character home kitchens mean refrigerators often occupy tight spaces where French door models may not open fully against walls. Counter-depth refrigerators are particularly popular in Bankview renovations. Common Bankview fridge issues include evaporator fan motor failures across Samsung, GE, and Whirlpool models; defrost system faults in Maytag and Kenmore units; and compressor relay problems. Calgary's 150-200 ppm water hardness affects ice makers in fridges with water dispensers, and Bankview's older homes sometimes have partially calcified water lines that compound inlet valve scale.",
    fridgeIssues:['Counter-depth French door fridge repair in tight Bankview kitchen spaces','Evaporator fan motor failure — Samsung, GE, Whirlpool most common in Bankview','Defrost heater or thermostat fault — frost buildup blocking evaporator airflow','Ice maker inlet valve scaled by Calgary 150-200 ppm hard water']
  },
  glendale:{name:'Glendale',slug:'glendale',area:'SW Calgary',lat:51.0186,lng:-114.1539,dist:'15-18',
    dishwasherIntro:"Glendale is a well-established 1960s SW Calgary neighbourhood near Glenmore Trail, characterized by detached bungalows and split-level homes on generous lots. Dishwashers in Glendale tend to be mid-range units from Whirlpool, Kenmore, and GE in the 10-15 year old range. Calgary's 150-200 ppm hard water causes calcium deposits on spray arm nozzles, heating elements, and inlet valve screens, producing cloudy dishes and poor wash coverage. Our technicians carry hard water test equipment to accurately assess scale impact before recommending parts versus cleaning-based solutions. Same-day service from our 700 6th Ave SW location to Glendale takes approximately 15-18 minutes.",
    dishwasherIssues:['Spray arm scale from Calgary 150-200 ppm water — nozzles blocked in older Glendale units','Heating element failure — dishes not drying in Whirlpool and GE models','Kenmore control board faults — cycle errors in 10-15 year old units in Glendale','Drain pump failure — standing water after cycle in split-level Glendale homes'],
    washerIntro:"Glendale's 1960s split-level and bungalow homes typically have dedicated laundry rooms, making washer repair straightforward. The neighbourhood's appliance mix includes older top-load Whirlpool and Kenmore machines alongside newer front-load Samsung and LG units. Hard water at 150-200 ppm contributes to detergent residue in both machine types, and older Glendale homes may have slightly reduced water pressure that triggers fill-related error codes in high-efficiency front-load models. Our technicians typically reach Glendale within 15-18 minutes from our 700 6th Ave SW location.",
    washerIssues:['Top-load agitator failure — Whirlpool and Kenmore models in Glendale bungalows','Front-load drum bearing noise — worn bearings in Samsung and LG after 8+ years','Drain pump failure — water standing after cycle in split-level Glendale laundry rooms','Control board errors — electronic faults in newer high-efficiency washer models'],
    fridgeIntro:"Glendale's spacious 1960s homes accommodate full-size and French door refrigerators comfortably. Common fridge brands in Glendale include Whirlpool, Samsung, GE, and Frigidaire. Refrigerator cooling failures during Calgary's summer months are urgent — our priority dispatch means Glendale homeowners can receive same-day fridge repair when they book before noon. The most common causes of fridge failure in Glendale are evaporator fan motor burnout, defrost thermostat failure, and compressor start relay failure. Calgary's 150-200 ppm water hardness affects ice maker function through inlet valve scale.",
    fridgeIssues:['Fridge not cooling — evaporator fan motor or start relay failure in Glendale homes','Freezer frost buildup — defrost heater or thermostat fault blocking airflow','Ice maker not producing ice — water inlet valve scaled by Calgary hard water','Water pooling inside fridge — clogged defrost drain pan or drain line']
  },
  lakeview:{name:'Lakeview',slug:'lakeview',area:'SW Calgary',lat:51.0057,lng:-114.1433,dist:'18-22',
    dishwasherIntro:"Lakeview is a desirable 1960s SW Calgary neighbourhood along the Glenmore Reservoir, where large lots attract established families who invest in premium appliances. Bosch, KitchenAid, Miele, and Samsung are common dishwasher brands in Lakeview kitchens. Calgary's 150-200 ppm hard water is particularly damaging to high-end dishwashers: Miele circulation pumps and Bosch wash motors accumulate scale faster without regular rinse aid use. Our technicians are trained to service premium brand dishwashers in Lakeview, carrying OEM-grade parts for Bosch, Miele, and KitchenAid. From our 700 6th Ave SW dispatch, Lakeview is approximately 18-22 minutes.",
    dishwasherIssues:['Miele circulation pump scale damage from Calgary 150-200 ppm hard water in Lakeview','Bosch control module errors in 800 series — E15, E24, E25 fault codes','KitchenAid heating element and drying fan failure in upper-end Lakeview models','Hard water film on dishwasher interior — etched glassware from calcium deposits'],
    washerIntro:"Lakeview homeowners investing in premium kitchen appliances often extend that preference to laundry — Miele, Electrolux, and LG washing machines are among the higher-end units we service in this neighbourhood. Lakeview's renovated homes feature dedicated laundry rooms with premium stackable or side-by-side units. Drum bearing wear, door boot seal failures, and electronic control board issues are the most common service calls for these premium models. Our technicians carry OEM or OEM-equivalent parts for Miele, Electrolux, and LG front-load units, enabling first-visit repair in most Lakeview calls.",
    washerIssues:['Miele and Electrolux front-load repair — precision European units common in Lakeview','LG drum bearing noise — worn bearings in high-cycle-count machines in Lakeview','Front-load door boot seal mould — OEM seal replaced same-day in Lakeview','Electronic control board fault — washer displays error code and will not start'],
    fridgeIntro:"Lakeview's premium home market includes Sub-Zero, Miele, and Samsung Family Hub units alongside Whirlpool and KitchenAid refrigerators. Lakeview homeowners appreciate reliable same-day service when a refrigerator fails. Calgary's 150-200 ppm hard water contributes to ice maker inlet valve scale across all fridge brands in Lakeview. We carry diagnostic tools for both standard and smart connected refrigerators, and advise Lakeview customers on preventive hard water maintenance during every service call.",
    fridgeIssues:['Premium fridge repair — KitchenAid, Miele, Samsung, Whirlpool in Lakeview homes','Ice maker failure — inlet valve scaled by Calgary 150-200 ppm hard water','Evaporator fan motor or compressor relay failure — fridge warm but freezer cold','Defrost system fault — frost buildup blocking evaporator coil airflow in all brands']
  },
  bayview:{name:'Bayview',slug:'bayview',area:'SW Calgary',lat:50.9948,lng:-114.1312,dist:'20-24',
    dishwasherIntro:"Bayview is a quiet 1960s-70s SW residential neighbourhood along the Elbow River near Glenmore Reservoir. Its curving streets and mature tree canopy attract homeowners who maintain their properties carefully. Dishwasher repair in Bayview spans older Kenmore and GE units in original kitchens alongside Bosch and Samsung in recently updated spaces. Calgary's 150-200 ppm hard water causes calcium scale on spray arms, heating elements, and inlet valve screens within 3-5 years without regular rinse aid use. Our technicians include a hard water impact assessment as standard practice on every Bayview dishwasher service call.",
    dishwasherIssues:['Calcium scale on spray arms — Calgary 150-200 ppm hard water deposits within 3-5 years','Kenmore and GE pump replacement in original 1960s-70s Bayview kitchens','Bosch and Samsung in renovated Bayview homes — control board and circulation pump repair','Door latch assembly failure — common in dishwashers over 10 years old'],
    washerIntro:"Bayview's mix of original 1960s-70s homes and renovated properties creates a varied washer repair landscape. Original basement laundry rooms house older top-load Whirlpool and Maytag machines, while renovated main-floor laundry areas feature compact LG or Samsung front-load stackables. The Elbow River proximity gives Bayview a slightly higher ambient humidity than inland SW neighbourhoods, which can accelerate door boot seal mould in front-load washers kept in poorly ventilated spaces. Calgary's 150-200 ppm hard water remains a consistent factor in drum bearing and seal wear across all Bayview washer types.",
    washerIssues:['Compact front-load stackable repair — LG and Samsung in renovated Bayview laundry rooms','Top-load washer lid switch and agitator failure in original 1960s-70s setups','Door boot seal mould — elevated humidity near Elbow River accelerates seal degradation','Drain pump failure — standing water after cycle in both front-load and top-load units'],
    fridgeIntro:"Bayview homeowners tend to keep their appliances longer than the Calgary average — the neighbourhood has a stable resident base that values quality repair over premature replacement. Common fridge service calls in Bayview include evaporator fan motor failures in Samsung and GE models, defrost thermostat failures in older Kenmore and Frigidaire units, and compressor relay problems. Calgary's 150-200 ppm water hardness is a factor in ice maker maintenance in all Bayview homes with water-dispensing fridges. We are typically 20-24 minutes from Bayview from our 700 6th Ave SW base.",
    fridgeIssues:['Evaporator fan motor failure — fridge warm and freezer cold in Samsung and GE units','Defrost thermostat failure — frost accumulation in Kenmore and Frigidaire models','Compressor start relay — clicking noise with no cooling in older Bayview fridges','Ice maker not working — inlet valve restricted by Calgary hard water scale']
  },
  patterson:{name:'Patterson',slug:'patterson',area:'SW Calgary',lat:51.0268,lng:-114.1832,dist:'18-22',
    dishwasherIntro:"Patterson is a prestigious 1980s SW Calgary neighbourhood on the hillside west of Glenmore Reservoir, known for its executive homes and dramatic city views. Kitchens in Patterson are frequently renovated with premium appliances — Bosch 800 series, Miele, and KitchenAid integrated dishwashers are among the most common service calls. Calgary's 150-200 ppm hard water is a significant concern for precision Bosch and Miele wash systems — calcium scale on circulation pumps and spray nozzles degrades performance faster than expected without regular rinse aid use. Our technicians carry OEM-grade parts for all premium brands and are trained for integrated panel-ready unit disassembly in Patterson's high-end kitchen renovations.",
    dishwasherIssues:['Bosch 800 series circulation pump scale from Calgary 150-200 ppm hard water','Miele integrated dishwasher — specialized disassembly in executive Patterson kitchen cabinetry','KitchenAid control board errors — electronic fault diagnosis in premium units','Hard water film and etching on glassware — calcium scale impact in Patterson homes'],
    washerIntro:"Patterson's executive homes often feature dedicated laundry rooms with premium appliances — Miele, Electrolux, and LG Signature washing machines are more common here than in most Calgary neighbourhoods. When precision European or premium American units develop faults, accurate diagnosis is critical — the wrong part ordered means an additional appointment. Our technicians carry service manuals and diagnostic tools for Miele and Electrolux washers, enabling on-the-spot fault diagnosis and first-visit repair in most cases. Patterson is approximately 18-22 minutes from our 700 6th Ave SW location.",
    washerIssues:['Miele and Electrolux precision washer repair — European brands common in Patterson homes','LG Signature and Samsung front-load — drum bearing and door seal repair','Executive laundry room configurations — often side-by-side units in built-in cabinetry','Water inlet valve and pressure issues — hillside location can affect supply pressure'],
    fridgeIntro:"Patterson's high-end homes feature premium refrigerators — Sub-Zero, Thermador, Miele, and KitchenAid column refrigerators alongside Samsung and LG. Our technicians approach each Patterson fridge repair with the thoroughness the neighbourhood expects: accurate diagnosis, clear written quote, and high-quality OEM parts. Calgary's 150-200 ppm water hardness affects ice makers and water dispensers across all fridge categories in Patterson, and we carry replacement inlet valves and ice maker assemblies for all major brands on every truck.",
    fridgeIssues:['Premium fridge repair — Sub-Zero, Miele, KitchenAid, Thermador in Patterson executive homes','Evaporator fan motor or compressor relay — most common first-visit repair in Patterson','Ice maker failure — inlet valve scale from Calgary 150-200 ppm hard water','Defrost system fault — frost blocking evaporator coil airflow in premium and standard models']
  },
  inglewood:{name:'Inglewood',slug:'inglewood',area:'Inner City SE',lat:51.0376,lng:-114.0226,dist:'8-12',
    dishwasherIntro:"Inglewood is Calgary's oldest neighbourhood, with development dating to the 1910s-20s along 9th Avenue SE — a vibrant heritage and arts district near the Bow River. Dishwasher repair in Inglewood spans century-old character homes with narrow kitchens and modern infill condominiums with premium integrated appliances. Original Inglewood cast iron or galvanized supply lines have diminished flow that compounds hard water scale risk beyond Calgary's standard 150-200 ppm baseline. Heritage home infill builds frequently feature Bosch 800 or Miele dishwashers requiring specialized panel-ready access techniques. Our technicians assess supply line condition on every Inglewood dishwasher service call.",
    dishwasherIssues:['Century-old plumbing compounds inlet valve scale beyond Calgary 150-200 ppm baseline','Bosch and Miele panel-ready units in Inglewood infill and heritage renovations','Drain pump failure — standing water in dishwasher across all Inglewood building types','Control board fault — Bosch E-code diagnosis in 500 and 800 series units'],
    washerIntro:"Inglewood's heritage homes and arts-district character attract creative professionals who appreciate quality repair. A washing machine failure in a busy Inglewood household is an urgent inconvenience — our same-day service means residents can book in the morning and have their washer repaired by early afternoon. Common service calls include front-load door seal failures in stackable LG and Samsung units in infill townhomes, and older top-load lid switch and pump failures in 1920s homes. Original Inglewood plumbing may compound fill-rate issues in high-efficiency washers. We are 8-12 minutes from Inglewood from our 700 6th Ave SW base.",
    washerIssues:['Front-load stackable repair — LG and Samsung in Inglewood infill townhomes and condos','Top-load lid switch and pump failure in original 1910s-20s Inglewood character homes','Heritage plumbing impact — older supply lines cause low-fill errors in HE washers','Drum bearing wear — noise during spin in machines over 8 years old'],
    fridgeIntro:"Inglewood's tight urban lots and heritage kitchen footprints mean refrigerators often need to be counter-depth or apartment-sized to fit the available space. Counter-depth Samsung and Bosch fridges are common in renovated Inglewood character homes, while infill condos often feature LG or Whirlpool bottom-freezer models. In some heritage homes, kitchen doorways are narrower than a standard fridge width, so diagnosis occurs in place without unit removal. Calgary's 150-200 ppm water hardness affects ice makers across all Inglewood fridge types. At 8-12 minutes from our 700 6th Ave SW base, we are among Inglewood's fastest-responding appliance repair services.",
    fridgeIssues:['Counter-depth and apartment-size fridge repair — common in tight Inglewood kitchens','Heritage home access — in-place diagnosis without unit removal in narrow original kitchens','Ice maker failure — inlet valve scaled by hard water and original plumbing restriction','Evaporator fan motor and compressor relay — most common cooling failures in Inglewood fridges']
  }
};

function buildPage(nbKey, service) {
  const d = data[nbKey];
  const svcLabel = service === 'dishwasher' ? 'Dishwasher' : service === 'washer' ? 'Washer' : 'Fridge';
  const svcFull = svcLabel + ' Repair';
  const urlSlug = service + '-repair-' + d.slug;
  const key = (d.slug.replace(/-/g,'') + service);

  let intro = '';
  let issues = [];
  if (service === 'dishwasher') { intro = d.dishwasherIntro || ''; issues = d.dishwasherIssues || []; }
  else if (service === 'washer') { intro = d.washerIntro || ''; issues = d.washerIssues || []; }
  else { intro = d.fridgeIntro || ''; issues = d.fridgeIssues || []; }

  const stdPrice = service === 'dishwasher' ? '$120 - $240' : '$120 - $260';
  const cplxPrice = service === 'dishwasher' ? '$240 - $380' : service === 'washer' ? '$260 - $420' : '$260 - $450';
  const maxRange = cplxPrice.split(' - ')[1];

  const stdRow = service === 'dishwasher'
    ? '<tr><td>Standard repair — drain pump, spray arm, inlet valve</td><td>'+stdPrice+'</td></tr>\n        <tr><td>Complex repair — control board, wash motor, sealed components</td><td>'+cplxPrice+'</td></tr>'
    : service === 'washer'
    ? '<tr><td>Standard repair — pump, belt, lid switch, inlet valve</td><td>'+stdPrice+'</td></tr>\n        <tr><td>Complex repair — drum bearing, motor, control board</td><td>'+cplxPrice+'</td></tr>'
    : '<tr><td>Standard repair — fan motor, relay, thermostat, drain</td><td>'+stdPrice+'</td></tr>\n        <tr><td>Complex repair — compressor, sealed system, control board</td><td>'+cplxPrice+'</td></tr>';

  const breadcrumbHref = service + '-repair-calgary';
  const breadcrumbLabel = svcFull + ' Calgary';
  const serviceType = service === 'dishwasher' ? 'Dishwasher Repair' : service === 'washer' ? 'Washer Repair' : 'Refrigerator Repair';

  const answerBox = service === 'dishwasher'
    ? `Same-day dishwasher repair in ${d.name}, Calgary. All major brands serviced. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty. Calgary 150&ndash;200 ppm hard water specialists.`
    : service === 'washer'
    ? `Same-day washing machine repair in ${d.name}, Calgary. All major brands fixed. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.`
    : `Same-day refrigerator repair in ${d.name}, Calgary. All major brands fixed. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.`;

  const faq1a = `${d.name} is approximately ${d.dist} minutes from our 700 6th Ave SW location. We typically dispatch within 2-3 hours of booking. Book before noon on weekdays for same-day service.`;
  const faq2q = service === 'dishwasher' ? `How does Calgary hard water affect dishwashers in ${d.name}?`
    : service === 'washer' ? `Do you repair both top-load and front-load washers in ${d.name}?`
    : `What refrigerator brands do you repair in ${d.name}?`;
  const faq2a = service === 'dishwasher'
    ? `Calgary's 150-200 ppm water hardness causes calcium scale on spray arms, heating elements, and inlet valves within 3-5 years. We assess hard water impact on every ${d.name} service call and recommend preventive rinse aid use.`
    : service === 'washer'
    ? `Yes — we service all washer types in ${d.name}. Brands include Samsung, LG, Whirlpool, Maytag, Kenmore, Miele, and Electrolux. Both top-load agitator and front-load high-efficiency models repaired.`
    : `We repair all major brands in ${d.name} including Samsung, LG, Whirlpool, GE, Frigidaire, KitchenAid, Kenmore, Maytag, Bosch, and Miele. All configurations serviced.`;
  const faq3a = `Most ${svcLabel.toLowerCase()} repairs in ${d.name} run ${stdPrice.replace(' - ',' to ')} to ${maxRange} CAD. The flat $65 diagnostic fee is waived when you proceed with the repair. Written quote before any work begins.`;

  const faqJSON = [
    `{"@type":"Question","name":"How quickly can you reach ${d.name} for ${svcLabel.toLowerCase()} repair?","acceptedAnswer":{"@type":"Answer","text":"${faq1a}"}}`,
    `{"@type":"Question","name":"${faq2q}","acceptedAnswer":{"@type":"Answer","text":"${faq2a}"}}`,
    `{"@type":"Question","name":"How much does ${svcLabel.toLowerCase()} repair cost in ${d.name}?","acceptedAnswer":{"@type":"Answer","text":"${faq3a}"}}`
  ].join(',');

  const problemCards = issues.slice(0,4).map(i => {
    const parts = i.split(' — ');
    return `<div class="problem-card"><div class="problem-name">${parts[0]}</div><div class="problem-desc">${parts[1] || 'Diagnosed and repaired same-day. Parts on truck for all common '+d.name+' models.'}</div></div>`;
  }).join('\n      ');

  const issueList = issues.map(i => `<li><strong>${i}</strong></li>`).join('\n      ');

  const otherNbs = Object.keys(data).filter(k=>k!==nbKey).slice(0,3);
  const altSvc = service === 'dishwasher' ? 'washer' : service === 'washer' ? 'fridge' : 'dishwasher';
  const altSvcLabel = altSvc === 'dishwasher' ? 'Dishwasher' : altSvc === 'washer' ? 'Washer' : 'Fridge';
  const relatedLinks = [
    ...otherNbs.map(o=>`<a href="/${service}-repair-${data[o].slug}" class="related-link">${svcFull} &mdash; ${data[o].name}</a>`),
    `<a href="/${altSvc}-repair-${d.slug}" class="related-link">${altSvcLabel} Repair &mdash; ${d.name}</a>`,
    `<a href="/${service}-repair-calgary" class="related-link">All Calgary ${svcFull}</a>`
  ].join('\n      ');

  const BOOK_URL = 'https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${svcFull} ${d.name} Calgary | Neary Appliance</title>
<meta name="description" content="${svcFull} in ${d.name}, Calgary - same-day service, flat $65 diagnostic. Serving ${d.area} homes. 90-day warranty. Book online.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://appliancerepairneary.com/${urlSlug}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>
${CSS}
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${svcFull} ${d.name} Calgary | Neary Appliance">
<meta property="og:url" content="https://appliancerepairneary.com/${urlSlug}">
<meta property="og:site_name" content="Appliance Repair Near You - Calgary">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"https://appliancerepairneary.com/${urlSlug}#business","name":"${svcFull} ${d.name} - Calgary Appliance Repair","description":"Same-day ${service} repair in ${d.name}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"https://appliancerepairneary.com/${urlSlug}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"geo":{"@type":"GeoCoordinates","latitude":${d.lat},"longitude":${d.lng}},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${d.name}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"${serviceType}"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>
<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/${breadcrumbHref}">${breadcrumbLabel}</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${d.name}</span>
  </div>
</nav>
<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">${d.area} &middot; ${d.name}</div>
    <h1 class="page-h1">${svcFull} in ${d.name}, Calgary</h1>
    <div class="answer-box">${answerBox}</div>
    <div class="page-hero-ctas">
      <a href="${BOOK_URL}" class="btn-primary">Book Online</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>
<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6" itemprop="description">Need ${service} repair in ${d.name}? Same-day, flat $65 diagnostic. <a href="${BOOK_URL}" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#2563eb;font-weight:600">calgary@appliancerepairneary.com</a>. Available 7 days a week.</p>
</div>
<div class="trust-bar" role="complementary" aria-label="Trust signals">
  <div class="trust-bar-inner">
    <div class="trust-item">&#128205; Local Technicians</div>
    <div class="trust-item">&#11088; 4.9/5 Rating</div>
    <div class="trust-item">&#9873; Same-Day Available</div>
    <div class="trust-item">&#10003; 90-Day Warranty</div>
  </div>
</div>
<main class="page-main container" id="main-content">
  <div class="content-intro fade-in">
    <h2>${svcFull} in ${d.name} - Fast, Reliable, Local</h2>
    <p>${intro}</p>
    <h2>Common ${svcLabel} Repair Issues in ${d.name}</h2>
    <ul>
      ${issueList}
    </ul>
    <h2>Repair Cost in ${d.name}</h2>
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most ${service} repairs in ${d.name}: ${stdPrice} to ${maxRange} parts and labour. Written quote before any work begins. All repairs include a 90-day parts and labour warranty.</p>
  </div>
  <section class="service-details fade-in" aria-label="Common problems and pricing">
    <div class="section-label">Common issues</div>
    <h2 class="section-title">Common ${svcLabel} Repair Problems We Fix in ${d.name}</h2>
    <div class="problems-grid">
      ${problemCards}
    </div>
    <div class="section-label" style="margin-top:48px">Pricing</div>
    <h2 class="section-title">${svcLabel} Repair Cost in ${d.name}</h2>
    <table class="pricing-table" aria-label="Repair pricing">
      <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
      <tbody>
        <tr><td>Diagnostic visit (waived when repair proceeds)</td><td>$65</td></tr>
        ${stdRow}
      </tbody>
    </table>
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts with 90-day parts and labour warranty.</p>
  </section>
  <section class="booking-section fade-in" aria-label="Book your repair">
    <div class="section-label">Online booking</div>
    <h2>Book ${svcLabel} Repair in ${d.name}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-${key}" src="${BOOK_URL}?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book ${svcLabel} Repair in ${d.name}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-${key}');if(el)el.style.height=e.data.height+'px'}});<\/script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> - Mon-Sat 8am-8pm, Sun 10am-6pm</p>
  </section>
  <section class="faq-section fade-in" aria-label="Frequently asked questions">
    <div class="container" style="padding:0">
      <h2>FAQ - ${svcLabel} Repair in ${d.name}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How quickly can you reach ${d.name} for ${svcLabel.toLowerCase()} repair?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${faq1a}</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">${faq2q}</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${faq2a}</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How much does ${svcLabel.toLowerCase()} repair cost in ${d.name}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${faq3a}</p></div></details>
      </div>
    </div>
  </section>
</main>
<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair Services in ${d.name} and Calgary</h2>
    <div class="related-grid">
      ${relatedLinks}
    </div>
  </div>
</div>
<footer class="site-footer" role="contentinfo" data-footer-region="calgary">
  <div class="container">
    <p><strong>Calgary Appliance Repair</strong> | Serving ${d.name} and all Calgary</p>
    <p>700 6th Avenue SW, Suite 1700, Calgary, AB T2P 0T8</p>
    <p>Email: <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> | <a href="${BOOK_URL}">Book Online</a></p>
    <p>Mon-Sat 8 AM-8 PM | Sun 10 AM-6 PM (Mountain Time)</p>
    <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
    <p>&copy; <span id="footer-year-${key}"></span> Appliance Repair Near You - Calgary</p>
  </div>
</footer>
<script>(function(){var el=document.getElementById('footer-year-${key}');if(el)el.textContent=new Date().getFullYear()})();<\/script>
<div class="sticky-cta" aria-label="Quick contact">
  <a href="${BOOK_URL}" class="sticky-btn sticky-book">Book Online &rarr;</a>
</div>
<script>document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('visible')})}});<\/script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqJSON}]}
<\/script>
</body>
</html>`;
}

const outDir = __dirname;
const toGen = [
  ['bankview','washer'],['bankview','fridge'],
  ['glendale','dishwasher'],['glendale','washer'],['glendale','fridge'],
  ['lakeview','dishwasher'],['lakeview','washer'],['lakeview','fridge'],
  ['bayview','dishwasher'],['bayview','washer'],['bayview','fridge'],
  ['patterson','dishwasher'],['patterson','washer'],['patterson','fridge'],
  ['inglewood','dishwasher'],['inglewood','washer'],['inglewood','fridge'],
];

let created = 0;
for (const [nb, svc] of toGen) {
  const html = buildPage(nb, svc);
  const slug = data[nb].slug;
  const fname = path.join(outDir, svc + '-repair-' + slug + '.html');
  fs.writeFileSync(fname, html, 'utf8');
  created++;
  console.log('Created: ' + path.basename(fname));
}
console.log('\nTotal created: ' + created);
