// Batch 18 generator — 10 neighborhoods x 3 services = 30 pages
const fs = require('fs');
const path = require('path');

const OUT = 'C:/appliancerepairneary';

const neighborhoods = [
  {
    slug: 'dalhousie',
    display: 'Dalhousie',
    region: 'NW Calgary',
    postal: 'T3A',
    era: '1970s',
    drive: '22 minutes from our 700 6th Ave SW base via Crowchild Trail NW',
    dishPara: `Dalhousie is a well-established 1970s family suburb in northwest Calgary, developed between 1971 and 1982 along the escarpment above Nose Creek. With a population of approximately 8,500 residents, the neighbourhood is characterized by two-storey and bi-level detached homes on generous lots, many of which retain original or early-replacement appliances. The majority of dishwashers in Dalhousie are now 15–25 years old, placing them squarely in the end-of-lifecycle and frequent-repair zone. Whirlpool and older GE dishwashers dominate the original install base, while Bosch and Samsung represent the most common replacement choices over the past decade. Calgary's hard water at 150–200 ppm Bow River mineral content accelerates scale accumulation in Dalhousie's older units, clogging spray arms and reducing wash performance significantly faster than in softer-water cities. We routinely service Dalhousie homes for calcium-blocked spray arm holes, worn door gaskets, and failing wash pump motors — all hallmarks of aging 1970s-era appliance stock. The neighbourhood is a core part of our NW Calgary service zone.`,
    washerPara: `Dalhousie's 1970s housing stock means washing machines in the neighbourhood are typically in their second or third replacement cycle. The current generation of Whirlpool, Samsung, LG, and GE front-loaders installed over the past 5–12 years is now entering its prime repair window. Older agitator top-loaders from original or 1990s installs still exist in some detached homes. Common repair needs in Dalhousie include Samsung VRT drum bearing failures, LG OE drain error codes caused by clogged pump filters, and Whirlpool lid switch faults on top-loading machines. The neighbourhood's mature tree canopy and older sewer connections occasionally lead to drain backup conditions that manifest as washer drain errors — we inspect both the machine and the standpipe connection on every diagnostic visit. Our technicians carry parts for the five most common Calgary washer brands and can typically complete a repair in a single visit to Dalhousie.`,
    fridgePara: `Refrigerators in Dalhousie span a wide range of ages and brands, reflecting the neighbourhood's 50-plus years of continuous occupation. Many homes have seen two or three refrigerator replacements, with the most recent generation of Samsung French door, LG linear compressor, and Whirlpool side-by-side units representing the current install base. Common refrigerator repair requests in Dalhousie include Samsung ice maker failures and RS models showing temperature fluctuation errors, LG linear compressor units with sealed system issues showing the familiar ER FF or ER CF fault codes, and Whirlpool side-by-side units with evaporator fan motor failures. We also frequently service older 1990s Frigidaire and Maytag top-mount fridges that residents prefer to repair rather than replace. Every fridge repair in Dalhousie includes a calibration check and refrigerant pressure assessment where applicable.`
  },
  {
    slug: 'edgemont',
    display: 'Edgemont',
    region: 'NW Calgary',
    postal: 'T3A',
    era: '1980s–90s',
    drive: '28 minutes from our 700 6th Ave SW base via Crowchild Trail NW to Edgemont Blvd',
    dishPara: `Edgemont is one of Calgary's largest northwest family communities, developed primarily between 1980 and 1998 across a series of crescents and cul-de-sacs on the gentle slopes north of Nose Hill Park. With over 15,000 residents in predominantly two-storey and split-level detached homes, Edgemont represents a high-volume appliance service area. The dishwashers installed during the neighbourhood's main development period are now 25–40 years old — most well past economic repair — but the strong second-generation install base of Bosch, Samsung, and GE units from the 2000s and 2010s is now entering its prime repair window at 8–18 years of age. Calgary's Bow River water at 150–200 ppm mineral hardness creates visible scale accumulation in Edgemont dishwashers within 3–5 years of installation if rinse aid is not used consistently. We routinely service Edgemont homes for Bosch dishwashers showing E15 flood protection errors, Samsung units displaying LC codes from base pan moisture, and GE dishwashers with control board intermittent faults. Edgemont is a core part of our NW Calgary service territory.`,
    washerPara: `Edgemont's large single-family housing stock supports a significant washer repair market. The neighbourhood's 1980s–90s development era means many homes are on their second or third washing machine, with the current Samsung, LG, and Whirlpool front-loaders installed over the past 8–15 years now accumulating typical mid-life failures. Samsung front-loaders in Edgemont frequently develop drum bearing noise at 7–10 years due to the weight of Calgary hard water residue accelerating bearing wear. LG front-loaders show the OE drain error when the pump filter becomes clogged — a 30-minute service call in most cases. Whirlpool top-loaders in older Edgemont homes present with actuator errors (F7E1) and lid switch failures. We service all major brands in Edgemont and carry a comprehensive parts inventory for same-day resolution on the most common failures.`,
    fridgePara: `Edgemont refrigerators reflect the neighbourhood's affluent, family-oriented character — Bosch, Samsung French door, and LG counter-depth units are common in the 2000s–2010s replacement generation, alongside older Maytag and Frigidaire top-mount units in homes that haven't updated. The most frequent fridge repair calls in Edgemont involve Samsung RF-series French door models with ice maker failures and the familiar temperature warning codes, LG bottom freezer models with evaporator frost accumulation causing the ER FF fault, and older Maytag refrigerators with failing defrost heaters. Edgemont's larger homes also include Sub-Zero and KitchenAid built-in refrigerators in higher-end renovated kitchens — we carry parts and have technician experience for these premium brands as well.`
  },
  {
    slug: 'hamptons',
    display: 'Hamptons',
    region: 'NW Calgary',
    postal: 'T3A',
    era: '1990s–2000s',
    drive: '30 minutes from our 700 6th Ave SW base via Crowchild Trail NW to Hamptons Way',
    dishPara: `The Hamptons is an upscale northwest Calgary family suburb developed through the 1990s and early 2000s around a signature golf course, featuring predominantly large two-storey detached homes with premium finishes. With approximately 7,400 residents, the neighbourhood attracts a homeowner demographic that invested in high-end kitchen packages during construction — Bosch, KitchenAid, and Miele dishwashers are far more common here than in Calgary's average suburban community. These premium units, now 15–25 years old, are approaching and passing the point where factory parts become harder to source, making experienced appliance repair even more valuable. Calgary's Bow River hard water at 150–200 ppm is a significant factor for The Hamptons dishwashers: Miele units in particular show calcium-induced pump motor wear and clogged heat exchanger passages that reduce wash temperature and cleaning performance. We carry Bosch and Miele OEM-equivalent parts and have technician experience with the full range of premium dishwasher brands common in The Hamptons.`,
    washerPara: `The Hamptons washing machine market reflects the neighbourhood's premium appliance orientation. Many homes feature Bosch front-loaders, Samsung AddWash or FlexWash units, and LG twin-wash configurations. At 15–25 years of age, the original Miele and Bosch washers in some Hamptons homes require specialized bearing and motor brush replacements. Newer Samsung units in the neighbourhood show the typical 5DC (door circuit) and DC (unbalanced load) fault codes common to their design — often resolved with drum counterweight bolt tightening or bearing replacement. LG front-loaders in The Hamptons frequently develop the UE unbalance error when shock absorbers wear, and the OE drain error when pump filters clog with Calgary's higher mineral content. We service all premium washer brands in The Hamptons with the same flat $65 diagnostic fee regardless of brand.`,
    fridgePara: `Refrigerators in The Hamptons skew significantly toward premium brands — Bosch, Sub-Zero, KitchenAid built-in, and LG Studio counter-depth models are the norm in renovated kitchens, while older homes still contain excellent-condition 2000s-era Samsung and Maytag units. Sub-Zero and KitchenAid built-in refrigerator repairs in The Hamptons are among our most requested specialty services: these units require specific sealed system expertise and OEM parts that most appliance services cannot supply. We provide full Sub-Zero sealed system diagnostics, evaporator coil servicing, and compressor assessment. For Samsung French door and LG linear compressor models — now the most common replacements in The Hamptons — we provide same-day service with parts on hand for ice maker, evaporator fan, and control board repairs.`
  },
  {
    slug: 'citadel',
    display: 'Citadel',
    region: 'NW Calgary',
    postal: 'T3G',
    era: '1990s',
    drive: '27 minutes from our 700 6th Ave SW base via Crowchild Trail NW and Stoney Trail',
    dishPara: `Citadel is a mid-sized northwest Calgary family community developed through the 1990s, featuring approximately 10,000 residents in a mix of detached and semi-detached homes. The neighbourhood's development era means its dishwashers are now predominantly 20–30 years old for original installs, with a strong second-generation layer of Bosch, Samsung, LG, and GE units from the 2005–2015 replacement wave now entering their prime repair window. Calgary's Bow River water hardness of 150–200 ppm is a significant ongoing stressor for Citadel dishwashers — residents who have not consistently used rinse aid often find their spray arm holes completely blocked and their heating elements coated in calcium. We regularly service Citadel homes for Bosch E15 flood protection errors, Samsung LC code base pan issues, GE control board faults, and Whirlpool pump assembly failures. Citadel's street grid and consistent access make it one of our most efficiently serviced northwest communities.`,
    washerPara: `Citadel washers follow a predictable pattern for a 1990s family suburb: many homes are on their second Samsung or LG front-loader, with the first-generation replacement units now at 8–15 years of age and generating the typical bearing noise, drain error, and spin fault calls we see across northwest Calgary. Samsung VRT Plus front-loaders in Citadel develop drum bearing noise at 7–10 years — the repair involves full rear bearing and spider arm replacement, a job we complete in a single 3–4 hour visit. LG front-loaders show the OE drain error and, in older units, the LE motor error when the hall sensor or stator winding fails. Whirlpool top-loaders in older Citadel homes present with F7E1 basket drive errors and lid switch failures. We carry parts for all common Calgary washer brands and serve Citadel with same-day availability.`,
    fridgePara: `Citadel refrigerators are predominantly Samsung French door and LG bottom-freezer models from the 2010s replacement cycle, alongside a substantial number of Whirlpool and Frigidaire top-mount units in homes that haven't renovated. The Samsung RF and RS series French door models in Citadel frequently develop ice maker failures, temperature fluctuation codes, and fan motor issues — all repairable in a single visit with the parts we stock on every Calgary dispatch truck. LG refrigerators in the neighbourhood show ER FF (evaporator fan motor failure) and ER DH (defrost heater fault) codes as the most common failures. Older Frigidaire and Maytag top-mount units in Citadel are approaching the point where repair costs approach replacement value — we provide honest assessments and will not recommend repairs that don't make economic sense.`
  },
  {
    slug: 'royal-oak',
    display: 'Royal Oak',
    region: 'NW Calgary',
    postal: 'T3G',
    era: '2000s–2010s',
    drive: '29 minutes from our 700 6th Ave SW base via Stoney Trail NW to Royal Oak Blvd',
    dishPara: `Royal Oak is a 2000s-era upscale northwest Calgary family community built around a network of crescents and cul-de-sacs on the city's northwestern edge. With approximately 11,500 residents in predominantly large two-storey detached homes, the neighbourhood has a strong premium appliance install base — Bosch, KitchenAid, and Samsung were the standard kitchen package choices for Royal Oak builders, with higher-end custom homes featuring Miele and Fisher & Paykel. The dishwashers in Royal Oak are now 10–22 years old, placing the majority in the optimal repair-not-replace window where a quality repair extends service life by 5–8 additional years at a fraction of replacement cost. Calgary's Bow River hard water at 150–200 ppm creates specific challenges: Bosch dishwashers in Royal Oak show the E15 flood protection error more frequently than in softer-water cities due to calcium-induced pump seal degradation. We serve Royal Oak as a core part of our NW Calgary territory and carry all commonly needed parts for Bosch, Samsung, and KitchenAid dishwashers.`,
    washerPara: `Royal Oak washing machines reflect the neighbourhood's upscale character — Samsung FlexWash, LG twin-wash, and Bosch front-loader installations are common, alongside the standard Whirlpool and Maytag top-loaders in older sections of the community. At 10–22 years of age, the first generation of front-loaders installed during Royal Oak's development is showing bearing wear, control board faults, and drum seal failures. Samsung front-loaders in Royal Oak frequently develop the 4C water supply error and DC unbalance fault as they age. LG units show OE drain and LE motor errors. Bosch front-loaders in the neighbourhood develop E17 water heating errors and E13 water loss faults as pump seals wear. We provide full same-day service to Royal Oak with parts for all premium washer brands.`,
    fridgePara: `Royal Oak refrigerators skew toward premium brands — Samsung French door counter-depth, LG Studio and InstaView, and KitchenAid built-in models represent the most common current installs. The Samsung RF28 and RF23 series French door models in Royal Oak are now 10–15 years old and generating significant repair volume: ice maker failures, French door bin cracking, and temperature warning codes are the most frequent calls. LG linear compressor refrigerators in Royal Oak present with the familiar sealed system issues (ER RF, ER CO codes) that require compressor replacement or sealed system recharge. We provide full sealed system service and carry LG and Samsung compressors in our Royal Oak service inventory.`
  },
  {
    slug: 'montgomery',
    display: 'Montgomery',
    region: 'NW Calgary',
    postal: 'T3B',
    era: '1940s–50s',
    drive: '18 minutes from our 700 6th Ave SW base via 16th Avenue NW (Trans-Canada)',
    dishPara: `Montgomery is one of Calgary's older northwest neighbourhoods, developed as an independent community along the Bow River through the 1940s and 1950s before annexation into the city. The area's character is defined by its mix of original post-war bungalows — many with original or early-replacement appliances — alongside significant infill construction that has brought new builds with premium kitchen packages into the same streetscapes. Original Montgomery bungalows with their narrow kitchens often feature compact 18-inch dishwashers or older 24-inch Whirlpool and Frigidaire units from the 1990s–2000s era; the infill homes typically feature Bosch or Fisher & Paykel. Calgary's Bow River hard water at 150–200 ppm is especially impactful for older Montgomery dishwashers, where calcium accumulation in aging pump seals and door gaskets accelerates the rate of failure. We service both the older original stock and the newer infill builds in Montgomery, carrying parts for the full spectrum of brands represented in the neighbourhood.`,
    washerPara: `Montgomery washers span the full age spectrum from 1990s top-loaders in original bungalows to brand-new Bosch front-loaders in infill builds completed last year. This variety makes Montgomery a technically interesting service area — our technicians encounter everything from older Inglis and Kenmore agitator machines to current-generation Samsung AddWash and LG ThinQ units in the same neighbourhood. Older Kenmore and Whirlpool top-loaders in Montgomery frequently need pump, lid switch, and actuator replacements. Mid-generation Samsung and LG front-loaders present with bearing noise and drain errors. Newer Bosch front-loaders occasionally show E17 and E13 fault codes as their pump systems settle in. We service all eras and brands in Montgomery and provide honest advice on repair-vs-replace for older machines.`,
    fridgePara: `Montgomery refrigerators mirror the neighbourhood's housing diversity — original post-war bungalows may contain 2000s-era Frigidaire or Maytag top-mount units, while infill builds feature Samsung French door and Bosch counter-depth models. The older top-mount refrigerators in Montgomery bungalows are commonly serviced for defrost timer failures, thermostat replacement, and evaporator fan motor faults. The newer Samsung and LG models in infill homes bring ice maker repairs, sealed system diagnostics, and control board replacements. Montgomery's proximity to the Bow River means basement humidity is occasionally higher than in upland neighborhoods — this can accelerate condenser coil corrosion in refrigerators placed in utility areas. We check condenser condition on every Montgomery fridge diagnostic.`
  },
  {
    slug: 'kensington',
    display: 'Kensington',
    region: 'NW Calgary',
    postal: 'T2N',
    era: 'pre-1950 to 2010s',
    drive: '12 minutes from our 700 6th Ave SW base via 8th Street SW and Memorial Drive',
    dishPara: `Kensington is Calgary's most walkable northwest village, centred on Kensington Road and 10th Street NW in the Hillhurst community. The area's housing stock ranges from pre-1950 character homes and original apartments to luxury condo towers built in the 2010s, creating an unusually diverse appliance service market. Compact 18-inch Bosch dishwashers are the standard specification for Kensington's newer condos and character home renovations — these European-style units require specific knowledge of Bosch's compact dishwasher fault codes, which differ from their full-size counterparts. Calgary's Bow River hard water at 150–200 ppm creates rapid scale accumulation in compact dishwashers due to their smaller water volume and shorter cycle times. E15 (base pan flood protection) and E09 (heating element fault) are the most common Bosch compact error codes in Kensington. Full-size older dishwashers in Kensington's character homes are typically Whirlpool or GE units approaching end-of-life. We reach Kensington in approximately 12 minutes from our 700 6th Ave SW base — one of our fastest response zones in Calgary.`,
    washerPara: `Kensington laundry appliances reflect the neighbourhood's condo-heavy character: stacked Bosch or Samsung washer-dryer combos in condo units, and standalone Samsung or LG front-loaders in character home basement suites. Stacked Bosch laundry pairs in Kensington condos are among our most specialized service requests — the stacked configuration requires specific disassembly knowledge and often limited access space. Samsung front-loaders in Kensington condos frequently show the DC unbalance code when installed on non-level concrete subfloors typical of older buildings. LG front-loaders in the neighbourhood present with OE drain errors when condo standpipes have marginal drain heights. We carry parts for Bosch, Samsung, and LG compact and full-size washers and can navigate the stacked and space-constrained installations common in Kensington.`,
    fridgePara: `Refrigerators in Kensington are predominantly counter-depth and compact models suited to the neighbourhood's condo and character home kitchens. Bosch and Samsung counter-depth French door models are the most common current install. Older character homes contain full-depth Frigidaire and Maytag units. Counter-depth Samsung and LG refrigerators in Kensington condos frequently develop ice maker issues — the confined installation space makes ice maker servicing more complex than in standard configurations. We carry the full range of counter-depth refrigerator parts for Bosch, Samsung, and LG. Kensington's central location means we can typically provide same-day or next-morning service with the shortest travel times of any NW Calgary neighbourhood.`
  },
  {
    slug: 'highwood',
    display: 'Highwood',
    region: 'NW Calgary',
    postal: 'T2K',
    era: '1950s',
    drive: '20 minutes from our 700 6th Ave SW base via Centre Street N to 64th Avenue NW',
    dishPara: `Highwood is a quiet 1950s residential neighbourhood in northwest Calgary, developed between 1955 and 1965 as a postwar family suburb north of the Confederation Park golf course. With approximately 2,200 residents in predominantly bungalow and bi-level detached homes, Highwood is an established community with appliances that have gone through one or more full replacement cycles. The current generation of dishwashers in Highwood is predominantly Whirlpool, Samsung, and GE units installed in the 2005–2018 period, now 8–20 years old and in the prime repair window. Original Highwood bungalows with smaller kitchens sometimes have compact dishwashers or older 24-inch units nearing end-of-service. Calgary's Bow River hard water at 150–200 ppm contributes to spray arm clogging, pump seal degradation, and reduced wash performance in Highwood's aging dishwasher stock. We serve Highwood as part of our north-central Calgary service territory and carry parts for all common residential dishwasher brands.`,
    washerPara: `Highwood washing machines follow the typical pattern for a 1950s Calgary neighbourhood: many bungalow basements contain Whirlpool or GE top-loaders from the 2000s era that are now 15–20 years old and generating regular repair needs. The most common washer calls in Highwood involve Whirlpool and Maytag top-loaders with failing lid switches, worn pump seals, and actuator motor errors (F7E1). A second tier of Samsung and LG front-loaders installed more recently is beginning to show the characteristic bearing noise and drain errors of mid-life front-loaders. Highwood's older homes sometimes have 24-inch side-by-side laundry pairs in smaller utility rooms that restrict access for service — our technicians are experienced with constrained space repairs. We provide same-day washer repair service to Highwood with direct routing via Centre Street N.`,
    fridgePara: `Highwood refrigerators are predominantly Frigidaire, Whirlpool, and Maytag top-mount models from the 2000s–2010s, with a growing number of Samsung and LG French door units representing recent replacements. The older top-mount fridges in Highwood bungalows commonly need defrost heater replacement, evaporator fan motor servicing, and thermostat calibration. The newer Samsung RF-series models in recently renovated Highwood kitchens present with ice maker failures and the RF service reset (21E/14E sensor codes). LG bottom-freezer models in the neighbourhood show ER FF evaporator fan failure as a common first repair. We provide full refrigerator diagnostics in Highwood with a flat $65 fee that covers a complete system check before any repair recommendation.`
  },
  {
    slug: 'thorncliffe',
    display: 'Thorncliffe',
    region: 'NW Calgary',
    postal: 'T2K',
    era: '1960s',
    drive: '22 minutes from our 700 6th Ave SW base via Centre Street N to Thorncliffe Drive NW',
    dishPara: `Thorncliffe is a 1960s family suburb in north Calgary, developed between 1962 and 1972 across a large area north of Nose Creek between Centre Street N and 4th Street NW. With approximately 8,700 residents in a mix of bungalows, bi-levels, and two-storey homes, Thorncliffe represents a mature appliance service market where most households are on their second or third dishwasher. The current generation of dishwashers in Thorncliffe is predominantly from the 2005–2018 period — Whirlpool, GE, Samsung, and Bosch units now 8–20 years old and generating regular repair volume. Calgary's Bow River hard water at 150–200 ppm is a significant factor in Thorncliffe: the neighbourhood's older galvanized supply lines in some original homes can concentrate dissolved minerals further, accelerating scale accumulation in dishwasher heating elements and spray arms. We service Thorncliffe regularly for pump motor failures, control board intermittent faults, and hard water-induced spray arm clogging across all major brands.`,
    washerPara: `Thorncliffe washing machines are predominantly in the 8–20 year age range, reflecting the neighbourhood's 1960s development era and the typical 10–15 year replacement cycle. Samsung and LG front-loaders represent the most common recent installs; older Whirlpool and Maytag top-loaders persist in many homes. The most frequent washer calls in Thorncliffe involve Samsung VRT Plus bearing failures (drum rumble noise on spin), LG OE drain errors from clogged pump filters, and Whirlpool top-loaders with actuator and lid switch failures. Thorncliffe's older homes sometimes have original plumbing that creates drain standpipe height issues for front-loaders — we check standpipe configuration on every front-loader drain error diagnosis. We serve Thorncliffe with fast access via Centre Street N and carry a comprehensive parts inventory for same-day resolution.`,
    fridgePara: `Refrigerators in Thorncliffe are predominantly mid-range Samsung French door, LG bottom-freezer, and Whirlpool side-by-side models from the 2010s replacement cycle, with some older Frigidaire and Maytag top-mount units in homes that haven't updated kitchens. Samsung French door models in Thorncliffe — especially the RF28HDEDBSR and similar RS-series — frequently develop ice maker motor failures and ice bin auger jams at 8–12 years of age. LG bottom-freezer models in the neighbourhood show ER FF (evaporator fan failure) as the most common first post-warranty issue. Older Whirlpool and Frigidaire top-mount fridges in Thorncliffe are commonly serviced for defrost heater replacement and door seal deterioration. We provide same-day fridge repair service to Thorncliffe with honest repair-vs-replace guidance.`
  },
  {
    slug: 'country-hills',
    display: 'Country Hills',
    region: 'NW Calgary',
    postal: 'T3K',
    era: '1990s',
    drive: '25 minutes from our 700 6th Ave SW base via Crowchild Trail NW to Country Hills Blvd',
    dishPara: `Country Hills is a 1990s northwest Calgary family suburb developed along Country Hills Boulevard between Shaganappi Trail and Stoney Trail. With approximately 3,660 residents in predominantly two-storey detached family homes, the neighbourhood occupies a prime service corridor connecting several of our high-volume NW communities. Country Hills dishwashers are predominantly from the 2005–2020 period, placing the majority in the optimal repair window of 6–20 years. The original builder-grade Whirlpool and GE dishwashers from the 1990s construction era have largely been replaced with Samsung, Bosch, and LG units. Calgary's Bow River hard water at 150–200 ppm is a persistent stressor — Country Hills dishwashers serviced without regular rinse aid and periodic descaling accumulate calcium at the heating element and circulation pump at a measurable rate. We service Country Hills for the standard NW Calgary repair spectrum: Bosch E15 flood protection errors, Samsung LC base pan codes, and GE control board failures. Same-day service is typically available via Crowchild Trail NW.`,
    washerPara: `Country Hills washing machines reflect the neighbourhood's 1990s development era: the original Whirlpool top-loaders from the construction period have been largely replaced with Samsung and LG front-loaders in the 2010s–2020s, with these replacement units now at 5–12 years of age. Samsung front-loaders in Country Hills frequently show the 4E/4C water supply error when inlet screens become clogged with Calgary's harder water particulates, and the DC unbalance fault when shock absorbers wear. LG front-loaders in the neighbourhood present with OE drain errors and the UE spin imbalance code. We carry Samsung and LG parts for the most common Country Hills washer repairs and provide same-day service availability with access via Country Hills Boulevard.`,
    fridgePara: `Country Hills refrigerators are predominantly mid-range Samsung and LG French door models from the 2015–2023 period, alongside older Frigidaire and Whirlpool side-by-side units that residents continue to service rather than replace. Samsung French door models in Country Hills — particularly the RF28HDEDBSR and RF23M series — develop ice maker motor faults and freezer temperature fluctuation codes at 5–10 years. LG linear compressor models in newer Country Hills homes occasionally present with the compressor start relay failure that produces the familiar clicking sound on startup. Older Frigidaire side-by-side models in the neighbourhood are commonly serviced for ice maker jams and dispenser control board failures. We provide full refrigerator diagnostics with a flat $65 fee covering a complete system assessment.`
  }
];

const CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Instrument Sans',-apple-system,sans-serif;background:#fff;color:#0a0a0a;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 24px}.breadcrumb{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fafafa}.breadcrumb .container{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.breadcrumb a{font-size:.8125rem;font-weight:500;color:#6b7280}.breadcrumb-sep{font-size:.8125rem;color:#d1d5db}.breadcrumb-current{font-size:.8125rem;font-weight:600;color:#0a0a0a}.page-hero{padding:56px 0 48px;background:#fff;border-bottom:1px solid #e5e7eb}.page-hero .container{max-width:800px}.page-hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:16px}.page-hero-eyebrow::before{content:'';display:block;width:16px;height:2px;background:#2563eb}h1.page-h1{font-size:clamp(1.875rem,4vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:24px}.answer-box{background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;padding:20px 24px;margin-bottom:32px;font-size:1rem;color:#1e40af;line-height:1.7;font-weight:500}.page-hero-ctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:700;padding:14px 24px;border-radius:4px;white-space:nowrap}.btn-secondary{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#2563eb;font-size:1rem;font-weight:700;padding:13px 22px;border-radius:4px;border:1.5px solid #2563eb;white-space:nowrap}.trust-bar{background:#0a0a0a;padding:14px 0}.trust-bar-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0}.trust-item{display:flex;align-items:center;gap:8px;padding:4px 24px;border-right:1px solid rgba(255,255,255,.1);font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap}.trust-item:last-child{border-right:none}.section-label{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#2563eb;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section-title{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;line-height:1.15;margin-bottom:16px}main.page-main{padding:56px 0 0}.content-intro{max-width:760px;font-size:1.0625rem;color:#374151;line-height:1.75;margin-bottom:56px}.content-intro h2{font-size:1.375rem;font-weight:700;color:#0a0a0a;letter-spacing:-.02em;margin-top:32px;margin-bottom:12px}.content-intro p{margin-bottom:16px}.content-intro ul{margin:16px 0;padding-left:0;list-style:none}.content-intro ul li{padding:6px 0 6px 20px;position:relative;font-size:1rem;color:#374151}.content-intro ul li::before{content:'→';position:absolute;left:0;color:#2563eb;font-weight:700}.service-details{padding:48px 0;border-top:1px solid #e5e7eb}.problems-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}.problem-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px}.problem-name{font-size:.9375rem;font-weight:700;color:#0a0a0a;margin-bottom:6px}.problem-desc{font-size:.875rem;color:#6b7280;line-height:1.5}.pricing-table{width:100%;border-collapse:collapse;margin-top:24px;font-size:.9375rem}.pricing-table th,.pricing-table td{padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:left}.pricing-table th{background:#f9fafb;font-weight:600;color:#0a0a0a;font-size:.8125rem;text-transform:uppercase;letter-spacing:.05em}.pricing-table td:last-child{font-weight:600;color:#2563eb;white-space:nowrap}.pricing-note{font-size:.8125rem;color:#6b7280;margin-top:12px;line-height:1.5}.booking-section{padding:56px 0;border-top:1px solid #e5e7eb;text-align:center}.booking-section h2{font-size:1.75rem;font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:12px}.booking-alt{font-size:.9375rem;color:#6b7280;margin-top:16px}.booking-alt a{color:#2563eb;font-weight:600}.faq-section{padding:56px 0;border-top:1px solid #e5e7eb}.faq-section h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:32px}.faq-item{border-bottom:1px solid #e5e7eb}.faq-question{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;gap:16px;list-style:none;font-weight:600;font-size:1rem;color:#0a0a0a}.faq-question::-webkit-details-marker{display:none}.faq-icon{font-size:1.25rem;color:#2563eb;flex-shrink:0;transition:transform .2s}details[open] .faq-icon{transform:rotate(45deg)}.faq-answer{padding:0 0 18px;font-size:.9375rem;color:#374151;line-height:1.7}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.related-link{display:block;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;font-weight:500;color:#2563eb;transition:border-color .15s}.related-link:hover{border-color:#2563eb}footer.site-footer{background:#0a0a0a;color:rgba(255,255,255,.7);padding:40px 0;margin-top:80px}footer .container{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}footer p{font-size:.875rem;line-height:1.6}footer a{color:#93c5fd;font-weight:500}.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:10px}.sticky-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:50px;font-size:.9375rem;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap}.sticky-book{background:#2563eb;color:#fff}.fade-in{opacity:0;transition:opacity .35s ease}.fade-in.visible{opacity:1}@media(max-width:768px){.problems-grid{grid-template-columns:1fr}}@media(max-width:640px){.page-hero{padding:40px 0 36px}h1.page-h1{font-size:1.75rem}.sticky-cta{display:none}}`;

