export interface CountryMetadata {
  source: string;
  confidence: number; // 0.0 - 1.0
  lastUpdated: string;
  entityStatus: "UN Member State" | "UN Observer State" | "De Facto Sovereign" | "Dependency" | "Unrecognized";
}

export interface CountryPreview {
  name: string;
  system: string; // e.g. Presidential Republic, Constitutional Monarchy
  gdp: string; // e.g. "$3.1 Trillion"
  population: string; // e.g. "67 Million"
  military: string; // e.g. "High", "Medium", "Global Superpower"
  desc: string;
  metadata: CountryMetadata;
}

const DEFAULT_META: CountryMetadata = {
  source: "Global Simulation Database (Est.)",
  confidence: 0.5,
  lastUpdated: new Date().toISOString().split('T')[0],
  entityStatus: "UN Member State"
};

// Fallback for generic selection
export const GENERIC_COUNTRY: CountryPreview = {
  name: "Target Region",
  system: "Political System Unknown",
  gdp: "Data Pending",
  population: "Census Pending",
  military: "Standard Defense Forces",
  desc: "A recognized geopolitical entity awaiting detailed intelligence analysis.",
  metadata: {
    ...DEFAULT_META,
    confidence: 0.1,
    source: "Automated Geo-Inference"
  }
};

