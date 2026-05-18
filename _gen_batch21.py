#!/usr/bin/env python3
"""Generate batch 21 Calgary neighborhood pages for appliancerepairneary.com"""

import os

FADEIN_JS = '<script>document.addEventListener(\'DOMContentLoaded\',function(){var els=document.querySelectorAll(\'.fade-in\');if(\'IntersectionObserver\' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add(\'visible\');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add(\'visible\')})}})</script>'

STYLE = """*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Instrument Sans',-apple-system,sans-serif;background:#fff;color:#0a0a0a;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 24px}.breadcrumb{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fafafa}.breadcrumb .container{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.breadcrumb a{font-size:.8125rem;font-weight:500;color:#6b7280}.breadcrumb-sep{font-size:.8125rem;color:#d1d5db}.breadcrumb-current{font-size:.8125rem;font-weight:600;color:#0a0a0a}.page-hero{padding:56px 0 48px;background:#fff;border-bottom:1px solid #e5e7eb}.page-hero .container{max-width:800px}.page-hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:16px}.page-hero-eyebrow::before{content:'';display:block;width:16px;height:2px;background:#2563eb}h1.page-h1{font-size:clamp(1.875rem,4vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:24px}.answer-box{background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;padding:20px 24px;margin-bottom:32px;font-size:1rem;color:#1e40af;line-height:1.7;font-weight:500}.page-hero-ctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:700;padding:14px 24px;border-radius:4px;white-space:nowrap}.btn-secondary{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#2563eb;font-size:1rem;font-weight:700;padding:13px 22px;border-radius:4px;border:1.5px solid #2563eb;white-space:nowrap}.trust-bar{background:#0a0a0a;padding:14px 0}.trust-bar-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0}.trust-item{display:flex;align-items:center;gap:8px;padding:4px 24px;border-right:1px solid rgba(255,255,255,.1);font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap}.trust-item:last-child{border-right:none}.section-label{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#2563eb;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section-title{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;line-height:1.15;margin-bottom:16px}main.page-main{padding:56px 0 0}.content-intro{max-width:760px;font-size:1.0625rem;color:#374151;line-height:1.75;margin-bottom:56px}.content-intro h2{font-size:1.375rem;font-weight:700;color:#0a0a0a;letter-spacing:-.02em;margin-top:32px;margin-bottom:12px}.content-intro p{margin-bottom:16px}.content-intro ul{margin:16px 0;padding-left:0;list-style:none}.content-intro ul li{padding:6px 0 6px 20px;position:relative;font-size:1rem;color:#374151}.content-intro ul li::before{content:'→';position:absolute;left:0;color:#2563eb;font-weight:700}.service-details{padding:48px 0;border-top:1px solid #e5e7eb}.problems-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}.problem-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px}.problem-name{font-size:.9375rem;font-weight:700;color:#0a0a0a;margin-bottom:6px}.problem-desc{font-size:.875rem;color:#6b7280;line-height:1.5}.pricing-table{width:100%;border-collapse:collapse;margin-top:24px;font-size:.9375rem}.pricing-table th,.pricing-table td{padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:left}.pricing-table th{background:#f9fafb;font-weight:600;color:#0a0a0a;font-size:.8125rem;text-transform:uppercase;letter-spacing:.05em}.pricing-table td:last-child{font-weight:600;color:#2563eb;white-space:nowrap}.pricing-note{font-size:.8125rem;color:#6b7280;margin-top:12px;line-height:1.5}.booking-section{padding:56px 0;border-top:1px solid #e5e7eb;text-align:center}.booking-section h2{font-size:1.75rem;font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:12px}.booking-alt{font-size:.9375rem;color:#6b7280;margin-top:16px}.booking-alt a{color:#2563eb;font-weight:600}.faq-section{padding:56px 0;border-top:1px solid #e5e7eb}.faq-section h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:32px}.faq-item{border-bottom:1px solid #e5e7eb}.faq-question{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;gap:16px;list-style:none;font-weight:600;font-size:1rem;color:#0a0a0a}.faq-question::-webkit-details-marker{display:none}.faq-icon{font-size:1.25rem;color:#2563eb;flex-shrink:0;transition:transform .2s}details[open] .faq-icon{transform:rotate(45deg)}.faq-answer{padding:0 0 18px;font-size:.9375rem;color:#374151;line-height:1.7}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.related-link{display:block;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;font-weight:500;color:#2563eb;transition:border-color .15s}.related-link:hover{border-color:#2563eb}footer.site-footer{background:#0a0a0a;color:rgba(255,255,255,.7);padding:40px 0;margin-top:80px}footer .container{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}footer p{font-size:.875rem;line-height:1.6}footer a{color:#93c5fd;font-weight:500}.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:10px}.sticky-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:50px;font-size:.9375rem;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap}.sticky-book{background:#2563eb;color:#fff}.fade-in{opacity:0;transition:opacity .35s ease}.fade-in.visible{opacity:1}@media(max-width:768px){.problems-grid{grid-template-columns:1fr}}@media(max-width:640px){.page-hero{padding:40px 0 36px}h1.page-h1{font-size:1.75rem}.sticky-cta{display:none}}"""

