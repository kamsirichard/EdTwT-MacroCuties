import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createSchema } from "./db/schema";
import { seedData } from "./db/seed";
import { seedLocations } from "./db/seed-locations";
import { seedCondimentExtras } from "./db/seed-condiment-extras";
import restaurantRoutes from "./routes/restaurants";
import menuItemRoutes from "./routes/menuItems";
import condimentRoutes from "./routes/condiments";
import nutritionRoutes from "./routes/nutrition";
import authRoutes from "./routes/auth";
import savedMealsRoutes from "./routes/savedMeals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/condiments", condimentRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meals", savedMealsRoutes);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../dist/public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

async function start() {
  try {
    await createSchema();
    await seedData();
    await seedLocations();
    await seedCondimentExtras();
    app.listen(PORT, () => {
      console.log(`MacroCutie API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