export const COUNTRY_DATA: Record<string, CountryPreview> = {
  // NORTH AMERICA
  "United States": {
    name: "United States",
    system: "Federal Presidential Republic",
    gdp: "$27.36 Trillion",
    population: "335 Million",
    military: "Global Superpower (Tier 1)",
    desc: "The world's preeminent economic and military power, characterizing a complex federal democracy with significant global force projection capabilities.",
    metadata: { source: "IMF WEO / CIA Factbook 2024", confidence: 0.99, lastUpdated: "2024-03-01", entityStatus: "UN Member State" }
  },
  "Canada": {
    name: "Canada",
    system: "Federal Parliamentary Democracy",
    gdp: "$2.1 Trillion",
    population: "40 Million",
    military: "Modernized / NATO Integrated",
    desc: "A stable G7 economy with vast natural resources and a diplomatic focus on multilateralism and peacekeeping.",
    metadata: { source: "StatsCan / World Bank", confidence: 0.98, lastUpdated: "2024-02-15", entityStatus: "UN Member State" }
  },
  "Mexico": {
    name: "Mexico",
    system: "Federal Presidential Republic",
    gdp: "$1.8 Trillion",
    population: "129 Million",
    military: "Internal Security Focus",
    desc: "A major manufacturing hub and cultural heavyweight in the Americas, currently managing complex internal security and cartel challenges.",
    metadata: { source: "INEGI / IMF", confidence: 0.95, lastUpdated: "2024-01-20", entityStatus: "UN Member State" }
  },

  // SOUTH AMERICA
  "Brazil": {
    name: "Brazil",
    system: "Federal Presidential Republic",
    gdp: "$2.17 Trillion",
    population: "203 Million",
    military: "Regional Power (South America)",
    desc: "The demographic and economic giant of South America, possessing vast environmental assets in the Amazon and a diversified industrial base.",
    metadata: { source: "IBGE / World Bank", confidence: 0.95, lastUpdated: "2024-02-10", entityStatus: "UN Member State" }
  },
  "Argentina": {
    name: "Argentina",
    system: "Federal Presidential Republic",
    gdp: "$640 Billion",
    population: "46 Million",
    military: "Restructuring",
    desc: "A G20 nation with rich agricultural resources, historically plagued by economic volatility and high inflation rates.",
    metadata: { source: "INDEC / IMF", confidence: 0.92, lastUpdated: "2024-03-05", entityStatus: "UN Member State" }
  },

  // EUROPE
  "United Kingdom": {
    name: "United Kingdom",
    system: "Unitary Parliamentary Constitutional Monarchy",
    gdp: "$3.5 Trillion",
    population: "68 Million",
    military: "Tier 2 (Blue Water Navy / Nuclear)",
    desc: "A P5 UN member with global soft power and financial influence, navigating a post-Brexit geopolitical landscape.",
    metadata: { source: "ONS / MOD", confidence: 0.98, lastUpdated: "2024-03-01", entityStatus: "UN Member State" }
  },
  "Germany": {
    name: "Germany",
    system: "Federal Parliamentary Republic",
    gdp: "$4.5 Trillion",
    population: "84 Million",
    military: "NATO Framework Nation",
    desc: "The economic engine of the Eurozone, focusing on industrial export prowess and renewed military modernization (Zeitenwende).",
    metadata: { source: "Destatis / Bundeswehr", confidence: 0.98, lastUpdated: "2024-02-28", entityStatus: "UN Member State" }
  },
  "France": {
    name: "France",
    system: "Unitary Semi-Presidential Republic",
    gdp: "$3.1 Trillion",
    population: "68 Million",
    military: "Tier 2 (Independent Nuclear Deterrent)",
    desc: "A pivotal European power maintaining strategic autonomy, a global diplomatic network, and significant overseas territories.",
    metadata: { source: "INSEE / French Gov", confidence: 0.98, lastUpdated: "2024-02-28", entityStatus: "UN Member State" }
  },
  "Russia": {
    name: "Russia",
    system: "Federal Semi-Presidential Republic (Authoritarian)",
    gdp: "$2.0 Trillion",
    population: "144 Million",
    military: "Global Superpower (Nuclear Parity)",
    desc: "The world's largest nation by landmass, wielding vast energy resources and a massive nuclear arsenal, currently in a high-intensity war footing.",
    metadata: { source: "Rosstat / Independent Estimates", confidence: 0.85, lastUpdated: "2024-03-10", entityStatus: "UN Member State" }
  },
  "Ukraine": {
    name: "Ukraine",
    system: "Unitary Semi-Presidential Republic",
    gdp: "$160 Billion (War Economy)",
    population: "37 Million (Est.)",
    military: "High Intensity / Mobilized",
    desc: "An Eastern European nation currently engaged in a high-intensity defensive war, supported by Western military aid.",
    metadata: { source: "Kyiv School of Economics", confidence: 0.80, lastUpdated: "2024-03-10", entityStatus: "UN Member State" }
  },

  // ASIA
  "China": {
    name: "China",
    system: "Unitary One-Party Socialist Republic",
    gdp: "$18.5 Trillion",
    population: "1.41 Billion",
    military: "Global Superpower (Near-Peer)",
    desc: "A comprehensive national power challenging the established global order through the Belt and Road Initiative and rapid military expansion.",
    metadata: { source: "NBS China / World Bank", confidence: 0.90, lastUpdated: "2024-02-01", entityStatus: "UN Member State" }
  },
  "India": {
    name: "India",
    system: "Federal Parliamentary Republic",
    gdp: "$3.9 Trillion",
    population: "1.43 Billion",
    military: "Major Power (Nuclear)",
    desc: "The world's most populous democracy and a rising economic titan, balancing strategic autonomy between East and West.",
    metadata: { source: "MoSPI / IMF", confidence: 0.93, lastUpdated: "2024-03-01", entityStatus: "UN Member State" }
  },
  "Japan": {
    name: "Japan",
    system: "Unitary Parliamentary Constitutional Monarchy",
    gdp: "$4.2 Trillion",
    population: "124 Million",
    military: "High Tech (Self-Defense Forces)",
    desc: "A highly developed technological powerhouse facing demographic decline, increasingly proactive in Indo-Pacific security.",
    metadata: { source: "Cabinet Office Japan", confidence: 0.98, lastUpdated: "2024-02-15", entityStatus: "UN Member State" }
  },
  "South Korea": {
    name: "South Korea",
    system: "Unitary Presidential Republic",
    gdp: "$1.7 Trillion",
    population: "51 Million",
    military: "Advanced / Conscript Based",
    desc: "A global leader in technology and soft power, maintaining high military readiness due to the unresolved conflict on the peninsula.",
    metadata: { source: "Bank of Korea", confidence: 0.97, lastUpdated: "2024-02-20", entityStatus: "UN Member State" }
  },
  "Indonesia": {
    name: "Indonesia",
    system: "Unitary Presidential Republic",
    gdp: "$1.4 Trillion",
    population: "278 Million",
    military: "Rising Regional Power",
    desc: "The world's largest archipelagic state and largest Muslim-majority nation, pivotal to Southeast Asian maritime security.",
    metadata: { source: "BPS Indonesia", confidence: 0.90, lastUpdated: "2024-01-30", entityStatus: "UN Member State" }
  },

  // MIDDLE EAST
  "Saudi Arabia": {
    name: "Saudi Arabia",
    system: "Unitary Absolute Monarchy",
    gdp: "$1.1 Trillion",
    population: "36 Million",
    military: "High Expenditure",
    desc: "The de facto leader of OPEC and the Islamic world, driving aggressive economic diversification under Vision 2030.",
    metadata: { source: "GASTAT / IMF", confidence: 0.90, lastUpdated: "2024-02-01", entityStatus: "UN Member State" }
  },
  "Iran": {
    name: "Iran",
    system: "Theocratic Republic",
    gdp: "$400 Billion (Sanctioned)",
    population: "89 Million",
    military: "Asymmetric / Missile Heavy",
    desc: "A revolutionary shi'a power dominating the Persian Gulf littoral, heavily sanctioned but retaining significant regional influence via proxies.",
    metadata: { source: "World Bank (Est)", confidence: 0.75, lastUpdated: "2024-01-15", entityStatus: "UN Member State" }
  },
  "Turkey": {
    name: "Turkey",
    system: "Unitary Presidential Republic",
    gdp: "$1.1 Trillion",
    population: "85 Million",
    military: "NATO (Second Largest Army)",
    desc: "A transcontinental geostrategic hub connecting Europe and Asia, pursuing an assertive and independent foreign policy.",
    metadata: { source: "TurkStat", confidence: 0.92, lastUpdated: "2024-02-10", entityStatus: "UN Member State" }
  },
  "Israel": {
    name: "Israel",
    system: "Unitary Parliamentary Republic",
    gdp: "$520 Billion",
    population: "9.8 Million",
    military: "Tier 1 Technological (Undeclared Nuclear)",
    desc: "A highly advanced technology and military power in the Levant, facing perpetual regional security challenges.",
    metadata: { source: "CBS Israel", confidence: 0.95, lastUpdated: "2024-03-01", entityStatus: "UN Member State" }
  },

  // AFRICA
  "South Africa": {
    name: "South Africa",
    system: "Unitary Parliamentary Republic",
    gdp: "$380 Billion",
    population: "62 Million",
    military: "Regional Peacekeeping Focus",
    desc: "The most industrialized economy in Africa, a BRICS member grappling with energy crises and structural inequality.",
    metadata: { source: "Stats SA", confidence: 0.92, lastUpdated: "2024-02-01", entityStatus: "UN Member State" }
  },
  "Nigeria": {
    name: "Nigeria",
    system: "Federal Presidential Republic",
    gdp: "$390 Billion",
    population: "223 Million",
    military: "Large Standing Army (COIN Focus)",
    desc: "The 'Giant of Africa', possessing the continent's largest population and economy, though hindered by infrastructure deficits.",
    metadata: { source: "NBS / World Bank", confidence: 0.85, lastUpdated: "2024-01-20", entityStatus: "UN Member State" }
  },
  "Egypt": {
    name: "Egypt",
    system: "Unitary Semi-Presidential Republic",
    gdp: "$398 Billion",
    population: "113 Million",
    military: "Major Regional (Arab World)",
    desc: "A historical civilization state controlling the Suez Canal, serving as a cultural and political pivot for North Africa.",
    metadata: { source: "CAPMAS", confidence: 0.88, lastUpdated: "2024-02-01", entityStatus: "UN Member State" }
  },

  // OCEANIA
  "Australia": {
    name: "Australia",
    system: "Federal Parliamentary Constitutional Monarchy",
    gdp: "$1.7 Trillion",
    population: "27 Million",
    military: "Modern / AUKUS Pact",
    desc: "A wealthy continent-nation with a resource-heavy economy and deepening strategic ties to US/UK defense architectures.",
    metadata: { source: "ABS", confidence: 0.98, lastUpdated: "2024-03-01", entityStatus: "UN Member State" }
  }
};