function makeId(slug) {
  return slug.replace(/-/g, '_');
}

function genDishwasher(n) {
  const id = makeId(n.slug);
  const slug = n.slug;
  const d = n.display;
  const title = `Dishwasher Repair ${d} Calgary | Neary Appliance`;
  const desc = `Expert dishwasher repair in ${d}, Calgary — same-day service, flat $65 diagnostic. Book online or email calgary@appliancerepairneary.com.`.substring(0, 160);
  const url = `https://appliancerepairneary.com/dishwasher-repair-${slug}`;
  const h1 = `Dishwasher Repair in ${d}, Calgary`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>${CSS}</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Appliance Repair Near You — Calgary">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"${url}#business","name":"Dishwasher Repair ${d} — Calgary Appliance Repair","description":"Same-day dishwasher repair in ${d}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"${url}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"geo":{"@type":"GeoCoordinates","latitude":51.0447,"longitude":-114.0719},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${d}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"Dishwasher Repair"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/dishwasher-repair-calgary">Dishwasher Repair Calgary</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${d}</span>
  </div>
</nav>

<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">${n.region} &middot; ${d}</div>
    <h1 class="page-h1">${h1}</h1>
    <div class="answer-box">Same-day dishwasher repair in ${d}, Calgary. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Kenmore, KitchenAid, Miele, GE &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.</div>
    <div class="page-hero-ctas">
      <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary">Book Online</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>

<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6" itemprop="description">Need dishwasher repair in ${d}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic. <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#2563eb;font-weight:600">calgary@appliancerepairneary.com</a>. Available 7 days a week.</p>
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
    <h2>Dishwasher Repair in ${d} — Fast, Reliable, Local</h2>
    <p>${n.dishPara}</p>

    <h2>Common Dishwasher Repair Issues in ${d}</h2>
    <ul>
      <li><strong>Bosch E15 flood protection error — base pan water accumulation from door seal or pump leak</strong></li>
      <li><strong>Samsung LC/LE base pan float code — float switch or door boot seal replacement</strong></li>
      <li><strong>LG AE anti-flood sensor error — drain hose routing or inlet solenoid drip</strong></li>
      <li><strong>Control board fault — intermittent start failure or unresponsive panel</strong></li>
      <li><strong>Hard water scale — spray arm clogging, heating element calcium buildup (150–200 ppm)</strong></li>
    </ul>

    <h2>Repair Cost in ${d}</h2>
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most dishwasher repairs in ${d}: $120–$380 parts and labour. Written quote before any work begins — no surprises. All repairs include a 90-day parts and labour warranty.</p>
  </div>

  <section class="service-details fade-in" aria-label="Common problems and pricing">
    <div class="section-label">Common issues</div>
    <h2 class="section-title">Common Dishwasher Repair Problems We Fix in ${d}</h2>
    <div class="problems-grid">
      <div class="problem-card"><div class="problem-name">Not cleaning properly</div><div class="problem-desc">clogged spray arms, blocked filter, calcium scale from 150–200 ppm Calgary hard water</div></div>
      <div class="problem-card"><div class="problem-name">Flood protection error (E15/LC/AE)</div><div class="problem-desc">base pan water from door seal, pump housing, or inlet valve leak</div></div>
      <div class="problem-card"><div class="problem-name">Not draining / standing water</div><div class="problem-desc">clogged drain hose, failed drain pump, or blocked filter</div></div>
      <div class="problem-card"><div class="problem-name">Control board fault</div><div class="problem-desc">intermittent start failure, display unresponsive, mid-cycle shutdown</div></div>
      <div class="problem-card"><div class="problem-name">Door latch / seal failure</div><div class="problem-desc">door won't latch, water leaking from door seal or gasket</div></div>
      <div class="problem-card"><div class="problem-name">No heat / not drying</div><div class="problem-desc">failed heating element or thermistor, reduced wash temperature</div></div>
    </div>

    <div class="section-label" style="margin-top:48px">Pricing</div>
    <h2 class="section-title">Dishwasher Repair Cost in ${d}</h2>
    <table class="pricing-table" aria-label="Repair pricing">
      <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
      <tbody>
        <tr><td>Diagnostic visit (waived when repair proceeds)</td><td>$65</td></tr>
        <tr><td>Standard repair — door seal, drain hose, float switch, inlet valve</td><td>$120 – $240</td></tr>
        <tr><td>Complex repair — control board, wash motor, pump assembly</td><td>$240 – $380</td></tr>
      </tbody>
    </table>
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts with 90-day parts &amp; labour warranty.</p>
  </section>

  <section class="booking-section fade-in" aria-label="Book your repair">
    <div class="section-label">Online booking</div>
    <h2>Book Dishwasher Repair in ${d}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-${slug}-dishwasher" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book Dishwasher Repair in ${d}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-${slug}-dishwasher');if(el)el.style.height=e.data.height+'px'}});</script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>

  <section class="faq-section fade-in" aria-label="Frequently asked questions">
    <div class="container" style="padding:0">
      <h2>FAQ — Dishwasher Repair in ${d}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How quickly can you reach ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${d} is ${n.drive}. We typically dispatch within 2–4 hours of booking and can often provide same-day service.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Does Calgary hard water damage dishwashers in ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Yes. Calgary's Bow River water at 150–200 ppm mineral hardness accelerates calcium scale accumulation in spray arms, heating elements, and pump seals. We recommend consistent rinse aid use and monthly citric acid cleaning cycles for all ${d} dishwashers.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How much does dishwasher repair cost in ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Most dishwasher repairs in ${d} run $120–$380 CAD depending on the brand and part. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins.</p></div></details>
      </div>
    </div>
  </section>
</main>

<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair Services in ${d} &amp; Calgary</h2>
    <div class="related-grid">
      <a href="/washer-repair-${slug}" class="related-link">Washer Repair — ${d}</a>
      <a href="/fridge-repair-${slug}" class="related-link">Fridge Repair — ${d}</a>
      <a href="/dishwasher-repair-panorama-hills" class="related-link">Dishwasher Repair — Panorama Hills</a>
      <a href="/dishwasher-repair-nolan-hill" class="related-link">Dishwasher Repair — Nolan Hill</a>
      <a href="/dishwasher-repair-sage-hill" class="related-link">Dishwasher Repair — Sage Hill</a>
      <a href="/dishwasher-repair-calgary" class="related-link">All Calgary Dishwasher Repair</a>
    </div>
  </div>
</div>

<footer class="site-footer" role="contentinfo" data-footer-region="calgary">
  <div class="container">
    <p><strong>Calgary Appliance Repair</strong> | Serving ${d} and all Calgary</p>
    <p>700 6th Avenue SW, Suite 1700, Calgary, AB T2P 0T8</p>
    <p>Email: <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> | <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a></p>
    <p>Mon&ndash;Sat 8 AM&ndash;8 PM &nbsp;|&nbsp; Sun 10 AM&ndash;6 PM (Mountain Time)</p>
    <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
    <p>&copy; <span id="footer-year-${id}-dishwasher"></span> Appliance Repair Near You &mdash; Calgary</p>
  </div>
</footer>
<script>(function(){var el=document.getElementById('footer-year-${id}-dishwasher');if(el)el.textContent=new Date().getFullYear()})();</script>

<div class="sticky-cta" aria-label="Quick contact">
  <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="sticky-btn sticky-book">Book Online &rarr;</a>
</div>
<script>document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('visible')})}});</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How quickly can you reach ${d}?","acceptedAnswer":{"@type":"Answer","text":"${d} is ${n.drive}. We typically dispatch within 2–4 hours of booking and can often provide same-day service."}},{"@type":"Question","name":"Does Calgary hard water damage dishwashers in ${d}?","acceptedAnswer":{"@type":"Answer","text":"Yes. Calgary's Bow River water at 150–200 ppm mineral hardness accelerates calcium scale in spray arms, heating elements, and pump seals. We recommend consistent rinse aid use and monthly citric acid cleaning cycles."}},{"@type":"Question","name":"How much does dishwasher repair cost in ${d}?","acceptedAnswer":{"@type":"Answer","text":"Most dishwasher repairs in ${d} run $120–$380 CAD. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins."}}]}
</script>
</body>
</html>`;
}

function genWasher(n) {
  const id = makeId(n.slug);
  const slug = n.slug;
  const d = n.display;
  const title = `Washer Repair ${d} Calgary | Neary Appliance`;
  const desc = `Professional washing machine repair in ${d}, Calgary. Same-day service, flat $65 diagnostic. Book online or email calgary@appliancerepairneary.com.`.substring(0, 160);
  const url = `https://appliancerepairneary.com/washer-repair-${slug}`;
  const h1 = `Washer Repair in ${d}, Calgary`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>${CSS}</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Appliance Repair Near You — Calgary">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"${url}#business","name":"Washer Repair ${d} — Calgary Appliance Repair","description":"Same-day washing machine repair in ${d}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"${url}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"geo":{"@type":"GeoCoordinates","latitude":51.0447,"longitude":-114.0719},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${d}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"Washing Machine Repair"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/washer-repair-calgary">Washer Repair Calgary</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${d}</span>
  </div>