NEIGHBORHOODS = [
    {
        "slug": "christie-park",
        "display": "Christie Park",
        "region": "SW Calgary",
        "era": "1993 upscale",
        "desc": "Christie Park is a 1993-built upscale SW Calgary neighbourhood situated along the Bow River escarpment, offering sweeping valley views from its estate-style homes. The community was planned as a premium residential area, and its two-storey and walk-out homes are equipped with higher-end appliances — KitchenAid, Bosch, and Samsung French door and side-by-side refrigerators are common. After more than 30 years of service, ice makers, compressors, and control boards in these units are entering their first major repair cycle. Christie Park is served from our 700 6th Ave SW base via 17th Avenue SW and the Sarcee Trail corridor, typically a 20-minute run. Calgary's Bow River water at 150–200 ppm hardness is the primary culprit behind Christie Park's ice maker failures — mineral scale blocks the inlet valve after a few years of use, and we stock replacement valves for every major brand on every dispatch.",
        "issues_dw": ["Scale-clogged spray arms from 150–200 ppm Bow River hard water", "Bosch integrated dishwasher panel-ready disassembly", "Control board failure in 10–15 year old units", "Door latch and seal wear on estate kitchen units"],
        "issues_wr": ["High-efficiency front-loader bearing failure after 8–12 years", "Control board error codes in newer Samsung and LG units", "Drain pump clog from estate laundry use", "Lid lock failure in top-loader machines"],
        "issues_fr": ["Ice maker inlet valve scale from Calgary hard water", "French door ice dispenser jam — auger motor or ice clump", "Compressor failure in 10–15 year old KitchenAid units", "Control board error codes and temperature swings"],
        "related_dw": [("dishwasher-repair-strathcona-park", "Dishwasher — Strathcona Park"), ("dishwasher-repair-coach-hill", "Dishwasher — Coach Hill"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-strathcona-park", "Washer Repair — Strathcona Park"), ("washer-repair-coach-hill", "Washer Repair — Coach Hill"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-strathcona-park", "Fridge Repair — Strathcona Park"), ("fridge-repair-signal-hill", "Fridge Repair — Signal Hill"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
    },
    {
        "slug": "crestmont",
        "display": "Crestmont",
        "region": "SW Calgary",
        "era": "2000s upscale",
        "desc": "Crestmont is a 2000s-era upscale neighbourhood on Calgary's far SW edge, developed in the hills above the Bow River valley. Its premium estate homes with mountain and valley views attract buyers who invest in high-end appliances — Sub-Zero, Wolf, and Bosch are found alongside Samsung and Whirlpool in Crestmont kitchens. With many homes now 15–20 years old, first-generation appliance replacements and repairs are becoming routine. Our team reaches Crestmont via Trans-Canada Highway westbound and the 101st Street SW corridor in approximately 25–30 minutes from 700 6th Ave SW. Despite Crestmont's elevation, it draws from the same Bow River water supply as the rest of Calgary, running at 150–200 ppm total dissolved solids — ice makers and water filters in Crestmont homes require regular maintenance to avoid scale-related inlet valve blockages.",
        "issues_dw": ["Calcium scale on spray arms and filters — Bow River 150–200 ppm water", "Bosch and Miele premium dishwasher servicing", "Control board failure in 15+ year old units", "Float switch and drain pump repair"],
        "issues_wr": ["Front-load washer drum bearing failure", "Vibration issues on laundry pedestals in estate homes", "Control board reset or replacement", "Water inlet valve failure causing no-fill"],
        "issues_fr": ["Ice maker scale from 150–200 ppm Bow River water", "Sub-Zero service and maintenance", "French door ice auger jam", "Evaporator fan failure causing warm fridge"],
        "related_dw": [("dishwasher-repair-crestmont", "Dishwasher — Crestmont"), ("dishwasher-repair-coach-hill", "Dishwasher — Coach Hill"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-crestmont", "Washer Repair — Crestmont"), ("washer-repair-coach-hill", "Washer Repair — Coach Hill"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-coach-hill", "Fridge Repair — Coach Hill"), ("fridge-repair-springbank-hill", "Fridge Repair — Springbank Hill"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
    },
    {
        "slug": "spruce-cliff",
        "display": "Spruce Cliff",
        "region": "SW Calgary",
        "era": "1950s mature",
        "desc": "Spruce Cliff is a compact 1950s SW Calgary neighbourhood perched on the bluffs above the Bow River, just west of Shaganappi Golf Course and east of the Edworthy Park escarpment. The community's original bungalows and semi-detached homes have seen significant condo conversion and infill development over the decades, making Spruce Cliff a mix of older appliance installations and newer condo-format compact units. Bosch, Miele, and Fisher & Paykel are common in the condo builds, while Whirlpool and Maytag dominate in the original houses. From our 700 6th Ave SW location, Spruce Cliff is approximately 15 minutes via Bow Trail. Calgary's Bow River water supply, at 150–200 ppm hardness, causes consistent scale accumulation in Spruce Cliff dishwashers — especially in the older units that have never had water softener protection. Our technicians descale internal components on every relevant repair call.",
        "issues_dw": ["Calcium scale clogging spray arms — Bow River 150–200 ppm hard water", "Compact Bosch and Miele condo-unit dishwasher servicing", "Drain pump failure in older bungalow units", "Door latch and control panel repair"],
        "issues_wr": ["Compact washer-dryer combo repair in condo units", "Agitator seal failure in older top-loaders", "Front-load bearing wear in 8–12 year old units", "Electronic control board failure"],
        "issues_fr": ["Ice maker failure from hard water mineral scale", "Compact condo fridge repair — space-constraint service", "Evaporator frost build-up in older units", "Compressor diagnosis in aging bungalow appliances"],
        "related_dw": [("dishwasher-repair-spruce-cliff", "Dishwasher — Spruce Cliff"), ("dishwasher-repair-rosscarrock", "Dishwasher — Rosscarrock"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-spruce-cliff", "Washer Repair — Spruce Cliff"), ("washer-repair-rosscarrock", "Washer Repair — Rosscarrock"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-rosscarrock", "Fridge Repair — Rosscarrock"), ("fridge-repair-westgate", "Fridge Repair — Westgate"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
    },
    {
        "slug": "shaganappi",
        "display": "Shaganappi",
        "region": "SW Calgary",
        "era": "pre-1950 mature",
        "desc": "Shaganappi is a mature, pre-1950 SW Calgary neighbourhood named after the nearby Shaganappi Golf Course, situated along the west bank of the Bow River between Bow Trail and 37th Street SW. Its original character homes from the 1940s and early 1950s sit alongside more recent infill developments and condo conversions, creating a neighbourhood with a wide range of appliance ages and types. Original homes often have Whirlpool and GE appliances installed during kitchen renovations in the 1990s and 2000s — now at peak repair age. Infill builds and condos feature Bosch or Samsung units. Shaganappi is one of our closest SW service areas from 700 6th Ave SW, typically reachable in 12–18 minutes via Bow Trail. Calgary's Bow River water hardness of 150–200 ppm affects all homes in Shaganappi, and older appliances without sediment filters accumulate scale faster than newer units with inline filtration.",
        "issues_dw": ["Spray arm scale from 150–200 ppm Bow River hard water", "Drain pump and motor failure in renovated-kitchen units", "Control board replacement in older GE and Whirlpool models", "Door gasket and latch wear in character-home kitchens"],
        "issues_wr": ["Agitator failure in older top-load washers from renovated homes", "Front-load bearing failure in 8–12 year Bosch and Samsung units", "Control board and motor coupling repair", "Drain hose blockage and pump replacement"],
        "issues_fr": ["Ice maker valve failure from Calgary hard water", "Defrost system failure causing frost accumulation", "Evaporator fan noise in older units", "Compressor wear in 12+ year old refrigerators"],
        "related_dw": [("dishwasher-repair-shaganappi", "Dishwasher — Shaganappi"), ("dishwasher-repair-rosscarrock", "Dishwasher — Rosscarrock"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-shaganappi", "Washer Repair — Shaganappi"), ("washer-repair-rosscarrock", "Washer Repair — Rosscarrock"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-rosscarrock", "Fridge Repair — Rosscarrock"), ("fridge-repair-glamorgan", "Fridge Repair — Glamorgan"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
    },
    {
        "slug": "rutland-park",
        "display": "Rutland Park",
        "region": "SW Calgary",
        "era": "1960s mature",
        "desc": "Rutland Park is a small, quiet 1960s-era SW Calgary neighbourhood bounded by Glenmore Trail to the south and Sarcee Trail to the west, with a tight-knit community of original bungalows and raised bungalows that have been lovingly maintained over six decades. Like many Calgary SW communities of its era, Rutland Park homes typically feature Whirlpool, Maytag, and GE appliances from kitchen renovations done in the 1990s and 2000s, which are now well into their prime repair years. Being tucked between major arterials, Rutland Park is easy to reach from our 700 6th Ave SW dispatch in 18–22 minutes. The Bow River supplies Rutland Park homes with water running at 150–200 ppm total hardness, and dishwashers and refrigerators in this community show consistent mineral scale accumulation — our technicians carry descaling tools and replacement inlet valves on every SW Calgary call.",
        "issues_dw": ["Spray arm and filter scale from 150–200 ppm Bow River water", "Drain pump failure in 1990s–2000s kitchen renovation appliances", "Control panel malfunction in older Whirlpool and GE models", "Door seal and latch replacement in aging bungalow kitchens"],
        "issues_wr": ["Top-loader agitator failure in 15+ year old units", "Front-loader drum bearing noise in more recent machines", "Water inlet valve failure — no-fill condition", "Lid switch and motor coupler replacement"],
        "issues_fr": ["Ice maker inlet valve blocked by hard water scale", "Freezer defrost failure causing frost accumulation", "Compressor diagnosis in 12–18 year old units", "Door gasket seal replacement for energy loss"],
        "related_dw": [("dishwasher-repair-rutland-park", "Dishwasher — Rutland Park"), ("dishwasher-repair-glenbrook", "Dishwasher — Glenbrook"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-rutland-park", "Washer Repair — Rutland Park"), ("washer-repair-glenbrook", "Washer Repair — Glenbrook"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-glamorgan", "Fridge Repair — Glamorgan"), ("fridge-repair-glenbrook", "Fridge Repair — Glenbrook"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
    },
    # 3 towns needing all 3 pages
    {
        "slug": "crossfield",
        "display": "Crossfield",
        "region": "North Calgary CMA",
        "era": "growing family town",
        "desc": "Crossfield is a small but growing family town approximately 35 km north of Calgary along Highway 2, part of the broader Calgary metropolitan area. With a mix of 1980s–2000s single-family homes and newer 2010s subdivisions, Crossfield's housing stock covers a full range of appliance ages — from aging Maytag and Whirlpool top-loaders to newer Samsung and LG French door refrigerators. As a commuter community to Calgary, residents value fast same-day repair service that eliminates the need to drive to the city for appliance parts or technicians. We dispatch to Crossfield from our Calgary base, typically arriving within 45–60 minutes. Crossfield draws water from the Mountain View County water system, which blends Bow River and local groundwater sources — water hardness in the 120–180 ppm range contributes to similar scale-related dishwasher and ice maker issues as Calgary proper.",
        "issues_dw": ["Spray arm and filter scale from 120–180 ppm municipal water", "Drain pump failure in aging Whirlpool and Maytag units", "Control board replacement in 10–15 year old dishwashers", "Door latch and seal repair in family-home kitchens"],
        "issues_wr": ["Agitator failure in top-loader washers in older homes", "Front-load bearing failure in 8–12 year old units", "Water inlet valve failure causing no-fill", "Drain pump blockage from family laundry use"],
        "issues_fr": ["Ice maker scale from municipal hard water", "Compressor failure in 10–15 year old units", "Frost accumulation — defrost heater or thermostat failure", "Water dispenser line freeze in cold Alberta winters"],
        "related_dw": [("dishwasher-repair-calgary", "Dishwasher Repair Calgary"), ("dishwasher-repair-airdrie", "Dishwasher Repair — Airdrie"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-airdrie", "Washer Repair — Airdrie"), ("washer-repair-calgary", "Washer Repair Calgary"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-airdrie", "Fridge Repair — Airdrie"), ("fridge-repair-calgary", "Fridge Repair Calgary"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
        "all_three": True,
    },
    {
        "slug": "carstairs",
        "display": "Carstairs",
        "region": "North Calgary CMA",
        "era": "growing family town",
        "desc": "Carstairs is a family-oriented town approximately 55 km north of Calgary, growing steadily as Calgary commuters seek affordable housing in the Mountain View County. Its residential stock spans from 1980s bungalows through to 2020s new-build subdivisions, giving the community a diverse appliance inventory that ranges from aging top-loaders requiring drum and agitator repair to modern Samsung and LG units with electronic control boards. As the closest major repair provider in the region, our Calgary team dispatches to Carstairs via Highway 2 North, typically arriving within 60 minutes. Carstairs draws from the Mountain View County water system at hardness levels similar to Calgary's 150–200 ppm range, meaning dishwashers and refrigerator ice makers in town accumulate mineral scale at a comparable rate — a factor we address on every service call.",
        "issues_dw": ["Hard water scale from Mountain View County supply — spray arm and filter blockage", "Drain pump failure in aging bungalow dishwashers", "Control board malfunction in 10+ year old units", "Door latch and gasket wear in family-home kitchens"],
        "issues_wr": ["Top-loader agitator and transmission failure", "Front-load bearing noise in 8–12 year old Samsung and LG units", "Lid switch failure in older top-loaders", "Water inlet valve replacement — no-fill condition"],
        "issues_fr": ["Ice maker scale from hard water supply", "Compressor failure in 10–15 year old family fridge", "Water line freeze during Alberta winters", "Defrost heater and thermostat failure"],
        "related_dw": [("dishwasher-repair-airdrie", "Dishwasher Repair — Airdrie"), ("dishwasher-repair-calgary", "Dishwasher Repair Calgary"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-airdrie", "Washer Repair — Airdrie"), ("washer-repair-calgary", "Washer Repair Calgary"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-airdrie", "Fridge Repair — Airdrie"), ("fridge-repair-calgary", "Fridge Repair Calgary"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
        "all_three": True,
    },
    {
        "slug": "olds",
        "display": "Olds",
        "region": "North Calgary CMA",
        "era": "established family town",
        "desc": "Olds is an established family town approximately 90 km north of Calgary along the Queen Elizabeth II Highway, home to Olds College and a stable community of long-term residents alongside newer families. Its diverse housing stock spans from 1970s established bungalows through to 2010s and 2020s new subdivisions, with a mix of entry-level Whirlpool and GE appliances in older homes and premium Samsung, LG, and Bosch units in newer builds. Appliance repair access in Olds is limited, making same-day service from Calgary particularly valuable for residents who cannot wait days for a local technician. Our team dispatches to Olds via Highway 2 North, typically arriving within 75–90 minutes. The municipal water supply in Olds runs at moderate hardness, creating similar scale-related dishwasher and ice maker issues as the broader Calgary region — we account for local water conditions on every Olds service call.",
        "issues_dw": ["Spray arm and filter scale from moderate municipal hard water", "Drain pump failure in 10–15 year old units", "Control board replacement in aging family-home dishwashers", "Door seal and gasket wear requiring replacement"],
        "issues_wr": ["Top-loader agitator and drum seal failure in older homes", "Front-loader bearing and spider arm failure", "Electronic control board malfunction", "Drain hose blockage and pump replacement"],
        "issues_fr": ["Ice maker mineral scale from municipal water supply", "Compressor failure in aging family refrigerators", "Freezer frost build-up — defrost system repair", "Door gasket seal failure causing energy loss"],
        "related_dw": [("dishwasher-repair-airdrie", "Dishwasher Repair — Airdrie"), ("dishwasher-repair-calgary", "Dishwasher Repair Calgary"), ("dishwasher-repair-calgary", "All Calgary Dishwasher Repair")],
        "related_wr": [("washer-repair-airdrie", "Washer Repair — Airdrie"), ("washer-repair-calgary", "Washer Repair Calgary"), ("washer-repair-calgary", "All Calgary Washer Repair")],
        "related_fr": [("fridge-repair-airdrie", "Fridge Repair — Airdrie"), ("fridge-repair-calgary", "Fridge Repair Calgary"), ("fridge-repair-calgary", "All Calgary Fridge Repair")],
        "dw_hard_water": True,
        "all_three": True,
    },
]

SERVICE_CONFIG = {
    "dishwasher": {
        "title_word": "Dishwasher Repair",
        "slug_prefix": "dishwasher-repair",
        "service_type": "Dishwasher Repair",
        "desc_tmpl": "Dishwasher repair in {n}, Calgary — same-day service, flat $65 diagnostic fee. Bow River hard water at 150–200 ppm accelerates scale buildup. Book online or email calgary@appliancerepairneary.com.",
        "answer_box": "Same-day dishwasher repair in {n}, {r}. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Kenmore, KitchenAid, Miele, GE &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.",
        "quick_answer": "Need dishwasher repair in {n}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic.",
        "h2_intro": "Dishwasher Repair in {n} — Fast, Reliable, Local",
        "h2_issues": "Common Dishwasher Repair Issues in {n}",
        "h2_cost": "Repair Cost in {n}",
        "cost_desc": "Flat $65 diagnostic fee, waived when repair proceeds. Most dishwasher repairs in {n}: $120–$380 parts and labour. Written quote before any work begins — no surprises. All repairs include a 90-day parts and labour warranty.",
        "section_title": "Common Dishwasher Repair Problems We Fix in {n}",
        "pricing_rows": [
            ("Diagnostic visit (waived when repair proceeds)", "$65"),
            ("Standard repair — drain pump, spray arm, inlet valve", "$120 – $240"),
            ("Complex repair — control board, wash motor, sealed components", "$240 – $380"),
        ],
        "book_h2": "Book Dishwasher Repair in {n}",
        "faq_q1": "How quickly can you reach {n}?",
        "faq_a1": "We typically dispatch within 2–3 hours of booking. Book before noon on weekdays for same-day service.",
        "faq_q2": "Does Calgary hard water affect dishwashers in {n}?",
        "faq_a2": "Yes. Calgary's Bow River water hardness of 150–200 ppm causes calcium scale to accumulate on spray arms, filters, and pumps. We address local water conditions on every {n} service call.",
        "faq_q3": "How much does dishwasher repair cost in {n}?",
        "faq_a3": "Most dishwasher repairs in {n} run $120–$380 CAD depending on the part and brand. The flat $65 diagnostic fee is waived when you proceed with the repair.",
        "breadcrumb_parent": ("dishwasher-repair-calgary", "Dishwasher Repair Calgary"),
        "issues_key": "issues_dw",
        "related_key": "related_dw",
    },
    "washer": {
        "title_word": "Washer Repair",
        "slug_prefix": "washer-repair",
        "service_type": "Washing Machine Repair",
        "desc_tmpl": "Washer repair in {n}, Calgary — same-day washing machine service, flat $65 diagnostic. Book online or email calgary@appliancerepairneary.com today.",
        "answer_box": "Same-day washer repair in {n}, {r}. We fix all major brands — Samsung, LG, Whirlpool, Maytag, Bosch, GE, Kenmore &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.",
        "quick_answer": "Need washer repair in {n}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic.",
        "h2_intro": "Washer Repair in {n} — Fast, Reliable, Local",
        "h2_issues": "Common Washer Repair Issues in {n}",
        "h2_cost": "Repair Cost in {n}",
        "cost_desc": "Flat $65 diagnostic fee, waived when repair proceeds. Most washer repairs in {n}: $120–$380 parts and labour. Written quote before any work begins — no surprises. All repairs include a 90-day parts and labour warranty.",
        "section_title": "Common Washer Repair Problems We Fix in {n}",
        "pricing_rows": [
            ("Diagnostic visit (waived when repair proceeds)", "$65"),
            ("Standard repair — lid switch, pump, belt, coupling", "$120 – $240"),
            ("Complex repair — drum bearing, motor, control board", "$240 – $380"),
        ],
        "book_h2": "Book Washer Repair in {n}",
        "faq_q1": "How quickly can you reach {n}?",
        "faq_a1": "We typically dispatch within 2–3 hours of booking. Book before noon on weekdays for same-day service.",
        "faq_q2": "What washer brands do you repair in {n}?",
        "faq_a2": "We repair Samsung, LG, Whirlpool, Maytag, GE, Bosch, Frigidaire, Electrolux, Speed Queen, and most other brands found in {n} homes.",
        "faq_q3": "How much does washer repair cost in {n}?",
        "faq_a3": "Most washer repairs in {n} run $120–$380 CAD depending on the issue. The flat $65 diagnostic fee is waived when you proceed with the repair.",
        "breadcrumb_parent": ("washer-repair-calgary", "Washer Repair Calgary"),
        "issues_key": "issues_wr",
        "related_key": "related_wr",
    },
    "fridge": {
        "title_word": "Fridge Repair",
        "slug_prefix": "fridge-repair",
        "service_type": "Refrigerator Repair",
        "desc_tmpl": "Fridge repair in {n}, Calgary — same-day refrigerator service, flat $65 diagnostic. Book online or email calgary@appliancerepairneary.com today.",
        "answer_box": "Same-day refrigerator repair in {n}, {r}. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Kenmore, KitchenAid, Frigidaire, GE &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.",
        "quick_answer": "Need fridge repair in {n}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic.",
        "h2_intro": "Fridge Repair in {n} — Fast, Reliable, Local",
        "h2_issues": "Common Fridge Repair Issues in {n}",
        "h2_cost": "Repair Cost in {n}",
        "cost_desc": "Flat $65 diagnostic fee, waived when repair proceeds. Most refrigerator repairs in {n}: $130–$400 parts and labour. Written quote before any work begins — no surprises. All repairs include a 90-day parts and labour warranty.",
        "section_title": "Common Fridge Repair Problems We Fix in {n}",
        "pricing_rows": [
            ("Diagnostic visit (waived when repair proceeds)", "$65"),
            ("Standard repair — thermostat, fan motor, inlet valve, door gasket", "$130 – $270"),
            ("Complex repair — compressor, control board, sealed system", "$270 – $400"),
        ],
        "book_h2": "Book Fridge Repair in {n}",
        "faq_q1": "How quickly can you reach {n}?",
        "faq_a1": "We typically dispatch within 2–3 hours of booking. Book before noon on weekdays for same-day service.",
        "faq_q2": "What fridge brands do you repair in {n}?",
        "faq_a2": "We repair Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, Electrolux, KitchenAid, Kenmore, and most other brands found in {n} homes.",
        "faq_q3": "How much does fridge repair cost in {n}?",
        "faq_a3": "Most refrigerator repairs in {n} run $130–$400 CAD. The flat $65 diagnostic fee is waived when you proceed with the repair.",
        "breadcrumb_parent": ("fridge-repair-calgary", "Fridge Repair Calgary"),
        "issues_key": "issues_fr",
        "related_key": "related_fr",
    },
}

def fmt(s, n, r):
    return s.replace("{n}", n).replace("{r}", r)

def make_page(nb, service_key, svc):
    slug = nb["slug"]
    display = nb["display"]
    region = nb["region"]
    n = display
    r = region

    page_slug = f"{svc['slug_prefix']}-{slug}"
    url = f"https://appliancerepairneary.com/{page_slug}"
    title = f"{svc['title_word']} {display} Calgary | Neary Appliance"
    meta_desc = fmt(svc["desc_tmpl"], n, r)
    answer_box = fmt(svc["answer_box"], n, r)
    quick_answer = fmt(svc["quick_answer"], n, r)
    h2_intro = fmt(svc["h2_intro"], n, r)
    h2_issues = fmt(svc["h2_issues"], n, r)
    h2_cost = fmt(svc["h2_cost"], n, r)
    cost_desc = fmt(svc["cost_desc"], n, r)
    section_title = fmt(svc["section_title"], n, r)
    book_h2 = fmt(svc["book_h2"], n, r)
    faq_q1 = fmt(svc["faq_q1"], n, r)
    faq_a1 = fmt(svc["faq_a1"], n, r)
    faq_q2 = fmt(svc["faq_q2"], n, r)
    faq_a2 = fmt(svc["faq_a2"], n, r)
    faq_q3 = fmt(svc["faq_q3"], n, r)
    faq_a3 = fmt(svc["faq_a3"], n, r)

    breadcrumb_href, breadcrumb_label = svc["breadcrumb_parent"]
    issues = nb[svc["issues_key"]]
    related_links = nb[svc["related_key"]]

    issues_li = "\n".join(f"      <li><strong>{i}</strong></li>" for i in issues)
    problems_cards = "\n".join(
        f'      <div class="problem-card"><div class="problem-name">{i}</div><div class="problem-desc">Diagnosed and repaired same-day. We carry parts for all common {display} models.</div></div>'
        for i in issues
    )
    pricing_rows_html = "\n".join(
        f"        <tr><td>{r_}</td><td>{c}</td></tr>" for r_, c in svc["pricing_rows"]
    )
    related_html = "\n".join(
        f'      <a href="/{href}" class="related-link">{label}</a>'
        for href, label in related_links
    )

    id_slug = slug.replace("-", "_")

    json_ld = (
        f'{{"@context":"https://schema.org","@type":"ProfessionalService",'
        f'"@id":"{url}#business","name":"{svc["title_word"]} {display} — Calgary Appliance Repair",'
        f'"description":"Same-day {svc["service_type"].lower()} in {display}, Calgary. Flat $65 diagnostic, 90-day warranty.",'
        f'"url":"{url}","priceRange":"$$",'
        f'"address":{{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"}},'
        f'"geo":{{"@type":"GeoCoordinates","latitude":51.0347,"longitude":-114.0819}},'
        f'"areaServed":[{{"@type":"City","name":"Calgary"}},{{"@type":"Neighborhood","name":"{display}"}}],'
        f'"openingHoursSpecification":[{{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"}},{{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}}],'
        f'"serviceType":"{svc["service_type"]}"}}'
    )

    faq_ld = (
        f'{{"@context":"https://schema.org","@type":"FAQPage","mainEntity":['
        f'{{"@type":"Question","name":"{faq_q1}","acceptedAnswer":{{"@type":"Answer","text":"{faq_a1}"}}}}, '
        f'{{"@type":"Question","name":"{faq_q2}","acceptedAnswer":{{"@type":"Answer","text":"{faq_a2}"}}}}, '
        f'{{"@type":"Question","name":"{faq_q3}","acceptedAnswer":{{"@type":"Answer","text":"{faq_a3}"}}}}]}}'
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{meta_desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>
{STYLE}
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{meta_desc}">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Appliance Repair Near You — Calgary">
<script type="application/ld+json">
{json_ld}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/{breadcrumb_href}">{breadcrumb_label}</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">{display}</span>
  </div>
</nav>

<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">{region} &middot; {display}</div>
    <h1 class="page-h1">{svc["title_word"]} in {display}, Calgary</h1>
    <div class="answer-box">{answer_box}</div>
    <div class="page-hero-ctas">
      <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary">Book Online</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>

<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6" itemprop="description">{quick_answer} <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#2563eb;font-weight:600">calgary@appliancerepairneary.com</a>. Available 7 days a week.</p>
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
    <h2>{h2_intro}</h2>
    <p>{nb["desc"]}</p>

    <h2>{h2_issues}</h2>
    <ul>
{issues_li}
    </ul>

    <h2>{h2_cost}</h2>
    <p>{cost_desc}</p>
  </div>

  <section class="service-details fade-in" aria-label="Common problems and pricing">
    <div class="section-label">Common issues</div>
    <h2 class="section-title">{section_title}</h2>
    <div class="problems-grid">
{problems_cards}
    </div>

    <div class="section-label" style="margin-top:48px">Pricing</div>
    <h2 class="section-title">{svc["title_word"]} Cost in {display}</h2>
    <table class="pricing-table" aria-label="Repair pricing">
      <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
      <tbody>
{pricing_rows_html}
      </tbody>
    </table>
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts with 90-day parts &amp; labour warranty.</p>
  </section>

  <section class="booking-section fade-in" aria-label="Book your repair">
    <div class="section-label">Online booking</div>
    <h2>{book_h2}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-{id_slug}-{service_key}" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="{book_h2}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){{if(e.data&&e.data.type==='fixlify-resize'){{var el=document.getElementById('fixlify-booking-{id_slug}-{service_key}');if(el)el.style.height=e.data.height+'px'}}}});</script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>

  <section class="faq-section fade-in" aria-label="Frequently asked questions">
    <div class="container" style="padding:0">
      <h2>FAQ &mdash; {svc["title_word"]} in {display}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">{faq_q1}</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>{faq_a1}</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">{faq_q2}</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>{faq_a2}</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">{faq_q3}</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>{faq_a3}</p></div></details>
      </div>
    </div>
  </section>
</main>

<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair Services in {display} &amp; Calgary</h2>
    <div class="related-grid">
{related_html}
    </div>
  </div>
</div>

<footer class="site-footer" role="contentinfo" data-footer-region="calgary">
  <div class="container">
    <p><strong>Calgary Appliance Repair</strong> | Serving {display} and all Calgary</p>
    <p>700 6th Avenue SW, Suite 1700, Calgary, AB T2P 0T8</p>
    <p>Email: <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> | <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a></p>
    <p>Mon&ndash;Sat 8 AM&ndash;8 PM &nbsp;|&nbsp; Sun 10 AM&ndash;6 PM (Mountain Time)</p>
    <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
    <p>&copy; <span id="footer-year-{id_slug}-{service_key}"></span> Appliance Repair Near You &mdash; Calgary</p>
  </div>
</footer>
<script>(function(){{var el=document.getElementById('footer-year-{id_slug}-{service_key}');if(el)el.textContent=new Date().getFullYear()}})();</script>

<div class="sticky-cta" aria-label="Quick contact">
  <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="sticky-btn sticky-book">Book Online &rarr;</a>
</div>
FADEIN_SCRIPT
<script type="application/ld+json">
{faq_ld}
</script>
</body>
</html>"""
    html = html.replace("FADEIN_SCRIPT", FADEIN_JS)
    return html

OUT_DIR = "C:/appliancerepairneary"

created = []
skipped = []

for nb in NEIGHBORHOODS:
    slug = nb["slug"]
    all_three = nb.get("all_three", False)

    for service_key, svc in SERVICE_CONFIG.items():
        # For non-all_three neighborhoods: only create fridge page (dishwasher and washer already exist)
        if not all_three and service_key != "fridge":
            continue

        filename = f"{svc['slug_prefix']}-{slug}.html"
        filepath = os.path.join(OUT_DIR, filename)

        if os.path.exists(filepath):
            skipped.append(filename)
            continue

        html = make_page(nb, service_key, svc)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        created.append(filename)
        print(f"Created: {filename}")

print(f"\nDone: {len(created)} created, {len(skipped)} skipped")
for f in created:
    print(f"  + {f}")