/**
 * Normalizes GeoJSON properties to match our internal dictionary keys.
 */
export const normalizeCountryName = (rawName: string): string => {
  const map: Record<string, string> = {
    "USA": "United States",
    "United States of America": "United States",
    "England": "United Kingdom",
    "Great Britain": "United Kingdom",
    "UK": "United Kingdom",
    "Russian Federation": "Russia",
    "People's Republic of China": "China",
    "Republic of Korea": "South Korea",
    "Korea, South": "South Korea",
    "Dem. Rep. Congo": "DR Congo",
    "Congo, Dem. Rep.": "DR Congo",
    "Viet Nam": "Vietnam",
    "Türkiye": "Turkey"
  };
  return map[rawName] || rawName;
};

export const getCountryPreview = (rawName: string): CountryPreview => {
  const normalized = normalizeCountryName(rawName);
  
  // Direct match
  if (COUNTRY_DATA[normalized]) return COUNTRY_DATA[normalized];

  // Heuristic Search
  const foundKey = Object.keys(COUNTRY_DATA).find(k => 
    normalized.includes(k) || k.includes(normalized)
  );
  
  if (foundKey) return COUNTRY_DATA[foundKey];

  return {
    ...GENERIC_COUNTRY,
    name: normalized,
    // Provide a slightly more informative default for recognized countries not in our detailed DB
    system: "Sovereign State (System Unverified)",
    metadata: {
      ...DEFAULT_META,
      source: "Geo-Spatial Boundary Registry",
      confidence: 0.3,
      entityStatus: "UN Member State" // Assumption for most map entries
    }
  };
};