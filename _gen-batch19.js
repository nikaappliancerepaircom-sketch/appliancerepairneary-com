const fs = require('fs');
const path = require('path');

const DIR = 'C:/appliancerepairneary';

const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Instrument Sans',-apple-system,sans-serif;background:#fff;color:#0a0a0a;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 24px}.breadcrumb{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fafafa}.breadcrumb .container{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.breadcrumb a{font-size:.8125rem;font-weight:500;color:#6b7280}.breadcrumb-sep{font-size:.8125rem;color:#d1d5db}.breadcrumb-current{font-size:.8125rem;font-weight:600;color:#0a0a0a}.page-hero{padding:56px 0 48px;background:#fff;border-bottom:1px solid #e5e7eb}.page-hero .container{max-width:800px}.page-hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:16px}.page-hero-eyebrow::before{content:'';display:block;width:16px;height:2px;background:#2563eb}h1.page-h1{font-size:clamp(1.875rem,4vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:24px}.answer-box{background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;padding:20px 24px;margin-bottom:32px;font-size:1rem;color:#1e40af;line-height:1.7;font-weight:500}.page-hero-ctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:700;padding:14px 24px;border-radius:4px;white-space:nowrap}.btn-secondary{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#2563eb;font-size:1rem;font-weight:700;padding:13px 22px;border-radius:4px;border:1.5px solid #2563eb;white-space:nowrap}.trust-bar{background:#0a0a0a;padding:14px 0}.trust-bar-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0}.trust-item{display:flex;align-items:center;gap:8px;padding:4px 24px;border-right:1px solid rgba(255,255,255,.1);font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap}.trust-item:last-child{border-right:none}.section-label{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#2563eb;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section-title{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;line-height:1.15;margin-bottom:16px}main.page-main{padding:56px 0 0}.content-intro{max-width:760px;font-size:1.0625rem;color:#374151;line-height:1.75;margin-bottom:56px}.content-intro h2{font-size:1.375rem;font-weight:700;color:#0a0a0a;letter-spacing:-.02em;margin-top:32px;margin-bottom:12px}.content-intro p{margin-bottom:16px}.content-intro ul{margin:16px 0;padding-left:0;list-style:none}.content-intro ul li{padding:6px 0 6px 20px;position:relative;font-size:1rem;color:#374151}.content-intro ul li::before{content:'→';position:absolute;left:0;color:#2563eb;font-weight:700}.service-details{padding:48px 0;border-top:1px solid #e5e7eb}.problems-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}.problem-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px}.problem-name{font-size:.9375rem;font-weight:700;color:#0a0a0a;margin-bottom:6px}.problem-desc{font-size:.875rem;color:#6b7280;line-height:1.5}.pricing-table{width:100%;border-collapse:collapse;margin-top:24px;font-size:.9375rem}.pricing-table th,.pricing-table td{padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:left}.pricing-table th{background:#f9fafb;font-weight:600;color:#0a0a0a;font-size:.8125rem;text-transform:uppercase;letter-spacing:.05em}.pricing-table td:last-child{font-weight:600;color:#2563eb;white-space:nowrap}.pricing-note{font-size:.8125rem;color:#6b7280;margin-top:12px;line-height:1.5}.booking-section{padding:56px 0;border-top:1px solid #e5e7eb;text-align:center}.booking-section h2{font-size:1.75rem;font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:12px}.booking-alt{font-size:.9375rem;color:#6b7280;margin-top:16px}.booking-alt a{color:#2563eb;font-weight:600}.faq-section{padding:56px 0;border-top:1px solid #e5e7eb}.faq-section h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:32px}.faq-item{border-bottom:1px solid #e5e7eb}.faq-question{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;gap:16px;list-style:none;font-weight:600;font-size:1rem;color:#0a0a0a}.faq-question::-webkit-details-marker{display:none}.faq-icon{font-size:1.25rem;color:#2563eb;flex-shrink:0;transition:transform .2s}details[open] .faq-icon{transform:rotate(45deg)}.faq-answer{padding:0 0 18px;font-size:.9375rem;color:#374151;line-height:1.7}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.related-link{display:block;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;font-weight:500;color:#2563eb;transition:border-color .15s}.related-link:hover{border-color:#2563eb}footer.site-footer{background:#0a0a0a;color:rgba(255,255,255,.7);padding:40px 0;margin-top:80px}footer .container{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}footer p{font-size:.875rem;line-height:1.6}footer a{color:#93c5fd;font-weight:500}.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:10px}.sticky-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:50px;font-size:.9375rem;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap}.sticky-book{background:#2563eb;color:#fff}.fade-in{opacity:0;transition:opacity .35s ease}.fade-in.visible{opacity:1}@media(max-width:768px){.problems-grid{grid-template-columns:1fr}}@media(max-width:640px){.page-hero{padding:40px 0 36px}h1.page-h1{font-size:1.75rem}.sticky-cta{display:none}}`;

