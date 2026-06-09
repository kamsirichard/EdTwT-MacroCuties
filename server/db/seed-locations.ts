import { pool } from "./schema";

const TORONTO_HOODS = [
  "Downtown Core", "North York", "Scarborough", "Etobicoke",
  "East York", "Mississauga", "Brampton", "Markham",
  "Richmond Hill", "Vaughan", "Oakville", "Ajax",
  "Pickering", "Whitby", "Oshawa",
];

const ONTARIO_CITIES = [
  { city: "Ottawa", ps: "ON" },
  { city: "Hamilton", ps: "ON" },
  { city: "London", ps: "ON" },
  { city: "Windsor", ps: "ON" },
  { city: "Kitchener", ps: "ON" },
  { city: "Barrie", ps: "ON" },
  { city: "Kingston", ps: "ON" },
  { city: "Sudbury", ps: "ON" },
  { city: "Thunder Bay", ps: "ON" },
  { city: "St. Catharines", ps: "ON" },
];

const OTHER_CANADIAN = [
  { city: "Montreal", ps: "QC" },
  { city: "Quebec City", ps: "QC" },
  { city: "Sherbrooke", ps: "QC" },
  { city: "Vancouver", ps: "BC" },
  { city: "Surrey", ps: "BC" },
  { city: "Burnaby", ps: "BC" },
  { city: "Victoria", ps: "BC" },
  { city: "Kelowna", ps: "BC" },
  { city: "Abbotsford", ps: "BC" },
  { city: "Calgary", ps: "AB" },
  { city: "Edmonton", ps: "AB" },
  { city: "Red Deer", ps: "AB" },
  { city: "Lethbridge", ps: "AB" },
  { city: "Winnipeg", ps: "MB" },
  { city: "Brandon", ps: "MB" },
  { city: "Saskatoon", ps: "SK" },
  { city: "Regina", ps: "SK" },
  { city: "Halifax", ps: "NS" },
  { city: "Moncton", ps: "NB" },
  { city: "Fredericton", ps: "NB" },
  { city: "Charlottetown", ps: "PE" },
  { city: "St. John's", ps: "NL" },
];

const US_CITIES = [
  { city: "New York City", ps: "NY" },
  { city: "Buffalo", ps: "NY" },
  { city: "Los Angeles", ps: "CA" },
  { city: "San Diego", ps: "CA" },
  { city: "San Francisco", ps: "CA" },
  { city: "Chicago", ps: "IL" },
  { city: "Houston", ps: "TX" },
  { city: "Dallas", ps: "TX" },
  { city: "San Antonio", ps: "TX" },
  { city: "Austin", ps: "TX" },
  { city: "Phoenix", ps: "AZ" },
  { city: "Seattle", ps: "WA" },
  { city: "Miami", ps: "FL" },
  { city: "Atlanta", ps: "GA" },
  { city: "Boston", ps: "MA" },
  { city: "Denver", ps: "CO" },
  { city: "Las Vegas", ps: "NV" },
  { city: "Portland", ps: "OR" },
  { city: "Nashville", ps: "TN" },
  { city: "Charlotte", ps: "NC" },
  { city: "Detroit", ps: "MI" },
  { city: "Minneapolis", ps: "MN" },
  { city: "Orlando", ps: "FL" },
  { city: "Columbus", ps: "OH" },
  { city: "Indianapolis", ps: "IN" },
];

const US_WEST_CITIES = [
  { city: "Los Angeles", ps: "CA" },
  { city: "San Diego", ps: "CA" },
  { city: "San Francisco", ps: "CA" },
  { city: "Las Vegas", ps: "NV" },
  { city: "Phoenix", ps: "AZ" },
  { city: "Seattle", ps: "WA" },
  { city: "Portland", ps: "OR" },
  { city: "Denver", ps: "CO" },
  { city: "Dallas", ps: "TX" },
  { city: "Austin", ps: "TX" },
];

type Loc = { city: string; ps: string; country?: string; hood?: string };

function torontoLocs(slug: string, hoods: string[]): Loc[] {
  return hoods.map((h) => ({ city: "Toronto", ps: "ON", country: "Canada", hood: h }));
}
function canadianCities(cities: { city: string; ps: string }[]): Loc[] {
  return cities.map((c) => ({ ...c, country: "Canada", hood: "" }));
}
function usCities(cities: { city: string; ps: string }[]): Loc[] {
  return cities.map((c) => ({ ...c, country: "USA", hood: "" }));
}

