import { pool } from "./schema";

export async function seedData() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if already seeded
    const existing = await client.query("SELECT COUNT(*) FROM restaurants");
    if (parseInt(existing.rows[0].count) > 0) {
      console.log("Database already seeded, skipping...");
      await client.query("ROLLBACK");
      return;
    }

    console.log("Seeding restaurants...");

    // ─── RESTAURANTS ────────────────────────────────────────────────────────
    const restaurants = [
      { name: "McDonald's", slug: "mcdonalds", category: "Burgers & Fast Food", headquarters: "Chicago, IL", logo_emoji: "🍟", logo_color: "#DA291C", description: "The world's largest fast-food chain, serving burgers, fries, chicken and more.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "Burger King", slug: "burger-king", category: "Burgers & Fast Food", headquarters: "Miami, FL", logo_emoji: "👑", logo_color: "#D62300", description: "Home of the Whopper. Flame-grilled burgers since 1954.", dietary_options: ["vegetarian", "vegan"], is_featured: true },
      { name: "Wendy's", slug: "wendys", category: "Burgers & Fast Food", headquarters: "Dublin, OH", logo_emoji: "🍔", logo_color: "#E2231A", description: "Fresh, never frozen beef burgers with a side of Frosty.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "Subway", slug: "subway", category: "Sandwiches & Subs", headquarters: "Milford, CT", logo_emoji: "🥖", logo_color: "#009743", description: "Build your own sub with hundreds of combinations.", dietary_options: ["vegetarian", "vegan", "halal"], is_featured: true },
      { name: "Taco Bell", slug: "taco-bell", category: "Mexican Fast Food", headquarters: "Irvine, CA", logo_emoji: "🌮", logo_color: "#702082", description: "Live Más. Mexican-inspired fast food with vegetarian and vegan options.", dietary_options: ["vegetarian", "vegan"], is_featured: true },
      { name: "Chipotle", slug: "chipotle", category: "Mexican Fast Food", headquarters: "Newport Beach, CA", logo_emoji: "🌯", logo_color: "#A81612", description: "Food with integrity. Customizable bowls, burritos and tacos.", dietary_options: ["vegetarian", "vegan", "gluten-free"], is_featured: true },
      { name: "Chick-fil-A", slug: "chick-fil-a", category: "Chicken", headquarters: "College Park, GA", logo_emoji: "🐔", logo_color: "#E31837", description: "Pressure-cooked chicken sandwiches and waffle fries.", dietary_options: ["gluten-free"], is_featured: true },
      { name: "KFC", slug: "kfc", category: "Chicken", headquarters: "Louisville, KY", logo_emoji: "🍗", logo_color: "#F40027", description: "Original Recipe fried chicken with 11 herbs and spices.", dietary_options: [], is_featured: true },
      { name: "Popeyes", slug: "popeyes", category: "Chicken", headquarters: "Miami, FL", logo_emoji: "🦞", logo_color: "#F05023", description: "Louisiana-style fried chicken with bold Cajun flavors.", dietary_options: [], is_featured: false },
      { name: "Pizza Hut", slug: "pizza-hut", category: "Pizza", headquarters: "Plano, TX", logo_emoji: "🍕", logo_color: "#EE3124", description: "Pan pizzas, stuffed crust, and pasta since 1958.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "Domino's", slug: "dominos", category: "Pizza", headquarters: "Ann Arbor, MI", logo_emoji: "🍕", logo_color: "#006491", description: "Delivery-focused pizza chain with custom toppings.", dietary_options: ["vegetarian", "vegan"], is_featured: true },
      { name: "Starbucks", slug: "starbucks", category: "Coffee & Drinks", headquarters: "Seattle, WA", logo_emoji: "☕", logo_color: "#00704A", description: "Coffee, lattes, frappuccinos, and snacks customized your way.", dietary_options: ["vegetarian", "vegan", "dairy-free"], is_featured: true },
      { name: "Tim Hortons", slug: "tim-hortons", category: "Coffee & Baked Goods", headquarters: "Toronto, ON, Canada", country: "Canada", logo_emoji: "☕", logo_color: "#C8102E", description: "Canada's beloved coffee chain with Timbits and double-doubles.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "Dairy Queen", slug: "dairy-queen", category: "Ice Cream & Burgers", headquarters: "Edina, MN", logo_emoji: "🍦", logo_color: "#D62300", description: "Blizzards, soft serve, and DQ Grill burgers.", dietary_options: ["vegetarian"], is_featured: false },
      { name: "Five Guys", slug: "five-guys", category: "Burgers & Fast Food", headquarters: "Lorton, VA", logo_emoji: "🍔", logo_color: "#CF2028", description: "Customizable burgers made with fresh beef and free toppings.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "In-N-Out Burger", slug: "in-n-out", category: "Burgers & Fast Food", headquarters: "Irvine, CA", logo_emoji: "🍔", logo_color: "#DA291C", description: "West Coast icon with a simple menu and secret sauce.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "Shake Shack", slug: "shake-shack", category: "Burgers & Fast Food", headquarters: "New York, NY", logo_emoji: "🥤", logo_color: "#64A70B", description: "Premium burgers, crinkle-cut fries, and thick shakes.", dietary_options: ["vegetarian"], is_featured: true },
      { name: "Panera Bread", slug: "panera-bread", category: "Bakery & Cafe", headquarters: "St. Louis, MO", logo_emoji: "🥐", logo_color: "#A6232F", description: "Soups, sandwiches and salads with clean ingredients.", dietary_options: ["vegetarian", "vegan", "gluten-free"], is_featured: true },
      { name: "Panda Express", slug: "panda-express", category: "Asian Fast Food", headquarters: "Rosemead, CA", logo_emoji: "🐼", logo_color: "#E02020", description: "American Chinese fast food with signature Orange Chicken.", dietary_options: ["vegetarian", "gluten-free"], is_featured: true },
      { name: "Dunkin'", slug: "dunkin", category: "Coffee & Baked Goods", headquarters: "Canton, MA", logo_emoji: "🍩", logo_color: "#FF671F", description: "America runs on Dunkin'. Coffee, donuts, sandwiches.", dietary_options: ["vegetarian", "vegan"], is_featured: true },
      { name: "A&W", slug: "aw", category: "Burgers & Fast Food", headquarters: "Lexington, KY", logo_emoji: "🍺", logo_color: "#F7941D", description: "Root beer floats and classic burgers since 1919.", dietary_options: ["vegetarian"], is_featured: false },
      { name: "Harvey's", slug: "harveys", category: "Burgers & Fast Food", headquarters: "Toronto, ON, Canada", country: "Canada", logo_emoji: "🍔", logo_color: "#E3001B", description: "Canada's original flame-grilled burger chain.", dietary_options: ["vegetarian"], is_featured: false },
      { name: "Swiss Chalet", slug: "swiss-chalet", category: "Chicken & Ribs", headquarters: "Toronto, ON, Canada", country: "Canada", logo_emoji: "🍖", logo_color: "#C8102E", description: "Slow-roasted chicken and ribs with signature Chalet sauce.", dietary_options: ["gluten-free"], is_featured: false },
      { name: "Mary Brown's", slug: "mary-browns", category: "Chicken", headquarters: "Toronto, ON, Canada", country: "Canada", logo_emoji: "🍗", logo_color: "#D62300", description: "Canadian fried chicken chain with Big Mary's and Taters.", dietary_options: [], is_featured: false },
      { name: "Carl's Jr. / Hardee's", slug: "carls-jr", category: "Burgers & Fast Food", headquarters: "Franklin, TN", logo_emoji: "⭐", logo_color: "#D62300", description: "Charbroiled thick burgers and hand-breaded chicken tenders.", dietary_options: [], is_featured: false },
      { name: "Jack in the Box", slug: "jack-in-the-box", category: "Burgers & Fast Food", headquarters: "San Diego, CA", logo_emoji: "🎪", logo_color: "#FF6600", description: "24-hour burgers, tacos, and loaded fries.", dietary_options: ["vegetarian"], is_featured: false },
      { name: "Sonic Drive-In", slug: "sonic", category: "Burgers & Fast Food", headquarters: "Oklahoma City, OK", logo_emoji: "🛻", logo_color: "#FFB511", description: "America's Drive-In with tots, slushes, and customizable hot dogs.", dietary_options: ["vegetarian"], is_featured: false },
      { name: "Whataburger", slug: "whataburger", category: "Burgers & Fast Food", headquarters: "San Antonio, TX", logo_emoji: "🧡", logo_color: "#F26522", description: "Texas-born burgers with a cult following and signature Fancy Ketchup.", dietary_options: ["vegetarian"], is_featured: false },
      { name: "Wingstop", slug: "wingstop", category: "Wings & Chicken", headquarters: "Addison, TX", logo_emoji: "🪶", logo_color: "#FFB800", description: "The Wing Experts — 11 flavors of crispy or sauced wings.", dietary_options: [], is_featured: false },
      { name: "Arby's", slug: "arbys", category: "Sandwiches", headquarters: "Sandy Springs, GA", logo_emoji: "🎩", logo_color: "#CC0000", description: "We Have the Meats. Roast beef, brisket, and curly fries.", dietary_options: [], is_featured: false },
    ];

    const restIds: Record<string, number> = {};
    for (const r of restaurants) {
      const res = await client.query(
        `INSERT INTO restaurants (name, slug, category, headquarters, country, logo_emoji, logo_color, description, dietary_options, is_featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
        [r.name, r.slug, r.category, r.headquarters, r.country || "USA", r.logo_emoji, r.logo_color, r.description, r.dietary_options, r.is_featured]
      );
      restIds[r.slug] = res.rows[0].id;
    }

    console.log("Seeding menu items...");

    // ─── MENU ITEMS ──────────────────────────────────────────────────────────
    const menuItems = [
      // === McDONALD'S ===
      { slug: "mcdonalds", name: "Big Mac", category: "Burgers", cal: 590, pro: 25, carb: 46, fat: 34, sat: 11, sod: 1040, sug: 9, fib: 3, chol: 80, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs","sesame"] },
      { slug: "mcdonalds", name: "Quarter Pounder with Cheese", category: "Burgers", cal: 520, pro: 30, carb: 41, fat: 26, sat: 12, sod: 1090, sug: 10, fib: 2, chol: 95, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "mcdonalds", name: "McDouble", category: "Burgers", cal: 400, pro: 22, carb: 34, fat: 20, sat: 8, sod: 750, sug: 7, fib: 1, chol: 70, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "mcdonalds", name: "Filet-O-Fish", category: "Sandwiches", cal: 390, pro: 16, carb: 38, fat: 19, sat: 4, sod: 590, sug: 5, fib: 1, chol: 40, veg: false, hal: false, gf: false, allergens: ["gluten","fish","dairy"] },
      { slug: "mcdonalds", name: "McChicken", category: "Sandwiches", cal: 400, pro: 14, carb: 41, fat: 21, sat: 3.5, sod: 600, sug: 5, fib: 2, chol: 40, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "mcdonalds", name: "Crispy Chicken Sandwich", category: "Sandwiches", cal: 470, pro: 25, carb: 46, fat: 20, sat: 3.5, sod: 990, sug: 6, fib: 2, chol: 60, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "mcdonalds", name: "Medium French Fries", category: "Sides", cal: 320, pro: 4, carb: 44, fat: 15, sat: 1.5, sod: 400, sug: 0, fib: 4, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "mcdonalds", name: "Large French Fries", category: "Sides", cal: 490, pro: 7, carb: 66, fat: 23, sat: 3, sod: 610, sug: 0, fib: 6, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "mcdonalds", name: "Egg McMuffin", category: "Breakfast", cal: 310, pro: 17, carb: 30, fat: 13, sat: 6, sod: 750, sug: 3, fib: 2, chol: 235, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "mcdonalds", name: "Hotcakes (3 pieces)", category: "Breakfast", cal: 350, pro: 8, carb: 66, fat: 9, sat: 2, sod: 590, sug: 14, fib: 2, chol: 20, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "mcdonalds", name: "Sausage McMuffin with Egg", category: "Breakfast", cal: 480, pro: 21, carb: 30, fat: 30, sat: 12, sod: 870, sug: 3, fib: 2, chol: 255, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "mcdonalds", name: "Medium Vanilla Shake", category: "Drinks & Desserts", cal: 530, pro: 13, carb: 82, fat: 14, sat: 9, sod: 260, sug: 73, fib: 0, chol: 55, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "mcdonalds", name: "Apple Pie", category: "Drinks & Desserts", cal: 240, pro: 2, carb: 34, fat: 11, sat: 4.5, sod: 85, sug: 12, fib: 2, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten"] },
      { slug: "mcdonalds", name: "Southwest Chicken Salad", category: "Salads", cal: 350, pro: 37, carb: 27, fat: 11, sat: 4.5, sod: 980, sug: 8, fib: 6, chol: 85, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "mcdonalds", name: "Side Salad", category: "Salads", cal: 15, pro: 1, carb: 3, fat: 0, sat: 0, sod: 10, sug: 2, fib: 1, chol: 0, veg: true, hal: true, gf: true, allergens: [] },

      // === BURGER KING ===
      { slug: "burger-king", name: "Whopper", category: "Burgers", cal: 657, pro: 28, carb: 40, fat: 40, sat: 12, sod: 980, sug: 11, fib: 2, chol: 90, veg: false, hal: false, gf: false, allergens: ["gluten","sesame"] },
      { slug: "burger-king", name: "Whopper with Cheese", category: "Burgers", cal: 707, pro: 31, carb: 41, fat: 44, sat: 15, sod: 1200, sug: 11, fib: 2, chol: 105, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "burger-king", name: "Double Whopper", category: "Burgers", cal: 900, pro: 46, carb: 40, fat: 57, sat: 20, sod: 1080, sug: 11, fib: 2, chol: 185, veg: false, hal: false, gf: false, allergens: ["gluten","sesame"] },
      { slug: "burger-king", name: "Impossible Whopper", category: "Burgers", cal: 630, pro: 25, carb: 58, fat: 34, sat: 11, sod: 1080, sug: 12, fib: 4, chol: 10, veg: true, hal: false, gf: false, allergens: ["gluten","soy","sesame"] },
      { slug: "burger-king", name: "Original Chicken Sandwich", category: "Sandwiches", cal: 660, pro: 24, carb: 52, fat: 40, sat: 7, sod: 1110, sug: 6, fib: 2, chol: 55, veg: false, hal: false, gf: false, allergens: ["gluten","eggs","sesame"] },
      { slug: "burger-king", name: "Crispy Chicken Sandwich", category: "Sandwiches", cal: 470, pro: 26, carb: 42, fat: 20, sat: 4, sod: 940, sug: 7, fib: 2, chol: 55, veg: false, hal: false, gf: false, allergens: ["gluten","sesame"] },
      { slug: "burger-king", name: "Medium Onion Rings", category: "Sides", cal: 320, pro: 4, carb: 40, fat: 16, sat: 3.5, sod: 490, sug: 3, fib: 3, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","milk"] },
      { slug: "burger-king", name: "Medium Fries", category: "Sides", cal: 380, pro: 4, carb: 54, fat: 17, sat: 2, sod: 570, sug: 0, fib: 4, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "burger-king", name: "Croissan'wich with Egg & Cheese", category: "Breakfast", cal: 340, pro: 13, carb: 26, fat: 22, sat: 10, sod: 630, sug: 4, fib: 0, chol: 155, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },

      // === WENDY'S ===
      { slug: "wendys", name: "Dave's Single", category: "Burgers", cal: 570, pro: 30, carb: 37, fat: 33, sat: 13, sod: 1120, sug: 8, fib: 2, chol: 100, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "wendys", name: "Dave's Double", category: "Burgers", cal: 840, pro: 52, carb: 38, fat: 53, sat: 23, sod: 1440, sug: 8, fib: 2, chol: 185, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "wendys", name: "Baconator", category: "Burgers", cal: 950, pro: 61, carb: 35, fat: 62, sat: 26, sod: 1880, sug: 8, fib: 1, chol: 215, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "wendys", name: "Spicy Chicken Sandwich", category: "Sandwiches", cal: 500, pro: 33, carb: 49, fat: 20, sat: 3.5, sod: 1120, sug: 7, fib: 3, chol: 70, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "wendys", name: "Classic Chicken Sandwich", category: "Sandwiches", cal: 430, pro: 28, carb: 43, fat: 16, sat: 3, sod: 780, sug: 7, fib: 3, chol: 60, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "wendys", name: "Apple Pecan Chicken Salad (Full)", category: "Salads", cal: 570, pro: 42, carb: 43, fat: 24, sat: 8, sod: 880, sug: 34, fib: 6, chol: 110, veg: false, hal: false, gf: true, allergens: ["dairy","tree nuts"] },
      { slug: "wendys", name: "Natural-Cut Fries (Medium)", category: "Sides", cal: 320, pro: 4, carb: 43, fat: 15, sat: 2.5, sod: 450, sug: 0, fib: 4, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "wendys", name: "Frosty — Chocolate (Medium)", category: "Drinks & Desserts", cal: 440, pro: 11, carb: 73, fat: 11, sat: 7, sod: 200, sug: 60, fib: 0, chol: 45, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "wendys", name: "Chili (Large)", category: "Sides", cal: 300, pro: 23, carb: 32, fat: 7, sat: 2.5, sod: 1090, sug: 7, fib: 8, chol: 45, veg: false, hal: false, gf: true, allergens: [] },

      // === SUBWAY ===
      { slug: "subway", name: "Italian B.M.T. (6 inch)", category: "Subs", cal: 410, pro: 22, carb: 40, fat: 18, sat: 7, sod: 1100, sug: 6, fib: 3, chol: 55, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "subway", name: "Chicken Teriyaki (6 inch)", category: "Subs", cal: 370, pro: 26, carb: 50, fat: 7, sat: 2, sod: 910, sug: 12, fib: 3, chol: 50, veg: false, hal: true, gf: false, allergens: ["gluten","soy"] },
      { slug: "subway", name: "Tuna (6 inch)", category: "Subs", cal: 480, pro: 21, carb: 40, fat: 25, sat: 5, sod: 630, sug: 6, fib: 3, chol: 35, veg: false, hal: false, gf: false, allergens: ["gluten","fish","eggs"] },
      { slug: "subway", name: "Veggie Delite (6 inch)", category: "Subs", cal: 200, pro: 8, carb: 39, fat: 2, sat: 0.5, sod: 310, sug: 6, fib: 3, chol: 0, veg: true, hal: true, gf: false, allergens: ["gluten"] },
      { slug: "subway", name: "Meatball Marinara (6 inch)", category: "Subs", cal: 480, pro: 21, carb: 54, fat: 19, sat: 8, sod: 1050, sug: 11, fib: 4, chol: 45, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "subway", name: "Black Forest Ham (Footlong)", category: "Subs", cal: 570, pro: 37, carb: 80, fat: 12, sat: 4, sod: 2330, sug: 12, fib: 6, chol: 50, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "subway", name: "Roast Beef (6 inch)", category: "Subs", cal: 310, pro: 24, carb: 40, fat: 6, sat: 1.5, sod: 840, sug: 6, fib: 3, chol: 45, veg: false, hal: false, gf: false, allergens: ["gluten"] },

      // === TACO BELL ===
      { slug: "taco-bell", name: "Crunchy Taco", category: "Tacos", cal: 170, pro: 8, carb: 13, fat: 9, sat: 4, sod: 310, sug: 1, fib: 3, chol: 25, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "taco-bell", name: "Soft Taco", category: "Tacos", cal: 180, pro: 9, carb: 18, fat: 8, sat: 3.5, sod: 450, sug: 2, fib: 2, chol: 25, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "taco-bell", name: "Crunchwrap Supreme", category: "Specialty", cal: 530, pro: 17, carb: 71, fat: 21, sat: 8, sod: 1230, sug: 5, fib: 7, chol: 35, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "taco-bell", name: "Beefy 5-Layer Burrito", category: "Burritos", cal: 500, pro: 20, carb: 63, fat: 19, sat: 7, sod: 1200, sug: 4, fib: 8, chol: 40, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "taco-bell", name: "Black Bean Crunchwrap Supreme", category: "Specialty", cal: 510, pro: 14, carb: 76, fat: 18, sat: 6, sod: 1100, sug: 4, fib: 8, chol: 10, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "taco-bell", name: "Mexican Pizza", category: "Specialty", cal: 540, pro: 20, carb: 47, fat: 30, sat: 10, sod: 970, sug: 3, fib: 6, chol: 45, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "taco-bell", name: "Chips and Nacho Cheese Sauce", category: "Sides", cal: 220, pro: 2, carb: 29, fat: 11, sat: 2, sod: 380, sug: 1, fib: 1, chol: 0, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "taco-bell", name: "Cinnabon Delights (4-pack)", category: "Desserts", cal: 310, pro: 3, carb: 37, fat: 17, sat: 8, sod: 340, sug: 18, fib: 1, chol: 20, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },

      // === CHIPOTLE ===
      { slug: "chipotle", name: "Chicken Burrito Bowl", category: "Bowls", cal: 630, pro: 47, carb: 67, fat: 20, sat: 6, sod: 1600, sug: 3, fib: 10, chol: 115, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "chipotle", name: "Steak Burrito", category: "Burritos", cal: 855, pro: 45, carb: 99, fat: 29, sat: 10, sod: 2030, sug: 4, fib: 14, chol: 120, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "chipotle", name: "Sofritas Bowl (Vegan)", category: "Bowls", cal: 535, pro: 22, carb: 69, fat: 20, sat: 5, sod: 1470, sug: 5, fib: 11, chol: 0, veg: true, hal: false, gf: true, allergens: ["soy"] },
      { slug: "chipotle", name: "Chicken Tacos (3)", category: "Tacos", cal: 500, pro: 38, carb: 48, fat: 17, sat: 5, sod: 1280, sug: 4, fib: 6, chol: 105, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "chipotle", name: "Carnitas Burrito Bowl", category: "Bowls", cal: 730, pro: 43, carb: 67, fat: 29, sat: 9, sod: 1550, sug: 3, fib: 10, chol: 130, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "chipotle", name: "Chips & Guacamole", category: "Sides", cal: 560, pro: 7, carb: 69, fat: 31, sat: 4.5, sod: 620, sug: 1, fib: 11, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "chipotle", name: "Quesadilla (Cheese)", category: "Specialty", cal: 780, pro: 38, carb: 73, fat: 37, sat: 18, sod: 1710, sug: 4, fib: 7, chol: 95, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },

      // === CHICK-FIL-A ===
      { slug: "chick-fil-a", name: "Chicken Sandwich", category: "Sandwiches", cal: 440, pro: 28, carb: 40, fat: 19, sat: 4, sod: 1350, sug: 5, fib: 1, chol: 80, veg: false, hal: false, gf: false, allergens: ["gluten","eggs","soy"] },
      { slug: "chick-fil-a", name: "Spicy Deluxe Sandwich", category: "Sandwiches", cal: 550, pro: 37, carb: 43, fat: 25, sat: 10, sod: 1670, sug: 6, fib: 2, chol: 105, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "chick-fil-a", name: "Grilled Chicken Sandwich", category: "Sandwiches", cal: 320, pro: 30, carb: 36, fat: 6, sat: 1.5, sod: 800, sug: 9, fib: 3, chol: 75, veg: false, hal: false, gf: false, allergens: ["gluten","soy"] },
      { slug: "chick-fil-a", name: "8-count Nuggets", category: "Nuggets & Strips", cal: 250, pro: 29, carb: 11, fat: 11, sat: 2.5, sod: 1070, sug: 1, fib: 0, chol: 70, veg: false, hal: false, gf: false, allergens: ["gluten","eggs","soy"] },
      { slug: "chick-fil-a", name: "Waffle Potato Fries (Medium)", category: "Sides", cal: 360, pro: 4, carb: 45, fat: 18, sat: 4, sod: 270, sug: 0, fib: 4, chol: 0, veg: true, hal: false, gf: true, allergens: [] },
      { slug: "chick-fil-a", name: "Grilled Market Salad", category: "Salads", cal: 330, pro: 31, carb: 27, fat: 12, sat: 5, sod: 690, sug: 14, fib: 4, chol: 80, veg: false, hal: false, gf: true, allergens: ["dairy","tree nuts"] },
      { slug: "chick-fil-a", name: "Mac & Cheese (Medium)", category: "Sides", cal: 450, pro: 17, carb: 46, fat: 22, sat: 12, sod: 920, sug: 6, fib: 2, chol: 65, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "chick-fil-a", name: "Peach Milkshake (Medium)", category: "Drinks & Desserts", cal: 620, pro: 16, carb: 95, fat: 20, sat: 13, sod: 310, sug: 81, fib: 1, chol: 75, veg: true, hal: false, gf: true, allergens: ["dairy"] },

      // === KFC ===
      { slug: "kfc", name: "Original Recipe Breast", category: "Chicken", cal: 390, pro: 39, carb: 11, fat: 21, sat: 5, sod: 1010, sug: 0, fib: 0, chol: 145, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "kfc", name: "Extra Crispy Breast", category: "Chicken", cal: 530, pro: 35, carb: 27, fat: 33, sat: 8, sod: 1010, sug: 0, fib: 1, chol: 130, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "kfc", name: "Nashville Hot Chicken (Breast)", category: "Chicken", cal: 450, pro: 37, carb: 14, fat: 28, sat: 6, sod: 1200, sug: 1, fib: 1, chol: 145, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "kfc", name: "Chicken Sandwich", category: "Sandwiches", cal: 650, pro: 30, carb: 57, fat: 35, sat: 8, sod: 1600, sug: 6, fib: 3, chol: 90, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "kfc", name: "Famous Bowl", category: "Specialty", cal: 720, pro: 26, carb: 82, fat: 34, sat: 7, sod: 2090, sug: 5, fib: 6, chol: 55, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "kfc", name: "Mashed Potatoes & Gravy", category: "Sides", cal: 120, pro: 3, carb: 18, fat: 4.5, sat: 1, sod: 460, sug: 0, fib: 2, chol: 0, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "kfc", name: "Coleslaw", category: "Sides", cal: 100, pro: 1, carb: 11, fat: 6, sat: 1, sod: 135, sug: 8, fib: 1, chol: 5, veg: true, hal: false, gf: true, allergens: ["eggs"] },
      { slug: "kfc", name: "Biscuit", category: "Sides", cal: 180, pro: 4, carb: 22, fat: 8, sat: 3, sod: 490, sug: 2, fib: 0, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },

      // === STARBUCKS ===
      { slug: "starbucks", name: "Caramel Macchiato (Grande, 2%)", category: "Hot Drinks", cal: 250, pro: 10, carb: 37, fat: 7, sat: 4.5, sod: 150, sug: 35, fib: 0, chol: 30, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "starbucks", name: "Vanilla Latte (Grande, 2%)", category: "Hot Drinks", cal: 250, pro: 12, carb: 37, fat: 6, sat: 3.5, sod: 170, sug: 35, fib: 0, chol: 25, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "starbucks", name: "Frappuccino — Java Chip (Grande)", category: "Cold Drinks", cal: 460, pro: 7, carb: 66, fat: 19, sat: 12, sod: 280, sug: 60, fib: 2, chol: 45, veg: true, hal: false, gf: false, allergens: ["dairy","gluten"] },
      { slug: "starbucks", name: "Cold Brew Coffee (Grande)", category: "Cold Drinks", cal: 5, pro: 0, carb: 0, fat: 0, sat: 0, sod: 15, sug: 0, fib: 0, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "starbucks", name: "Pumpkin Spice Latte (Grande)", category: "Seasonal", cal: 380, pro: 14, carb: 52, fat: 13, sat: 8, sod: 240, sug: 50, fib: 0, chol: 50, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "starbucks", name: "Matcha Green Tea Latte (Grande, Oat)", category: "Hot Drinks", cal: 270, pro: 8, carb: 44, fat: 7, sat: 1, sod: 180, sug: 32, fib: 2, chol: 0, veg: true, hal: true, gf: true, allergens: ["oats"] },
      { slug: "starbucks", name: "Bacon, Gouda & Egg Sandwich", category: "Food", cal: 370, pro: 17, carb: 36, fat: 18, sat: 8, sod: 770, sug: 5, fib: 1, chol: 135, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "starbucks", name: "Impossible Breakfast Sandwich", category: "Food", cal: 420, pro: 24, carb: 47, fat: 15, sat: 5, sod: 670, sug: 5, fib: 3, chol: 140, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","eggs","soy"] },
      { slug: "starbucks", name: "Birthday Cake Pop", category: "Food", cal: 160, pro: 2, carb: 22, fat: 8, sat: 4.5, sod: 65, sug: 19, fib: 0, chol: 15, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },

      // === TIM HORTONS ===
      { slug: "tim-hortons", name: "Double Double (Large)", category: "Coffee", cal: 230, pro: 3, carb: 34, fat: 9, sat: 5, sod: 75, sug: 32, fib: 0, chol: 30, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "tim-hortons", name: "Original Blend Coffee (Medium)", category: "Coffee", cal: 10, pro: 1, carb: 2, fat: 0, sat: 0, sod: 10, sug: 0, fib: 0, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "tim-hortons", name: "Iced Capp (Medium)", category: "Cold Drinks", cal: 270, pro: 3, carb: 45, fat: 9, sat: 5, sod: 80, sug: 43, fib: 0, chol: 30, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "tim-hortons", name: "Timbits Honey Dip (10-pack)", category: "Donuts & Pastries", cal: 430, pro: 6, carb: 76, fat: 13, sat: 2, sod: 340, sug: 36, fib: 1, chol: 10, veg: true, hal: false, gf: false, allergens: ["gluten","eggs","dairy"] },
      { slug: "tim-hortons", name: "Toasted Coconut Donut", category: "Donuts & Pastries", cal: 270, pro: 4, carb: 37, fat: 13, sat: 5, sod: 220, sug: 19, fib: 1, chol: 25, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "tim-hortons", name: "Breakfast BLT Sandwich", category: "Sandwiches", cal: 390, pro: 20, carb: 41, fat: 17, sat: 6, sod: 920, sug: 4, fib: 2, chol: 165, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "tim-hortons", name: "Chili (Medium)", category: "Soups", cal: 200, pro: 16, carb: 24, fat: 4, sat: 1.5, sod: 1230, sug: 5, fib: 7, chol: 30, veg: false, hal: false, gf: true, allergens: [] },
      { slug: "tim-hortons", name: "Everything Bagel with Cream Cheese", category: "Breads & Bagels", cal: 370, pro: 13, carb: 54, fat: 12, sat: 6, sod: 690, sug: 8, fib: 2, chol: 35, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },

      // === CHIPOTLE extras, FIVE GUYS, IN-N-OUT, SHAKE SHACK ===
      { slug: "five-guys", name: "Hamburger", category: "Burgers", cal: 530, pro: 26, carb: 40, fat: 30, sat: 14, sod: 430, sug: 8, fib: 2, chol: 80, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "five-guys", name: "Cheeseburger", category: "Burgers", cal: 690, pro: 34, carb: 40, fat: 43, sat: 21, sod: 820, sug: 8, fib: 2, chol: 115, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "five-guys", name: "Bacon Cheeseburger", category: "Burgers", cal: 780, pro: 38, carb: 40, fat: 51, sat: 23, sod: 1080, sug: 8, fib: 2, chol: 135, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "five-guys", name: "Little Hamburger", category: "Burgers", cal: 300, pro: 17, carb: 26, fat: 15, sat: 7, sod: 380, sug: 5, fib: 1, chol: 45, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "five-guys", name: "Veggie Sandwich", category: "Sandwiches", cal: 440, pro: 17, carb: 60, fat: 15, sat: 8, sod: 490, sug: 10, fib: 5, chol: 25, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "five-guys", name: "Regular Fries (Cajun)", category: "Sides", cal: 543, pro: 9, carb: 71, fat: 24, sat: 6, sod: 965, sug: 1, fib: 6, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "five-guys", name: "Regular Fries", category: "Sides", cal: 543, pro: 9, carb: 71, fat: 24, sat: 6, sod: 215, sug: 1, fib: 6, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "five-guys", name: "Chocolate Milkshake (Regular)", category: "Drinks & Desserts", cal: 885, pro: 18, carb: 122, fat: 38, sat: 24, sod: 490, sug: 103, fib: 2, chol: 130, veg: true, hal: false, gf: true, allergens: ["dairy"] },

      { slug: "in-n-out", name: "Hamburger", category: "Burgers", cal: 390, pro: 16, carb: 37, fat: 19, sat: 5, sod: 650, sug: 10, fib: 3, chol: 40, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "in-n-out", name: "Cheeseburger", category: "Burgers", cal: 480, pro: 22, carb: 39, fat: 27, sat: 10, sod: 1000, sug: 10, fib: 3, chol: 60, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "in-n-out", name: "Double-Double", category: "Burgers", cal: 670, pro: 37, carb: 39, fat: 41, sat: 18, sod: 1440, sug: 10, fib: 3, chol: 120, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "in-n-out", name: "Animal Style Burger", category: "Burgers", cal: 560, pro: 26, carb: 48, fat: 33, sat: 11, sod: 1120, sug: 14, fib: 3, chol: 70, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs","sesame"] },
      { slug: "in-n-out", name: "Protein Style (Lettuce Wrap)", category: "Burgers", cal: 240, pro: 16, carb: 11, fat: 17, sat: 5, sod: 730, sug: 7, fib: 2, chol: 40, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "in-n-out", name: "French Fries", category: "Sides", cal: 395, pro: 7, carb: 54, fat: 18, sat: 5, sod: 245, sug: 0, fib: 2, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "in-n-out", name: "Vanilla Shake", category: "Drinks & Desserts", cal: 590, pro: 13, carb: 86, fat: 23, sat: 14, sod: 270, sug: 68, fib: 0, chol: 90, veg: true, hal: false, gf: true, allergens: ["dairy"] },

      { slug: "shake-shack", name: "ShackBurger", category: "Burgers", cal: 560, pro: 29, carb: 40, fat: 34, sat: 14, sod: 870, sug: 8, fib: 2, chol: 100, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "shake-shack", name: "SmokeShack", category: "Burgers", cal: 610, pro: 32, carb: 40, fat: 38, sat: 16, sod: 1010, sug: 8, fib: 2, chol: 115, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","sesame"] },
      { slug: "shake-shack", name: "'Shroom Burger", category: "Burgers", cal: 590, pro: 21, carb: 45, fat: 40, sat: 14, sod: 730, sug: 8, fib: 3, chol: 60, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "shake-shack", name: "Chicken Shack", category: "Sandwiches", cal: 650, pro: 39, carb: 53, fat: 31, sat: 10, sod: 1490, sug: 8, fib: 3, chol: 125, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs","sesame"] },
      { slug: "shake-shack", name: "Crinkle Cut Fries", category: "Sides", cal: 420, pro: 6, carb: 60, fat: 19, sat: 5, sod: 670, sug: 0, fib: 5, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "shake-shack", name: "Vanilla Shake", category: "Drinks & Desserts", cal: 700, pro: 14, carb: 103, fat: 27, sat: 17, sod: 390, sug: 80, fib: 0, chol: 105, veg: true, hal: false, gf: true, allergens: ["dairy"] },

      // === PANERA BREAD ===
      { slug: "panera-bread", name: "Broccoli Cheddar Soup (Medium)", category: "Soups", cal: 360, pro: 15, carb: 29, fat: 22, sat: 11, sod: 1260, sug: 5, fib: 3, chol: 65, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "panera-bread", name: "Fuji Apple Chicken Salad (Full)", category: "Salads", cal: 560, pro: 30, carb: 57, fat: 24, sat: 5, sod: 1110, sug: 38, fib: 7, chol: 65, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","tree nuts"] },
      { slug: "panera-bread", name: "Frontega Chicken Panini", category: "Sandwiches", cal: 840, pro: 50, carb: 87, fat: 31, sat: 12, sod: 2620, sug: 9, fib: 5, chol: 115, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "panera-bread", name: "Avocado, Egg White & Spinach Sandwich", category: "Breakfast", cal: 440, pro: 20, carb: 56, fat: 15, sat: 3.5, sod: 680, sug: 4, fib: 8, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "panera-bread", name: "Green Goddess Cobb Salad with Chicken", category: "Salads", cal: 600, pro: 41, carb: 29, fat: 37, sat: 9, sod: 1550, sug: 6, fib: 9, chol: 175, veg: false, hal: false, gf: true, allergens: ["dairy","eggs","tree nuts"] },
      { slug: "panera-bread", name: "Cinnamon Crunch Bagel", category: "Bakery", cal: 420, pro: 11, carb: 84, fat: 6, sat: 0.5, sod: 430, sug: 27, fib: 3, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten"] },

      // === PANDA EXPRESS ===
      { slug: "panda-express", name: "Orange Chicken (1 serving)", category: "Entrees", cal: 420, pro: 15, carb: 43, fat: 21, sat: 5, sod: 620, sug: 19, fib: 1, chol: 90, veg: false, hal: false, gf: false, allergens: ["gluten","soy","eggs"] },
      { slug: "panda-express", name: "Kung Pao Chicken (1 serving)", category: "Entrees", cal: 290, pro: 17, carb: 19, fat: 17, sat: 3, sod: 840, sug: 8, fib: 2, chol: 80, veg: false, hal: false, gf: true, allergens: ["soy","peanuts","tree nuts"] },
      { slug: "panda-express", name: "Broccoli Beef (1 serving)", category: "Entrees", cal: 150, pro: 9, carb: 13, fat: 7, sat: 1.5, sod: 520, sug: 4, fib: 2, chol: 15, veg: false, hal: false, gf: true, allergens: ["soy"] },
      { slug: "panda-express", name: "Eggplant Tofu (1 serving)", category: "Entrees", cal: 310, pro: 8, carb: 32, fat: 18, sat: 2.5, sod: 680, sug: 17, fib: 4, chol: 0, veg: true, hal: false, gf: true, allergens: ["soy"] },
      { slug: "panda-express", name: "Fried Rice (1 serving)", category: "Sides", cal: 520, pro: 11, carb: 85, fat: 16, sat: 3, sod: 850, sug: 3, fib: 2, chol: 150, veg: false, hal: false, gf: true, allergens: ["soy","eggs"] },
      { slug: "panda-express", name: "Chow Mein (1 serving)", category: "Sides", cal: 510, pro: 13, carb: 80, fat: 15, sat: 2, sod: 860, sug: 8, fib: 6, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","soy"] },
      { slug: "panda-express", name: "Super Greens (1 serving)", category: "Sides", cal: 90, pro: 6, carb: 13, fat: 3, sat: 0, sod: 330, sug: 5, fib: 5, chol: 0, veg: true, hal: true, gf: true, allergens: [] },

      // === DUNKIN' ===
      { slug: "dunkin", name: "Medium Hot Coffee (black)", category: "Coffee", cal: 5, pro: 0, carb: 1, fat: 0, sat: 0, sod: 15, sug: 0, fib: 0, chol: 0, veg: true, hal: true, gf: true, allergens: [] },
      { slug: "dunkin", name: "Iced Caramel Latte (Medium)", category: "Cold Drinks", cal: 240, pro: 8, carb: 38, fat: 6, sat: 3.5, sod: 200, sug: 35, fib: 0, chol: 20, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "dunkin", name: "Glazed Donut", category: "Donuts", cal: 260, pro: 4, carb: 33, fat: 13, sat: 6, sod: 330, sug: 12, fib: 1, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","soy"] },
      { slug: "dunkin", name: "Bacon, Egg & Cheese Croissant", category: "Breakfast", cal: 480, pro: 20, carb: 33, fat: 31, sat: 14, sod: 940, sug: 6, fib: 1, chol: 215, veg: false, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "dunkin", name: "Wake-Up Wrap (Egg & Cheese)", category: "Breakfast", cal: 200, pro: 8, carb: 22, fat: 9, sat: 4, sod: 470, sug: 1, fib: 1, chol: 95, veg: true, hal: false, gf: false, allergens: ["gluten","dairy","eggs"] },
      { slug: "dunkin", name: "Matcha Latte (Medium)", category: "Cold Drinks", cal: 270, pro: 9, carb: 41, fat: 7, sat: 4, sod: 190, sug: 36, fib: 0, chol: 20, veg: true, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "dunkin", name: "Avocado Toast", category: "Snacks", cal: 270, pro: 8, carb: 32, fat: 14, sat: 2.5, sod: 610, sug: 3, fib: 6, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","soy"] },

      // === POPEYES ===
      { slug: "popeyes", name: "Classic Chicken Sandwich", category: "Sandwiches", cal: 700, pro: 28, carb: 50, fat: 42, sat: 9, sod: 1443, sug: 6, fib: 2, chol: 90, veg: false, hal: false, gf: false, allergens: ["gluten","eggs","dairy"] },
      { slug: "popeyes", name: "Spicy Chicken Sandwich", category: "Sandwiches", cal: 700, pro: 28, carb: 50, fat: 42, sat: 9, sod: 1443, sug: 6, fib: 2, chol: 90, veg: false, hal: false, gf: false, allergens: ["gluten","eggs","dairy"] },
      { slug: "popeyes", name: "3-Piece Chicken Tender (Handcrafted)", category: "Chicken", cal: 340, pro: 24, carb: 25, fat: 14, sat: 3, sod: 1020, sug: 1, fib: 1, chol: 55, veg: false, hal: false, gf: false, allergens: ["gluten","eggs"] },
      { slug: "popeyes", name: "Red Beans & Rice", category: "Sides", cal: 230, pro: 8, carb: 30, fat: 9, sat: 3.5, sod: 680, sug: 1, fib: 8, chol: 20, veg: false, hal: false, gf: true, allergens: [] },
      { slug: "popeyes", name: "Mashed Potatoes w/ Cajun Gravy", category: "Sides", cal: 110, pro: 2, carb: 18, fat: 4, sat: 1, sod: 590, sug: 0, fib: 2, chol: 0, veg: false, hal: false, gf: true, allergens: ["dairy"] },
      { slug: "popeyes", name: "Cajun Fries", category: "Sides", cal: 260, pro: 3, carb: 35, fat: 12, sat: 2, sod: 430, sug: 0, fib: 3, chol: 0, veg: true, hal: true, gf: true, allergens: [] },

      // === PIZZA HUT ===
      { slug: "pizza-hut", name: "Pepperoni Pan Pizza (1 slice, medium)", category: "Pizza", cal: 290, pro: 12, carb: 31, fat: 14, sat: 6, sod: 600, sug: 3, fib: 1, chol: 30, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "pizza-hut", name: "Cheese Pan Pizza (1 slice, medium)", category: "Pizza", cal: 240, pro: 10, carb: 30, fat: 10, sat: 4.5, sod: 490, sug: 3, fib: 1, chol: 20, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "pizza-hut", name: "Veggie Lovers Pan Pizza (1 slice)", category: "Pizza", cal: 230, pro: 9, carb: 30, fat: 9, sat: 4, sod: 480, sug: 3, fib: 2, chol: 15, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "pizza-hut", name: "Stuffed Crust Pepperoni (1 slice, large)", category: "Pizza", cal: 380, pro: 17, carb: 42, fat: 16, sat: 8, sod: 830, sug: 4, fib: 2, chol: 45, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "pizza-hut", name: "Meat Lover's Pan Pizza (1 slice)", category: "Pizza", cal: 360, pro: 18, carb: 30, fat: 20, sat: 8, sod: 800, sug: 2, fib: 1, chol: 50, veg: false, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "pizza-hut", name: "Breadsticks (5 piece)", category: "Sides", cal: 360, pro: 10, carb: 60, fat: 9, sat: 2.5, sod: 830, sug: 4, fib: 2, chol: 0, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
      { slug: "pizza-hut", name: "Cinnabon Mini Rolls (4 piece)", category: "Desserts", cal: 360, pro: 6, carb: 52, fat: 14, sat: 7, sod: 330, sug: 22, fib: 1, chol: 25, veg: true, hal: false, gf: false, allergens: ["gluten","dairy"] },
    ];

    for (const item of menuItems) {
      const rid = restIds[item.slug];
      if (!rid) continue;
      await client.query(
        `INSERT INTO menu_items 
          (restaurant_id, name, category, base_calories, base_protein_g, base_carbs_g, base_fat_g, base_saturated_fat_g, base_sodium_mg, base_sugar_g, base_fiber_g, base_cholesterol_mg, is_vegetarian, is_halal, is_gluten_free, allergens)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [rid, item.name, item.category, item.cal, item.pro, item.carb, item.fat, item.sat, item.sod, item.sug, item.fib, item.chol, item.veg, item.hal, item.gf, item.allergens]
      );
    }

    console.log("Seeding condiments...");

    // ─── CONDIMENTS ──────────────────────────────────────────────────────────
    const condiments = [
      // SAUCES & DRESSINGS
      { name: "Ketchup (1 packet)", category: "Sauce", brand: "Heinz", cal: 20, pro: 0, carb: 5, fat: 0, sat: 0, sod: 190, sug: 4, serving: "1 packet (14g)", sg: 14 },
      { name: "Yellow Mustard (1 packet)", category: "Sauce", brand: "French's", cal: 5, pro: 0, carb: 1, fat: 0, sat: 0, sod: 115, sug: 0, serving: "1 packet (7g)", sg: 7 },
      { name: "Mayonnaise (1 tbsp)", category: "Sauce", brand: "Hellmann's", cal: 90, pro: 0, carb: 0, fat: 10, sat: 1.5, sod: 90, sug: 0, serving: "1 tbsp (15g)", sg: 15 },
      { name: "Ranch Dressing (1 oz)", category: "Dressing", brand: "Hidden Valley", cal: 140, pro: 0, carb: 1, fat: 15, sat: 2.5, sod: 270, sug: 1, serving: "1 oz (30g)", sg: 30 },
      { name: "BBQ Sauce (1 packet)", category: "Sauce", brand: "Sweet Baby Ray's", cal: 45, pro: 0, carb: 11, fat: 0, sat: 0, sod: 290, sug: 10, serving: "1 oz (28g)", sg: 28 },
      { name: "Hot Sauce (1 tsp)", category: "Sauce", brand: "Tabasco", cal: 0, pro: 0, carb: 0, fat: 0, sat: 0, sod: 35, sug: 0, serving: "1 tsp (5g)", sg: 5 },
      { name: "Buffalo Sauce (1 oz)", category: "Sauce", brand: "Frank's RedHot", cal: 10, pro: 0, carb: 1, fat: 0, sat: 0, sod: 460, sug: 0, serving: "1 oz (30g)", sg: 30 },
      { name: "Sriracha (1 tsp)", category: "Sauce", brand: "Huy Fong", cal: 5, pro: 0, carb: 1, fat: 0, sat: 0, sod: 80, sug: 1, serving: "1 tsp (7g)", sg: 7 },
      { name: "Honey Mustard (1 packet)", category: "Sauce", brand: "Generic", cal: 60, pro: 0, carb: 8, fat: 3, sat: 0, sod: 120, sug: 7, serving: "1 packet (21g)", sg: 21 },
      { name: "Caesar Dressing (1 oz)", category: "Dressing", brand: "Cardini's", cal: 160, pro: 1, carb: 1, fat: 17, sat: 3, sod: 290, sug: 0, serving: "1 oz (28g)", sg: 28 },
      { name: "Balsamic Vinaigrette (1 oz)", category: "Dressing", brand: "Newman's Own", cal: 80, pro: 0, carb: 5, fat: 6, sat: 1, sod: 280, sug: 4, serving: "1 oz (28g)", sg: 28 },
      { name: "Thousand Island Dressing (1 oz)", category: "Dressing", brand: "Kraft", cal: 120, pro: 0, carb: 5, fat: 11, sat: 1.5, sod: 230, sug: 4, serving: "1 oz (28g)", sg: 28 },
      { name: "Guacamole (2 tbsp)", category: "Sauce", brand: "Wholly Guacamole", cal: 60, pro: 1, carb: 3, fat: 5, sat: 0.5, sod: 125, sug: 0, serving: "2 tbsp (30g)", sg: 30 },
      { name: "Sour Cream (2 tbsp)", category: "Dairy", brand: "Generic", cal: 60, pro: 1, carb: 2, fat: 5, sat: 3, sod: 15, sug: 1, serving: "2 tbsp (30g)", sg: 30 },
      { name: "Salsa (2 tbsp)", category: "Sauce", brand: "Tostitos", cal: 10, pro: 0, carb: 2, fat: 0, sat: 0, sod: 160, sug: 1, serving: "2 tbsp (30g)", sg: 30 },
      { name: "Chipotle Sauce (1 tbsp)", category: "Sauce", brand: "Generic", cal: 90, pro: 0, carb: 2, fat: 9, sat: 1.5, sod: 135, sug: 1, serving: "1 tbsp (15g)", sg: 15 },
      { name: "Teriyaki Sauce (1 tbsp)", category: "Sauce", brand: "Kikkoman", cal: 15, pro: 1, carb: 3, fat: 0, sat: 0, sod: 610, sug: 2, serving: "1 tbsp (18g)", sg: 18 },
      { name: "Soy Sauce (1 tsp)", category: "Sauce", brand: "Kikkoman", cal: 5, pro: 1, carb: 1, fat: 0, sat: 0, sod: 575, sug: 0, serving: "1 tsp (5g)", sg: 5 },
      { name: "Sweet & Sour Sauce (1 oz)", category: "Sauce", brand: "Generic", cal: 50, pro: 0, carb: 13, fat: 0, sat: 0, sod: 120, sug: 12, serving: "1 oz (28g)", sg: 28 },
      { name: "Aioli / Garlic Sauce (1 tbsp)", category: "Sauce", brand: "Generic", cal: 80, pro: 0, carb: 1, fat: 9, sat: 1.5, sod: 70, sug: 0, serving: "1 tbsp (15g)", sg: 15 },
      // TOPPINGS
      { name: "American Cheese (1 slice)", category: "Topping", brand: "Kraft Singles", cal: 60, pro: 3, carb: 2, fat: 4.5, sat: 3, sod: 280, sug: 1, serving: "1 slice (19g)", sg: 19, gf: true },
      { name: "Cheddar Cheese (1 slice)", category: "Topping", brand: "Generic", cal: 70, pro: 4, carb: 1, fat: 5, sat: 3.5, sod: 120, sug: 0, serving: "1 slice (19g)", sg: 19, gf: true },
      { name: "Swiss Cheese (1 slice)", category: "Topping", brand: "Generic", cal: 80, pro: 5, carb: 1, fat: 6, sat: 3.5, sod: 60, sug: 0, serving: "1 slice (19g)", sg: 19, gf: true },
      { name: "Pepper Jack Cheese (1 slice)", category: "Topping", brand: "Tillamook", cal: 70, pro: 4, carb: 0, fat: 6, sat: 3.5, sod: 160, sug: 0, serving: "1 slice (19g)", sg: 19, gf: true },
      { name: "Bacon (2 strips)", category: "Topping", brand: "Generic", cal: 80, pro: 6, carb: 0, fat: 6, sat: 2, sod: 310, sug: 0, serving: "2 strips (18g)", sg: 18, gf: true },
      { name: "Crispy Onions (1 tbsp)", category: "Topping", brand: "French's", cal: 45, pro: 1, carb: 6, fat: 2, sat: 0, sod: 60, sug: 1, serving: "1 tbsp (7g)", sg: 7 },
      { name: "Jalapeños (1 oz pickled)", category: "Topping", brand: "Generic", cal: 10, pro: 0, carb: 2, fat: 0, sat: 0, sod: 560, sug: 1, serving: "1 oz (28g)", sg: 28, gf: true },
      { name: "Pickles (3 slices)", category: "Topping", brand: "Vlasic", cal: 5, pro: 0, carb: 1, fat: 0, sat: 0, sod: 260, sug: 0, serving: "3 slices (28g)", sg: 28, gf: true },
      { name: "Lettuce (1 leaf)", category: "Topping", brand: "Fresh", cal: 2, pro: 0, carb: 0, fat: 0, sat: 0, sod: 2, sug: 0, serving: "1 leaf (10g)", sg: 10, gf: true },
      { name: "Tomato (2 slices)", category: "Topping", brand: "Fresh", cal: 10, pro: 0, carb: 2, fat: 0, sat: 0, sod: 5, sug: 1, serving: "2 slices (40g)", sg: 40, gf: true },
      { name: "Onion (3 rings, raw)", category: "Topping", brand: "Fresh", cal: 10, pro: 0, carb: 2, fat: 0, sat: 0, sod: 0, sug: 1, serving: "3 rings (28g)", sg: 28, gf: true },
      { name: "Avocado (1/4 avocado)", category: "Topping", brand: "Fresh", cal: 80, pro: 1, carb: 4, fat: 7, sat: 1, sod: 5, sug: 0, serving: "1/4 avocado (50g)", sg: 50, gf: true },
      { name: "Egg (fried)", category: "Topping", brand: "Generic", cal: 90, pro: 6, carb: 0, fat: 7, sat: 2, sod: 65, sug: 0, serving: "1 large egg (46g)", sg: 46, gf: true },
      { name: "Mushrooms (sauteed, 1 oz)", category: "Topping", brand: "Generic", cal: 15, pro: 1, carb: 2, fat: 0.5, sat: 0, sod: 5, sug: 1, serving: "1 oz (28g)", sg: 28, gf: true },
      // BREADS & WRAPPERS
      { name: "Whole Wheat Bun", category: "Bread", brand: "Generic", cal: 140, pro: 6, carb: 26, fat: 2, sat: 0, sod: 230, sug: 4, serving: "1 bun (57g)", sg: 57 },
      { name: "Gluten-Free Bun", category: "Bread", brand: "Udi's", cal: 170, pro: 3, carb: 32, fat: 4, sat: 0.5, sod: 290, sug: 4, serving: "1 bun (70g)", sg: 70, gf: true },
      { name: "Lettuce Wrap (instead of bun)", category: "Bread", brand: "Fresh", cal: 5, pro: 0, carb: 1, fat: 0, sat: 0, sod: 5, sug: 0, serving: "2 leaves (40g)", sg: 40, gf: true },
      // EXTRAS
      { name: "Maple Syrup (1 tbsp)", category: "Sweet", brand: "Log Cabin", cal: 50, pro: 0, carb: 13, fat: 0, sat: 0, sod: 0, sug: 12, serving: "1 tbsp (20g)", sg: 20, gf: true },
      { name: "Honey (1 packet)", category: "Sweet", brand: "Generic", cal: 60, pro: 0, carb: 17, fat: 0, sat: 0, sod: 0, sug: 16, serving: "1 packet (21g)", sg: 21, gf: true },
      { name: "Butter (1 pat)", category: "Dairy", brand: "Generic", cal: 35, pro: 0, carb: 0, fat: 4, sat: 2.5, sod: 30, sug: 0, serving: "1 pat (5g)", sg: 5, gf: true },
      { name: "Olive Oil (1 tsp)", category: "Oil", brand: "Generic", cal: 40, pro: 0, carb: 0, fat: 4.5, sat: 0.5, sod: 0, sug: 0, serving: "1 tsp (5g)", sg: 5, gf: true },
      { name: "Extra Patty (beef)", category: "Protein", brand: "Generic", cal: 220, pro: 14, carb: 0, fat: 18, sat: 7, sod: 55, sug: 0, serving: "1 patty (85g)", sg: 85, gf: true },
      { name: "Extra Grilled Chicken", category: "Protein", brand: "Generic", cal: 130, pro: 25, carb: 0, fat: 3, sat: 0.5, sod: 340, sug: 0, serving: "3 oz (85g)", sg: 85, gf: true },
    ];

    for (const c of condiments) {
      await client.query(
        `INSERT INTO condiments (name, category, brand, calories, protein_g, carbs_g, fat_g, saturated_fat_g, sodium_mg, sugar_g, serving_size, serving_size_g, is_gluten_free, is_generic)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [c.name, c.category, c.brand, c.cal, c.pro, c.carb, c.fat, c.sat, c.sod, c.sug, c.serving, c.sg, c.gf !== false, true]
      );
    }

    await client.query("COMMIT");
    console.log("Seeding complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed error:", err);
    throw err;
  } finally {
    client.release();
  }
}
