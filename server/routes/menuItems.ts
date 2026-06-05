import { Router, Request, Response } from "express";
import { pool } from "../db/schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { restaurant_id, restaurant_slug, category, search, dietary, vegan, vegetarian, halal, gluten_free } = req.query;
    
    let query = `
      SELECT mi.*, r.name AS restaurant_name, r.slug AS restaurant_slug, r.logo_emoji, r.logo_color
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let idx = 1;

    if (restaurant_id) {
      query += ` AND mi.restaurant_id = $${idx}`;
      params.push(Number(restaurant_id));
      idx++;
    }
    if (restaurant_slug) {
      query += ` AND r.slug = $${idx}`;
      params.push(String(restaurant_slug));
      idx++;
    }
    if (category) {
      query += ` AND mi.category = $${idx}`;
      params.push(String(category));
      idx++;
    }
    if (search) {
      query += ` AND LOWER(mi.name) LIKE $${idx}`;
      params.push(`%${String(search).toLowerCase()}%`);
      idx++;
    }
    if (vegan === "true") {
      query += ` AND mi.is_vegan = true`;
    }
    if (vegetarian === "true") {
      query += ` AND mi.is_vegetarian = true`;
    }
    if (halal === "true") {
      query += ` AND mi.is_halal = true`;
    }
    if (gluten_free === "true") {
      query += ` AND mi.is_gluten_free = true`;
    }

    query += ` ORDER BY mi.category, mi.name`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

router.get("/categories", async (req: Request, res: Response) => {
  try {
    const { restaurant_slug } = req.query;
    let query = `
      SELECT DISTINCT mi.category
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    if (restaurant_slug) {
      query += ` AND r.slug = $1`;
      params.push(String(restaurant_slug));
    }
    query += ` ORDER BY mi.category`;
    const result = await pool.query(query, params);
    res.json(result.rows.map((r) => r.category));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT mi.*, r.name AS restaurant_name, r.slug AS restaurant_slug, r.logo_emoji, r.logo_color
       FROM menu_items mi
       JOIN restaurants r ON mi.restaurant_id = r.id
       WHERE mi.id = $1`,
      [Number(req.params.id)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
});

export default router;
