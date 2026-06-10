import { Router, Request, Response } from "express";
import { pool } from "../db/schema";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, result, mealItems } = req.body;
    if (!result || !result.totals) {
      return res.status(400).json({ error: "Missing meal result data" });
    }

    const { totals, breakdown } = result;
    const restaurantNames: string[] = [...new Set(
      (breakdown as Array<{ restaurantName: string }>).map((b) => b.restaurantName)
    )];

    const saved = await pool.query(
      `INSERT INTO saved_meals
         (user_id, name, total_calories, total_protein_g, total_carbs_g, total_fat_g,
          total_sodium_mg, total_sugar_g, total_fiber_g, restaurant_names, items)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        req.user!.userId,
        (name || "My Meal").trim().slice(0, 80),
        Math.round(totals.calories),
        parseFloat(totals.protein_g) || 0,
        parseFloat(totals.carbs_g) || 0,
        parseFloat(totals.fat_g) || 0,
        parseFloat(totals.sodium_mg) || 0,
        parseFloat(totals.sugar_g) || 0,
        parseFloat(totals.fiber_g) || 0,
        restaurantNames,
        JSON.stringify(mealItems || []),
      ]
    );

    res.status(201).json(saved.rows[0]);
  } catch (err) {
    console.error("Save meal error:", err);
    res.status(500).json({ error: "Failed to save meal" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, total_calories, total_protein_g, total_carbs_g, total_fat_g,
              total_sodium_mg, total_sugar_g, total_fiber_g, restaurant_names, items, saved_at
       FROM saved_meals
       WHERE user_id = $1
       ORDER BY saved_at DESC
       LIMIT 100`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meal history" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "DELETE FROM saved_meals WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

export default router;
