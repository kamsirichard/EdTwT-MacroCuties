import { Router, Request, Response } from "express";
import { pool } from "../db/schema";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, category, dietary, featured, city, neighborhood } = req.query;

    const params: unknown[] = [];
    let idx = 1;
    let localJoin = "";
    let localSelect = "false AS available_locally";
    let whereClause = "WHERE 1=1";

    if (city) {
      const hoodFilter =
        neighborhood
          ? `AND LOWER(rl.neighborhood) = LOWER($${idx + 1})`
          : "";

      localJoin = `
        LEFT JOIN (
          SELECT DISTINCT restaurant_id
          FROM restaurant_locations
          WHERE LOWER(city) = LOWER($${idx})
          ${hoodFilter}
        ) loc ON r.id = loc.restaurant_id
      `;
      localSelect = "CASE WHEN loc.restaurant_id IS NOT NULL THEN true ELSE false END AS available_locally";

      params.push(String(city));
      idx++;
      if (neighborhood) {
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

    const orderClause = city
      ? `ORDER BY available_locally DESC, r.is_featured DESC, r.name ASC`
      : `ORDER BY r.is_featured DESC, r.name ASC`;

    const query = `
      SELECT r.*, ${localSelect}
      FROM restaurants r
      ${localJoin}
      ${whereClause}
      ${orderClause}
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
