import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function createSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(100),
      headquarters VARCHAR(255),
      country VARCHAR(100) DEFAULT 'USA',
      description TEXT,
      logo_emoji VARCHAR(20),
      logo_color VARCHAR(20),
      website VARCHAR(255),
      dietary_options TEXT[] DEFAULT '{}',
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      description TEXT,
      base_calories INTEGER DEFAULT 0,
      base_protein_g DECIMAL(8,2) DEFAULT 0,
      base_carbs_g DECIMAL(8,2) DEFAULT 0,
      base_fat_g DECIMAL(8,2) DEFAULT 0,
      base_saturated_fat_g DECIMAL(8,2) DEFAULT 0,
      base_sodium_mg DECIMAL(8,2) DEFAULT 0,
      base_sugar_g DECIMAL(8,2) DEFAULT 0,
      base_fiber_g DECIMAL(8,2) DEFAULT 0,
      base_cholesterol_mg DECIMAL(8,2) DEFAULT 0,
      serving_size_g DECIMAL(8,2),
      is_vegan BOOLEAN DEFAULT false,
      is_vegetarian BOOLEAN DEFAULT false,
      is_halal BOOLEAN DEFAULT false,
      is_gluten_free BOOLEAN DEFAULT false,
      is_dairy_free BOOLEAN DEFAULT false,
      is_nut_free BOOLEAN DEFAULT false,
      is_spicy BOOLEAN DEFAULT false,
      allergens TEXT[] DEFAULT '{}',
      ingredients_note TEXT,
      data_source VARCHAR(255) DEFAULT 'Official nutrition guide',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS condiments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      brand VARCHAR(255),
      description TEXT,
      calories INTEGER DEFAULT 0,
      protein_g DECIMAL(8,2) DEFAULT 0,
      carbs_g DECIMAL(8,2) DEFAULT 0,
      fat_g DECIMAL(8,2) DEFAULT 0,
      saturated_fat_g DECIMAL(8,2) DEFAULT 0,
      sodium_mg DECIMAL(8,2) DEFAULT 0,
      sugar_g DECIMAL(8,2) DEFAULT 0,
      serving_size VARCHAR(100),
      serving_size_g DECIMAL(8,2),
      is_vegan BOOLEAN DEFAULT true,
      is_gluten_free BOOLEAN DEFAULT true,
      is_generic BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS restaurant_condiments (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      condiment_id INTEGER REFERENCES condiments(id) ON DELETE CASCADE,
      is_house_brand BOOLEAN DEFAULT false,
      brand_name VARCHAR(255),
      notes TEXT,
      UNIQUE(restaurant_id, condiment_id)
    );

    CREATE TABLE IF NOT EXISTS menu_item_modifications (
      id SERIAL PRIMARY KEY,
      menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      mod_type VARCHAR(50) NOT NULL,
      calories_delta INTEGER DEFAULT 0,
      protein_delta DECIMAL(8,2) DEFAULT 0,
      carbs_delta DECIMAL(8,2) DEFAULT 0,
      fat_delta DECIMAL(8,2) DEFAULT 0,
      sodium_delta DECIMAL(8,2) DEFAULT 0,
      is_default BOOLEAN DEFAULT true,
      category VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS restaurant_locations (
      id SERIAL PRIMARY KEY,
      restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
      city VARCHAR(150) NOT NULL,
      province_state VARCHAR(100) NOT NULL,
      country VARCHAR(100) NOT NULL DEFAULT 'Canada',
      neighborhood VARCHAR(200) DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(restaurant_id, city, province_state, country, neighborhood)
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS saved_meals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      name TEXT NOT NULL DEFAULT 'My Meal',
      total_calories INTEGER NOT NULL DEFAULT 0,
      total_protein_g DECIMAL(8,2) NOT NULL DEFAULT 0,
      total_carbs_g DECIMAL(8,2) NOT NULL DEFAULT 0,
      total_fat_g DECIMAL(8,2) NOT NULL DEFAULT 0,
      total_sodium_mg DECIMAL(8,2) NOT NULL DEFAULT 0,
      total_sugar_g DECIMAL(8,2) NOT NULL DEFAULT 0,
      total_fiber_g DECIMAL(8,2) NOT NULL DEFAULT 0,
      restaurant_names TEXT[] DEFAULT '{}',
      items JSONB NOT NULL DEFAULT '[]',
      notes TEXT,
      saved_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
    CREATE INDEX IF NOT EXISTS idx_condiments_category ON condiments(category);
    CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
    CREATE INDEX IF NOT EXISTS idx_locations_city ON restaurant_locations(city);
    CREATE INDEX IF NOT EXISTS idx_locations_restaurant ON restaurant_locations(restaurant_id);
    CREATE INDEX IF NOT EXISTS idx_saved_meals_user ON saved_meals(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
}