</nav>

<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">${n.region} &middot; ${d}</div>
    <h1 class="page-h1">${h1}</h1>
    <div class="answer-box">Same-day washing machine repair in ${d}, Calgary. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Maytag, GE, Kenmore, Miele &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.</div>
    <div class="page-hero-ctas">
      <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary">Book Online</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>

<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6" itemprop="description">Need washer repair in ${d}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic. <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#2563eb;font-weight:600">calgary@appliancerepairneary.com</a>. Available 7 days a week.</p>
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
    <h2>Washer Repair in ${d} — Fast, Reliable, Local</h2>
    <p>${n.washerPara}</p>

    <h2>Common Washer Repair Issues in ${d}</h2>
    <ul>
      <li><strong>Drum bearing failure — loud rumbling or grinding during spin cycle</strong></li>
      <li><strong>OE/E drain error — clogged drain pump filter or kinked hose</strong></li>
      <li><strong>UE/DC unbalance error — worn shock absorbers or counterweight bolts</strong></li>
      <li><strong>Lid switch / door latch failure — machine won't start or spin</strong></li>
      <li><strong>Control board fault — error codes, unresponsive panel, mid-cycle stop</strong></li>
    </ul>

    <h2>Repair Cost in ${d}</h2>
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most washer repairs in ${d}: $120–$420 parts and labour. Written quote before any work begins. All repairs include a 90-day parts and labour warranty.</p>
  </div>

  <section class="service-details fade-in" aria-label="Common problems and pricing">
    <div class="section-label">Common issues</div>
    <h2 class="section-title">Common Washer Repair Problems We Fix in ${d}</h2>
    <div class="problems-grid">
      <div class="problem-card"><div class="problem-name">Won't start or spin</div><div class="problem-desc">lid switch, door latch, motor coupler, or control board failure</div></div>
      <div class="problem-card"><div class="problem-name">Loud noise during spin</div><div class="problem-desc">drum bearing failure — rear bearing and spider arm replacement</div></div>
      <div class="problem-card"><div class="problem-name">Not draining / OE error</div><div class="problem-desc">clogged pump filter, blocked drain hose, or failed drain pump</div></div>
      <div class="problem-card"><div class="problem-name">Leaking water</div><div class="problem-desc">door seal (bellow), inlet valve, or tub seal failure</div></div>
      <div class="problem-card"><div class="problem-name">Vibration / unbalance error</div><div class="problem-desc">worn shock absorbers, broken counterweight, or drum spider failure</div></div>
      <div class="problem-card"><div class="problem-name">Not filling with water</div><div class="problem-desc">failed inlet valve, clogged inlet screen, or water pressure issue</div></div>
    </div>

    <div class="section-label" style="margin-top:48px">Pricing</div>
    <h2 class="section-title">Washer Repair Cost in ${d}</h2>
    <table class="pricing-table" aria-label="Repair pricing">
      <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
      <tbody>
        <tr><td>Diagnostic visit (waived when repair proceeds)</td><td>$65</td></tr>
        <tr><td>Standard repair — lid switch, drain pump, inlet valve, door seal</td><td>$120 – $240</td></tr>
        <tr><td>Complex repair — drum bearing, control board, motor</td><td>$240 – $420</td></tr>
      </tbody>
    </table>
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts with 90-day parts &amp; labour warranty.</p>
  </section>

  <section class="booking-section fade-in" aria-label="Book your repair">
    <div class="section-label">Online booking</div>
    <h2>Book Washer Repair in ${d}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-${slug}-washer" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book Washer Repair in ${d}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-${slug}-washer');if(el)el.style.height=e.data.height+'px'}});</script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>

  <section class="faq-section fade-in" aria-label="Frequently asked questions">
    <div class="container" style="padding:0">
      <h2>FAQ — Washer Repair in ${d}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How quickly can you reach ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${d} is ${n.drive}. We typically dispatch within 2–4 hours of booking and can often provide same-day service.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">My washer is making a loud noise during spin — what is it?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Loud rumbling or grinding during spin typically indicates drum bearing failure. This is a repairable condition — we replace the rear bearing, seal, and spider arm in a single visit. Ignoring it can lead to drum shaft damage that increases repair cost.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How much does washer repair cost in ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Most washer repairs in ${d} run $120–$420 CAD depending on the brand and part. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins.</p></div></details>
      </div>
    </div>
  </section>
