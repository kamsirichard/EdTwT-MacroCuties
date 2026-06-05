import { Router, Request, Response } from "express";
import { pool } from "../db/schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search, gluten_free } = req.query;
    let query = `SELECT * FROM condiments WHERE 1=1`;
    const params: unknown[] = [];
    let idx = 1;

    if (category) {
      query += ` AND category = $${idx}`;
      params.push(String(category));
      idx++;
    }
    if (search) {
      query += ` AND (LOWER(name) LIKE $${idx} OR LOWER(brand) LIKE $${idx})`;
      params.push(`%${String(search).toLowerCase()}%`);
      idx++;
    }
    if (gluten_free === "true") {
      query += ` AND is_gluten_free = true`;
    }

    query += ` ORDER BY category, name`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch condiments" });
  }
});

router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category FROM condiments ORDER BY category`
    );
    res.json(result.rows.map((r) => r.category));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch condiment categories" });
  }
});

export default router;
