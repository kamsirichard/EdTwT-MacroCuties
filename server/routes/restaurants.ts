import { Router, Request, Response } from "express";
import { pool } from "../db/schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, category, dietary, featured } = req.query;
    let query = `SELECT * FROM restaurants WHERE 1=1`;
    const params: unknown[] = [];
    let idx = 1;

    if (search) {
      query += ` AND (LOWER(name) LIKE $${idx} OR LOWER(category) LIKE $${idx})`;
      params.push(`%${String(search).toLowerCase()}%`);
      idx++;
    }
    if (category) {
      query += ` AND category = $${idx}`;
      params.push(String(category));
      idx++;
    }
    if (dietary) {
      query += ` AND $${idx} = ANY(dietary_options)`;
      params.push(String(dietary));
      idx++;
    }
    if (featured === "true") {
      query += ` AND is_featured = true`;
    }

    query += ` ORDER BY is_featured DESC, name ASC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category FROM restaurants ORDER BY category`
    );
    res.json(result.rows.map((r) => r.category));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM restaurants) AS total_restaurants,
        (SELECT COUNT(*) FROM menu_items) AS total_items,
        (SELECT COUNT(*) FROM condiments) AS total_condiments,
        (SELECT COUNT(DISTINCT category) FROM restaurants) AS total_categories
    `);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT * FROM restaurants WHERE slug = $1`,
      [req.params.slug]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

export default router;
