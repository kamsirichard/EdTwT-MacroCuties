import { pool } from "./schema";

export async function seedCondimentExtras() {
  const client = await pool.connect();
  try {
    const existing = await client.query(
      `SELECT COUNT(*) FROM condiments WHERE category IN ('Coffee Extra', 'Drink', 'Brand Sauce')`
    );
    if (parseInt(existing.rows[0].count) > 0) {
      console.log("Condiment extras already seeded, skipping...");
      return;
    }

    console.log("Seeding condiment extras...");
    await client.query("BEGIN");

    const extras = [
      // ── Coffee Extras ──────────────────────────────────────────────────────
      { name: "White Sugar (1 packet)", category: "Coffee Extra", brand: "Generic", description: "Single white sugar packet, 4g", calories: 16, protein_g: 0, carbs_g: 4, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 4, serving_size: "1 packet (4g)", serving_size_g: 4, is_vegan: true, is_gf: true },
      { name: "White Sugar (2 packets)", category: "Coffee Extra", brand: "Generic", description: "Two white sugar packets, 8g", calories: 32, protein_g: 0, carbs_g: 8, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 8, serving_size: "2 packets (8g)", serving_size_g: 8, is_vegan: true, is_gf: true },
      { name: "Brown Sugar (1 packet)", category: "Coffee Extra", brand: "Generic", description: "Single brown sugar packet, 4g", calories: 17, protein_g: 0, carbs_g: 4.5, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 4.5, serving_size: "1 packet (4g)", serving_size_g: 4, is_vegan: true, is_gf: true },
      { name: "Honey Packet", category: "Coffee Extra", brand: "Generic", description: "Single honey packet, 7g", calories: 21, protein_g: 0, carbs_g: 5.9, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 5.7, serving_size: "1 packet (7g)", serving_size_g: 7, is_vegan: false, is_gf: true },
      { name: "18% Cream", category: "Coffee Extra", brand: "Beatrice", description: "Two tablespoons of 18% (coffee) cream", calories: 40, protein_g: 0.8, carbs_g: 0.7, fat_g: 4, sat: 2.5, sodium_mg: 15, sugar_g: 0.7, serving_size: "2 tbsp (30ml)", serving_size_g: 30, is_vegan: false, is_gf: true },
      { name: "Half & Half Cream", category: "Coffee Extra", brand: "Generic", description: "Two tablespoons of half-and-half cream", calories: 20, protein_g: 0.6, carbs_g: 1.3, fat_g: 1.7, sat: 1, sodium_mg: 15, sugar_g: 0.7, serving_size: "2 tbsp (30ml)", serving_size_g: 30, is_vegan: false, is_gf: true },
      { name: "Non-Dairy Creamer", category: "Coffee Extra", brand: "Coffee Mate", description: "2 tablespoons liquid creamer", calories: 25, protein_g: 0, carbs_g: 4, fat_g: 1, sat: 0.5, sodium_mg: 20, sugar_g: 2, serving_size: "2 tbsp (30ml)", serving_size_g: 30, is_vegan: true, is_gf: true },
      { name: "Oat Milk Splash", category: "Coffee Extra", brand: "Oatly", description: "2 oz oat milk in coffee", calories: 15, protein_g: 0.3, carbs_g: 2, fat_g: 0.5, sat: 0, sodium_mg: 30, sugar_g: 0.5, serving_size: "2 oz (60ml)", serving_size_g: 60, is_vegan: true, is_gf: false },
      { name: "Almond Milk Splash", category: "Coffee Extra", brand: "Silk", description: "2 oz almond milk in coffee", calories: 8, protein_g: 0.2, carbs_g: 0.5, fat_g: 0.5, sat: 0, sodium_mg: 40, sugar_g: 0, serving_size: "2 oz (60ml)", serving_size_g: 60, is_vegan: true, is_gf: true },
      { name: "Soy Milk Splash", category: "Coffee Extra", brand: "Silk", description: "2 oz soy milk in coffee", calories: 15, protein_g: 1, carbs_g: 1.5, fat_g: 0.7, sat: 0.1, sodium_mg: 20, sugar_g: 0.5, serving_size: "2 oz (60ml)", serving_size_g: 60, is_vegan: true, is_gf: true },
      { name: "Vanilla Syrup (1 pump)", category: "Coffee Extra", brand: "Starbucks", description: "One pump of vanilla syrup", calories: 20, protein_g: 0, carbs_g: 5, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 5, serving_size: "1 pump (10ml)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Caramel Syrup (1 pump)", category: "Coffee Extra", brand: "Starbucks", description: "One pump of caramel syrup", calories: 20, protein_g: 0, carbs_g: 5, fat_g: 0, sat: 0, sodium_mg: 5, sugar_g: 5, serving_size: "1 pump (10ml)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Hazelnut Syrup (1 pump)", category: "Coffee Extra", brand: "Torani", description: "One pump of hazelnut syrup", calories: 20, protein_g: 0, carbs_g: 5, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 5, serving_size: "1 pump (10ml)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Sugar-Free Vanilla (1 pump)", category: "Coffee Extra", brand: "Starbucks", description: "One pump sugar-free vanilla syrup", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 0, serving_size: "1 pump (10ml)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Cinnamon Syrup (1 pump)", category: "Coffee Extra", brand: "Torani", description: "One pump of cinnamon syrup", calories: 20, protein_g: 0, carbs_g: 5, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 5, serving_size: "1 pump (10ml)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Whipped Cream", category: "Coffee Extra", brand: "Generic", description: "Whipped cream topping", calories: 60, protein_g: 0.5, carbs_g: 2, fat_g: 6, sat: 3.5, sodium_mg: 10, sugar_g: 1, serving_size: "2 tbsp (15g)", serving_size_g: 15, is_vegan: false, is_gf: true },

      // ── Drinks ─────────────────────────────────────────────────────────────
      { name: "Water, Bottled (500ml)", category: "Drink", brand: "Generic", description: "Plain bottled water", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 0, sugar_g: 0, serving_size: "500ml", serving_size_g: 500, is_vegan: true, is_gf: true },
      { name: "Diet Cola (355ml)", category: "Drink", brand: "Generic", description: "Diet cola — zero sugar, zero calories", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 40, sugar_g: 0, serving_size: "355ml can", serving_size_g: 355, is_vegan: true, is_gf: true },
      { name: "Regular Cola, Small (355ml)", category: "Drink", brand: "Coca-Cola", description: "Regular cola, small cup or can", calories: 140, protein_g: 0, carbs_g: 39, fat_g: 0, sat: 0, sodium_mg: 45, sugar_g: 39, serving_size: "355ml", serving_size_g: 355, is_vegan: true, is_gf: true },
      { name: "Regular Cola, Medium (473ml)", category: "Drink", brand: "Coca-Cola", description: "Regular cola, medium cup", calories: 180, protein_g: 0, carbs_g: 50, fat_g: 0, sat: 0, sodium_mg: 55, sugar_g: 50, serving_size: "473ml", serving_size_g: 473, is_vegan: true, is_gf: true },
      { name: "Lemonade, Small", category: "Drink", brand: "Generic", description: "Lemonade small cup", calories: 130, protein_g: 0, carbs_g: 34, fat_g: 0, sat: 0, sodium_mg: 10, sugar_g: 32, serving_size: "355ml", serving_size_g: 355, is_vegan: true, is_gf: true },
      { name: "Orange Juice, Small (236ml)", category: "Drink", brand: "Tropicana", description: "Pure orange juice, small cup", calories: 110, protein_g: 2, carbs_g: 26, fat_g: 0, sat: 0, sodium_mg: 2, sugar_g: 22, serving_size: "236ml", serving_size_g: 236, is_vegan: true, is_gf: true },
      { name: "Apple Juice Box (200ml)", category: "Drink", brand: "Mott's", description: "Apple juice box", calories: 90, protein_g: 0, carbs_g: 23, fat_g: 0, sat: 0, sodium_mg: 15, sugar_g: 21, serving_size: "200ml", serving_size_g: 200, is_vegan: true, is_gf: true },
      { name: "Chocolate Milk, Small (236ml)", category: "Drink", brand: "Beatrice", description: "Chocolate milk small carton", calories: 150, protein_g: 8, carbs_g: 25, fat_g: 3, sat: 1.5, sodium_mg: 150, sugar_g: 23, serving_size: "236ml", serving_size_g: 236, is_vegan: false, is_gf: true },
      { name: "2% Milk, Small (236ml)", category: "Drink", brand: "Natrel", description: "2% white milk small carton", calories: 120, protein_g: 8, carbs_g: 11, fat_g: 4.5, sat: 3, sodium_mg: 115, sugar_g: 11, serving_size: "236ml", serving_size_g: 236, is_vegan: false, is_gf: true },
      { name: "Iced Tea, Unsweetened (355ml)", category: "Drink", brand: "Generic", description: "Unsweetened brewed iced tea", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 5, sugar_g: 0, serving_size: "355ml", serving_size_g: 355, is_vegan: true, is_gf: true },
      { name: "Iced Tea, Sweetened (355ml)", category: "Drink", brand: "Nestea", description: "Sweetened iced tea", calories: 120, protein_g: 0, carbs_g: 30, fat_g: 0, sat: 0, sodium_mg: 5, sugar_g: 30, serving_size: "355ml", serving_size_g: 355, is_vegan: true, is_gf: true },
      { name: "Sparkling Water (355ml)", category: "Drink", brand: "Perrier", description: "Plain sparkling water, zero calories", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 5, sugar_g: 0, serving_size: "355ml", serving_size_g: 355, is_vegan: true, is_gf: true },

      // ── Branded Sauces ─────────────────────────────────────────────────────
      { name: "Heinz Ketchup Packet", category: "Brand Sauce", brand: "Heinz", description: "Standard Heinz ketchup single packet", calories: 10, protein_g: 0, carbs_g: 2.5, fat_g: 0, sat: 0, sodium_mg: 90, sugar_g: 2, serving_size: "1 packet (10g)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Heinz Ketchup (1 tbsp)", category: "Brand Sauce", brand: "Heinz", description: "Heinz tomato ketchup, tablespoon", calories: 20, protein_g: 0, carbs_g: 5, fat_g: 0, sat: 0, sodium_mg: 160, sugar_g: 4, serving_size: "1 tbsp (17g)", serving_size_g: 17, is_vegan: true, is_gf: true },
      { name: "McDonald's Ketchup Packet", category: "Brand Sauce", brand: "McDonald's / Heinz", description: "McDonald's branded ketchup packet", calories: 10, protein_g: 0, carbs_g: 2.5, fat_g: 0, sat: 0, sodium_mg: 95, sugar_g: 2, serving_size: "1 packet (10g)", serving_size_g: 10, is_vegan: true, is_gf: true },
      { name: "Whataburger Fancy Ketchup", category: "Brand Sauce", brand: "Whataburger", description: "Whataburger's signature spiced ketchup", calories: 15, protein_g: 0, carbs_g: 3.5, fat_g: 0, sat: 0, sodium_mg: 115, sugar_g: 3, serving_size: "1 packet (17g)", serving_size_g: 17, is_vegan: true, is_gf: true },
      { name: "Hellmann's Real Mayonnaise", category: "Brand Sauce", brand: "Hellmann's", description: "Hellmann's classic mayo, tablespoon", calories: 90, protein_g: 0, carbs_g: 0, fat_g: 10, sat: 1.5, sodium_mg: 80, sugar_g: 0, serving_size: "1 tbsp (14g)", serving_size_g: 14, is_vegan: false, is_gf: true },
      { name: "Miracle Whip", category: "Brand Sauce", brand: "Kraft", description: "Kraft Miracle Whip dressing", calories: 35, protein_g: 0, carbs_g: 2, fat_g: 3, sat: 0.5, sodium_mg: 105, sugar_g: 1.5, serving_size: "1 tbsp (14g)", serving_size_g: 14, is_vegan: false, is_gf: true },
      { name: "Frank's RedHot Original", category: "Brand Sauce", brand: "Frank's RedHot", description: "Classic hot sauce, teaspoon", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 190, sugar_g: 0, serving_size: "1 tsp (5ml)", serving_size_g: 5, is_vegan: true, is_gf: true },
      { name: "Tabasco Red Pepper Sauce", category: "Brand Sauce", brand: "Tabasco", description: "Original Tabasco hot sauce", calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sat: 0, sodium_mg: 35, sugar_g: 0, serving_size: "1 tsp (5ml)", serving_size_g: 5, is_vegan: true, is_gf: true },
      { name: "Chick-fil-A Sauce", category: "Brand Sauce", brand: "Chick-fil-A", description: "Signature Chick-fil-A dipping sauce", calories: 140, protein_g: 0, carbs_g: 7, fat_g: 13, sat: 2, sodium_mg: 170, sugar_g: 6, serving_size: "1 packet (28g)", serving_size_g: 28, is_vegan: false, is_gf: true },
      { name: "Chick-fil-A Polynesian Sauce", category: "Brand Sauce", brand: "Chick-fil-A", description: "Sweet and tangy Polynesian dipping sauce", calories: 110, protein_g: 0, carbs_g: 13, fat_g: 6, sat: 1, sodium_mg: 210, sugar_g: 13, serving_size: "1 packet (28g)", serving_size_g: 28, is_vegan: true, is_gf: true },
      { name: "Big Mac Sauce (Packet)", category: "Brand Sauce", brand: "McDonald's", description: "McDonald's signature Big Mac sauce", calories: 70, protein_g: 0, carbs_g: 2, fat_g: 7, sat: 1, sodium_mg: 130, sugar_g: 1.5, serving_size: "1 packet (21g)", serving_size_g: 21, is_vegan: false, is_gf: true },
      { name: "KFC Gravy (Side Cup)", category: "Brand Sauce", brand: "KFC", description: "KFC signature gravy, small cup", calories: 110, protein_g: 2, carbs_g: 11, fat_g: 6, sat: 1, sodium_mg: 630, sugar_g: 0, serving_size: "side cup (76g)", serving_size_g: 76, is_vegan: false, is_gf: false },
      { name: "Swiss Chalet Dipping Sauce", category: "Brand Sauce", brand: "Swiss Chalet", description: "Swiss Chalet signature chicken dipping sauce", calories: 25, protein_g: 1, carbs_g: 3, fat_g: 1, sat: 0, sodium_mg: 380, sugar_g: 0.5, serving_size: "60ml cup", serving_size_g: 60, is_vegan: false, is_gf: true },
      { name: "Tim Hortons Butter Pat", category: "Brand Sauce", brand: "Tim Hortons", description: "Single butter pat for baked goods", calories: 36, protein_g: 0, carbs_g: 0, fat_g: 4, sat: 2.5, sodium_mg: 35, sugar_g: 0, serving_size: "5g pat", serving_size_g: 5, is_vegan: false, is_gf: true },
      { name: "Harvey's House Sauce", category: "Brand Sauce", brand: "Harvey's", description: "Harvey's signature burger sauce", calories: 50, protein_g: 0, carbs_g: 2, fat_g: 5, sat: 0.5, sodium_mg: 95, sugar_g: 1.5, serving_size: "1 portion (14g)", serving_size_g: 14, is_vegan: false, is_gf: true },
      { name: "A&W Teen Sauce", category: "Brand Sauce", brand: "A&W", description: "A&W signature Teen Burger sauce", calories: 45, protein_g: 0, carbs_g: 1.5, fat_g: 4.5, sat: 0.5, sodium_mg: 80, sugar_g: 1, serving_size: "1 portion (14g)", serving_size_g: 14, is_vegan: false, is_gf: true },
    ];

    for (const c of extras) {
      await client.query(
        `INSERT INTO condiments
         (name, category, brand, description, calories, protein_g, carbs_g, fat_g, saturated_fat_g,
          sodium_mg, sugar_g, serving_size, serving_size_g, is_vegan, is_gluten_free, is_generic)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,false)`,
        [c.name, c.category, c.brand, c.description, c.calories, c.protein_g, c.carbs_g,
         c.fat_g, c.sat, c.sodium_mg, c.sugar_g, c.serving_size, c.serving_size_g,
         c.is_vegan, c.is_gf]
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${extras.length} condiment extras.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to seed condiment extras:", err);
  } finally {
    client.release();
  }
}