</main>

<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair Services in ${d} &amp; Calgary</h2>
    <div class="related-grid">
      <a href="/dishwasher-repair-${slug}" class="related-link">Dishwasher Repair — ${d}</a>
      <a href="/fridge-repair-${slug}" class="related-link">Fridge Repair — ${d}</a>
      <a href="/washer-repair-panorama-hills" class="related-link">Washer Repair — Panorama Hills</a>
      <a href="/washer-repair-nolan-hill" class="related-link">Washer Repair — Nolan Hill</a>
      <a href="/washer-repair-sage-hill" class="related-link">Washer Repair — Sage Hill</a>
      <a href="/washer-repair-calgary" class="related-link">All Calgary Washer Repair</a>
    </div>
  </div>
</div>

<footer class="site-footer" role="contentinfo" data-footer-region="calgary">
  <div class="container">
    <p><strong>Calgary Appliance Repair</strong> | Serving ${d} and all Calgary</p>
    <p>700 6th Avenue SW, Suite 1700, Calgary, AB T2P 0T8</p>
    <p>Email: <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> | <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a></p>
    <p>Mon&ndash;Sat 8 AM&ndash;8 PM &nbsp;|&nbsp; Sun 10 AM&ndash;6 PM (Mountain Time)</p>
    <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
    <p>&copy; <span id="footer-year-${id}-washer"></span> Appliance Repair Near You &mdash; Calgary</p>
  </div>