const neighborhoods = [
  {
    slug: 'rideau-park', display: 'Rideau Park', region: 'SW', eyebrow: 'Calgary SW · Rideau Park',
    dw_para: `Rideau Park is a small, exclusive SW Calgary community of around 675 homes perched above the Elbow River, developed primarily in the 1950s for Calgary's professional class. Its elevated location near Sandy Beach and Stanley Park gives it one of the most desirable addresses in the city. Homes here are large estate-style properties that have been continuously renovated, meaning kitchens in Rideau Park typically feature premium appliances — Miele, Bosch, and KitchenAid are the most common dishwasher brands encountered. The long ownership tenure in this neighbourhood means appliances are sometimes 15–20 years old and due for servicing rather than replacement. Calgary's 150–200 ppm Bow River water hardness creates persistent calcium scale on dishwasher heating elements and spray arm nozzles, and the vintage of many Rideau Park machines means our technicians frequently source legacy parts. Our same-day dispatch from 700 6th Ave SW puts Rideau Park within 10–15 minutes.`,
    dw_issues: ['Miele and KitchenAid legacy component sourcing for 15–20 year old units', 'Calcium scale on heating elements from 150–200 ppm water', 'Bosch circulation pump and door latch failures in older models', 'Estate kitchen integrated dishwasher panel alignment'],
    ws_para: `Rideau Park homes typically have large-capacity laundry rooms with stacked or side-by-side washer-dryer pairs. Miele and Electrolux front-load washers are common in renovated estates, alongside older Whirlpool and Maytag top-loaders in original 1950s service rooms. Washer repair here often involves drum bearing failures in older front-loaders or lid switch issues in top-load machines past the 15-year mark. We carry parts for all major brands and diagnose on the first visit.`,
    ws_issues: ['Miele front-load drum bearing and seal failures', 'Whirlpool top-loader lid switch and pump failures', 'Electrolux control board diagnostics and resets', 'Hard water mineral buildup on front-load door seals'],
    fr_para: `Refrigerator repair in Rideau Park means working with premium brands in well-appointed estate kitchens. Sub-Zero built-in refrigerators are common in fully renovated homes, alongside KitchenAid and LG French-door units in more recent kitchen updates. Ice maker failures and sealed system issues are the most frequent call types. Calgary's dry climate and seasonal temperature swings affect condenser performance in units over 10 years old.`,
    fr_issues: ['Sub-Zero sealed system and compressor diagnostics', 'KitchenAid ice maker assembly failures', 'LG French-door water inlet valve replacement', 'Condenser coil cleaning for 10+ year old units'],
    nearby_dw: ['dishwasher-repair-elbow-park|Dishwasher Repair — Elbow Park', 'dishwasher-repair-britannia|Dishwasher Repair — Britannia', 'dishwasher-repair-elboya|Dishwasher Repair — Elboya'],
    nearby_ws: ['washer-repair-elbow-park|Washer Repair — Elbow Park', 'washer-repair-britannia|Washer Repair — Britannia'],
    nearby_fr: ['fridge-repair-elbow-park|Fridge Repair — Elbow Park', 'fridge-repair-britannia|Fridge Repair — Britannia'],
  },
  {
    slug: 'roxboro', display: 'Roxboro', region: 'SW', eyebrow: 'Calgary SW · Roxboro',
    dw_para: `Roxboro is one of Calgary's tiniest and most exclusive residential communities — approximately 415 homes on the inner bend of the Elbow River in SW Calgary. Developed before 1950, Roxboro shares its character with Elbow Park and Rideau Park: large heritage lots, mature tree canopy, and homes continuously renovated with the most sophisticated kitchen appliances. Sub-Zero, Wolf, Gaggenau, and Miele are the brands most commonly encountered here. Dishwasher repair in Roxboro is almost exclusively premium-brand work — integrated Miele G7000 series and Gaggenau panel-ready units are found in recently renovated kitchens. Calgary's 150–200 ppm water hardness is particularly punishing for Gaggenau and Miele precision water management systems, where scale deposits in flow meters and AquaSensor components can trigger false-error shutdowns. Our technicians carry Gaggenau and Miele OEM diagnostic cables for accurate fault reading.`,
    dw_issues: ['Gaggenau and Miele AquaSensor and flow meter scale errors from hard water', 'Sub-Zero dishwasher integrated panel disassembly', 'Luxury brand OEM part sourcing for pre-2000 Miele models', 'Precision water temperature sensor calibration in premium units'],
    ws_para: `Washer repair in Roxboro involves premium European front-load machines almost exclusively. Miele W1 series, Electrolux Grand, and V-ZUG washers are found in estate laundry rooms here. These machines require specialized diagnostic software and OEM parts not available through mass-market distributors. We source Miele and V-ZUG parts directly and carry Miele diagnostic adapters on SW Calgary service runs.`,
    ws_issues: ['Miele W1 series bearing, seal, and control board failures', 'V-ZUG and Electrolux Grand diagnostic and repair', 'Premium front-load drum bearing replacement in estate laundry rooms', 'Hard water scale causing Miele drum seal deterioration'],
    fr_para: `Fridge repair in Roxboro almost always means Sub-Zero built-in columns or French-door refrigerators. These units require factory-trained diagnostic protocols for sealed system issues, compressor assessments, and ice maker replacement. We carry Sub-Zero service manuals and OEM gasket kits. Gaggenau refrigerator drawers and Miele integrated fridge columns are also found in fully appointed Roxboro kitchens.`,
    fr_issues: ['Sub-Zero built-in compressor and sealed system assessment', 'Gaggenau refrigerator drawer mechanism and cooling failures', 'Miele integrated fridge column temperature sensor replacement', 'Ice maker assembly and water line diagnostics in luxury units'],
    nearby_dw: ['dishwasher-repair-elbow-park|Dishwasher Repair — Elbow Park', 'dishwasher-repair-rideau-park|Dishwasher Repair — Rideau Park', 'dishwasher-repair-erlton|Dishwasher Repair — Erlton'],
    nearby_ws: ['washer-repair-elbow-park|Washer Repair — Elbow Park', 'washer-repair-mission|Washer Repair — Mission'],
    nearby_fr: ['fridge-repair-elbow-park|Fridge Repair — Elbow Park', 'fridge-repair-mission|Fridge Repair — Mission'],
  },
  {
    slug: 'parkhill', display: 'Parkhill', region: 'SW', eyebrow: 'Calgary SW · Parkhill',
    dw_para: `Parkhill is a quiet SW Calgary neighbourhood situated between the Elbow River and Macleod Trail, developed primarily before 1950. With approximately 1,770 residents, Parkhill retains much of its original residential character — bungalows and small two-storey homes, many now undergoing infill development and renovation. Dishwasher repair in Parkhill covers a wide range of appliance generations: original owners may have mid-range Whirlpool or Maytag units from the 1990s–2000s, while renovated infill homes often feature new Bosch 300 or 500 series integrated dishwashers. Calgary's Bow River water hardness of 150–200 ppm creates consistent calcium scale issues across all brands, particularly in older Whirlpool units where scale accumulates on the thermal fuse and float switch assembly. Our technicians dispatch from 700 6th Ave SW and are typically on-site in Parkhill within 20–25 minutes.`,
    dw_issues: ['Whirlpool and Maytag thermal fuse and float switch failures from scale buildup', 'Bosch 300 series door latch and spray arm cleaning', 'Infill home integrated dishwasher installation and repair', 'Calcium scale descaling on mid-range brands from 150–200 ppm water'],
    ws_para: `Parkhill's washer repair calls reflect the neighbourhood's mixed housing stock. Older bungalows typically have top-load Whirlpool or Maytag washers in original laundry closets, while renovated infill homes feature front-load Bosch or Samsung units. Common issues include lid switch failures in top-loaders, door boot seal tears in front-loaders, and control board errors in Samsung machines.`,
    ws_issues: ['Whirlpool top-loader lid switch and drive motor failures', 'Samsung front-load door boot seal and drum bearing replacement', 'Bosch washer drain pump and control module diagnostics', 'Hard water scale on door seals accelerating deterioration'],
    fr_para: `Fridge repair in Parkhill covers the full spectrum from 20-year-old Frigidaire top-freezer units to newer LG French-door models in renovated kitchens. Ice maker failures, water dispenser valve blockages, and compressor diagnostics are the most common service calls. We stock OEM parts for Whirlpool, LG, Samsung, and Frigidaire — the brands most prevalent in Parkhill homes.`,
    fr_issues: ['Frigidaire and Whirlpool compressor and condenser fan diagnostics', 'LG French-door ice maker assembly replacement', 'Samsung water dispenser valve and ice maker failures', 'Older top-freezer defrost system and thermostat replacement'],
    nearby_dw: ['dishwasher-repair-mission|Dishwasher Repair — Mission', 'dishwasher-repair-erlton|Dishwasher Repair — Erlton', 'dishwasher-repair-elbow-park|Dishwasher Repair — Elbow Park'],
    nearby_ws: ['washer-repair-mission|Washer Repair — Mission', 'washer-repair-erlton|Washer Repair — Erlton'],
    nearby_fr: ['fridge-repair-mission|Fridge Repair — Mission', 'fridge-repair-erlton|Fridge Repair — Erlton'],
  },
  {
    slug: 'cliff-bungalow', display: 'Cliff Bungalow', region: 'SW', eyebrow: 'Calgary SW · Cliff Bungalow',
    dw_para: `Cliff Bungalow is a small, dense inner-city SW Calgary neighbourhood adjacent to Mission, bounded by 4th Street SW and the Elbow River escarpment. Developed before 1950, it takes its name from the Craftsman bungalows that still line many of its streets, though infill development has added modern semi-detached homes and low-rise condominiums. Dishwasher repair in Cliff Bungalow means navigating both historic bungalow kitchens — often compact with older Whirlpool or GE dishwashers — and modern infill kitchens fitted with Bosch 500 or Miele integrated units. Condo units in the neighbourhood often have stacked or integrated European dishwashers requiring specialized access. Calgary's hard water at 150–200 ppm is particularly visible in compact Bosch units common in infill builds, where spray arm blockages occur within 2–3 years without regular maintenance.`,
    dw_issues: ['Compact Bosch dishwasher spray arm blockages from 150–200 ppm hard water', 'Older GE and Whirlpool bungalow-kitchen dishwasher pump failures', 'Infill semi-detached home Miele integrated panel disassembly', 'Condo-format dishwasher door latch and control module service'],
    ws_para: `Cliff Bungalow washers reflect the neighbourhood's dual character. Heritage bungalow laundry rooms contain compact or standard Whirlpool top-loaders, while infill and condo units tend toward Bosch or LG front-load stacked configurations. The compact front-load market here means door seal deterioration and drain pump blockages are the most common washer repair calls.`,
    ws_issues: ['LG stacked front-load door seal and drain pump failures', 'Whirlpool top-loader lid switch and drum bearing replacement', 'Bosch compact front-load motor and control board diagnostics', 'Hard water scale on front-load door seals in compact units'],
    fr_para: `Fridge repair in Cliff Bungalow ranges from compact counter-depth models in condo and infill kitchens to full-size LG and Samsung French-door units. Counter-depth Samsung and LG refrigerators dominate in renovated properties, with ice maker water valve failures being the most frequent call type. Older Frigidaire and GE top-freezer units remain in some unrenovated bungalows.`,
    fr_issues: ['Counter-depth Samsung and LG ice maker water valve failures', 'Compact fridge compressor and thermostat diagnostics in condo units', 'GE top-freezer defrost heater and thermostat replacement', 'LG French-door ice maker assembly and drawer seal replacement'],
    nearby_dw: ['dishwasher-repair-mission|Dishwasher Repair — Mission', 'dishwasher-repair-erlton|Dishwasher Repair — Erlton', 'dishwasher-repair-lower-mount-royal|Dishwasher Repair — Lower Mount Royal'],
    nearby_ws: ['washer-repair-mission|Washer Repair — Mission', 'washer-repair-lower-mount-royal|Washer Repair — Lower Mount Royal'],
    nearby_fr: ['fridge-repair-mission|Fridge Repair — Mission', 'fridge-repair-lower-mount-royal|Fridge Repair — Lower Mount Royal'],
  },
  {
    slug: 'meadowlark-park', display: 'Meadowlark Park', region: 'SW', eyebrow: 'Calgary SW · Meadowlark Park',
    dw_para: `Meadowlark Park is a compact, quiet residential pocket in SW Calgary near Glenmore Reservoir, developed in the 1950s with approximately 610 homes. Its 60–70 year old homes have largely been modernized through renovation. Dishwasher repair in Meadowlark Park typically involves mid-range Whirlpool, Maytag, or Frigidaire units from the 1990s–2000s that have been in continuous service, as well as Bosch and KitchenAid units in more recently renovated kitchens. Calgary's 150–200 ppm water hardness creates calcium buildup issues on all machines, particularly on older units where the water softening reservoir has never been serviced. Our dispatch from 700 6th Ave SW reaches Meadowlark Park in approximately 20 minutes via Glenmore Trail. The neighbourhood's small size means we are rarely delayed by other calls in the immediate area.`,
    dw_issues: ['Whirlpool and Maytag drain pump and water inlet valve failures', 'Frigidaire control board and door latch replacement in 1990s units', 'Bosch spray arm blockage from 150–200 ppm calcium scale', 'KitchenAid wash motor and pump assembly diagnostics'],
    ws_para: `Meadowlark Park washer repairs are predominantly top-load Whirlpool and Maytag machines in original laundry rooms, alongside newer Bosch or LG front-loaders in renovated homes. Top-loader lid switch, drive motor, and pump failures are the most common issues. LG front-loaders in renovated laundry spaces commonly develop drum bearing noise after the 5-year mark.`,
    ws_issues: ['Whirlpool and Maytag top-loader lid switch and drive belt failures', 'LG front-load drum bearing noise and door seal replacement', 'Bosch front-load drain pump and filter cleaning', 'Frigidaire washer control board and water valve diagnostics'],
    fr_para: `Refrigerator repair in Meadowlark Park covers mid-range Whirlpool, GE, and LG units typical of a 1950s-origin SW neighbourhood. French-door LG and Samsung fridges are the most common replacement purchase in renovated kitchens, with ice maker assembly failures being the leading repair category. Older GE and Frigidaire top-freezer units still in service require defrost thermostat and heater replacements.`,
    fr_issues: ['LG and Samsung French-door ice maker assembly replacement', 'Whirlpool and GE top-freezer defrost heater and thermostat diagnostics', 'Frigidaire condenser fan and compressor relay failures', 'Ice dispenser door actuator and water inlet valve replacements'],
    nearby_dw: ['dishwasher-repair-oakridge|Dishwasher Repair — Oakridge', 'dishwasher-repair-chinook-park|Dishwasher Repair — Chinook Park', 'dishwasher-repair-haysboro|Dishwasher Repair — Haysboro'],
    nearby_ws: ['washer-repair-oakridge|Washer Repair — Oakridge', 'washer-repair-haysboro|Washer Repair — Haysboro'],
    nearby_fr: ['fridge-repair-oakridge|Fridge Repair — Oakridge', 'fridge-repair-haysboro|Fridge Repair — Haysboro'],
  },
  {
    slug: 'mayfair', display: 'Mayfair', region: 'SW', eyebrow: 'Calgary SW · Mayfair',
    dw_para: `Mayfair is a small, affluent SW Calgary community of approximately 410 homes situated near Glenmore Reservoir and Elbow Drive, developed mid-century and retaining a quiet, upscale residential character. Homes are predominantly large bungalows and two-storey houses on generous lots, many having undergone complete kitchen renovations in the 2000s–2020s that brought premium appliance suites. Dishwasher repair in Mayfair commonly involves Miele, Bosch 800, and KitchenAid units — brands favoured by the neighbourhood's professional homeowner demographic. Calgary's 150–200 ppm hard water is the leading factor in premature component wear here, particularly affecting Miele's regeneration salt system and Bosch AquaStop water management modules. Given the high value of appliances serviced in Mayfair, we always bring OEM parts on service calls and offer written repair warranties.`,
    dw_issues: ['Miele regeneration salt system and AquaSensor failures from 150–200 ppm hard water', 'Bosch 800 series AquaStop valve and control module failures', 'KitchenAid wash pump motor and upper rack adjuster replacements', 'Premium brand OEM part procurement for estate kitchen dishwashers'],
    ws_para: `Washer repair in Mayfair reflects the neighbourhood's upscale character. Miele W1 series, Electrolux, and LG front-load washers are prevalent in renovated laundry rooms. Drum bearing wear, door boot seal deterioration, and control board failures are the most common call types. We carry Miele and Electrolux OEM parts for Mayfair service runs.`,
    ws_issues: ['Miele W1 front-load drum bearing and door seal failures', 'Electrolux front-load control board diagnostics', 'LG front-load tub bearing and drain pump replacement', 'Hard water mineral deposits on premium washer drum seals'],
    fr_para: `Refrigerator repair in Mayfair involves premium brands in renovated estate kitchens. Sub-Zero, KitchenAid, and LG Studio refrigerators are common. Sealed system assessments, ice maker replacements, and water dispenser valve repairs are the most frequent service requests. We service all premium refrigerator brands and carry OEM gasket kits.`,
    fr_issues: ['Sub-Zero compressor and sealed system diagnostics', 'KitchenAid and LG Studio ice maker assembly replacement', 'Premium refrigerator water dispenser inlet valve failures', 'Condenser fan motor and thermistor replacement in 10+ year old units'],
    nearby_dw: ['dishwasher-repair-bel-aire|Dishwasher Repair — Bel-Aire', 'dishwasher-repair-chinook-park|Dishwasher Repair — Chinook Park', 'dishwasher-repair-oakridge|Dishwasher Repair — Oakridge'],
    nearby_ws: ['washer-repair-bel-aire|Washer Repair — Bel-Aire', 'washer-repair-chinook-park|Washer Repair — Chinook Park'],
    nearby_fr: ['fridge-repair-bel-aire|Fridge Repair — Bel-Aire', 'fridge-repair-chinook-park|Fridge Repair — Chinook Park'],
  },
  {
    slug: 'shawnee-slopes', display: 'Shawnee Slopes', region: 'SW', eyebrow: 'Calgary SW · Shawnee Slopes',
    dw_para: `Shawnee Slopes is a small, upscale SW Calgary community of approximately 2,020 homes developed in the 1990s adjacent to Fish Creek Provincial Park. Its elevated position above the park ravine gives many homes panoramic views, and the neighbourhood's executive housing stock typically features premium or upper-mid-range kitchen appliances. Dishwasher repair in Shawnee Slopes commonly involves KitchenAid, Bosch, and Samsung units purchased during the neighbourhood's 1990s–2000s construction phase, now reaching the 20–25 year mark. Calgary's 150–200 ppm Bow River water hardness has had cumulative effects on these machines over two decades — spray arm nozzle blockages, heating element scale, and pump impeller wear are all common findings. Newer premium builds near the park edge feature Miele and Bosch 800 series, requiring different service protocols.`,
    dw_issues: ['KitchenAid and Bosch 1990s-era wash pump and drain pump failures', 'Samsung control board and door latch diagnostics in 20+ year old units', 'Calcium scale on heating elements from 20+ years at 150–200 ppm', 'Miele and Bosch 800 premium service in newer executive builds'],
    ws_para: `Washer repair in Shawnee Slopes involves a mix of late-model top-loaders and front-loaders. Maytag and Whirlpool high-efficiency top-loaders from 2005–2015 are common, along with Samsung and LG front-loaders in renovated laundry rooms. Lid actuator failures, bearing noise, and control board errors are the most frequent call types.`,
    ws_issues: ['Maytag and Whirlpool HE top-loader lid actuator and pump failures', 'Samsung front-load drum bearing noise and door seal replacement', 'LG front-load control board OE drain error diagnostics', 'Hard water deposits on front-load door boots accelerating tears'],
    fr_para: `Fridge repair in Shawnee Slopes typically involves Samsung and LG French-door models from the 2010s, alongside KitchenAid French-door and Whirlpool side-by-side units in older kitchens. Ice maker water valve failures and ice maker assembly replacement are the leading repair types. We carry OEM ice maker assemblies for all major brands.`,
    fr_issues: ['Samsung and LG French-door ice maker water valve and assembly failures', 'KitchenAid French-door ice dispenser door actuator replacement', 'Whirlpool side-by-side compressor and condenser fan diagnostics', 'Fish Creek temperature swings affecting outdoor-adjacent condenser performance'],
    nearby_dw: ['dishwasher-repair-somerset-calgary|Dishwasher Repair — Somerset', 'dishwasher-repair-evergreen-calgary|Dishwasher Repair — Evergreen', 'dishwasher-repair-millrise|Dishwasher Repair — Millrise'],
    nearby_ws: ['washer-repair-somerset-calgary|Washer Repair — Somerset', 'washer-repair-evergreen-calgary|Washer Repair — Evergreen'],
    nearby_fr: ['fridge-repair-somerset-calgary|Fridge Repair — Somerset', 'fridge-repair-evergreen-calgary|Fridge Repair — Evergreen'],
  },
  {
    slug: 'manchester', display: 'Manchester', region: 'SE', eyebrow: 'Calgary SE · Manchester',
    dw_para: `Manchester is a small SE Calgary community with mixed industrial and residential zoning, located south of the Stampede Grounds near the Macleod Trail corridor. With a residential population of approximately 950, Manchester's housing stock consists primarily of condominiums, townhouses, and a limited number of older single-family homes. Dishwasher repair in Manchester is predominantly condo and townhouse work: Whirlpool, Frigidaire, and Bosch dishwashers installed in compact kitchen configurations. Our technicians from 700 6th Ave SW are typically on-site within 15–20 minutes. Calgary's 150–200 ppm hard water affects compact dishwashers disproportionately because smaller water reservoirs cycle harder minerals through precision spray systems more quickly, accelerating nozzle blockages and spray arm wear.`,
    dw_issues: ['Compact condo-format Whirlpool and Frigidaire drain pump and float failures', 'Bosch spray arm blockage from concentrated hard water cycling in compact units', 'Townhouse integrated dishwasher door latch and seal failures', 'Control board error codes in compact Frigidaire and Whirlpool units'],
    ws_para: `Washer repair in Manchester is mostly stacked laundry unit service — Whirlpool or LG stacked washer-dryer combos in condos and townhouses. Drain pump blockages, door seal deterioration, and motor noise are the most common issues in stacked front-load configurations. We carry parts for all stacked laundry formats and navigate condo building access regularly.`,
    ws_issues: ['LG and Whirlpool stacked washer drain pump and door seal failures', 'Compact front-load drum bearing noise in condo laundry closets', 'Control board error diagnostics for LG and Samsung stacked units', 'Hard water detergent residue causing pump filter blockages'],
    fr_para: `Fridge repair in Manchester involves compact and counter-depth models suited to condo and townhouse kitchens. LG and Samsung counter-depth French-door units are the most common recent purchases, while older condos have Frigidaire or GE compact models. Ice maker water inlet valve failures are the leading repair type across all modern fridge formats in the neighbourhood.`,
    fr_issues: ['LG counter-depth French-door ice maker valve and assembly failures', 'Frigidaire and GE compact fridge compressor and thermostat diagnostics', 'Samsung ice maker error diagnostics and assembly replacement', 'Condenser coil cleaning in compact fridge models with restricted airflow'],
    nearby_dw: ['dishwasher-repair-inglewood-calgary|Dishwasher Repair — Inglewood', 'dishwasher-repair-ramsay|Dishwasher Repair — Ramsay', 'dishwasher-repair-erlton|Dishwasher Repair — Erlton'],
    nearby_ws: ['washer-repair-inglewood-calgary|Washer Repair — Inglewood', 'washer-repair-ramsay|Washer Repair — Ramsay'],
    nearby_fr: ['fridge-repair-inglewood-calgary|Fridge Repair — Inglewood', 'fridge-repair-ramsay|Fridge Repair — Ramsay'],
  },
  {
    slug: 'diamond-cove', display: 'Diamond Cove', region: 'SE', eyebrow: 'Calgary SE · Diamond Cove',
    dw_para: `Diamond Cove is a small, upscale SE Calgary community of approximately 625 homes tucked along the Bow River south of Fish Creek Provincial Park, developed in the 1980s as an exclusive residential pocket within the Lake Bonavista area. Its river and park adjacency, estate-sized lots, and executive housing stock make it comparable to SW Calgary's premium communities in terms of appliance sophistication. Dishwasher repair in Diamond Cove commonly involves KitchenAid, Bosch, and Miele units — brands standard in executive kitchens from the 1980s–2000s and in more recent renovations. The neighbourhood's 30–35 year old homes mean second-generation machines purchased in the 2000s are now entering their peak repair window. Calgary's 150–200 ppm hard water has accumulated significant calcium scale in these machines over two decades, particularly on heating elements and wash pump impellers. Our technicians reach Diamond Cove from 700 6th Ave SW in approximately 30–35 minutes via Macleod Trail and Bow Bottom Trail.`,
    dw_issues: ['KitchenAid and Bosch 2000s-era circulation pump and heating element scale from 150–200 ppm water', 'Miele precision wash system descaling and sensor recalibration', 'Executive kitchen integrated panel dishwasher door alignment', 'Older Fisher & Paykel DishDrawer rail and valve failures'],
    ws_para: `Washer repair in Diamond Cove involves premium front-load brands in executive laundry rooms. Miele W1, Electrolux, and LG ultra-large capacity front-loaders are common. Drum bearing failures, door boot seal deterioration, and drain pump blockages are the leading issues. River-adjacent humidity can accelerate door seal mould growth in front-load machines.`,
    ws_issues: ['Miele W1 and Electrolux front-load drum bearing and seal replacement', 'LG ultra-large front-load drain pump and tub bearing diagnostics', 'Door boot seal mould treatment and replacement in river-adjacent conditions', 'Hard water scale on premium front-load wash drum inner seals'],
    fr_para: `Refrigerator repair in Diamond Cove means executive-kitchen premium brands — Sub-Zero columns, KitchenAid French-door, and LG Studio counter-depth units. Sealed system diagnostics for Sub-Zero, ice maker assembly failures in KitchenAid, and water dispenser valve blockages in LG are the most common call types.`,
    fr_issues: ['Sub-Zero column compressor and evaporator diagnostics', 'KitchenAid French-door ice maker assembly and door bin replacement', 'LG Studio counter-depth water dispenser valve and ice maker failures', 'Sealed system leak detection in premium built-in refrigerators'],
    nearby_dw: ['dishwasher-repair-lake-bonavista|Dishwasher Repair — Lake Bonavista', 'dishwasher-repair-mckenzie-lake|Dishwasher Repair — McKenzie Lake', 'dishwasher-repair-sundance-calgary|Dishwasher Repair — Sundance'],
    nearby_ws: ['washer-repair-lake-bonavista|Washer Repair — Lake Bonavista', 'washer-repair-mckenzie-lake|Washer Repair — McKenzie Lake'],
    nearby_fr: ['fridge-repair-lake-bonavista|Fridge Repair — Lake Bonavista', 'fridge-repair-mckenzie-lake|Fridge Repair — McKenzie Lake'],
  },
  {
    slug: 'bonavista-downs', display: 'Bonavista Downs', region: 'SE', eyebrow: 'Calgary SE · Bonavista Downs',
    dw_para: `Bonavista Downs is a small, established SE Calgary community of approximately 830 homes developed in 1973 adjacent to the original Lake Bonavista community. Its bungalow-dominant streetscape and mature tree canopy give it the feel of an older inner suburb. Dishwasher repair in Bonavista Downs most commonly involves 1990s–2000s Whirlpool, Maytag, and Frigidaire machines that have been in continuous service for 20+ years, alongside newer Samsung and Bosch units in renovated kitchens. The 1973-era homes feature compact original kitchen layouts that sometimes require minor modification to access dishwasher drain lines and water connections. Calgary's 150–200 ppm hard water has had a compounding effect over the 20–25 year service life of older machines here — spray arm blockage, control board corrosion from mineral-laden steam, and heating element scale are all common findings on first inspection.`,
    dw_issues: ['Whirlpool and Maytag 20+ year drain pump and water inlet valve failures', 'Frigidaire control board corrosion from mineral-laden steam in long-service units', 'Bosch spray arm blockage and filter cleaning from 150–200 ppm scale', 'Older kitchen layout dishwasher access and drain line servicing'],
    ws_para: `Washer repair in Bonavista Downs is dominated by top-load Whirlpool and Maytag machines from the 1990s–2000s. Lid switch failures, drive motor worn components, and pump blockages are the most common issues. Some homeowners have upgraded to LG or Samsung front-loaders, which develop drum bearing noise and door seal failures in the 8–12 year range.`,
    ws_issues: ['Whirlpool top-loader lid switch, drive belt, and pump failures', 'Maytag top-loader agitator and transmission diagnostics in 20+ year old units', 'LG and Samsung front-load drum bearing and door seal replacement', 'Hard water calcium blocking agitator fabric softener dispensers'],
    fr_para: `Fridge repair in Bonavista Downs covers a wide age range — from original 1990s Frigidaire and Whirlpool top-freezers to newer LG and Samsung French-door models. Defrost system failures, compressor relay issues, and ice maker assembly replacements are the most common service requests.`,
    fr_issues: ['Whirlpool and Frigidaire 1990s top-freezer defrost heater and thermostat failures', 'LG French-door ice maker water valve and assembly replacement', 'Samsung French-door ice maker fan motor and sensor diagnostics', 'Compressor start relay and overload replacement in 15+ year old units'],
    nearby_dw: ['dishwasher-repair-lake-bonavista|Dishwasher Repair — Lake Bonavista', 'dishwasher-repair-acadia|Dishwasher Repair — Acadia', 'dishwasher-repair-willow-park|Dishwasher Repair — Willow Park'],
    nearby_ws: ['washer-repair-lake-bonavista|Washer Repair — Lake Bonavista', 'washer-repair-acadia|Washer Repair — Acadia'],
    nearby_fr: ['fridge-repair-lake-bonavista|Fridge Repair — Lake Bonavista', 'fridge-repair-acadia|Fridge Repair — Acadia'],
  },
  {
    slug: 'albert-park-radisson-heights', display: 'Albert Park/Radisson Heights', region: 'SE', eyebrow: 'Calgary SE · Albert Park / Radisson Heights',
    dw_para: `Albert Park/Radisson Heights is a large, mature SE Calgary community of approximately 6,740 residents with origins dating to 1910 — one of Calgary's older established neighbourhoods east of the city centre. Its housing stock spans a century of construction: pre-WWII bungalows on the west side near Albert Park, post-war semi-detached homes along Memorial Drive, and 1960s–1980s infill throughout. Dishwasher repair here covers an unusually wide range of machine ages and brands. Older bungalow kitchens may have GE or Frigidaire dishwashers from the 1990s, while recent renovations bring Bosch or Samsung units into the mix. Calgary's 150–200 ppm water hardness has had especially pronounced cumulative effects on long-running machines here — in some cases 25-year-old machines show heavy mineral scale on all water-contact surfaces, requiring thorough descaling before any component replacement. We dispatch to Albert Park/Radisson Heights from 700 6th Ave SW in approximately 25 minutes via Memorial Drive or Barlow Trail.`,
    dw_issues: ['GE and Frigidaire 1990s-era pump and control board failures in original bungalow kitchens', 'Heavy calcium scale on 20–25 year machines from 150–200 ppm water', 'Bosch and Samsung mid-range repairs in renovated homes', 'Drain hose routing access challenges in compact original kitchen layouts'],
    ws_para: `Washer repair in Albert Park/Radisson Heights reflects the neighbourhood's long housing history. Original bungalows often have top-load Whirlpool or GE washers from the 1990s–2000s in compact laundry alcoves. Newer infill homes feature LG or Samsung front-loaders. Both generations present common failure patterns: lid switches and pumps in top-loaders; door seals and bearings in front-loaders.`,
    ws_issues: ['GE and Whirlpool 1990s top-loader lid switch and pump replacement', 'LG front-load drum bearing noise and door boot seal deterioration', 'Samsung front-load control board OE and UE error code diagnostics', 'Hard water detergent residue blocking pump filters in long-service machines'],
    fr_para: `Fridge repair in Albert Park/Radisson Heights spans from 1990s Frigidaire and GE top-freezer models still in service to newer LG and Samsung French-door units in renovated homes. Defrost thermostat failures, compressor relay issues, and ice maker water valve blockages are the most common repair types.`,
    fr_issues: ['Frigidaire and GE 1990s top-freezer defrost system and thermostat failures', 'LG and Samsung French-door ice maker assembly and water valve replacement', 'Compressor start relay diagnostics in 15–25 year old units', 'Refrigerator door gasket replacement in high-age machines'],
    nearby_dw: ['dishwasher-repair-forest-lawn-calgary|Dishwasher Repair — Forest Lawn', 'dishwasher-repair-applewood-park|Dishwasher Repair — Applewood Park', 'dishwasher-repair-penbrooke-meadows|Dishwasher Repair — Penbrooke Meadows'],
    nearby_ws: ['washer-repair-forest-lawn-calgary|Washer Repair — Forest Lawn', 'washer-repair-applewood-park|Washer Repair — Applewood Park'],
    nearby_fr: ['fridge-repair-forest-lawn-calgary|Fridge Repair — Forest Lawn', 'fridge-repair-applewood-park|Fridge Repair — Applewood Park'],
  },
  {
    slug: 'red-carpet', display: 'Red Carpet', region: 'SE', eyebrow: 'Calgary SE · Red Carpet',
    dw_para: `Red Carpet is a small SE Calgary residential community of approximately 1,745 homes located near Forest Lawn and 17th Avenue SE, developed primarily in the 1960s–1970s as an affordable family neighbourhood. Dishwasher repair in Red Carpet tends to involve mid-range and entry-level machines — Whirlpool, Frigidaire, GE, and Maytag dishwashers from the 1990s–2000s that have been running continuously for 20+ years. These machines present predictable failure patterns: drain pump wear, water inlet valve blockages, control board failures, and door latch deterioration. Calgary's 150–200 ppm hard water accelerates component wear in mid-range machines faster than in premium brands with better filtration systems. Many Red Carpet homeowners face the repair-vs-replace decision given the age of their machines; our flat $65 diagnostic provides honest guidance on whether repair is economical. Our technicians reach Red Carpet in approximately 25–30 minutes from 700 6th Ave SW.`,
    dw_issues: ['Whirlpool and Frigidaire 20+ year drain pump and inlet valve replacement', 'GE and Maytag control board failures in long-service dishwashers', 'Door latch and door spring replacement in aging mid-range machines', 'Calcium scale throughout water system from 150–200 ppm water over 20+ years'],
    ws_para: `Washer repair in Red Carpet is predominantly top-load Whirlpool, GE, and Maytag machines from the 1990s–2000s. These are durable machines that have been running 20–25 years and are now developing transmission, pump, and lid switch failures. We carry common parts for all legacy top-load brands and perform same-day repairs on most standard component failures.`,
    ws_issues: ['Whirlpool and Maytag top-loader transmission and agitator coupler failures', 'GE top-loader pump and lid switch replacement in 20+ year old units', 'Frigidaire washer control board and water valve diagnostics', 'Drive belt and motor pulley wear in long-service top-load machines'],
    fr_para: `Fridge repair in Red Carpet is largely older-machine work — Whirlpool, GE, and Frigidaire top-freezer and side-by-side units from the 1990s still in daily service. Defrost system failures, compressor relay replacement, and condenser coil cleaning are the most common issues. We also service newer LG and Samsung units purchased as replacements.`,
    fr_issues: ['Whirlpool and GE 1990s top-freezer defrost heater and thermostat failures', 'Frigidaire side-by-side ice maker and water dispenser valve replacement', 'Compressor start relay and overload protector diagnostics in aging units', 'LG and Samsung replacement model ice maker assembly failures'],
    nearby_dw: ['dishwasher-repair-forest-lawn-calgary|Dishwasher Repair — Forest Lawn', 'dishwasher-repair-albert-park-radisson-heights|Dishwasher Repair — Albert Park', 'dishwasher-repair-penbrooke-meadows|Dishwasher Repair — Penbrooke Meadows'],
    nearby_ws: ['washer-repair-forest-lawn-calgary|Washer Repair — Forest Lawn', 'washer-repair-albert-park-radisson-heights|Washer Repair — Albert Park'],
    nearby_fr: ['fridge-repair-forest-lawn-calgary|Fridge Repair — Forest Lawn', 'fridge-repair-albert-park-radisson-heights|Fridge Repair — Albert Park'],
  },
  {
    slug: 'southview', display: 'Southview', region: 'SE', eyebrow: 'Calgary SE · Southview',
    dw_para: `Southview is a small, established SE Calgary community of approximately 1,550 residents located along 17th Avenue SE near Inglewood, developed primarily in the mid-20th century. Its mix of bungalows and semi-detached homes reflects modest post-war residential construction, with ongoing infill development adding newer units on corner lots. Dishwasher repair in Southview typically involves older Whirlpool, Maytag, and GE machines in original kitchen configurations, alongside newer Bosch and Samsung units in recently renovated homes. Calgary's 150–200 ppm Bow River water has accumulated significant calcium scale in long-running dishwashers here — particularly in machines where the filter basket has never been cleaned, causing pump cavitation and reduced wash performance. Being adjacent to Inglewood, Southview benefits from rapid dispatch coverage: our technicians from 700 6th Ave SW are on-site in approximately 20–25 minutes via 17th Avenue SE or Memorial Drive.`,
    dw_issues: ['Whirlpool and Maytag filter basket clogging from uncleaned calcium deposits at 150–200 ppm', 'GE dishwasher pump cavitation and wash performance decline from scale', 'Bosch mid-range spray arm and control board service in renovated homes', 'Samsung control board error codes and door latch diagnostics'],
    ws_para: `Washer repair in Southview involves a mix of older top-load and newer front-load machines. Long-running Whirlpool top-loaders with drum agitator and pump issues are the most common call type, along with newer Samsung front-loaders with door seal and bearing failures.`,
    ws_issues: ['Whirlpool top-loader agitator coupler, pump, and lid switch failures', 'Samsung front-load drum bearing noise and door seal replacement', 'GE top-loader control board and water valve diagnostics', 'Maytag washer drive motor and belt replacement in 15+ year old units'],
    fr_para: `Refrigerator repair in Southview covers the full range from 1990s Frigidaire and GE top-freezers to newer LG and Samsung French-door models. Defrost thermostat and heater failures are common in older units, while ice maker assembly and water valve failures dominate calls on newer French-door refrigerators.`,
    fr_issues: ['Frigidaire and GE top-freezer defrost system failures', 'LG and Samsung French-door ice maker assembly and water valve replacement', 'Whirlpool side-by-side ice dispenser actuator and door seal failures', 'Compressor start relay diagnostics in aging 1990s–2000s refrigerators'],
    nearby_dw: ['dishwasher-repair-inglewood-calgary|Dishwasher Repair — Inglewood', 'dishwasher-repair-ramsay|Dishwasher Repair — Ramsay', 'dishwasher-repair-forest-lawn-calgary|Dishwasher Repair — Forest Lawn'],
    nearby_ws: ['washer-repair-inglewood-calgary|Washer Repair — Inglewood', 'washer-repair-ramsay|Washer Repair — Ramsay'],
    nearby_fr: ['fridge-repair-inglewood-calgary|Fridge Repair — Inglewood', 'fridge-repair-ramsay|Fridge Repair — Ramsay'],
  },
];