export async function seedLocations() {
  const client = await pool.connect();
  try {
    const existing = await client.query("SELECT COUNT(*) FROM restaurant_locations");
    if (parseInt(existing.rows[0].count) > 0) {
      console.log("Locations already seeded, skipping...");
      client.release();
      return;
    }

    console.log("Seeding restaurant locations...");
    await client.query("BEGIN");

    const slugRows = await client.query("SELECT id, slug FROM restaurants");
    const slugToId: Record<string, number> = {};
    for (const row of slugRows.rows) slugToId[row.slug] = row.id;

    const ALL_CANADA_US_SLUGS = [
      "mcdonalds", "burger-king", "wendys", "subway",
      "starbucks", "kfc", "pizza-hut", "popeyes", "dominos",
    ];
    const CANADA_WIDE_SLUGS = ["tim-hortons", "aw", "dairy-queen"];
    const ONTARIO_SLUGS = ["harveys", "swiss-chalet"];
    const MARY_BROWNS_SLUGS = ["mary-browns"];
    const MAJOR_BOTH_SLUGS = [
      "taco-bell", "chipotle", "five-guys", "shake-shack",
      "panera-bread", "panda-express", "dunkin",
    ];
    const US_WEST_SLUGS = ["in-n-out"];
    const US_ONLY_SLUGS = [
      "chick-fil-a", "jack-in-the-box", "sonic",
      "whataburger", "wingstop", "carls-jr", "arbys",
    ];

    const locationGroups: Record<string, Loc[]> = {};

    for (const slug of ALL_CANADA_US_SLUGS) {
      locationGroups[slug] = [
        ...torontoLocs(slug, TORONTO_HOODS),
        ...canadianCities([...ONTARIO_CITIES, ...OTHER_CANADIAN]),
        ...usCities(US_CITIES),
      ];
    }

    for (const slug of CANADA_WIDE_SLUGS) {
      locationGroups[slug] = [
        ...torontoLocs(slug, TORONTO_HOODS),
        ...canadianCities([...ONTARIO_CITIES, ...OTHER_CANADIAN]),
        ...usCities([{ city: "Buffalo", ps: "NY" }, { city: "Detroit", ps: "MI" }]),
      ];
    }

    for (const slug of ONTARIO_SLUGS) {
      const majorCanadian = [
        { city: "Vancouver", ps: "BC" }, { city: "Calgary", ps: "AB" },
        { city: "Edmonton", ps: "AB" }, { city: "Montreal", ps: "QC" },
        { city: "Winnipeg", ps: "MB" }, { city: "Halifax", ps: "NS" },
      ];
      locationGroups[slug] = [
        ...torontoLocs(slug, TORONTO_HOODS),
        ...canadianCities([...ONTARIO_CITIES, ...majorCanadian]),
      ];
    }

    for (const slug of MARY_BROWNS_SLUGS) {
      const atantic = [
        { city: "Halifax", ps: "NS" }, { city: "Moncton", ps: "NB" },
        { city: "St. John's", ps: "NL" }, { city: "Charlottetown", ps: "PE" },
        { city: "Fredericton", ps: "NB" },
      ];
      locationGroups[slug] = [
        ...torontoLocs(slug, TORONTO_HOODS),
        ...canadianCities([...ONTARIO_CITIES, ...atantic]),
      ];
    }

    for (const slug of MAJOR_BOTH_SLUGS) {
      const majorToronto = [
        "Downtown Core", "North York", "Scarborough", "Etobicoke",
        "Mississauga", "Brampton", "Markham",
      ];
      const majorCan = [
        { city: "Ottawa", ps: "ON" }, { city: "Hamilton", ps: "ON" },
        { city: "Montreal", ps: "QC" }, { city: "Vancouver", ps: "BC" },
        { city: "Calgary", ps: "AB" }, { city: "Edmonton", ps: "AB" },
        { city: "Winnipeg", ps: "MB" }, { city: "Halifax", ps: "NS" },
        { city: "Quebec City", ps: "QC" }, { city: "Saskatoon", ps: "SK" },
        { city: "Regina", ps: "SK" },
      ];
      locationGroups[slug] = [
        ...torontoLocs(slug, majorToronto),
        ...canadianCities(majorCan),
        ...usCities(US_CITIES),
      ];
    }

    for (const slug of US_WEST_SLUGS) {
      locationGroups[slug] = usCities(US_WEST_CITIES);
    }

    for (const slug of US_ONLY_SLUGS) {
      locationGroups[slug] = usCities(US_CITIES);
    }

    let totalInserted = 0;
    for (const [slug, locs] of Object.entries(locationGroups)) {
      const restId = slugToId[slug];
      if (!restId) continue;
      for (const loc of locs) {
        try {
          await client.query(
            `INSERT INTO restaurant_locations
               (restaurant_id, city, province_state, country, neighborhood)
             VALUES ($1,$2,$3,$4,$5)
             ON CONFLICT (restaurant_id, city, province_state, country, neighborhood) DO NOTHING`,
            [restId, loc.city, loc.ps, loc.country ?? "USA", loc.hood ?? ""]
          );
          totalInserted++;
        } catch (_) {}
      }
    }

    await client.query("COMMIT");
    console.log(`Seeded ${totalInserted} location entries.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Location seed error:", err);
  } finally {
    client.release();
  }
}