</footer>
<script>(function(){var el=document.getElementById('footer-year-${id}-washer');if(el)el.textContent=new Date().getFullYear()})();</script>

<div class="sticky-cta" aria-label="Quick contact">
  <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="sticky-btn sticky-book">Book Online &rarr;</a>
</div>
<script>document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('visible')})}});</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How quickly can you reach ${d}?","acceptedAnswer":{"@type":"Answer","text":"${d} is ${n.drive}. We typically dispatch within 2–4 hours of booking and can often provide same-day service."}},{"@type":"Question","name":"My washer is making a loud noise during spin — what is it?","acceptedAnswer":{"@type":"Answer","text":"Loud rumbling during spin typically indicates drum bearing failure. We replace the rear bearing, seal, and spider arm in a single visit."}},{"@type":"Question","name":"How much does washer repair cost in ${d}?","acceptedAnswer":{"@type":"Answer","text":"Most washer repairs in ${d} run $120–$420 CAD. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins."}}]}
</script>
</body>
</html>`;
}

function genFridge(n) {
  const id = makeId(n.slug);
  const slug = n.slug;
  const d = n.display;
  const title = `Fridge Repair ${d} Calgary | Neary Appliance`;
  const desc = `Expert refrigerator repair in ${d}, Calgary. Same-day service, flat $65 diagnostic. All major brands. Book online or email calgary@appliancerepairneary.com.`.substring(0, 160);
  const url = `https://appliancerepairneary.com/fridge-repair-${slug}`;
  const h1 = `Fridge Repair in ${d}, Calgary`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>${CSS}</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Appliance Repair Near You — Calgary">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"${url}#business","name":"Fridge Repair ${d} — Calgary Appliance Repair","description":"Same-day refrigerator repair in ${d}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"${url}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"geo":{"@type":"GeoCoordinates","latitude":51.0447,"longitude":-114.0719},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${d}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"Refrigerator Repair"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/fridge-repair-calgary">Fridge Repair Calgary</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${d}</span>
  </div>
