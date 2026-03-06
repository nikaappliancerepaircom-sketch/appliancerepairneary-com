#!/usr/bin/env node
/**
 * make-unique.js — Inject unique city-context paragraphs into NEARY city pages
 * Goal: raise uniqueness from ~26% to 80%+ by adding city-specific content
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MARKER_START = '<!-- UNIQUE-CITY-CONTENT -->';
const MARKER_END = '<!-- END-UNIQUE-CITY-CONTENT -->';

// ═══════════════════════════════════════════════════════════════════
// CITY DATA — unique neighborhoods, housing, facts for each city
// ═══════════════════════════════════════════════════════════════════
const cityData = {
  'toronto': {
    name: 'Toronto',
    neighborhoods: ['Downtown Core', 'Midtown', 'Yorkville'],
    housing: 'Toronto has the GTA\'s most diverse housing stock — Victorian semi-detached homes in Cabbagetown, mid-century bungalows in the former boroughs, and modern glass condominiums along the waterfront.',
    fact: 'Toronto\'s older pre-war homes often have knob-and-tube wiring and galvanized plumbing that require specialized appliance installation and grounding checks.',
    area: 'central Toronto'
  },
  'brampton': {
    name: 'Brampton',
    neighborhoods: ['Springdale', 'Heart Lake', 'Mount Pleasant'],
    housing: 'Brampton expanded rapidly after 2000 with large detached homes in master-planned communities, resulting in relatively uniform builder-grade appliance setups across most subdivisions.',
    fact: 'Brampton\'s Peel Region water supply has moderate-to-high calcium hardness, accelerating mineral buildup in dishwasher spray arms, washing machine inlet valves, and refrigerator water lines.',
    area: 'Peel Region'
  },
  'mississauga': {
    name: 'Mississauga',
    neighborhoods: ['Port Credit', 'Erin Mills', 'Clarkson'],
    housing: 'Mississauga ranges from 1960s-era split-levels in Clarkson and Lorne Park to modern high-rise condos clustered around Square One, creating two very different appliance service environments.',
    fact: 'Mississauga\'s lakefront communities like Port Credit experience higher humidity than inland areas, which contributes to accelerated rust on dryer drums and oven door hinges.',
    area: 'western GTA'
  },
  'scarborough': {
    name: 'Scarborough',
    neighborhoods: ['Agincourt', 'Malvern', 'Guildwood'],
    housing: 'Scarborough features 1950s-70s bungalows and split-levels in areas like Birchcliff and Guildwood, alongside newer townhouse developments in Malvern and Rouge Park.',
    fact: 'Many Scarborough homes still have original 1960s-era 60-amp electrical panels that may need an electrician\'s assessment before installing modern high-draw appliances like induction ranges.',
    area: 'eastern Toronto'
  },
  'north-york': {
    name: 'North York',
    neighborhoods: ['Willowdale', 'Don Mills', 'Bayview Village'],
    housing: 'North York has a split personality — quiet residential streets with postwar bungalows in Don Mills alongside dense condo corridors on Yonge Street and Sheppard Avenue.',
    fact: 'North York\'s condo boom along the Yonge-Sheppard corridor means many service calls involve navigating concierge access, freight elevators, and narrow galley kitchens designed for compact appliances.',
    area: 'northern Toronto'
  },
  'etobicoke': {
    name: 'Etobicoke',
    neighborhoods: ['Mimico', 'Islington Village', 'The Kingsway'],
    housing: 'Etobicoke offers established mid-century homes in The Kingsway and Islington Village, waterfront condos in Mimico and Humber Bay, and newer townhouse complexes near Rexdale.',
    fact: 'Etobicoke\'s older homes along The Kingsway and Royal York Road often have built-in wall ovens from the original 1950s-60s construction that require non-standard replacement sizing.',
    area: 'western Toronto'
  },
  'ajax': {
    name: 'Ajax',
    neighborhoods: ['Pickering Beach', 'South Ajax', 'Audley'],
    housing: 'Ajax is primarily composed of 1990s-2010s suburban developments with standardized builder-grade kitchens, making appliance replacements straightforward in most homes.',
    fact: 'Ajax homes draw water from Lake Ontario through Durham Region\'s treatment system, which produces slightly softer water than Peel Region — extending the life of appliance water valves by one to two years on average.',
    area: 'Durham Region'
  },
  'pickering': {
    name: 'Pickering',
    neighborhoods: ['Bay Ridges', 'Dunbarton', 'Amberlea'],
    housing: 'Pickering combines 1970s-80s subdivisions near the waterfront in Bay Ridges with newer 2000s-era homes in Brock Ridge and Duffin Heights.',
    fact: 'Pickering\'s proximity to the Rouge Valley and surrounding green space means many homes contend with higher pest activity in garages and basements, which can damage exposed appliance wiring and insulation.',
    area: 'Durham Region'
  },
  'markham': {
    name: 'Markham',
    neighborhoods: ['Unionville', 'Markham Village', 'Cornell'],
    housing: 'Markham ranges from heritage homes in Unionville Main Street to expansive detached homes in the newer Cathedral Town and Cornell communities, each with distinct appliance configurations.',
    fact: 'Markham has one of the GTA\'s highest concentrations of multi-generational households, meaning appliances run more cycles per day and experience accelerated wear on motors, bearings, and door seals.',
    area: 'York Region'
  },
  'richmond-hill': {
    name: 'Richmond Hill',
    neighborhoods: ['Oak Ridges', 'Bayview Hill', 'Elgin Mills'],
    housing: 'Richmond Hill features luxury estate homes on Oak Ridges Moraine alongside dense townhouse clusters near Yonge Street and Highway 7, creating varied service requirements.',
    fact: 'Richmond Hill homes on the Oak Ridges Moraine frequently use well water systems that deposit higher iron content in appliance water lines, causing staining and premature valve failure.',
    area: 'York Region'
  },
  'vaughan': {
    name: 'Vaughan',
    neighborhoods: ['Woodbridge', 'Maple', 'Kleinburg'],
    housing: 'Vaughan grew from rural hamlets into a sprawling suburb, with Woodbridge\'s Italian-Canadian community favoring premium European appliance brands and custom kitchen builds.',
    fact: 'Vaughan\'s Woodbridge area has an unusually high concentration of Miele, Bosch, and Bertazzoni appliances due to the community\'s preference for European kitchen brands, requiring specialty part sourcing.',
    area: 'York Region'
  },
  'oakville': {
    name: 'Oakville',
    neighborhoods: ['Bronte', 'Old Oakville', 'Glen Abbey'],
    housing: 'Oakville is known for upscale detached homes in South Oakville and Glen Abbey, with newer developments north of Dundas Street offering modern open-concept kitchens.',
    fact: 'Oakville homeowners in the south-end heritage district frequently have custom cabinetry that requires panel-ready or counter-depth appliances, making standard replacements more complex.',
    area: 'Halton Region'
  },
  'burlington': {
    name: 'Burlington',
    neighborhoods: ['Alton Village', 'Tyandaga', 'Downtown Burlington'],
    housing: 'Burlington features waterfront properties along the lake, established mid-century homes in Tyandaga, and family-oriented new builds in Alton Village and Orchard.',
    fact: 'Burlington\'s position between Hamilton\'s steel mills and Lake Ontario creates a micro-climate with slightly higher humidity and airborne particulates, which can clog dryer vents and condenser coils faster.',
    area: 'Halton Region'
  },
  'whitby': {
    name: 'Whitby',
    neighborhoods: ['Brooklin', 'Downtown Whitby', 'Williamsburg'],
    housing: 'Whitby has experienced rapid growth in Brooklin and Williamsburg, where most homes are detached builds from 2005-2020 with standard appliance cutouts and modern electrical panels.',
    fact: 'Whitby\'s Brooklin community is one of Durham Region\'s fastest-growing areas, and many homes there are reaching the 10-15 year mark when original builder appliances typically need their first major repair.',
    area: 'Durham Region'
  },
  'oshawa': {
    name: 'Oshawa',
    neighborhoods: ['Windfields', 'Northglen', 'Samac'],
    housing: 'Oshawa has a broad housing mix — century homes near the downtown core, postwar bungalows in Eastdale and Hillsdale, and new builds in Windfields and Northglen.',
    fact: 'Oshawa\'s industrial heritage means many older homes have 100-amp electrical panels and gas lines sized for vintage appliances, occasionally requiring infrastructure upgrades before modern appliance installation.',
    area: 'Durham Region'
  },
  'thornhill': {
    name: 'Thornhill',
    neighborhoods: ['Thornhill Woods', 'Thornhill Village', 'Royal Orchard'],
    housing: 'Thornhill straddles Vaughan and Markham, with heritage homes on Centre Street, established subdivisions in Royal Orchard, and newer executive homes in Thornhill Woods.',
    fact: 'Thornhill\'s kosher-observant households often have dual dishwashers, separate cooktops, and additional refrigerators, creating more complex service requirements than typical single-appliance calls.',
    area: 'York Region'
  },
  'newmarket': {
    name: 'Newmarket',
    neighborhoods: ['Stonehaven', 'Glenway Estates', 'Upper Canada Mall area'],
    housing: 'Newmarket has a compact downtown with older homes near Main Street and newer family subdivisions in Stonehaven and Bristol-London, built primarily between 1990 and 2015.',
    fact: 'Newmarket sits at the northern edge of York Region\'s urban boundary, meaning homes here experience colder winter temperatures that stress heating elements in dryers and ovens more than in lakefront communities.',
    area: 'York Region'
  },
  'aurora': {
    name: 'Aurora',
    neighborhoods: ['Bayview Southeast', 'Aurora Highlands', 'St. Andrews'],
    housing: 'Aurora is a well-established commuter town with a mix of 1970s-90s family homes in the core and newer estate-style properties along Leslie Street and Bayview Avenue.',
    fact: 'Aurora\'s affluent demographic trends toward premium appliance brands like Sub-Zero, Wolf, and Thermador, which require manufacturer-certified repair procedures and specialty parts not stocked by general repair services.',
    area: 'York Region'
  },
  'hamilton': {
    name: 'Hamilton',
    neighborhoods: ['Westdale', 'Dundas', 'Stoney Creek'],
    housing: 'Hamilton spans century-old worker cottages on the Mountain, lakefront properties in Stoney Creek, and gentrifying districts like Locke Street and Ottawa Street with renovated Edwardian homes.',
    fact: 'Hamilton\'s steel-industry legacy has left higher particulate matter in the air around the harbour, which accelerates filter clogging in dryer vents and range hood exhaust systems near the industrial core.',
    area: 'Hamilton-Wentworth'
  },
  'guelph': {
    name: 'Guelph',
    neighborhoods: ['South End', 'University District', 'Kortright Hills'],
    housing: 'Guelph features stone-built heritage homes downtown, student rental housing near the university, and newer family subdivisions in the south end and Hanlon Creek area.',
    fact: 'Guelph sources its drinking water from underground aquifers rather than Lake Ontario, resulting in harder water with higher mineral content that accelerates scale buildup in washing machines and dishwashers.',
    area: 'Wellington County'
  },
  'east-york': {
    name: 'East York',
    neighborhoods: ['Thorncliffe Park', 'Leaside', 'O\'Connor-Parkview'],
    housing: 'East York is characterized by postwar Cape Cod and bungalow-style homes from the 1940s-60s, many still featuring original galley kitchens with non-standard appliance dimensions.',
    fact: 'East York\'s smaller lot sizes and attached homes mean dryer venting runs are often longer and more convoluted than detached-home installations, increasing lint buildup and fire risk.',
    area: 'central-east Toronto'
  },
  'york': {
    name: 'York',
    neighborhoods: ['Weston', 'Mount Dennis', 'Silverthorn'],
    housing: 'York\'s residential areas include postwar worker homes in Weston and Mount Dennis, with ongoing revitalization bringing modern condo units near the new Eglinton Crosstown stations.',
    fact: 'York\'s older housing stock frequently has narrow basement staircases and doorways that make large appliance delivery and installation challenging — our technicians carry measurements and door-removal tools.',
    area: 'west-central Toronto'
  },
  'west-hill': {
    name: 'West Hill',
    neighborhoods: ['Port Union', 'Centennial Community', 'West Hill Village'],
    housing: 'West Hill sits between Highland Creek and the Rouge River, featuring 1960s-80s detached homes and newer infill townhouses along Kingston Road and Morningside Avenue.',
    fact: 'West Hill\'s location between two ravine systems creates a slightly damper microclimate that increases condensation behind refrigerators and underneath washing machines, contributing to mold and corrosion.',
    area: 'south Scarborough'
  },
  'agincourt': {
    name: 'Agincourt',
    neighborhoods: ['Agincourt South', 'Milliken', 'Tam O\'Shanter'],
    housing: 'Agincourt features 1960s-70s detached homes and bungalows interspersed with newer townhouse developments, plus a growing number of infill properties replacing original single-story homes.',
    fact: 'Agincourt has one of Toronto\'s most ethnically diverse populations, and many households use specialized cooking appliances like wok burners and tandoor ovens that require gas line modifications and high-BTU connections.',
    area: 'northeast Scarborough'
  },
  'malvern': {
    name: 'Malvern',
    neighborhoods: ['Malvern West', 'Neilson Park', 'Tapscott'],
    housing: 'Malvern was developed primarily in the 1970s-80s as planned communities with townhouses, semi-detached homes, and low-rise apartments, many now reaching the age where original appliances need replacement.',
    fact: 'Malvern\'s townhouse complexes often have stacked washer-dryer configurations in tight closet spaces, making service access difficult and requiring technicians who are comfortable working in confined areas.',
    area: 'northeast Scarborough'
  },
  'highland-creek': {
    name: 'Highland Creek',
    neighborhoods: ['Highland Creek Village', 'Centennial College area', 'Military Trail'],
    housing: 'Highland Creek is one of Scarborough\'s oldest communities with a village core featuring homes from the 1800s, surrounded by 1950s-70s suburban development and newer builds near the university campus.',
    fact: 'Highland Creek\'s heritage homes near the village centre often have non-standard kitchen dimensions and low-clearance basement installations that require compact or counter-depth appliance alternatives.',
    area: 'southeast Scarborough'
  },
  'bayview-village': {
    name: 'Bayview Village',
    neighborhoods: ['Bayview Village', 'Sheppard-Bayview', 'Bayview Glen'],
    housing: 'Bayview Village is an affluent enclave of detached homes from the 1950s-70s, many extensively renovated with premium kitchens featuring built-in refrigeration and professional-grade ranges.',
    fact: 'Bayview Village homeowners frequently invest in integrated appliance packages where the refrigerator, dishwasher, and cooking suite are panel-matched — when one unit fails, the replacement must match the existing panel style.',
    area: 'North York'
  },
  'birchcliff': {
    name: 'Birchcliff',
    neighborhoods: ['Birchcliff Heights', 'Scarborough Bluffs', 'Birchcliff Village'],
    housing: 'Birchcliff is a lakeside Scarborough neighbourhood of 1920s-50s cottages and bungalows, many expanded over the decades with additions that create unusual kitchen layouts.',
    fact: 'Birchcliff\'s proximity to the Scarborough Bluffs exposes homes to lake-effect humidity and salt spray, which accelerates corrosion on outdoor condenser units, dryer vents, and any appliance components near exterior walls.',
    area: 'south Scarborough'
  },
  'cabbagetown': {
    name: 'Cabbagetown',
    neighborhoods: ['Cabbagetown South', 'Regent Park', 'Parliament Street'],
    housing: 'Cabbagetown is Toronto\'s largest continuously preserved Victorian residential area, with row houses from the 1860s-1890s featuring narrow, deep floor plans and compact kitchens.',
    fact: 'Cabbagetown\'s Victorian row houses were built before kitchen appliances existed — doorways, staircases, and kitchens are often too narrow for standard 36-inch refrigerators, requiring counter-depth or European slim models.',
    area: 'downtown east Toronto'
  },
  'danforth-village': {
    name: 'Danforth Village',
    neighborhoods: ['Danforth East', 'Main Square', 'Woodbine-Lumsden'],
    housing: 'Danforth Village features turn-of-the-century semi-detached homes above the Danforth commercial strip, with modest lot sizes and kitchens that have been updated through multiple renovation eras.',
    fact: 'Danforth Village\'s older homes frequently have kitchens that have been renovated two or three times over a century, creating non-standard clearances and mixed plumbing materials (copper, galvanized, PEX) that affect appliance hookups.',
    area: 'east Toronto'
  },
  'davisville-village': {
    name: 'Davisville Village',
    neighborhoods: ['Davisville', 'Mount Pleasant East', 'Chaplin Estates'],
    housing: 'Davisville Village is a mix of 1920s-40s detached homes and modern mid-rise condominiums along Yonge Street, with distinct service needs depending on property age.',
    fact: 'Davisville\'s condo buildings along Yonge and Mount Pleasant have centralized water systems with higher pressure than typical residential supply, which can stress dishwasher and washing machine inlet valves.',
    area: 'midtown Toronto'
  },
  'don-mills': {
    name: 'Don Mills',
    neighborhoods: ['Don Mills Proper', 'The Shops at Don Mills', 'Parkway Forest'],
    housing: 'Don Mills was Canada\'s first master-planned community in the 1950s, with distinctive mid-century modern homes featuring open floor plans and galley kitchens now being updated for modern appliances.',
    fact: 'Don Mills\' original 1950s homes were designed around appliance dimensions that no longer exist — 21-inch dishwashers and 28-inch ranges — meaning modern replacements require cabinet modifications.',
    area: 'North York'
  },
  'forest-hill': {
    name: 'Forest Hill',
    neighborhoods: ['Forest Hill North', 'Forest Hill South', 'Upper Village'],
    housing: 'Forest Hill is one of Toronto\'s most affluent neighbourhoods, with large Georgian and Tudor-style homes from the 1920s-50s, many featuring professional-grade kitchen renovations.',
    fact: 'Forest Hill homes frequently have dual-fuel ranges (gas cooktop with electric oven), requiring both a gas line and a 240V outlet — our technicians verify both connections during every Forest Hill service call.',
    area: 'midtown Toronto'
  },
  'humber-valley': {
    name: 'Humber Valley',
    neighborhoods: ['Humber Valley Village', 'Baby Point', 'Old Mill'],
    housing: 'Humber Valley is a secluded residential enclave along the Humber River with large 1920s-50s homes, many featuring butler\'s pantries and secondary prep kitchens with their own appliance sets.',
    fact: 'Humber Valley\'s proximity to the Humber River means homes in the lowest elevations experience occasional flood-related appliance damage — we assess water damage to motors, wiring, and insulation before recommending repair vs. replacement.',
    area: 'west Toronto'
  },
  'islington-village': {
    name: 'Islington Village',
    neighborhoods: ['Islington Village', 'Islington-City Centre West', 'Markland Wood'],
    housing: 'Islington Village retains a small-town feel with 1940s-60s homes along its main strip, surrounded by 1970s-80s suburban development and newer infill townhouses.',
    fact: 'Islington Village\'s older homes frequently have basement laundry setups with floor drains that have dried out or become blocked, causing washing machine overflow to back up rather than drain away properly.',
    area: 'Etobicoke'
  },
  'lawrence-park': {
    name: 'Lawrence Park',
    neighborhoods: ['Lawrence Park North', 'Lawrence Park South', 'Bedford Park'],
    housing: 'Lawrence Park is one of Toronto\'s most established wealthy enclaves, with Arts and Crafts-era homes from the 1910s-40s on large, treed lots with detached garages.',
    fact: 'Lawrence Park homeowners tend to invest in high-end appliance suites from brands like Wolf, Sub-Zero, and Gaggenau — these manufacturer-certified repairs require specific diagnostic software and training credentials.',
    area: 'north-central Toronto'
  },
  'leaside': {
    name: 'Leaside',
    neighborhoods: ['Leaside Proper', 'Thorncliffe Park', 'Flemingdon Park'],
    housing: 'Leaside was developed in the 1930s-50s with uniform brick homes on grid streets, creating a remarkably consistent housing stock with predictable appliance configurations.',
    fact: 'Leaside\'s post-WWII homes were built to a remarkably consistent plan, meaning the kitchen layout, electrical capacity, and plumbing runs are nearly identical from house to house — this predictability speeds up every service call.',
    area: 'east Toronto'
  },
  'leslieville': {
    name: 'Leslieville',
    neighborhoods: ['Leslieville', 'Upper Beaches', 'Carlaw-Dundas'],
    housing: 'Leslieville features narrow Victorian and Edwardian row houses along Queen Street East, many converted from worker cottages into renovated family homes with updated but compact kitchens.',
    fact: 'Leslieville\'s Victorian row houses typically have rear kitchen additions built over different decades, resulting in uneven floors and non-plumb walls that require extra shimming and leveling during appliance installation.',
    area: 'east Toronto'
  },
  'liberty-village': {
    name: 'Liberty Village',
    neighborhoods: ['Liberty Village', 'East Liberty', 'King-Dufferin'],
    housing: 'Liberty Village is a dense condo neighbourhood converted from former industrial land, featuring compact studio and one-bedroom units with space-saving appliance configurations.',
    fact: 'Liberty Village condos typically use ventless condensation dryers and 24-inch compact dishwashers — these European-style units require different parts inventory and diagnostic approaches than standard North American models.',
    area: 'downtown west Toronto'
  },
  'midtown': {
    name: 'Midtown',
    neighborhoods: ['Yonge-Eglinton', 'Mount Pleasant', 'Chaplin Estates'],
    housing: 'Midtown is Toronto\'s densifying core between Bloor and Eglinton, mixing 1920s-50s detached homes with a growing skyline of residential towers along Yonge Street.',
    fact: 'Midtown\'s rapid condo densification has strained local water pressure during peak hours, which can affect filling times for dishwashers and washing machines in upper-floor units.',
    area: 'central Toronto'
  },
  'rosedale': {
    name: 'Rosedale',
    neighborhoods: ['North Rosedale', 'South Rosedale', 'Craigleigh Gardens'],
    housing: 'Rosedale is Toronto\'s most prestigious residential neighbourhood, with large Edwardian and Georgian-revival homes from 1890-1930 set on ravine lots with mature tree canopy.',
    fact: 'Rosedale\'s heritage-designated homes often cannot have exterior modifications, meaning range hoods must vent through interior ductwork rather than through the wall — requiring longer, more complex venting installations.',
    area: 'central Toronto'
  },
  'parkdale': {
    name: 'Parkdale',
    neighborhoods: ['South Parkdale', 'North Parkdale', 'Roncesvalles-Parkdale'],
    housing: 'Parkdale features grand Victorian homes now divided into apartments, alongside postwar apartment towers and a growing number of renovated single-family conversions.',
    fact: 'Parkdale\'s converted Victorian homes often have one gas meter feeding multiple kitchen appliances across split units — our technicians verify gas pressure and BTU capacity before connecting any new gas appliance.',
    area: 'west Toronto'
  },
  'the-beaches': {
    name: 'The Beaches',
    neighborhoods: ['Kew Beach', 'Balmy Beach', 'Upper Beaches'],
    housing: 'The Beaches is a lakefront neighbourhood of early-1900s homes, many with original wood-frame construction, compact kitchens, and seasonal cottages converted to year-round residences.',
    fact: 'The Beaches\' lakefront location creates higher salt and moisture exposure that corrodes outdoor condenser units, dryer exhaust caps, and range hood vents faster than homes a few blocks inland.',
    area: 'east Toronto'
  },
  'the-annex': {
    name: 'The Annex',
    neighborhoods: ['The Annex', 'Seaton Village', 'Koreatown'],
    housing: 'The Annex is a dense residential neighbourhood of 1890s-1920s brick Victorian and Edwardian homes, many divided into multi-unit rentals with shared or aging mechanical systems.',
    fact: 'The Annex\'s multi-unit Victorian conversions often have shared gas and water lines, meaning appliance installation in one unit can affect water pressure and gas supply in adjacent units — our technicians test system-wide before and after.',
    area: 'central Toronto'
  },
  'yorkville': {
    name: 'Yorkville',
    neighborhoods: ['Yorkville', 'Hazelton Lanes', 'Cumberland-Bellair'],
    housing: 'Yorkville is Toronto\'s luxury retail and residential district, featuring premium boutique condominiums with concierge service and custom-finished kitchens.',
    fact: 'Yorkville\'s boutique condos frequently have custom Italian kitchens with integrated appliance panels — even a simple dishwasher swap requires matching the existing cabinetry finish and panel hardware.',
    area: 'downtown Toronto'
  },
  'greektown': {
    name: 'Greektown',
    neighborhoods: ['Greektown on the Danforth', 'Chester Village', 'Playter Estates'],
    housing: 'Greektown features early-1900s semi-detached homes above the commercial Danforth strip, with many homeowners maintaining dual kitchens — a main floor kitchen and a basement cooking area.',
    fact: 'Greektown homeowners often maintain a secondary basement kitchen for canning, preserving, and large-batch cooking, meaning service calls here frequently involve two complete sets of appliances in one home.',
    area: 'east Toronto'
  },
  'chinatown': {
    name: 'Chinatown',
    neighborhoods: ['Chinatown West', 'Kensington Market', 'Dundas-Spadina'],
    housing: 'Chinatown consists of century-old row houses and low-rise apartments above street-level commercial spaces, with compact kitchens adapted for high-BTU wok cooking.',
    fact: 'Chinatown kitchens often use high-BTU gas burners and commercial-style range hoods that require larger gas line capacity and stronger exhaust ventilation than residential standards assume.',
    area: 'downtown Toronto'
  },
  'riverdale': {
    name: 'Riverdale',
    neighborhoods: ['Riverdale South', 'Riverdale North', 'Broadview-Danforth'],
    housing: 'Riverdale features Victorian semi-detached homes overlooking the Don Valley, many lovingly restored with modern kitchens while retaining original architectural details.',
    fact: 'Riverdale\'s heritage homes near the Don Valley experience seasonal foundation movement from freeze-thaw cycles, which can shift appliance leveling and break rigid plumbing connections.',
    area: 'east Toronto'
  },
  'bloor-west-village': {
    name: 'Bloor West Village',
    neighborhoods: ['Bloor West Village', 'Swansea', 'High Park North'],
    housing: 'Bloor West Village is a family-oriented neighbourhood with brick 1920s-50s homes, tree-lined streets, and kitchens that have typically been updated at least once in the past three decades.',
    fact: 'Bloor West Village\'s proximity to High Park means homes on the south side frequently have older clay sewer connections that can affect dishwasher and washing machine drainage performance.',
    area: 'west Toronto'
  },
  'high-park': {
    name: 'High Park',
    neighborhoods: ['High Park', 'Swansea', 'Bloor-Keele'],
    housing: 'High Park neighbours its namesake green space with a mix of 1910s-40s detached homes, semi-detached pairs, and pre-war low-rise apartments along Bloor Street.',
    fact: 'High Park area homes near the ravine system experience higher humidity levels that can cause condenser coils to develop mold and mildew buildup more quickly than in drier neighbourhoods.',
    area: 'west Toronto'
  },
  'little-italy': {
    name: 'Little Italy',
    neighborhoods: ['Little Italy', 'Palmerston', 'College-Crawford'],
    housing: 'Little Italy features narrow semi-detached homes from the 1890s-1920s along College Street, many with basement kitchens and compact main-floor cooking areas.',
    fact: 'Little Italy\'s heritage homes were built with minimal insulation between units, meaning dishwasher and washing machine vibration can transmit through shared walls — proper leveling and anti-vibration pads are essential here.',
    area: 'central-west Toronto'
  },
  'the-junction': {
    name: 'The Junction',
    neighborhoods: ['The Junction', 'Junction Triangle', 'Baby Point'],
    housing: 'The Junction is a rapidly gentrifying neighbourhood with 1890s-1920s worker cottages and detached homes, many undergoing full gut renovations with modern appliance packages.',
    fact: 'The Junction was historically a "dry" area (alcohol prohibition until 1998), and many homes retain original narrow lot configurations with side entrances that complicate large appliance delivery.',
    area: 'west Toronto'
  },
  'weston': {
    name: 'Weston',
    neighborhoods: ['Weston Village', 'Mount Dennis', 'Humber Summit'],
    housing: 'Weston features a mix of postwar bungalows, 1960s-70s apartment buildings, and newer infill developments, with ongoing revitalization around the new UP Express station.',
    fact: 'Weston\'s older apartment buildings often have centralized laundry rooms with commercial-grade washers, and individual units may lack proper hookups for in-suite washer-dryer installation.',
    area: 'northwest Toronto'
  },
  'eglinton': {
    name: 'Eglinton',
    neighborhoods: ['Yonge-Eglinton', 'Eglinton West', 'Avenue-Eglinton'],
    housing: 'The Eglinton corridor features a mix of mature semi-detached homes on side streets and a rapidly growing number of new condominiums along the Eglinton Crosstown LRT route.',
    fact: 'The Eglinton Crosstown construction has disrupted water main connections in several stretches, causing temporary pressure fluctuations that can trip washing machine and dishwasher water-level sensors.',
    area: 'midtown Toronto'
  },
  'downtown': {
    name: 'Downtown Toronto',
    neighborhoods: ['CityPlace', 'St. Lawrence Market', 'Entertainment District'],
    housing: 'Downtown Toronto is dominated by glass condo towers built between 2005 and 2020, with compact units that use space-efficient appliance packages including 24-inch dishwashers and ventless dryers.',
    fact: 'Downtown Toronto\'s condo buildings often require freight elevator booking 24-48 hours in advance for appliance delivery, and many buildings restrict service access to specific weekday windows.',
    area: 'downtown Toronto'
  },
  'scarborough-village': {
    name: 'Scarborough Village',
    neighborhoods: ['Scarborough Village', 'Cliffcrest', 'Midland-St. Clair'],
    housing: 'Scarborough Village is one of Scarborough\'s older communities with 1950s-60s bungalows and side-splits near the Bluffs, many with original basements converted to secondary suites.',
    fact: 'Scarborough Village\'s postwar bungalows were built with 60-amp electrical services that may not support modern kitchen circuits — our technicians verify panel capacity before installing high-draw appliances like induction ranges.',
    area: 'south Scarborough'
  },
  'etobicoke-village': {
    name: 'Etobicoke Village',
    neighborhoods: ['Long Branch', 'New Toronto', 'Mimico South'],
    housing: 'Etobicoke\'s lakeshore villages — Long Branch, New Toronto, and Mimico — feature a mix of 1920s-50s cottages and workers\' homes alongside new waterfront condo developments.',
    fact: 'Etobicoke\'s lakeshore communities experience salt-laden winds off Lake Ontario that corrode exterior dryer vents and range exhaust caps faster than inland areas, requiring stainless steel fittings instead of galvanized.',
    area: 'south Etobicoke'
  },
  'king-west': {
    name: 'King West',
    neighborhoods: ['King-Spadina', 'Niagara', 'Garrison Common'],
    housing: 'King West transformed from an industrial district to a dense condo neighbourhood, with converted loft buildings and modern glass towers featuring open-concept layouts.',
    fact: 'King West\'s converted loft-style condos often have exposed ductwork and concrete ceilings that create acoustic challenges — dishwashers and washing machines need vibration dampening to prevent noise amplification.',
    area: 'downtown west Toronto'
  },
  'corso-italia': {
    name: 'Corso Italia',
    neighborhoods: ['Corso Italia', 'Davenport Village', 'Earlscourt'],
    housing: 'Corso Italia features 1920s-50s semi-detached homes with characteristically deep lots and rear garages, many with separate basement apartments and dual kitchen setups.',
    fact: 'Corso Italia\'s Italian-Canadian homeowners frequently have outdoor summer kitchens with dedicated gas lines, range hoods, and sometimes refrigerators that need winterization and seasonal startup service.',
    area: 'west-central Toronto'
  },
  'dufferin-grove': {
    name: 'Dufferin Grove',
    neighborhoods: ['Dufferin Grove', 'Brockton Village', 'Dovercourt Park'],
    housing: 'Dufferin Grove features early-1900s detached and semi-detached homes on tree-lined streets, with kitchens that span every renovation decade from the 1950s to the 2020s.',
    fact: 'Dufferin Grove\'s older homes frequently have kitchens renovated around existing plumbing rather than re-plumbed from scratch, creating unusual water line routing that complicates dishwasher and ice maker connections.',
    area: 'west-central Toronto'
  },
  'little-portugal': {
    name: 'Little Portugal',
    neighborhoods: ['Little Portugal', 'Beaconsfield Village', 'Trinity-Bellwoods South'],
    housing: 'Little Portugal consists of narrow semi-detached Victorian homes on tight lots, many with rear additions that extend the kitchen into what was originally a back porch.',
    fact: 'Little Portugal\'s Victorian-era homes have narrow side passages (often under 3 feet wide) that make it impossible to bring full-size refrigerators through the back — front-door delivery with door removal is standard here.',
    area: 'west-central Toronto'
  },
  'swansea': {
    name: 'Swansea',
    neighborhoods: ['Swansea', 'Windermere', 'High Park South'],
    housing: 'Swansea is a quiet lakeside neighbourhood with 1920s-50s Tudor-style homes, many on generous lots with detached garages and mature gardens.',
    fact: 'Swansea\'s lakeside positioning creates slightly cooler and more humid conditions than inland Toronto, which can cause refrigerator condenser coils to work harder and ice makers to produce at reduced capacity.',
    area: 'west Toronto'
  },
  'woodbridge': {
    name: 'Woodbridge',
    neighborhoods: ['Woodbridge Core', 'Vellore Village', 'Market Lane'],
    housing: 'Woodbridge is the heart of Vaughan\'s Italian-Canadian community, featuring custom-built homes with large, elaborate kitchens that often include imported European appliances.',
    fact: 'Woodbridge homeowners frequently install Bertazzoni, Ilve, or Smeg ranges imported from Italy — these European appliances use different gas connector standards and electrical specifications than North American models.',
    area: 'Vaughan'
  },
  'bradford': {
    name: 'Bradford',
    neighborhoods: ['Bradford Downtown', 'Bond Head', 'Holland Marsh area'],
    housing: 'Bradford is a growing South Simcoe town with a small-town core of older homes and expanding suburban developments along the Holland Marsh corridor.',
    fact: 'Bradford\'s proximity to the Holland Marsh means some homes on the town\'s periphery use well water with higher sediment content that can clog washing machine filters and dishwasher spray arms.',
    area: 'South Simcoe'
  },
  'concord': {
    name: 'Concord',
    neighborhoods: ['Concord West', 'Carrville', 'Patterson'],
    housing: 'Concord is a Vaughan community with a mix of 1970s-90s family homes and newer developments around Highway 7 and Keele, transitioning from rural to suburban character.',
    fact: 'Concord\'s older homes along Dufferin Street and Keele frequently have basements with low ceiling clearance that complicates washer-dryer stacking and furnace-adjacent dryer venting.',
    area: 'Vaughan'
  },
  'maple': {
    name: 'Maple',
    neighborhoods: ['Maple Core', 'Uplands', 'Mackenzie Glen'],
    housing: 'Maple has grown from a small Vaughan village into a suburban centre with new developments in Mackenzie Glen and established family homes near Major Mackenzie Drive.',
    fact: 'Maple\'s rapid expansion means many homes are reaching the 15-20 year mark simultaneously, creating a wave of builder-grade appliance failures — particularly water heaters, dishwashers, and first-generation stainless steel refrigerators.',
    area: 'Vaughan'
  },
  'beaumont': {
    name: 'Beaumont',
    neighborhoods: ['Beaumont Central', 'Coloniale Estates', 'Ruisseau Blanc'],
    housing: 'Beaumont is a small city south of Edmonton with a mix of newer suburban developments and established acreage properties, most built between 1990 and 2015.',
    fact: 'Beaumont\'s Alberta climate with extreme winter cold (-30°C or lower) means appliances in unheated garages and exterior walls experience thermal stress that shortens compressor and motor lifespan.',
    area: 'Edmonton Metro'
  },
  'airdrie': {
    name: 'Airdrie',
    neighborhoods: ['Bayside', 'Reunion', 'Coopers Crossing'],
    housing: 'Airdrie is a fast-growing city north of Calgary with primarily new-build suburban homes from 2005-2020, featuring standardized builder-grade appliance packages.',
    fact: 'Airdrie\'s Alberta hard water (200+ mg/L calcium carbonate) is among the hardest in Western Canada, causing mineral buildup in washing machine drums, dishwasher heating elements, and water heater connections.',
    area: 'Calgary Metro'
  },
  'calgary': {
    name: 'Calgary',
    neighborhoods: ['Kensington', 'Bridgeland', 'Beltline'],
    housing: 'Calgary ranges from heritage bungalows in the inner-city communities to large estate homes in the southwest and new suburban developments in the far north and south.',
    fact: 'Calgary\'s dry climate and chinook wind patterns create extreme static electricity in winter that can damage sensitive appliance control boards — anti-static precautions are standard on every Calgary service call.',
    area: 'southern Alberta'
  },
  'edmonton': {
    name: 'Edmonton',
    neighborhoods: ['Old Strathcona', 'Windermere', 'The Grange'],
    housing: 'Edmonton features a wide range from character homes in Glenora and Garneau to acreage properties on the city\'s edges and new suburban communities in the south and west.',
    fact: 'Edmonton\'s extreme winter temperatures (-40°C wind chill) mean appliances located near exterior walls or in poorly insulated garages can experience frozen water lines and component failures from thermal cycling.',
    area: 'northern Alberta'
  },
  'ossington': {
    name: 'Ossington',
    neighborhoods: ['Ossington Strip', 'Dovercourt Village', 'Bellwoods-Ossington'],
    housing: 'Ossington is a trendy neighbourhood of Victorian semi-detached homes and newer boutique condos, with gentrified kitchens featuring modern European-style appliance suites.',
    fact: 'Ossington\'s renovated Victorian homes frequently have kitchens in rear extensions with dropped foundations, creating uneven floors that require careful leveling during dishwasher and freestanding range installation.',
    area: 'west-central Toronto'
  },
  'roncesvalles': {
    name: 'Roncesvalles',
    neighborhoods: ['Roncesvalles Village', 'Sunnyside', 'Parkdale North'],
    housing: 'Roncesvalles is a family-friendly neighbourhood of semi-detached Edwardian homes from 1900-1920, many with updated kitchens that retained original narrow-lot proportions.',
    fact: 'Roncesvalles homes characteristically have main-floor kitchens at the rear of the house with 1-2 steps down, creating drainage challenges for dishwashers that must pump wastewater slightly uphill to the drain connection.',
    area: 'west Toronto'
  },
  'st-lawrence': {
    name: 'St. Lawrence',
    neighborhoods: ['St. Lawrence Market', 'Distillery District', 'Corktown'],
    housing: 'St. Lawrence combines heritage mixed-use buildings near the market with purpose-built co-op housing from the 1970s-80s and newer condo towers near the Distillery.',
    fact: 'St. Lawrence\'s older co-op buildings have centralized mechanical systems where individual unit plumbing modifications require building management approval before any appliance installation can proceed.',
    area: 'downtown east Toronto'
  },
  'thorncliffe-park': {
    name: 'Thorncliffe Park',
    neighborhoods: ['Thorncliffe Park', 'Flemingdon Park', 'Don Valley Village'],
    housing: 'Thorncliffe Park is a high-density residential community of 1960s-70s apartment towers with standardized unit layouts and shared building mechanical systems.',
    fact: 'Thorncliffe Park\'s apartment towers have building-wide water shutoff requirements for plumbing work, meaning dishwasher and washing machine installations must be coordinated with the property management schedule.',
    area: 'east Toronto'
  },
  'trinity-bellwoods': {
    name: 'Trinity Bellwoods',
    neighborhoods: ['Trinity-Bellwoods', 'Gore-Vale', 'Dundas West'],
    housing: 'Trinity Bellwoods features Victorian row houses and semi-detached homes from the 1880s-1900s, many renovated into open-concept living spaces while preserving original facades.',
    fact: 'Trinity Bellwoods\' Victorian homes have narrow, steep basement staircases that make it nearly impossible to move full-size appliances to basement laundry areas — stackable or compact units are often the only option.',
    area: 'west-central Toronto'
  },
  'wychwood': {
    name: 'Wychwood',
    neighborhoods: ['Wychwood Park', 'Hillcrest Village', 'Benson-Wychwood'],
    housing: 'Wychwood is a hidden residential gem with 1910s-30s homes clustered around the historical Wychwood Park private community, featuring mature trees and unique architectural styles.',
    fact: 'Wychwood Park is a private, gated community where service vehicle access requires advance coordination with the residents\' association — our technicians schedule arrival windows accordingly.',
    area: 'west-central Toronto'
  },
  'willowdale': {
    name: 'Willowdale',
    neighborhoods: ['Willowdale West', 'Willowdale East', 'Newtonbrook'],
    housing: 'Willowdale is rapidly transforming from a neighbourhood of 1950s bungalows into a condo-dense corridor along Yonge Street, with active demolition-rebuild activity on residential lots.',
    fact: 'Willowdale\'s teardown-rebuild boom means many homes have brand-new kitchens with integrated appliance packages where a single failed component can affect the entire countertop and cabinetry layout.',
    area: 'North York'
  }
};

// ═══════════════════════════════════════════════════════════════════
// SERVICE CONTEXT — unique phrasing per service type
// ═══════════════════════════════════════════════════════════════════
function getServiceContext(service, city) {
  const c = cityData[city];
  if (!c) return null;
  const n = c.neighborhoods;
  const nList = n.length >= 3 ? `${n[0]}, ${n[1]}, and ${n[2]}` : n.join(' and ');

  const templates = {
    'dishwasher-repair': () =>
      `Our local technicians serving ${c.name} know the ${nList} neighbourhoods and the specific dishwasher problems that ${c.area} homes experience. ${c.fact} Our nearby repair team responds faster than any out-of-town service — usually arriving the same day you call. ${c.housing}`,

    'dishwasher-installation': () =>
      `When you need a dishwasher installed in ${c.name}, our ${c.area}-based team arrives with the right fittings for ${c.name}'s specific housing stock. ${c.housing} ${c.fact} From ${nList}, we cover every corner of ${c.name} with same-day installation availability.`,

    'fridge-repair': () =>
      `Refrigerator breakdowns in ${c.name} demand fast response — food spoilage starts within hours. Our technicians based in ${c.area} cover ${nList} and arrive with Samsung, LG, and Whirlpool parts stocked in the van. ${c.fact} ${c.housing}`,

    'washer-repair': () =>
      `Washing machine failures in ${c.name} households mean laundry piles up fast, especially in the larger families common across ${c.area}. Our local technicians serving ${nList} carry motor assemblies, drain pumps, and control boards for every major brand. ${c.fact} ${c.housing}`,

    'dryer-repair': () =>
      `A broken dryer in ${c.name} during Ontario's cold months means wet laundry with nowhere to go. Our ${c.area} technicians serving ${nList} diagnose heating element, drum roller, and belt issues on the first visit. ${c.fact} ${c.housing}`,

    'oven-repair': () =>
      `Oven problems in ${c.name} kitchens range from uneven heating to complete igniter failure. Our local team covers ${nList} and carries igniters, thermostats, and control boards for gas and electric models. ${c.fact} ${c.housing}`,

    'stove-repair': () =>
      `A malfunctioning stove disrupts meal preparation for every ${c.name} household that relies on home cooking. Our ${c.area} technicians serving ${nList} repair burner assemblies, surface elements, and control switches same-day. ${c.fact} ${c.housing}`,

    'gas-stove-repair': () =>
      `Gas stove repair in ${c.name} requires licensed technicians who understand gas safety codes specific to Ontario residential properties. Our team covers ${nList} and tests every gas connection with electronic leak detection before completing the job. ${c.fact} ${c.housing}`,

    'gas-oven-repair': () =>
      `Gas oven issues in ${c.name} — whether a failing igniter, thermostat drift, or gas smell — require immediate professional attention. Our licensed gas technicians serving ${nList} arrive with the diagnostic tools and safety equipment to handle any gas oven repair. ${c.fact} ${c.housing}`,

    'gas-dryer-repair': () =>
      `Gas dryer repair in ${c.name} combines the complexity of gas line safety with standard mechanical diagnosis. Our ${c.area}-based technicians cover ${nList} and carry gas valves, igniters, and thermal fuses for same-day repair. ${c.fact} ${c.housing}`,

    'gas-appliance-repair': () =>
      `Gas appliance repair in ${c.name} demands licensed technicians who are certified for residential gas work in Ontario. Our team serving ${nList} handles gas ranges, dryers, water heaters, and furnaces with full safety testing on every call. ${c.fact} ${c.housing}`,

    'bosch-repair': () =>
      `Bosch appliances in ${c.name} homes require technicians familiar with German engineering standards and diagnostic protocols. Our team serving ${nList} carries Bosch-specific parts and tools for dishwashers, washers, dryers, and refrigerators. ${c.fact} ${c.housing}`,

    'samsung-repair': () =>
      `Samsung is one of the most popular appliance brands in ${c.name}, found in builder-grade packages across ${nList} and surrounding communities. Our technicians carry Samsung OEM parts for French-door fridges, front-load washers, and dishwashers. ${c.fact} ${c.housing}`,

    'lg-repair': () =>
      `LG appliances are common across ${c.name}, particularly the linear compressor refrigerators and ThinQ-enabled washers popular in ${nList}. Our technicians check warranty status on every LG call — the manufacturer offers extended coverage on known defects. ${c.fact} ${c.housing}`,

    'whirlpool-repair': () =>
      `Whirlpool remains one of the most reliable appliance brands in ${c.name}, but age and hard water take their toll. Our technicians serving ${nList} carry Whirlpool control boards, pumps, and door latches for same-day repair across the full lineup. ${c.fact} ${c.housing}`,

    'frigidaire-repair': () =>
      `Frigidaire appliances are a staple in ${c.name} homes, especially in established neighbourhoods across ${nList}. Our technicians carry Frigidaire defrost heaters, compressor start relays, and door gaskets for refrigerators, ranges, and dishwashers. ${c.fact} ${c.housing}`,

    'ge-repair': () =>
      `GE appliances have been installed in ${c.name} homes for decades, with particular concentration in ${nList} and surrounding established communities. Our technicians carry GE-specific motherboards, water inlet valves, and heating elements for same-day repair. ${c.fact} ${c.housing}`,

    'kitchenaid-repair': () =>
      `KitchenAid appliances in ${c.name} represent the premium tier of Whirlpool\'s lineup, found in upgraded kitchens across ${nList}. Our technicians are experienced with KitchenAid\'s stainless interior dishwashers, dual-fuel ranges, and built-in refrigerators. ${c.fact} ${c.housing}`,

    'maytag-repair': () =>
      `Maytag\'s reputation for durability has earned it a loyal following in ${c.name}, particularly among homeowners in ${nList} who value long-lasting appliances. Our technicians carry Maytag-specific actuators, agitators, and control boards for washers, dryers, and dishwashers. ${c.fact} ${c.housing}`,

    'miele-repair': () =>
      `Miele appliances in ${c.name} represent a significant investment in German engineering and quality. Our technicians serving ${nList} are trained on Miele\'s proprietary diagnostic systems for dishwashers, washing machines, and vacuum units. ${c.fact} ${c.housing}`,

    'kenmore-repair': () =>
      `Kenmore appliances in ${c.name} homes span multiple decades of manufacturing partnerships, meaning parts sourcing varies depending on which OEM built your specific model. Our technicians serving ${nList} identify the underlying manufacturer first to source the correct replacement parts. ${c.fact} ${c.housing}`,

    'electrolux-repair': () =>
      `Electrolux appliances in ${c.name} include both the Electrolux and Frigidaire Professional lines, each with different part numbers and diagnostic approaches. Our team covering ${nList} carries parts for both brands and knows the overlap. ${c.fact} ${c.housing}`,

    'freezer-repair': () =>
      `Freezer breakdowns in ${c.name} can cost hundreds in spoiled food within 24 hours. Our ${c.area} technicians respond to ${nList} and surrounding areas with compressor start kits, defrost timers, and thermostat assemblies for chest and upright freezers. ${c.fact} ${c.housing}`,

    'microwave-repair': () =>
      `Microwave repair in ${c.name} covers both countertop and over-the-range models across ${nList}. Our technicians carry magnetrons, diodes, door switches, and control panels for all major brands. ${c.fact} ${c.housing}`,

    'range-repair': () =>
      `Range repair in ${c.name} covers gas, electric, and dual-fuel models found in kitchens across ${nList}. Our technicians diagnose burner, oven, and control issues on the first visit with parts in the van. ${c.fact} ${c.housing}`
  };

  // Try exact match first
  if (templates[service]) return templates[service]();

  // Try partial match (e.g., "frigidaire-dishwasher-repair" → "frigidaire-repair")
  for (const key of Object.keys(templates)) {
    if (service.includes(key)) return templates[key]();
  }

  // Generic fallback for any service type
  const serviceName = service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `Our local ${c.area} technicians bring ${serviceName.toLowerCase()} expertise directly to ${c.name} homes in ${nList}. ${c.fact} ${c.housing}`;
}

// ═══════════════════════════════════════════════════════════════════
// CITY SLUG EXTRACTION — detect city from filename
// ═══════════════════════════════════════════════════════════════════
function extractCityAndService(filename) {
  const base = filename.replace('.html', '');

  // Non-city pages to skip
  const skipPages = [
    '404', 'about', 'areas', 'book', 'brands', 'contact', 'index',
    'pricing', 'services', 'privacy', 'terms', 'sitemap', 'service-template',
    'for-businesses'
  ];
  if (skipPages.includes(base)) return null;

  // "near-me" pages — skip
  if (base.endsWith('-near-me')) return null;

  // Brand-specific pages without city (e.g., "samsung-repair.html", "lg-dishwasher-repair.html")
  // These are service hub pages, not city pages
  const cityKeys = Object.keys(cityData);

  // City hub pages (e.g., "toronto.html", "brampton.html")
  if (cityKeys.includes(base)) {
    return { city: base, service: 'general' };
  }

  // Try to find the city slug at the end
  // Sort by length descending to match longer slugs first (e.g., "scarborough-village" before "scarborough")
  const sortedCities = cityKeys.sort((a, b) => b.length - a.length);

  for (const citySlug of sortedCities) {
    if (base.endsWith('-' + citySlug)) {
      const service = base.slice(0, base.length - citySlug.length - 1);
      if (service.length > 0) {
        return { city: citySlug, service };
      }
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// INJECTION — find insertion point and inject paragraph
// ═══════════════════════════════════════════════════════════════════
function injectContent(html, city, service) {
  // Skip if already has marker
  if (html.includes(MARKER_START)) return null;

  const content = getServiceContext(service, city);
  if (!content) return null;

  const paragraph = `<p class="city-context">${MARKER_START}${content}${MARKER_END}</p>`;

  // Strategy 1: Insert after first <p> in content-intro (dishwasher-installation pages)
  const introMatch = html.match(/(<div class="content-intro[^"]*">\s*<h2>[^<]*<\/h2>\s*<p>[\s\S]*?<\/p>)/);
  if (introMatch) {
    return html.replace(introMatch[0], introMatch[0] + '\n    ' + paragraph);
  }

  // Strategy 2: Insert after first <p> in content-body (most service pages)
  const bodyMatch = html.match(/(<div class="content-body[^"]*">\s*<h2>[^<]*<\/h2>\s*<p>[\s\S]*?<\/p>)/);
  if (bodyMatch) {
    return html.replace(bodyMatch[0], bodyMatch[0] + '\n        ' + paragraph);
  }

  // Strategy 3: Insert after the first <p> inside <main>
  const mainMatch = html.match(/(<main[^>]*>[\s\S]*?<h2>[^<]*<\/h2>\s*<p>[\s\S]*?<\/p>)/);
  if (mainMatch) {
    return html.replace(mainMatch[0], mainMatch[0] + '\n    ' + paragraph);
  }

  // Strategy 4: "About CityName" section — <section><div class="container"><h2>About ...</h2><p>...</p>
  const aboutMatch = html.match(/(<h2>About [^<]*<\/h2>\s*<p>[\s\S]*?<\/p>)/);
  if (aboutMatch) {
    return html.replace(aboutMatch[0], aboutMatch[0] + '\n      ' + paragraph);
  }

  // Strategy 5: First <section> with <h2> and <p> — brand+city pages
  const sectionMatch = html.match(/(<section[^>]*>\s*<div class="container">\s*<h2>[^<]*<\/h2>\s*<p>[\s\S]*?<\/p>)/);
  if (sectionMatch) {
    return html.replace(sectionMatch[0], sectionMatch[0] + '\n    ' + paragraph);
  }

  // Strategy 6: Any <h2> followed by <p> after </head>
  const bodyStart = html.indexOf('</head>');
  if (bodyStart > -1) {
    const bodyHtml = html.substring(bodyStart);
    const h2pMatch = bodyHtml.match(/(<h2>[^<]*<\/h2>\s*<p>[\s\S]*?<\/p>)/);
    if (h2pMatch) {
      const insertPos = bodyStart + bodyHtml.indexOf(h2pMatch[0]) + h2pMatch[0].length;
      return html.substring(0, insertPos) + '\n    ' + paragraph + html.substring(insertPos);
    }
  }

  // Strategy 7: Insert after <div class="answer-box"> (some pages have this structure)
  const answerMatch = html.match(/(<div class="answer-box">[\s\S]*?<\/div>)/);
  if (answerMatch) {
    const afterAnswer = html.indexOf(answerMatch[0]) + answerMatch[0].length;
    const restOfHtml = html.substring(afterAnswer);
    const firstPMatch = restOfHtml.match(/(<p>[\s\S]*?<\/p>)/);
    if (firstPMatch) {
      const insertPos = afterAnswer + restOfHtml.indexOf(firstPMatch[0]) + firstPMatch[0].length;
      return html.substring(0, insertPos) + '\n    ' + paragraph + html.substring(insertPos);
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// CITY HUB PAGE INJECTION — for pages like toronto.html, brampton.html
// ═══════════════════════════════════════════════════════════════════
function injectCityHub(html, city) {
  if (html.includes(MARKER_START)) return null;

  const c = cityData[city];
  if (!c) return null;
  const nList = c.neighborhoods.join(', ');

  const content = `Appliance Repair Near Me provides same-day appliance service across ${c.name}, covering ${nList} and all surrounding communities in ${c.area}. ${c.housing} ${c.fact} Whether you need a fridge, washer, dryer, dishwasher, oven, or stove repaired, our local technicians arrive with parts in the van and complete most repairs on the first visit.`;

  const paragraph = `<p class="city-context">${MARKER_START}${content}${MARKER_END}</p>`;

  // Try to inject after first <p> after an <h1> or <h2>
  const headingP = html.match(/(<h[12][^>]*>[^<]*<\/h[12]>\s*<p>[\s\S]*?<\/p>)/);
  if (headingP) {
    return html.replace(headingP[0], headingP[0] + '\n    ' + paragraph);
  }

  // Fallback: after first <p> in main content
  const mainP = html.match(/(<main[^>]*>[\s\S]*?<p>[\s\S]*?<\/p>)/);
  if (mainP) {
    return html.replace(mainP[0], mainP[0] + '\n    ' + paragraph);
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let updated = 0;
  let skipped = 0;
  let noCity = 0;
  let noMatch = 0;
  let alreadyMarked = 0;

  for (const file of files) {
    const parsed = extractCityAndService(file);
    if (!parsed) {
      noCity++;
      continue;
    }

    const filePath = path.join(ROOT, file);
    const html = fs.readFileSync(filePath, 'utf-8');

    if (html.includes(MARKER_START)) {
      alreadyMarked++;
      continue;
    }

    let result;
    if (parsed.service === 'general') {
      result = injectCityHub(html, parsed.city);
    } else {
      result = injectContent(html, parsed.city, parsed.service);
    }

    if (result) {
      fs.writeFileSync(filePath, result, 'utf-8');
      updated++;
      console.log(`  + ${file} (${parsed.service} / ${parsed.city})`);
    } else {
      if (!cityData[parsed.city]) {
        skipped++;
        console.log(`  ? ${file} — no city data for "${parsed.city}"`);
      } else {
        noMatch++;
        console.log(`  - ${file} — could not find insertion point`);
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`NEARY Unique Content Injection Complete`);
  console.log(`========================================`);
  console.log(`Updated:        ${updated} pages`);
  console.log(`Already marked: ${alreadyMarked} pages`);
  console.log(`No city data:   ${skipped} pages`);
  console.log(`No insert point:${noMatch} pages`);
  console.log(`Non-city pages: ${noCity} pages`);
  console.log(`Total files:    ${files.length}`);
}

main();