function buildPage(n, serviceSlug, serviceName, serviceShort, para, issues, nearby) {
  const slug = n.slug;
  const display = n.display;
  const eyebrow = n.eyebrow;
  const idSuffix = `${slug.replace(/-/g,'_')}-${serviceSlug.charAt(0)}`;
  const canonical = `https://appliancerepairneary.com/${serviceSlug}-repair-${slug}`;
  const title = `${serviceName} ${display} Calgary | Neary Appliance`;
  const metaDesc = `${serviceName} in ${display}, Calgary ${n.region} — same-day, flat $65 diagnostic, 90-day warranty. Book online or email calgary@appliancerepairneary.com.`;
  const h1 = `${serviceName} in ${display}, Calgary`;
  const answerText = `Same-day ${serviceShort} repair in ${display}, Calgary. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Kenmore, KitchenAid, Miele, GE &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.`;
  const issuesHtml = issues.map(i => `<li><strong>${i}</strong></li>`).join('\n      ');
  const nearbyHtml = nearby.map(n => {
    const [href, label] = n.split('|');
    return `<a href="/${href}" class="related-link">${label}</a>`;
  }).join('\n      ');

  const hwFaq = serviceSlug === 'dishwasher' ? `
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Does Calgary hard water affect dishwashers in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>Yes. Calgary's Bow River water hardness of 150–200 ppm causes calcium scale to accumulate on spray arms, heating elements, and pump impellers within 3–5 years. We account for local water conditions on every ${display} service call.</p></div></details>` : '';

  const serviceType = serviceName === 'Fridge Repair' ? 'Refrigerator Repair' : serviceName;

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
<style>
${CSS}
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="Appliance Repair Near You — Calgary">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"${canonical}#business","name":"${serviceType} ${display} — Calgary Appliance Repair","description":"Same-day ${serviceType} in ${display}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"${canonical}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${display}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"${serviceType}"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>
<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/${serviceSlug}-repair-calgary">${serviceName} Calgary</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${display}</span>
  </div>
</nav>
<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">${eyebrow}</div>
    <h1 class="page-h1">${h1}</h1>
    <div class="answer-box">${answerText}</div>
    <div class="page-hero-ctas">
      <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary">Book Online</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>
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
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most ${serviceShort} repairs in ${display}: $120–$380 parts and labour. Written quote before any work begins. All repairs include a 90-day parts and labour warranty.</p>
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
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts. 90-day parts &amp; labour warranty.</p>
  </section>
  <section class="booking-section fade-in">
    <div class="section-label">Online booking</div>
    <h2>Book ${serviceName} in ${display}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-${idSuffix}" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book ${serviceName} in ${display}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-${idSuffix}');if(el)el.style.height=e.data.height+'px'}});<\/script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>
  <section class="faq-section fade-in">
    <div class="container" style="padding:0">
      <h2>FAQ — ${serviceName} in ${display}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Do you offer same-day ${serviceShort} repair in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>Yes — we offer same-day ${serviceShort} repair throughout ${display}, Calgary. Book before noon on weekdays for same-day service. We dispatch from 700 6th Ave SW, Calgary.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">What does ${serviceShort} repair cost in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>Most repairs run $120–$380 CAD parts and labour. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Which brands do you repair in ${display}?</span><span class="faq-icon">+</span></summary><div class="faq-answer"><p>We repair Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, Electrolux, KitchenAid, Kenmore, Miele, and most other brands found in ${display} homes.</p></div></details>${hwFaq}
      </div>
    </div>
  </section>
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
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do you offer same-day ${serviceShort} repair in ${display}?","acceptedAnswer":{"@type":"Answer","text":"Yes — we offer same-day ${serviceShort} repair throughout ${display}, Calgary. Book before noon on weekdays for same-day service."}},{"@type":"Question","name":"What does ${serviceShort} repair cost in ${display}?","acceptedAnswer":{"@type":"Answer","text":"Most repairs run $120–$380 CAD parts and labour. The flat $65 diagnostic fee is waived when you proceed with the repair. Written quote before any work begins."}},{"@type":"Question","name":"Which brands do you repair in ${display}?","acceptedAnswer":{"@type":"Answer","text":"We repair Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, Electrolux, KitchenAid, Kenmore, Miele, and most other brands found in ${display} homes."}}]}
</script>
</body>
</html>`;
}

let count = 0;

for (const n of neighborhoods) {
  // Dishwasher
  const dwNearby = [...n.nearby_dw, `washer-repair-${n.slug}|Washer Repair — ${n.display}`, `fridge-repair-${n.slug}|Fridge Repair — ${n.display}`];
  fs.writeFileSync(path.join(DIR, `dishwasher-repair-${n.slug}.html`), buildPage(n, 'dishwasher', 'Dishwasher Repair', 'dishwasher', n.dw_para, n.dw_issues, dwNearby), 'utf8');
  console.log(`Created: dishwasher-repair-${n.slug}.html`);
  count++;

  // Washer
  const wsNearby = [...n.nearby_ws, `dishwasher-repair-${n.slug}|Dishwasher Repair — ${n.display}`, `fridge-repair-${n.slug}|Fridge Repair — ${n.display}`];
  fs.writeFileSync(path.join(DIR, `washer-repair-${n.slug}.html`), buildPage(n, 'washer', 'Washer Repair', 'washer', n.ws_para, n.ws_issues, wsNearby), 'utf8');
  console.log(`Created: washer-repair-${n.slug}.html`);
  count++;

  // Fridge
  const frNearby = [...n.nearby_fr, `dishwasher-repair-${n.slug}|Dishwasher Repair — ${n.display}`, `washer-repair-${n.slug}|Washer Repair — ${n.display}`];
  fs.writeFileSync(path.join(DIR, `fridge-repair-${n.slug}.html`), buildPage(n, 'fridge', 'Fridge Repair', 'fridge', n.fr_para, n.fr_issues, frNearby), 'utf8');
  console.log(`Created: fridge-repair-${n.slug}.html`);
  count++;
}

console.log(`\nTotal pages created: ${count}`);