</nav>

<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">${n.region} &middot; ${d}</div>
    <h1 class="page-h1">${h1}</h1>
    <div class="answer-box">Same-day refrigerator repair in ${d}, Calgary. We fix all major brands — Samsung, LG, Whirlpool, Bosch, Frigidaire, Maytag, GE, Sub-Zero &amp; more. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.</div>
    <div class="page-hero-ctas">
      <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="btn-primary">Book Online</a>
      <a href="mailto:calgary@appliancerepairneary.com" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>

<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6" itemprop="description">Need fridge repair in ${d}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic. <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:calgary@appliancerepairneary.com" style="color:#2563eb;font-weight:600">calgary@appliancerepairneary.com</a>. Available 7 days a week.</p>
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
    <h2>Fridge Repair in ${d} — Fast, Reliable, Local</h2>
    <p>${n.fridgePara}</p>

    <h2>Common Fridge Repair Issues in ${d}</h2>
    <ul>
      <li><strong>Not cooling / temperature too warm — compressor, evaporator fan, or defrost failure</strong></li>
      <li><strong>Ice maker not working — ice maker motor, auger, inlet valve, or control board</strong></li>
      <li><strong>Frost buildup in freezer — defrost heater, defrost thermostat, or timer failure</strong></li>
      <li><strong>Water dispenser not working — inlet valve, water filter, or dispenser switch</strong></li>
      <li><strong>Loud noise — condenser fan motor, evaporator fan, or compressor vibration</strong></li>
    </ul>

    <h2>Repair Cost in ${d}</h2>
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most fridge repairs in ${d}: $120–$480 parts and labour. Written quote before any work begins. All repairs include a 90-day parts and labour warranty.</p>
  </div>

  <section class="service-details fade-in" aria-label="Common problems and pricing">
    <div class="section-label">Common issues</div>
    <h2 class="section-title">Common Fridge Repair Problems We Fix in ${d}</h2>
    <div class="problems-grid">
      <div class="problem-card"><div class="problem-name">Not cooling</div><div class="problem-desc">evaporator fan failure, defrost system fault, or compressor issue</div></div>
      <div class="problem-card"><div class="problem-name">Ice maker not working</div><div class="problem-desc">ice maker motor, water inlet valve, auger jam, or control board fault</div></div>
      <div class="problem-card"><div class="problem-name">Frost or ice buildup in freezer</div><div class="problem-desc">defrost heater, thermostat, or timer failure causing frost accumulation</div></div>
      <div class="problem-card"><div class="problem-name">Water dispenser failure</div><div class="problem-desc">inlet valve, water filter blockage, or dispenser switch issue</div></div>
      <div class="problem-card"><div class="problem-name">Loud noise from fridge</div><div class="problem-desc">condenser fan motor, evaporator fan blade, or compressor vibration</div></div>
      <div class="problem-card"><div class="problem-name">Leaking water</div><div class="problem-desc">defrost drain clog, cracked drain pan, or inlet valve drip</div></div>
    </div>

    <div class="section-label" style="margin-top:48px">Pricing</div>
    <h2 class="section-title">Fridge Repair Cost in ${d}</h2>
    <table class="pricing-table" aria-label="Repair pricing">
      <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
      <tbody>
        <tr><td>Diagnostic visit (waived when repair proceeds)</td><td>$65</td></tr>
        <tr><td>Standard repair — defrost heater, fan motor, inlet valve, thermostat</td><td>$120 – $280</td></tr>
        <tr><td>Complex repair — ice maker assembly, control board, sealed system</td><td>$280 – $480</td></tr>
      </tbody>
    </table>
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts with 90-day parts &amp; labour warranty.</p>
  </section>

  <section class="booking-section fade-in" aria-label="Book your repair">
    <div class="section-label">Online booking</div>
    <h2>Book Fridge Repair in ${d}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-${slug}-fridge" src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book Fridge Repair in ${d}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-${slug}-fridge');if(el)el.style.height=e.data.height+'px'}});</script>
    <p class="booking-alt">Prefer email? <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>

  <section class="faq-section fade-in" aria-label="Frequently asked questions">
    <div class="container" style="padding:0">
      <h2>FAQ — Fridge Repair in ${d}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How quickly can you reach ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${d} is ${n.drive}. We typically dispatch within 2–4 hours of booking and can often provide same-day service.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">My fridge is not cooling — what could be wrong?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>A refrigerator that is not cooling properly is typically caused by a failed evaporator fan motor, a defrost system fault (heater, thermostat, or timer), or in more serious cases a compressor or sealed system issue. A diagnostic visit identifies the root cause before any repair work begins.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How much does fridge repair cost in ${d}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Most refrigerator repairs in ${d} run $120–$480 CAD depending on the brand and part. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins.</p></div></details>
      </div>
    </div>
  </section>
