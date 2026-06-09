import { Router, Request, Response } from "express";
import { pool } from "../db/schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, category, dietary, featured, city, neighborhood } = req.query;

    const params: unknown[] = [];
    let idx = 1;
    let joinClause = "";
    let whereClause = "WHERE 1=1";

    if (city) {
      joinClause = `JOIN restaurant_locations rl ON r.id = rl.restaurant_id`;
      whereClause += ` AND LOWER(rl.city) = LOWER($${idx})`;
      params.push(String(city));
      idx++;

      if (neighborhood) {
        whereClause += ` AND LOWER(rl.neighborhood) = LOWER($${idx})`;
        params.push(String(neighborhood));
        idx++;
      }
    }

    if (search) {
      whereClause += ` AND (LOWER(r.name) LIKE $${idx} OR LOWER(r.category) LIKE $${idx})`;
      params.push(`%${String(search).toLowerCase()}%`);
      idx++;
    }
    if (category) {
      whereClause += ` AND r.category = $${idx}`;
      params.push(String(category));
      idx++;
    }
    if (dietary) {
      whereClause += ` AND $${idx} = ANY(r.dietary_options)`;
      params.push(String(dietary));
      idx++;
    }
    if (featured === "true") {
      whereClause += ` AND r.is_featured = true`;
    }

    const query = `
      SELECT DISTINCT r.*
      FROM restaurants r
      ${joinClause}
      ${whereClause}
      ORDER BY r.is_featured DESC, r.name ASC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

router.get("/locations", async (_req: Request, res: Response) => {
  try {
    const citiesRes = await pool.query(`
      SELECT
        rl.city,
        rl.province_state,
        rl.country,
        COUNT(DISTINCT rl.restaurant_id) AS chain_count
      FROM restaurant_locations rl
      GROUP BY rl.city, rl.province_state, rl.country
      ORDER BY rl.country ASC, chain_count DESC, rl.city ASC
    `);

    const hoodRes = await pool.query(`
      SELECT DISTINCT neighborhood
      FROM restaurant_locations
      WHERE city = 'Toronto' AND neighborhood != ''
      ORDER BY neighborhood ASC
    `);

    const canada = citiesRes.rows.filter((r) => r.country === "Canada");
    const usa = citiesRes.rows.filter((r) => r.country === "USA");

    res.json({
      canada,
      usa,
      toronto_neighborhoods: hoodRes.rows.map((r) => r.neighborhood),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch locations" });
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
        (SELECT COUNT(DISTINCT category) FROM restaurants) AS total_categories,
        (SELECT COUNT(DISTINCT city) FROM restaurant_locations) AS total_cities
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

    const restaurant = result.rows[0];

    const locsRes = await pool.query(
      `SELECT city, province_state, country, neighborhood
       FROM restaurant_locations
       WHERE restaurant_id = $1
       ORDER BY country ASC, city ASC, neighborhood ASC`,
      [restaurant.id]
    );
    restaurant.locations = locsRes.rows;

    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
});

export default router;
