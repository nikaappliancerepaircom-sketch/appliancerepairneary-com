#!/usr/bin/env node
/**
 * Generates Calgary neighborhood service pages for appliancerepairneary.com
 * Run: node gen-calgary-neighborhood-pages.js
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://appliancerepairneary.com';
const EMAIL = 'calgary@appliancerepairneary.com';
const BOOKING_URL = 'https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce';
const ADDRESS = '700 6th Avenue SW Suite 1700, Calgary, AB T2P 0T8';

// Neighborhood data with unique context
const neighborhoods = [
  {
    slug: 'varsity',
    name: 'Varsity',
    area: 'NW Calgary',
    eyebrow: 'NW Calgary · Varsity',
    driveTime: '15 minutes',
    buildEra: '1960s–70s',
    primaryBrands: { dishwasher: 'Bosch and KitchenAid', washer: 'Bosch and Samsung', fridge: 'Samsung and KitchenAid' },
    uniquePara: {
      dishwasher: `Varsity is one of NW Calgary's most desirable established neighbourhoods, bounded by Crowchild Trail and the Bow River pathway. Developed through the 1960s and into the 1970s, it has attracted a consistently affluent demographic — many properties are second-owner, with homeowners who have invested in premium European appliances like Bosch and Miele that were rare in the neighbourhood's original build. The streets around Varsity Drive NW and Varmoor Road NW see a high proportion of Bosch dishwashers, which require brand-specific tooling and parts that many generalist repair companies don't carry. Our technicians are Bosch-certified and stock Bosch pump modules, control panels, and circulation motor assemblies. Calgary's hard water at 150–200 ppm is particularly punishing on Bosch dishwashers, which rely on a precision spray system that clogs with calcium faster than North American competitors' simpler designs. We diagnose the full water-path on every Varsity Bosch call and recommend the correct rinse-aid and salt dosage for Calgary conditions. Drive time from our 700 6th Ave SW base is approximately 15 minutes, making same-day service routine for Varsity bookings made before noon.`,
      washer: `Varsity's 1960s–70s homes on Varsity Drive NW and Varmoor Road NW typically house either original-era Kenmore or Whirlpool top-loaders or modern Samsung and Bosch front-loaders installed during kitchen and laundry room renovations. The neighbourhood's affluent profile means we frequently service premium brands like Miele and Bosch — models that require specialized tools and European-spec parts that generic repair shops cannot source. Front-load washers in Varsity's finished basements are often on raised pedestals, making drum bearing replacement more involved than in standard laundry rooms. Calgary's hard water accelerates inlet valve calcification; we see blocked fill valves regularly on 4–6 year-old machines in Varsity that were never used with rinse additives. Our 15-minute dispatch time from downtown Calgary means same-day slots are reliably available for Varsity residents, with technicians who carry the right parts for premium brand service on the first visit.`,
      fridge: `Varsity's established family homes and regularly renovated kitchens mean a wide spread of refrigerator ages and brands — from a 1990s Kenmore still running in a garage to a 2022 Samsung French-door in a renovated kitchen. The neighbourhood's premium renovation trend has brought a significant number of KitchenAid, Bosch, and Samsung counter-depth refrigerators into service. These slim-profile models have more compact compressor compartments that trap heat faster and require more frequent condenser cleaning — something many Varsity homeowners don't know until the compressor fails early. Calgary's temperature swings from -30°C winters to +30°C summers stress door seals and ice maker components. We carry OEM gaskets, ice maker assemblies, and compressor relay kits for all premium brands found in Varsity. Approximately 15 minutes from our 700 6th Ave SW base, Varsity is a priority service zone with consistent same-day availability.`
    },
    issues: {
      dishwasher: ['Bosch circulation pump failure — calcium scale on impeller', 'Not cleaning — spray arm nozzles blocked by hard water scale', 'E24 / E25 drain error on Bosch — drain pump or filter blocked', 'Door latch failure on older models after Calgary freeze-thaw cycles'],
      washer: ['Samsung front-load not draining — blocked pump filter', 'Miele drum bearing failure — professional tooling required', 'Bosch F21 fill error — inlet valve calcium blockage', 'Door boot seal mould — common in enclosed laundry rooms'],
      fridge: ['KitchenAid ice maker not producing — inlet valve scale', 'Counter-depth Samsung compressor overheating — dirty coils', 'Door gasket failure — warm air infiltration causing excessive frost', 'Water dispenser blocked — filter or inlet valve calcium at 150–200 ppm']
    },
    relatedNeighborhoods: ['brentwood', 'silver-springs', 'tuscany'],
    lat: 51.0897, lng: -114.1419
  },
  {
    slug: 'silver-springs',
    name: 'Silver Springs',
    area: 'NW Calgary',
    eyebrow: 'NW Calgary · Silver Springs',
    driveTime: '20 minutes',
    buildEra: '1975–85',
    primaryBrands: { dishwasher: 'Whirlpool and Frigidaire', washer: 'Whirlpool and Maytag', fridge: 'Whirlpool and Frigidaire' },
    uniquePara: {
      dishwasher: `Silver Springs is a mature NW Calgary neighbourhood that backs onto the Bow River, developed primarily between 1975 and 1985. The streets along Silver Springs Boulevard NW and Silvertip Road NW are lined with split-levels and two-storeys that have been family homes for 30–40 years, with appliances that reflect multiple upgrade cycles. Many Silver Springs dishwashers are mid-range Whirlpool, Frigidaire, or Kenmore units installed in the 1990s or early 2000s — durable workhorses that are now approaching end-of-life failure patterns. The Bow River valley creates a microclimate with slightly higher humidity than central Calgary, which accelerates door seal degradation and internal corrosion in older dishwashers. Hard water at 150–200 ppm is the same across the city, but Silver Springs' older plumbing infrastructure without water softeners means our technicians find particularly heavy calcium deposits in spray arm nozzles, heating elements, and water inlet valves on the majority of calls. We carry Whirlpool and Frigidaire parts across the most common model numbers for this neighbourhood and typically complete repairs on the first visit. Approximately 20 minutes from our 700 6th Ave SW base, Silver Springs receives priority same-day scheduling for morning bookings.`,
      washer: `Silver Springs' 1975–85 construction era produced homes with generous laundry rooms that often contain top-loading Whirlpool or Maytag washers — some of which have been in continuous service for 20+ years. These long-lived machines eventually fail at predictable points: drive belts, agitator couplings, and water inlet valves are the most common repair items. The neighbourhood also has a growing segment of second-generation homeowners who have upgraded to Samsung or LG front-loaders. Calgary's hard water creates scale in the detergent dispenser and along fill hose pathways, and we regularly find Maytag top-loaders in Silver Springs with partially blocked inlet screens that cause extended fill times and UL error codes. Our technicians arrive with Whirlpool, Maytag, Samsung, and LG parts stocked on the van, making first-visit resolution the standard outcome for Silver Springs washer calls.`,
      fridge: `Silver Springs homes from the 1975–85 build era frequently have original or early-replacement Whirlpool and Frigidaire refrigerators, plus newer Samsung or GE units in kitchens that have been renovated. The Bow River proximity creates a slightly more humid environment that can affect door seals more quickly than in drier inner-city locations — we see faster gasket degradation in Silver Springs compared to other NW Calgary neighbourhoods. Ice makers in Silver Springs fridges frequently call for service due to Calgary's 150–200 ppm water hardness scaling the inlet valve. Condenser coils on older units in Silver Springs homes tend to accumulate pet hair and dust rapidly, causing the compressor to run hot and eventually fail. A condenser cleaning during the diagnostic visit prevents this and extends unit life significantly. Silver Springs is 20 minutes from our base — same-day service is available for bookings before 11 AM.`
    },
    issues: {
      dishwasher: ['Not draining — Whirlpool drain pump failure', 'Spray arm scale build-up from 150–200 ppm Bow River water', 'Door seal degradation from Silver Springs microclimate humidity', 'Control board failure on 15+ year-old Frigidaire units'],
      washer: ['Agitator coupling failure — Whirlpool and Maytag top-loaders', 'Inlet valve calcium blockage — extended fill times', 'Drive belt failure on older top-load models', 'Samsung front-load door boot seal mould'],
      fridge: ['Compressor failure — dirty condenser coils on older units', 'Ice maker inlet valve scale at 150–200 ppm', 'Door gasket wear — Bow River humidity accelerating seal degradation', 'Defrost heater failure — frost accumulation in freezer section']
    },
    relatedNeighborhoods: ['brentwood', 'varsity', 'tuscany'],
    lat: 51.1047, lng: -114.1619
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    area: 'NW Calgary',
    eyebrow: 'NW Calgary · Tuscany',
    driveTime: '30 minutes',
    buildEra: '2000s',
    primaryBrands: { dishwasher: 'Samsung and LG', washer: 'Samsung and LG', fridge: 'Samsung and LG' },
    uniquePara: {
      dishwasher: `Tuscany is one of NW Calgary's largest master-planned communities, developed through the early 2000s at the edge of the city near the Twelve Mile Coulee. Streets like Tuscany Boulevard NW, Tuscany Hills Drive, and Tuscany Estates Road are lined with single-family homes built between 1998 and 2012, predominantly by Jayman, Cardel, and Shane Homes — all of which included Samsung, LG, and GE builder-package dishwashers as standard. These units, now 12–25 years old, are well past their builder warranty and entering peak failure territory. Homeowners in Tuscany often discover their builder appliances aren't covered by any remaining warranty and face their first major repair. The combination of Calgary's hard water at 150–200 ppm and heavy family use in Tuscany's large households (the neighbourhood skews toward families with children) means dishwasher failure rates are higher per capita than in denser inner-city areas. Samsung and LG dishwashers are our most common Tuscany call — we stock specific drain pump assemblies, door latch mechanisms, and control boards for these brands. At 30 minutes from our 700 6th Ave SW base, Tuscany is our furthest NW dispatch, but we offer dedicated morning and afternoon scheduling windows for the area.`,
      washer: `Tuscany's 2000s master-planned homes were built with large laundry rooms to accommodate the Samsung and LG front-loaders that came as builder packages. These front-loaders, now 12–25 years old, are reaching the stage where drum bearings wear, door boot seals crack, and control boards develop intermittent faults. Tuscany families — the neighbourhood has a high proportion of households with 3+ members — generate high laundry volumes that accelerate this wear. The relatively new build era means fewer of the hard-water scale issues common in older NW neighbourhoods, but Samsung 4E and LG IE error codes (both indicating fill issues from partially calcified inlet valves) are a regular Tuscany service call. We carry Samsung WF and LG WM series drum bearing kits, boot seals, and control boards as standard inventory on Tuscany dispatches. The 30-minute drive from downtown is offset by our Tuscany-specific scheduling windows — book before 10 AM for same-day afternoon service.`,
      fridge: `Tuscany's builder-package refrigerators — primarily Samsung, LG, and GE side-by-sides and French-doors — are now 12–25 years old and generating the highest repair volume of any age cohort. Ice maker failures top the list: Tuscany's large households depend on ice makers heavily, and Calgary's 150–200 ppm water hardness scales the fill tube and inlet valve within 5–8 years of use without a filter. Compressor starting relay failure is the second most common Tuscany fridge call, typically presenting as a fridge that clicks every few minutes and fails to cool. French-door hinge failures are also common on units in this age range — worn hinges let cold air escape and cause the bottom freezer to overwork. We carry Samsung and LG OEM ice maker assemblies, compressor relay kits, and French-door hinge components as standard inventory. Tuscany is 30 minutes from our 700 6th Ave SW base — dedicated scheduling windows are available for the NW edge of the city.`
    },
    issues: {
      dishwasher: ['Samsung OC/9E error — fill or drain fault', 'LG LE error — motor lock from scale build-up', 'Door latch failure on 12+ year-old builder-package units', 'Spray arm blockage from 150–200 ppm Calgary hard water'],
      washer: ['Samsung 4E fill error — inlet valve calcium', 'LG drum bearing failure — front-loaders 12–20 years old', 'Door boot seal crack — front-loaders after heavy family use', 'Control board intermittent fault — common on 15+ year-old units'],
      fridge: ['Ice maker fill tube freeze — common in Tuscany Samsung fridges', 'Compressor relay click — failing to start on LG and GE units', 'French-door hinge wear — cold air leaking, freezer overworking', 'Water dispenser flow blocked — filter and inlet valve calcium scale']
    },
    relatedNeighborhoods: ['silver-springs', 'varsity', 'brentwood'],
    lat: 51.1297, lng: -114.1819
  },
  {
    slug: 'altadore',
    name: 'Altadore',
    area: 'SW Inner City',
    eyebrow: 'SW Calgary · Altadore',
    driveTime: '8 minutes',
    buildEra: '2000s–2015 infill',
    primaryBrands: { dishwasher: 'Bosch and Miele', washer: 'Bosch and Miele', fridge: 'Bosch and KitchenAid' },
    uniquePara: {
      dishwasher: `Altadore is one of Calgary's most actively renovated inner-city SW neighbourhoods, with significant infill development along 33rd Avenue SW, 26th Avenue SW, and the streets between Crowchild Trail and the Elbow River. The predominant housing stock is 2000s–2015 infill semi-detached and detached homes built for young professionals and families, with premium kitchen packages that typically include Bosch, Miele, or KitchenAid dishwashers. Altadore sits approximately 8 minutes from our 700 6th Ave SW base — our fastest suburban dispatch — and receives priority scheduling accordingly. The premium appliance mix means our technicians arrive equipped specifically for European brand service: Bosch E-series pump modules, Miele wash motor brushes, and KitchenAid control boards are all stocked on Altadore calls. Calgary's hard water at 150–200 ppm creates specific challenges for Bosch and Miele dishwashers, which use precision micro-spray systems that are more sensitive to calcium deposits than North American competitors. We recommend the correct regeneration salt dosage for Calgary water conditions and set the water softener on Bosch units appropriately during every service call.`,
      washer: `Altadore's 2000s–2015 infill homes are predominantly occupied by dual-income professionals and young families who invest in premium European appliances. Bosch 500 and 800 series front-loaders are common, as are Miele W1 washers in the higher-end properties around 33rd Ave SW. These machines require specialized diagnostic tools — Bosch's proprietary door latch sensors and Miele's motor brush replacement procedure are not tasks generalist technicians can handle effectively. Our Altadore technicians carry Bosch door latch assemblies, drum bearing kits, and Miele motor components as standard. At 8 minutes from our 700 6th Ave SW base, Altadore is one of our fastest-response zones — same-day service is available for bookings made as late as 2 PM. Hard water at 150–200 ppm affects Bosch fill performance; we set the internal water softener correctly for Calgary conditions on every visit.`,
      fridge: `Altadore's infill housing market has brought a significant concentration of premium refrigerators — Bosch counter-depth, KitchenAid French-door, and occasionally Sub-Zero in the higher-end properties along 36th Street SW. These counter-depth and built-in units require specialized disassembly to access the compressor compartment and carry higher parts costs than standard-depth fridges. Calgary's 150–200 ppm water hardness affects Altadore fridges primarily through ice maker and water dispenser failures — KitchenAid ice makers are a particularly common call. Bosch counter-depth fridges in Altadore kitchens often show early compressor strain because the compact compressor enclosure retains heat; we recommend condenser cleaning every 6 months for these units. Being just 8 minutes from our base means Altadore residents enjoy the fastest response times in SW Calgary — we can typically arrive within 60–90 minutes of a morning booking.`
    },
    issues: {
      dishwasher: ['Bosch E24 error — drain pump failure or blocked filter', 'Miele circulation pump failure — scale from Calgary hard water', 'KitchenAid control board fault — intermittent start failure', 'Spray arm scale at 150–200 ppm — Bosch and Miele precision systems affected most'],
      washer: ['Bosch door latch sensor failure — proprietary component', 'Miele motor brush wear — requires specialized tools and parts', 'LG or Samsung fill error — inlet valve calcium at 150–200 ppm', 'Front-load drum bearing failure after 8+ years of use'],
      fridge: ['KitchenAid ice maker not producing — Calgary water scale', 'Bosch counter-depth compressor overheating — compact enclosure heat retention', 'Water dispenser calcium blockage — inline filter needed', 'Door gasket failure on built-in units — professional replacement required']
    },
    relatedNeighborhoods: ['marda-loop', 'killarney', 'mission'],
    lat: 51.0297, lng: -114.1019
  },
  {
    slug: 'marda-loop',
    name: 'Marda Loop',
    area: 'SW Calgary',
    eyebrow: 'SW Calgary · Marda Loop',
    driveTime: '10 minutes',
    buildEra: '1950s bungalows + 2000s infill',
    primaryBrands: { dishwasher: 'Whirlpool, Bosch and KitchenAid', washer: 'Whirlpool and Samsung', fridge: 'Whirlpool and Samsung' },
    uniquePara: {
      dishwasher: `Marda Loop — centred on 33rd Avenue SW near its intersection with 20th Street SW — is one of SW Calgary's most vibrant commercial and residential mixed-use areas. The residential streets around Marda Loop contain a fascinating mix: 1950s character bungalows on blocks like 30th Ave SW and 27th Ave SW sit alongside 2000s–2015 infill semi-detached and row-house developments. This creates a two-tier appliance landscape. Original bungalow owners often have 1990s-era Whirlpool or Maytag dishwashers that have been running for 25+ years; infill properties have modern Bosch or KitchenAid units. Both groups generate significant dishwasher repair calls. For the older Whirlpool and Maytag units, common failures are spray arm blockage, pump seal failure, and worn door gaskets — all accelerated by Calgary's 150–200 ppm water hardness acting on aging components. For Bosch and KitchenAid in infill properties, the same hard-water scale problem appears within 4–6 years of installation if rinse aid and regeneration salt settings aren't calibrated for Calgary. We carry parts for both generations and arrive prepared for either scenario. Marda Loop is 10 minutes from our 700 6th Ave SW base.`,
      washer: `Marda Loop's split personality — 1950s bungalows alongside 2000s infill row houses and semi-detached — produces equally varied washer repair calls. Older bungalows on 30th Avenue SW may have Whirlpool or Maytag top-loaders from the late 1990s; newer infill units typically have Samsung or LG front-loaders. Both types are well within viable repair range. The 1950s bungalows often have galvanized supply lines that reduce water pressure slightly, which can trigger fill errors on front-loaders calibrated for normal city pressure. We check supply pressure on every Marda Loop washer call and can advise on simple solutions. Calgary hard water at 150–200 ppm causes inlet valve calcification across all brands and building ages. At 10 minutes from our base, Marda Loop receives same-day service for bookings made by 1 PM.`,
      fridge: `Marda Loop's 1950s bungalows frequently have original or early-replacement refrigerators — Whirlpool top-freezer models are the most common, often 15–25 years old and still running but starting to show compressor relay failure, defrost heater issues, and door gasket wear. Infill properties in the area typically have Samsung or Bosch counter-depth fridges in renovated kitchens. The 33rd Ave SW commercial strip creates some ambient heat in summer that affects nearby residential unit temperatures. Ice maker and water dispenser failures are common across both building eras — Calgary's 150–200 ppm water is the primary cause of inlet valve scale. We carry refrigerator parts for both older Whirlpool units and newer Samsung/Bosch models, making Marda Loop calls one of our highest first-visit completion zones.`
    },
    issues: {
      dishwasher: ['Whirlpool pump seal failure — 25+ year-old bungalow units', 'Bosch spray arm scale — 150–200 ppm hard water', 'KitchenAid door gasket wear — older infill units', 'Not draining — drain pump failure across all brands and ages'],
      washer: ['Fill error on front-loaders — reduced pressure from older galvanized supply lines', 'Whirlpool agitator coupling failure — top-loaders in 1950s bungalows', 'Samsung front-load drum bearing failure', 'Inlet valve calcium blockage — across all brands'],
      fridge: ['Whirlpool compressor relay failure — older top-freezer units', 'Defrost heater failure — frost accumulation common', 'Samsung ice maker scale — 150–200 ppm inlet valve blockage', 'Door gasket wear — both bungalow-era and infill units']
    },
    relatedNeighborhoods: ['altadore', 'killarney', 'glamorgan'],
    lat: 51.0347, lng: -114.1119
  },
  {
    slug: 'glamorgan',
    name: 'Glamorgan',
    area: 'SW Calgary',
    eyebrow: 'SW Calgary · Glamorgan',
    driveTime: '15 minutes',
    buildEra: '1960s',
    primaryBrands: { dishwasher: 'Whirlpool and GE', washer: 'Whirlpool and Maytag', fridge: 'Whirlpool and GE' },
    uniquePara: {
      dishwasher: `Glamorgan is a classic SW Calgary neighbourhood built primarily through the 1960s, with streets like Glamorgan Drive SW and Glamis Drive SW lined with original split-levels and bungalows that have housed the same families for decades. The neighbourhood borders Glenbrook and sits west of Crowchild Trail — slightly further from the city core than Altadore or Marda Loop, but well within our regular SW dispatch zone at approximately 15 minutes from our 700 6th Ave SW base. Dishwashers in Glamorgan run the full spectrum from original-build Whirlpool and GE units installed in renovations through the 1980s and 1990s, to second-generation replacements — often Maytag or Frigidaire mid-range models purchased at Calgary's major appliance retailers in the 2000s. Calgary's hard water at 150–200 ppm has been working on these units' internal components for years, depositing calcium scale on spray arms, heating elements, and inlet valves. We carry Whirlpool, GE, Maytag, and Frigidaire parts as standard for Glamorgan calls and can typically diagnose and repair within the first visit. Many Glamorgan homeowners have never had their dishwasher professionally serviced — we advise on ongoing maintenance during the repair.`,
      washer: `Glamorgan's 1960s homes typically have laundry rooms in the basement or on the main floor — layouts that accommodated the top-loading Whirlpool and Maytag washers of the era and that continue to work well for modern top-loaders and front-loaders. The majority of Glamorgan washer calls involve Whirlpool or Maytag top-loaders from the late 1990s to early 2000s — reliable machines that eventually need new belts, water inlet valves, or drive motor couplings. Homeowners in Glamorgan tend to repair rather than replace, given the neighbourhood's practical ownership culture; our honest approach to repair-vs-replace advice resonates well here. Calgary's hard water accelerates inlet valve calcification on all brands — Glamorgan's aging plumbing (galvanized in some homes) reduces pressure further, compounding fill issues. We diagnose from the supply line inward, not just the appliance, to give Glamorgan homeowners a complete picture.`,
      fridge: `Glamorgan's 1960s housing stock contains some of the oldest actively running refrigerators in SW Calgary — Whirlpool and GE top-freezer models from the 1990s that have outlasted multiple cars and probably one or two TVs. These durable units fail predictably: compressor starting relays, door gaskets, and defrost heaters are the most common service items. Newer replacements in Glamorgan kitchens tend to be mid-range GE or Frigidaire units purchased at major Calgary appliance stores. Calgary's 150–200 ppm water hardness affects ice makers and water dispensers on all brands. The neighbourhood is 15 minutes from our 700 6th Ave SW base — we offer same-day service for morning bookings and can often accommodate afternoon calls with a few hours' notice.`
    },
    issues: {
      dishwasher: ['GE and Whirlpool pump assembly failure — 15+ year-old units', 'Heating element calcium coating — dishes not drying', 'Spray arm scale blockage — 150–200 ppm hard water', 'Door gasket failure — common after Calgary freeze-thaw cycling'],
      washer: ['Whirlpool drive belt failure — top-loaders after 15 years', 'Maytag water inlet valve calcium — extended fill or fill error codes', 'Drive motor coupling failure — top-load agitator units', 'LG or Samsung fill error from reduced pressure in older plumbing'],
      fridge: ['Compressor relay failure — Whirlpool and GE units clicking and not cooling', 'Defrost heater burnout — frost in freezer section', 'Door gasket degradation — warm air infiltration', 'Ice maker not working — inlet valve scale from 150–200 ppm water']
    },
    relatedNeighborhoods: ['marda-loop', 'killarney', 'altadore'],
    lat: 51.0347, lng: -114.1419
  },
  {
    slug: 'killarney',
    name: 'Killarney',
    area: 'SW Calgary',
    eyebrow: 'Inner SW · Killarney',
    driveTime: '10 minutes',
    buildEra: '1950s bungalows + renovations',
    primaryBrands: { dishwasher: 'Whirlpool, Bosch and Samsung', washer: 'Whirlpool and Samsung', fridge: 'Samsung and Whirlpool' },
    uniquePara: {
      dishwasher: `Killarney is one of Calgary's most character-rich inner SW neighbourhoods, with 1950s bungalows on streets like Killarney Avenue SW and 26th Avenue SW that have been progressively renovated over the past 20 years. The renovation wave has brought two distinct appliance generations into the same block: fully original 1950s kitchens (rare now) have been replaced by 1980s–1990s Whirlpool or Maytag dishwashers, and many recently renovated homes now have Samsung, Bosch, or KitchenAid units installed within the last 10 years. Calgary's hard water at 150–200 ppm is equally damaging to both generations. In the older Whirlpool units, spray arm nozzles and pump impellers are heavily scaled; in newer Samsung and Bosch units, calcium deposits form on the circulation motor and precision spray jets within 3–5 years without appropriate rinse aid. Killarney is 10 minutes from our 700 6th Ave SW base — a fast dispatch that makes same-day service the standard for any booking made before 1 PM. We stock parts for the full cross-section of Killarney appliance ages and brands.`,
      washer: `Killarney's progressive renovation history means its laundry rooms contain a wide variety of washing machines — from 1990s Whirlpool top-loaders that have been repaired multiple times, to brand-new Samsung front-loaders installed during complete bathroom and laundry renovations. The 1950s bungalow layout typically places the laundry room in a compact space off the kitchen or in the basement, which means front-loaders are often installed on risers — affecting access for drum bearing replacement. We're familiar with Killarney's tight-space repair challenges and bring the appropriate tools. Hard water at 150–200 ppm causes inlet valve scaling across all brands; many Killarney homeowners haven't heard of the Calgary water hardness issue until we diagnose it. We advise on HE-safe water softener tablets and proper rinse-aid use during every washer service call.`,
      fridge: `Killarney's 1950s bungalows that have been renovated often received updated kitchens with Samsung French-door or LG counter-depth refrigerators in the last 5–15 years — appliances that are now showing their first major failure patterns. Ice maker failures are the leading call: Samsung and LG ice makers in Calgary struggle against the city's 150–200 ppm water hardness without a dedicated inline filter. Older unrenovated properties in Killarney may still have Whirlpool or GE top-freezer models from the 1990s — typically presenting with compressor relay failure, defrost heater issues, or door gasket wear. Killarney's 10-minute proximity to our 700 6th Ave SW base makes it one of our fastest-response SW inner-city zones, with same-day service available up to 1:30 PM.`
    },
    issues: {
      dishwasher: ['Samsung dishwasher fill error — 150–200 ppm inlet valve scale', 'Whirlpool drain pump failure — older bungalow units', 'Bosch E24 drain error — pump or filter blockage', 'Door gasket failure — renovation-era units in Calgary climate'],
      washer: ['Samsung front-load drum bearing failure', 'Whirlpool top-load inlet valve calcium blockage', 'Front-loader on riser — drum bearing access in tight bungalow space', 'LG IE error — fill issue from hard water inlet valve scale'],
      fridge: ['Samsung ice maker not producing — 150–200 ppm fill tube scale', 'LG French-door hinge wear — cold air leaking', 'Whirlpool compressor relay failure — older units clicking', 'Defrost heater failure — frost build-up in freezer section']
    },
    relatedNeighborhoods: ['marda-loop', 'altadore', 'mission'],
    lat: 51.0397, lng: -114.1219
  },
  {
    slug: 'mission',
    name: 'Mission',
    area: 'Inner City SW',
    eyebrow: 'Inner City Calgary · Mission',
    driveTime: '5 minutes',
    buildEra: '1920s heritage + condos',
    primaryBrands: { dishwasher: 'Bosch and Miele', washer: 'Bosch and LG', fridge: 'Bosch and Samsung' },
    uniquePara: {
      dishwasher: `Mission — defined by 4th Street SW, the Cliff Bungalow area, and the river escarpment — is one of Calgary's most densely populated inner-city neighbourhoods. Heritage houses from the 1920s on Roxboro Road SW share a zip code with modern high-rise condominiums along the Elbow River. Dishwasher repair in Mission primarily means condo-unit service: Bosch 300–800 series and Miele integrated dishwashers are the dominant brands in newer condo developments, while heritage-home owners often have KitchenAid or Samsung units. Condo buildings add an extra logistical layer — we coordinate building access, freight elevator booking, and suite-specific tooling. Our technicians are experienced with condo-format repair in Mission, including integrated panel-ready Bosch and Miele units where the dishwasher is hidden behind a cabinet face panel. Mission is our closest NW dispatch at 5 minutes from 700 6th Ave SW — essentially downtown Calgary. Calgary's 150–200 ppm water hardness affects Mission condos just as it does suburban homes; high-rise water can also carry higher sediment levels that block precision spray systems faster.`,
      washer: `Mission's condo towers and heritage houses both generate washer repair calls, though the failure patterns differ. Condo units in buildings along the Elbow River typically have Bosch or LG front-loaders installed in compact in-suite laundry closets or stacked configurations. Stacked washer-dryer combos require specific disassembly sequences and tools — our Mission technicians carry the stacking kit hardware and know the Bosch and LG stacked-unit procedures. Heritage houses in Cliff Bungalow area may have older Whirlpool or Maytag units. Calgary's 150–200 ppm water hardness affects washer inlet valves and drum pathways across all buildings. At 5 minutes from our 700 6th Ave SW base, Mission is our fastest-dispatch zone in all of Calgary — technicians can arrive within 45–60 minutes of booking for urgent calls.`,
      fridge: `Mission's dual character — heritage houses and modern condo towers — creates equally varied fridge repair scenarios. Condo units along the Elbow River typically feature Bosch, Liebherr, or Samsung counter-depth fridges designed for compact kitchens. Heritage homes in Cliff Bungalow SW may have full-size Whirlpool or GE fridges. Bosch counter-depth refrigerators in Mission condos are a frequent service call — these units have compact compressor enclosures that require careful cleaning every 6–12 months. Ice maker and water dispenser failures are the leading call in Mission condo units, driven by Calgary's 150–200 ppm water hardness scaling the inlet valve. At 5 minutes from our base, Mission receives the fastest service response of any Calgary neighbourhood we cover — urgent fridge repairs can often be handled within 1 hour of booking.`
    },
    issues: {
      dishwasher: ['Bosch integrated dishwasher — panel-ready disassembly for condo units', 'Miele circulation pump failure — scale from 150–200 ppm water', 'Condo freight elevator coordination for parts delivery', 'High-rise sediment causing spray arm blockage faster than suburban homes'],
      washer: ['Bosch stacked washer in laundry closet — requires stacking disassembly procedure', 'LG front-load drum bearing failure in compact condo configuration', 'Fill error from hard water inlet valve scale — all brands', 'Door boot seal mould in poorly ventilated in-suite laundry closets'],
      fridge: ['Bosch counter-depth compressor overheating — compact enclosure in condo kitchen', 'Ice maker scale — Mission condo units on Calgary hard water', 'Water dispenser calcium blockage — filter and inlet valve replacement', 'Samsung French-door hinge failure in heritage home kitchens']
    },
    relatedNeighborhoods: ['erlton', 'killarney', 'altadore'],
    lat: 51.0347, lng: -114.0819
  },
  {
    slug: 'erlton',
    name: 'Erlton',
    area: 'SE Inner City',
    eyebrow: 'Inner City Calgary · Erlton / Stampede Park',
    driveTime: '7 minutes',
    buildEra: '1950s + condo towers',
    primaryBrands: { dishwasher: 'Samsung and Whirlpool', washer: 'Samsung and LG', fridge: 'Samsung and LG' },
    uniquePara: {
      dishwasher: `Erlton sits in the inner city SE, immediately south of Stampede Park on the Elbow River — a compact neighbourhood bounded by Macleod Trail and the river escarpment. 25th Avenue SE, Riverdale Avenue SW, and the streets feeding the Erlton/Stampede LRT station frame a mixed residential area: 1950s bungalows that survived the era of commercial encroachment and several condo towers built in the 2000s catering to downtown workers who want rapid transit access. Dishwasher repair calls in Erlton reflect this mix — older Whirlpool and Maytag units in the surviving bungalows, and Samsung or LG units in condo kitchens. Calgary's hard water at 150–200 ppm scales dishwasher spray arms and inlet valves across all property types. Condo units near the Stampede grounds sometimes experience elevated water sediment during and after Stampede season when municipal water usage spikes — we've seen corresponding increases in spray arm blockage calls in July each year. Erlton is 7 minutes from our 700 6th Ave SW base — one of our closest SE inner-city service zones, with same-day slots available for most bookings.`,
      washer: `Erlton's 1950s bungalows typically have original-era laundry configurations — rooms sized for top-loaders — while the condo towers have in-suite stacked front-loaders or compact all-in-one washer-dryer combos. Samsung and LG are the dominant brands in the condo segment; Whirlpool and Maytag appear in the bungalow segment. Stacked units in Erlton condos require specific tools and procedures — our technicians carry the necessary equipment for LG and Samsung stacked configuration service. Calgary's 150–200 ppm hard water causes inlet valve calcification on all brands; condo buildings sometimes have older internal plumbing that reduces water pressure, compounding fill issues. At 7 minutes from our base, Erlton is a fast-dispatch zone with same-day availability for bookings placed before 1 PM.`,
      fridge: `Erlton's proximity to Stampede Park means some residential streets face above-average summer heat from asphalt and crowds during Stampede season — a factor that stresses refrigerator condenser coils during Calgary's hottest weeks. Bungalow-era fridges in Erlton (typically Whirlpool or GE top-freezers) run harder than their design load during July; we frequently see condenser coil cleaning and compressor relay calls in August following the Stampede period. Condo units have Samsung or LG counter-depth fridges with ice makers that struggle against Calgary's 150–200 ppm water hardness. Water dispenser and ice maker failures are Erlton's most common fridge call. At 7 minutes from our 700 6th Ave SW base, we provide fast-response service across all Erlton property types.`
    },
    issues: {
      dishwasher: ['Samsung spray arm scale — elevated sediment during Calgary Stampede season', 'Whirlpool pump seal failure — older bungalow-era units', 'LG dishwasher fill error — inlet valve calcium from 150–200 ppm water', 'Condo stainless tub corrosion from high-use rental units'],
      washer: ['LG stacked washer in condo — requires stacking disassembly', 'Samsung 4E fill error — inlet valve calcium plus reduced condo building pressure', 'Whirlpool top-load motor coupling failure', 'Front-load door boot seal failure in high-density rental units'],
      fridge: ['Condenser coil overload during Calgary Stampede summer heat', 'Whirlpool compressor relay failure after sustained high-temperature operation', 'Samsung ice maker inlet valve scale from Calgary water hardness', 'LG French-door hinge failure — cold air leaking into kitchen']
    },
    relatedNeighborhoods: ['mission', 'killarney', 'marda-loop'],
    lat: 51.0297, lng: -114.0719
  }
];

const services = [
  {
    key: 'dishwasher',
    slug: 'dishwasher-repair',
    label: 'Dishwasher Repair',
    title: 'Dishwasher Repair',
    appliance: 'dishwasher',
    appliancePlural: 'dishwashers',
    commonBrandsLine: 'Samsung, LG, Whirlpool, Bosch, Kenmore, KitchenAid, Miele, GE &amp; more',
    priceRange: '$120–$380',
    repairRows: [
      ['Standard repair — drain pump, spray arm, inlet valve', '$120 – $240'],
      ['Complex repair — control board, wash motor, sealed components', '$240 – $380']
    ]
  },
  {
    key: 'washer',
    slug: 'washer-repair',
    label: 'Washer Repair',
    title: 'Washer Repair',
    appliance: 'washing machine',
    appliancePlural: 'washing machines',
    commonBrandsLine: 'Samsung, LG, Whirlpool, Kenmore, Maytag, Bosch, GE, KitchenAid, Electrolux &amp; more',
    priceRange: '$120–$380',
    repairRows: [
      ['Standard repair — pump, belt, lid switch, inlet valve', '$120 – $240'],
      ['Complex repair — drum bearing, motor, control board', '$240 – $380']
    ]
  },
  {
    key: 'fridge',
    slug: 'fridge-repair',
    label: 'Fridge Repair',
    title: 'Refrigerator Repair',
    appliance: 'refrigerator',
    appliancePlural: 'refrigerators',
    commonBrandsLine: 'Samsung, LG, Whirlpool, Kenmore, GE, Frigidaire, Bosch, KitchenAid &amp; more',
    priceRange: '$120–$450',
    repairRows: [
      ['Standard repair — relay, fan, defrost heater, gasket', '$120 – $260'],
      ['Complex repair — compressor, sealed system, control board', '$260 – $450']
    ]
  }
];

function getRelatedLinks(neighborhood, service, allNeighborhoods) {
  const otherServices = services.filter(s => s.key !== service.key);
  const relatedNbhds = neighborhood.relatedNeighborhoods.slice(0, 3);

  const links = [];
  // Other services in same neighborhood
  otherServices.forEach(s => {
    links.push(`<a href="/${s.slug}-${neighborhood.slug}" class="related-link">${s.label} — ${neighborhood.name}</a>`);
  });
  // Same service in related neighborhoods
  relatedNbhds.forEach(slug => {
    const nbhd = allNeighborhoods.find(n => n.slug === slug);
    if (nbhd) {
      links.push(`<a href="/${service.slug}-${slug}" class="related-link">${service.label} — ${nbhd.name}</a>`);
    }
  });
  // All Calgary
  links.push(`<a href="/${service.slug}-calgary" class="related-link">All Calgary ${service.label}</a>`);
  return links.slice(0, 6).join('\n      ');
}

function generatePage(neighborhood, service) {
  const slug = `${service.slug}-${neighborhood.slug}`;
  const url = `${BASE_URL}/${slug}`;
  const pageTitle = `${service.title} ${neighborhood.name} Calgary | Same-Day Appliance Repair`;
  const metaDesc = `${service.title} in ${neighborhood.name}, Calgary — same-day service, flat $65 diagnostic. Book online or email ${EMAIL}.`;
  const h1 = `${service.title} in ${neighborhood.name}, Calgary`;
  const answerBox = `Same-day ${service.appliance} repair in ${neighborhood.name}, ${neighborhood.area}, Calgary. We fix all major brands — ${service.commonBrandsLine}. Flat $65 diagnostic, waived when repair proceeds. 90-day warranty.`;
  const quickAnswer = `Need ${service.appliance} repair in ${neighborhood.name}? We serve all Calgary neighbourhoods — same-day, flat $65 diagnostic. <a href="${BOOKING_URL}" style="color:#2563eb;font-weight:600">Book online</a> or email <a href="mailto:${EMAIL}" style="color:#2563eb;font-weight:600">${EMAIL}</a>. Available 7 days a week.`;

  const uniquePara = neighborhood.uniquePara[service.key];
  const issues = neighborhood.issues[service.key];
  const issueItems = issues.map(i => `<li><strong>${i}</strong></li>`).join('\n      ');

  const problemCards = issues.map(issue => {
    const [name, ...rest] = issue.split(' — ');
    const desc = rest.length > 0 ? rest.join(' — ') : `Diagnosed and repaired same-day. We carry parts for all common ${neighborhood.name} models.`;
    return `<div class="problem-card"><div class="problem-name">${name}</div><div class="problem-desc">${desc}</div></div>`;
  }).join('\n      ');

  const priceRows = [
    `<tr><td>Diagnostic visit (waived when repair proceeds)</td><td>$65</td></tr>`,
    ...service.repairRows.map(([label, price]) => `<tr><td>${label}</td><td>${price}</td></tr>`)
  ].join('\n        ');

  const relatedLinks = getRelatedLinks(neighborhood, service, neighborhoods);

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How quickly can you reach ${neighborhood.name}?`,
        "acceptedAnswer": {"@type": "Answer", "text": `${neighborhood.name} is approximately ${neighborhood.driveTime} from our 700 6th Ave SW location. We typically arrive within 2–3 hours of booking. Book before noon on weekdays for same-day service.`}
      },
      {
        "@type": "Question",
        "name": `Do you repair ${neighborhood.primaryBrands[service.key]} ${service.appliancePlural} in ${neighborhood.name}?`,
        "acceptedAnswer": {"@type": "Answer", "text": `Yes — ${neighborhood.primaryBrands[service.key]} are among the most common brands we service in ${neighborhood.name}. We carry parts for all major brands and typically complete repairs on the first visit.`}
      },
      {
        "@type": "Question",
        "name": `How much does ${service.appliance} repair cost in ${neighborhood.name}?`,
        "acceptedAnswer": {"@type": "Answer", "text": `Most ${service.appliance} repairs in ${neighborhood.name} cost ${service.priceRange} CAD. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins.`}
      }
    ]
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<meta name="description" content="${metaDesc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/tokens.css">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth;font-size:16px}body{font-family:'Instrument Sans',-apple-system,sans-serif;background:#fff;color:#0a0a0a;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.container{max-width:1200px;margin:0 auto;padding:0 24px}.breadcrumb{padding:14px 0;border-bottom:1px solid #e5e7eb;background:#fafafa}.breadcrumb .container{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.breadcrumb a{font-size:.8125rem;font-weight:500;color:#6b7280}.breadcrumb-sep{font-size:.8125rem;color:#d1d5db}.breadcrumb-current{font-size:.8125rem;font-weight:600;color:#0a0a0a}.page-hero{padding:56px 0 48px;background:#fff;border-bottom:1px solid #e5e7eb}.page-hero .container{max-width:800px}.page-hero-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#2563eb;margin-bottom:16px}.page-hero-eyebrow::before{content:'';display:block;width:16px;height:2px;background:#2563eb}h1.page-h1{font-size:clamp(1.875rem,4vw,2.75rem);font-weight:700;line-height:1.1;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:24px}.answer-box{background:#eff6ff;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;padding:20px 24px;margin-bottom:32px;font-size:1rem;color:#1e40af;line-height:1.7;font-weight:500}.page-hero-ctas{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.btn-primary{display:inline-flex;align-items:center;gap:8px;background:#2563eb;color:#fff;font-size:1rem;font-weight:700;padding:14px 24px;border-radius:4px;white-space:nowrap}.btn-secondary{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#2563eb;font-size:1rem;font-weight:700;padding:13px 22px;border-radius:4px;border:1.5px solid #2563eb;white-space:nowrap}.trust-bar{background:#0a0a0a;padding:14px 0}.trust-bar-inner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0}.trust-item{display:flex;align-items:center;gap:8px;padding:4px 24px;border-right:1px solid rgba(255,255,255,.1);font-size:.8125rem;font-weight:600;color:rgba(255,255,255,.9);white-space:nowrap}.trust-item:last-child{border-right:none}.section-label{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#2563eb;margin-bottom:12px;display:flex;align-items:center;gap:8px}.section-title{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;line-height:1.15;margin-bottom:16px}main.page-main{padding:56px 0 0}.content-intro{max-width:760px;font-size:1.0625rem;color:#374151;line-height:1.75;margin-bottom:56px}.content-intro h2{font-size:1.375rem;font-weight:700;color:#0a0a0a;letter-spacing:-.02em;margin-top:32px;margin-bottom:12px}.content-intro p{margin-bottom:16px}.content-intro ul{margin:16px 0;padding-left:0;list-style:none}.content-intro ul li{padding:6px 0 6px 20px;position:relative;font-size:1rem;color:#374151}.content-intro ul li::before{content:'→';position:absolute;left:0;color:#2563eb;font-weight:700}.service-details{padding:48px 0;border-top:1px solid #e5e7eb}.problems-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}.problem-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px}.problem-name{font-size:.9375rem;font-weight:700;color:#0a0a0a;margin-bottom:6px}.problem-desc{font-size:.875rem;color:#6b7280;line-height:1.5}.pricing-table{width:100%;border-collapse:collapse;margin-top:24px;font-size:.9375rem}.pricing-table th,.pricing-table td{padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:left}.pricing-table th{background:#f9fafb;font-weight:600;color:#0a0a0a;font-size:.8125rem;text-transform:uppercase;letter-spacing:.05em}.pricing-table td:last-child{font-weight:600;color:#2563eb;white-space:nowrap}.pricing-note{font-size:.8125rem;color:#6b7280;margin-top:12px;line-height:1.5}.booking-section{padding:56px 0;border-top:1px solid #e5e7eb;text-align:center}.booking-section h2{font-size:1.75rem;font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:12px}.booking-alt{font-size:.9375rem;color:#6b7280;margin-top:16px}.booking-alt a{color:#2563eb;font-weight:600}.faq-section{padding:56px 0;border-top:1px solid #e5e7eb}.faq-section h2{font-size:clamp(1.5rem,3vw,2rem);font-weight:700;letter-spacing:-.03em;color:#0a0a0a;margin-bottom:32px}.faq-item{border-bottom:1px solid #e5e7eb}.faq-question{display:flex;justify-content:space-between;align-items:center;padding:18px 0;cursor:pointer;gap:16px;list-style:none;font-weight:600;font-size:1rem;color:#0a0a0a}.faq-question::-webkit-details-marker{display:none}.faq-icon{font-size:1.25rem;color:#2563eb;flex-shrink:0;transition:transform .2s}details[open] .faq-icon{transform:rotate(45deg)}.faq-answer{padding:0 0 18px;font-size:.9375rem;color:#374151;line-height:1.7}.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}.related-link{display:block;padding:10px 14px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;font-size:.875rem;font-weight:500;color:#2563eb;transition:border-color .15s}.related-link:hover{border-color:#2563eb}footer.site-footer{background:#0a0a0a;color:rgba(255,255,255,.7);padding:40px 0;margin-top:80px}footer .container{display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}footer p{font-size:.875rem;line-height:1.6}footer a{color:#93c5fd;font-weight:500}.sticky-cta{position:fixed;bottom:24px;right:24px;z-index:200;display:flex;flex-direction:column;gap:10px}.sticky-btn{display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:50px;font-size:.9375rem;font-weight:700;box-shadow:0 4px 16px rgba(0,0,0,.2);white-space:nowrap}.sticky-book{background:#2563eb;color:#fff}.fade-in{opacity:0;transition:opacity .35s ease}.fade-in.visible{opacity:1}@media(max-width:768px){.problems-grid{grid-template-columns:1fr}}@media(max-width:640px){.page-hero{padding:40px 0 36px}h1.page-h1{font-size:1.75rem}.sticky-cta{display:none}}
</style>
<meta property="og:type" content="website">
<meta property="og:title" content="${pageTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Appliance Repair Near You — Calgary">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","@id":"${url}#business","name":"${service.title} ${neighborhood.name} — Calgary Appliance Repair","description":"Same-day ${service.appliance} repair in ${neighborhood.name}, Calgary. Flat $65 diagnostic, 90-day warranty.","url":"${url}","priceRange":"$$","address":{"@type":"PostalAddress","streetAddress":"700 6th Avenue SW Suite 1700","addressLocality":"Calgary","addressRegion":"AB","postalCode":"T2P 0T8","addressCountry":"CA"},"geo":{"@type":"GeoCoordinates","latitude":${neighborhood.lat},"longitude":${neighborhood.lng}},"areaServed":[{"@type":"City","name":"Calgary"},{"@type":"Neighborhood","name":"${neighborhood.name}"}],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"08:00","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":"Sunday","opens":"10:00","closes":"18:00"}],"serviceType":"${service.title}"}
</script>
</head>
<body>
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>

<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
    <a href="/">Home</a><span class="breadcrumb-sep">/</span>
    <a href="/${service.slug}-calgary">${service.label} Calgary</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${neighborhood.name}</span>
  </div>
</nav>

<section class="page-hero" aria-label="Page header">
  <div class="container">
    <div class="page-hero-eyebrow">${neighborhood.eyebrow}</div>
    <h1 class="page-h1">${h1}</h1>
    <div class="answer-box">${answerBox}</div>
    <div class="page-hero-ctas">
      <a href="${BOOKING_URL}" class="btn-primary">Book Online</a>
      <a href="mailto:${EMAIL}" class="btn-secondary">Email Us</a>
    </div>
  </div>
</section>

<div class="answer-capsule" style="background:#eff6ff;border-left:4px solid #2563eb;padding:1rem 1.25rem;margin:1rem auto;max-width:900px;border-radius:0 8px 8px 0" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2563eb;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#1e3a5f;font-size:.9rem;line-height:1.6" itemprop="description">${quickAnswer}</p>
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
    <h2>${service.title} in ${neighborhood.name} — Fast, Reliable, Local</h2>
    <p>${uniquePara}</p>

    <h2>Common ${service.title} Issues in ${neighborhood.name}</h2>
    <ul>
      ${issueItems}
    </ul>

    <h2>Repair Cost in ${neighborhood.name}</h2>
    <p>Flat $65 diagnostic fee, waived when repair proceeds. Most ${service.appliance} repairs in ${neighborhood.name}: ${service.priceRange} parts and labour. Written quote before any work begins — no surprises. All repairs include a 90-day parts and labour warranty.</p>
  </div>

  <section class="service-details fade-in" aria-label="Common problems and pricing">
    <div class="section-label">Common issues</div>
    <h2 class="section-title">Common ${service.title} Problems We Fix in ${neighborhood.name}</h2>
    <div class="problems-grid">
      ${problemCards}
    </div>

    <div class="section-label" style="margin-top:48px">Pricing</div>
    <h2 class="section-title">${service.title} Cost in ${neighborhood.name}</h2>
    <table class="pricing-table" aria-label="Repair pricing">
      <thead><tr><th>Repair Type</th><th>Typical Cost (CAD)</th></tr></thead>
      <tbody>
        ${priceRows}
      </tbody>
    </table>
    <p class="pricing-note">Firm written quote before any work begins. OEM or OEM-equivalent parts with 90-day parts &amp; labour warranty.</p>
  </section>

  <section class="booking-section fade-in" aria-label="Book your repair">
    <div class="section-label">Online booking</div>
    <h2>Book ${service.title} in ${neighborhood.name}</h2>
    <p>Real-time availability, instant confirmation, no commitment required.</p>
    <iframe id="fixlify-booking-${neighborhood.slug}-${service.key}" src="${BOOKING_URL}?embed=true" style="width:100%;height:600px;border:none;display:block" title="Book ${service.title} in ${neighborhood.name}" loading="lazy" allowtransparency="true"></iframe>
    <script>window.addEventListener('message',function(e){if(e.data&&e.data.type==='fixlify-resize'){var el=document.getElementById('fixlify-booking-${neighborhood.slug}-${service.key}');if(el)el.style.height=e.data.height+'px'}});<\/script>
    <p class="booking-alt">Prefer email? <a href="mailto:${EMAIL}">${EMAIL}</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm, Sun 10am&ndash;6pm</p>
  </section>

  <section class="faq-section fade-in" aria-label="Frequently asked questions">
    <div class="container" style="padding:0">
      <h2>FAQ — ${service.title} in ${neighborhood.name}</h2>
      <div class="faq-list">
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How quickly can you reach ${neighborhood.name}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${neighborhood.name} is approximately ${neighborhood.driveTime} from our 700 6th Ave SW location. We typically dispatch within 2–3 hours of booking. Book before noon on weekdays for same-day service.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Do you repair ${neighborhood.primaryBrands[service.key]} ${service.appliancePlural} in ${neighborhood.name}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Yes — ${neighborhood.primaryBrands[service.key]} are among the most common brands we service in ${neighborhood.name}. We carry parts on every dispatch and typically complete repairs on the first visit.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">How much does ${service.appliance} repair cost in ${neighborhood.name}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Most ${service.appliance} repairs in ${neighborhood.name} run ${service.priceRange} CAD depending on the part and brand. The flat $65 diagnostic fee is waived when you proceed with the repair. You receive a written quote before any work begins.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Does Calgary hard water affect my ${service.appliance} in ${neighborhood.name}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Yes. Calgary's water hardness of 150–200 ppm causes calcium scale to accumulate on water-contact components within 3–5 years. We account for local water conditions on every ${neighborhood.name} service call and advise on preventive measures.</p></div></details>
        <details class="faq-item"><summary class="faq-question"><span class="faq-q-text">Do you service all appliance brands in ${neighborhood.name}?</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><p>Yes. We repair Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, Electrolux, KitchenAid, Kenmore, Miele, and most other brands found in ${neighborhood.name} homes.</p></div></details>
      </div>
    </div>
  </section>
</main>

<div style="padding:40px 0;border-top:1px solid #e5e7eb;background:#f9fafb">
  <div class="container">
    <h2 style="font-size:1.375rem;font-weight:700;margin-bottom:24px">More Appliance Repair Services in ${neighborhood.name} &amp; Calgary</h2>
    <div class="related-grid">
      ${relatedLinks}
    </div>
  </div>
</div>

<footer class="site-footer" role="contentinfo" data-footer-region="calgary">
  <div class="container">
    <p><strong>Calgary Appliance Repair</strong> | Serving ${neighborhood.name} and all Calgary</p>
    <p>${ADDRESS}</p>
    <p>Email: <a href="mailto:${EMAIL}">${EMAIL}</a> | <a href="${BOOKING_URL}">Book Online</a></p>
    <p>Mon&ndash;Sat 8 AM&ndash;8 PM &nbsp;|&nbsp; Sun 10 AM&ndash;6 PM (Mountain Time)</p>
    <p><a href="/privacy">Privacy Policy</a> &middot; <a href="/terms">Terms of Service</a> &middot; <a href="/sitemap.xml">Sitemap</a></p>
    <p>&copy; <span id="footer-year-${neighborhood.slug}-${service.key}"></span> Appliance Repair Near You &mdash; Calgary</p>
  </div>
</footer>
<script>(function(){var el=document.getElementById('footer-year-${neighborhood.slug}-${service.key}');if(el)el.textContent=new Date().getFullYear()})();<\/script>

<div class="sticky-cta" aria-label="Quick contact">
  <a href="${BOOKING_URL}" class="sticky-btn sticky-book">Book Online &rarr;</a>
</div>
<script>document.addEventListener('DOMContentLoaded',function(){var els=document.querySelectorAll('.fade-in');if('IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:.1});els.forEach(function(el){io.observe(el)})}else{els.forEach(function(el){el.classList.add('visible')})}});<\/script>
<script type="application/ld+json">
${faqSchema}
<\/script>
</body>
</html>`;
}

let generated = 0;
let skipped = 0;

neighborhoods.forEach(neighborhood => {
  services.forEach(service => {
    const filename = `${service.slug}-${neighborhood.slug}.html`;
    const filepath = path.join(__dirname, filename);

    // Skip if already manually created (Brentwood pages)
    if (neighborhood.slug === 'brentwood') {
      console.log(`SKIP (manual): ${filename}`);
      skipped++;
      return;
    }

    const html = generatePage(neighborhood, service);
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`OK: ${filename} (${html.length} bytes)`);
    generated++;
  });
});

console.log(`\nDone! Generated ${generated} pages, skipped ${skipped} (manual). Total: ${generated + skipped}`);