</main>

<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair Services in ${d} &amp; Calgary</h2>
    <div class="related-grid">
      <a href="/dishwasher-repair-${slug}" class="related-link">Dishwasher Repair — ${d}</a>
      <a href="/washer-repair-${slug}" class="related-link">Washer Repair — ${d}</a>
      <a href="/fridge-repair-panorama-hills" class="related-link">Fridge Repair — Panorama Hills</a>
      <a href="/fridge-repair-nolan-hill" class="related-link">Fridge Repair — Nolan Hill</a>
      <a href="/fridge-repair-sage-hill" class="related-link">Fridge Repair — Sage Hill</a>
      <a href="/fridge-repair-calgary" class="related-link">All Calgary Fridge Repair</a>
    </div>
  </div>
</div>

<footer class="site-footer" role="contentinfo" data-footer-region="calgary">
  <div class="container">
    <p><strong>Calgary Appliance Repair</strong> | Serving ${d} and all Calgary</p>
    <p>700 6th Avenue SW, Suite 1700, Calgary, AB T2P 0T8</p>
    <p>Email: <a href="mailto:calgary@appliancerepairneary.com">calgary@appliancerepairneary.com</a> | <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce">Book Online</a></p>
    <p>Mon&ndash;Sat 8 AM&ndash;8 PM &nbsp;|&nbsp; Sun 10 AM&ndash;6 PM (Mountain Time)</p>
    <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
    <p>&copy; <span id="footer-year-${id}-fridge"></span> Appliance Repair Near You &mdash; Calgary</p>
  </div>
</footer>
<script>(function(){var el=document.getElementById('footer-year-${id}-fridge');if(el)el.textContent=new Date().getFullYear()})();</script>

<div class="sticky-cta" aria-label="Quick contact">
  <a href="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce" class="sticky-btn sticky-book">Book Online &rarr;</a>
</div>
<script>document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('visible')})}});</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How quickly can you reach ${d}?","acceptedAnswer":{"@type":"Answer","text":"${d} is ${n.drive}. We typically dispatch within 2–4 hours of booking and can often provide same-day service."}},{"@type":"Question","name":"My fridge is not cooling — what could be wrong?","acceptedAnswer":{"@type":"Answer","text":"A refrigerator that is not cooling is typically caused by a failed evaporator fan motor, defrost system fault, or compressor issue. A diagnostic visit identifies the root cause before any repair work begins."}},{"@type":"Question","name":"How much does fridge repair cost in ${d}?","acceptedAnswer":{"@type":"Answer","text":"Most refrigerator repairs in ${d} run $120–$480 CAD. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins."}}]}
</script>
</body>
</html>`;
}

// Generate all 30 pages
let count = 0;
for (const n of neighborhoods) {
  // Dishwasher
  const dishFile = path.join(OUT, `dishwasher-repair-${n.slug}.html`);
  fs.writeFileSync(dishFile, genDishwasher(n), 'utf8');

  // Washer
  const washerFile = path.join(OUT, `washer-repair-${n.slug}.html`);
  fs.writeFileSync(washerFile, genWasher(n), 'utf8');

  // Fridge
  const fridgeFile = path.join(OUT, `fridge-repair-${n.slug}.html`);
  fs.writeFileSync(fridgeFile, genFridge(n), 'utf8');

  count += 3;
  console.log(`Generated ${n.slug}: dishwasher + washer + fridge`);
}
console.log(`\nTotal pages generated: ${count}`);
