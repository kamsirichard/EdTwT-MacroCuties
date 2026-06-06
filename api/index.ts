import express from "express";
import cors from "cors";
import { createSchema } from "../server/db/schema";
import { seedData } from "../server/db/seed";
import restaurantRoutes from "../server/routes/restaurants";
import menuItemRoutes from "../server/routes/menuItems";
import condimentRoutes from "../server/routes/condiments";
import nutritionRoutes from "../server/routes/nutrition";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/condiments", condimentRoutes);
app.use("/api/nutrition", nutritionRoutes);

const initPromise = createSchema()
  .then(() => seedData())
  .catch((err) => console.error("DB init error:", err));

const handler = async (req: any, res: any) => {
  await initPromise;
  app(req, res);
};

export default handler;
