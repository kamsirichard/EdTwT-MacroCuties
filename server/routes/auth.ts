import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/schema";
import { requireAuth, signToken } from "../middleware/auth";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "Email, password, and display name are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name`,
      [email.toLowerCase().trim(), passwordHash, displayName.trim()]
    );

    const user = result.rows[0];
    const token = signToken({ userId: user.id, email: user.email, displayName: user.display_name });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, displayName: user.display_name },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT id, email, display_name, password_hash FROM users WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken({ userId: user.id, email: user.email, displayName: user.display_name });
    res.json({
      token,
      user: { id: user.id, email: user.email, displayName: user.display_name },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, email, display_name, created_at FROM users WHERE id = $1",
      [req.user!.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const u = result.rows[0];
    res.json({ id: u.id, email: u.email, displayName: u.display_name, createdAt: u.created_at });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
