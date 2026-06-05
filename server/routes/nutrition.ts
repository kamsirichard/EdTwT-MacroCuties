import { Router, Request, Response } from "express";

const router = Router();

interface MealItem {
  menuItemId: number;
  name: string;
  restaurantName: string;
  quantity: number;
  baseCalories: number;
  baseProtein: number;
  baseCarbs: number;
  baseFat: number;
  baseSodium: number;
  baseSugar: number;
  baseFiber: number;
  baseCholesterol: number;
  condiments: Array<{
    condimentId: number;
    name: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
    sugar: number;
  }>;
  modifications: Array<{
    name: string;
    caloriesDelta: number;
    proteinDelta: number;
    carbsDelta: number;
    fatDelta: number;
    sodiumDelta: number;
  }>;
}

router.post("/calculate", (req: Request, res: Response) => {
  try {
    const { items }: { items: MealItem[] } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let totals = {
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      sodium_mg: 0,
      sugar_g: 0,
      fiber_g: 0,
      cholesterol_mg: 0,
    };

    const breakdown = items.map((item) => {
      const qty = item.quantity || 1;
      let itemCal = item.baseCalories * qty;
      let itemPro = item.baseProtein * qty;
      let itemCarb = item.baseCarbs * qty;
      let itemFat = item.baseFat * qty;
      let itemSod = item.baseSodium * qty;
      let itemSug = item.baseSugar * qty;
      let itemFib = item.baseFiber * qty;
      let itemChol = item.baseCholesterol * qty;

      // Apply modifications
      for (const mod of item.modifications || []) {
        itemCal += (mod.caloriesDelta || 0) * qty;
        itemPro += (mod.proteinDelta || 0) * qty;
        itemCarb += (mod.carbsDelta || 0) * qty;
        itemFat += (mod.fatDelta || 0) * qty;
        itemSod += (mod.sodiumDelta || 0) * qty;
      }

      // Add condiments
      for (const cond of item.condiments || []) {
        const cqty = cond.quantity || 1;
        itemCal += cond.calories * cqty * qty;
        itemPro += cond.protein * cqty * qty;
        itemCarb += cond.carbs * cqty * qty;
        itemFat += cond.fat * cqty * qty;
        itemSod += cond.sodium * cqty * qty;
        itemSug += cond.sugar * cqty * qty;
      }

      totals.calories += itemCal;
      totals.protein_g += itemPro;
      totals.carbs_g += itemCarb;
      totals.fat_g += itemFat;
      totals.sodium_mg += itemSod;
      totals.sugar_g += itemSug;
      totals.fiber_g += itemFib;
      totals.cholesterol_mg += itemChol;

      const totalItemCal = itemCal || 1;
      return {
        name: item.name,
        restaurantName: item.restaurantName,
        quantity: qty,
        calories: Math.round(itemCal),
        protein_g: Math.round(itemPro * 10) / 10,
        carbs_g: Math.round(itemCarb * 10) / 10,
        fat_g: Math.round(itemFat * 10) / 10,
        sodium_mg: Math.round(itemSod),
        sugar_g: Math.round(itemSug * 10) / 10,
        fiber_g: Math.round(itemFib * 10) / 10,
        macroPercents: {
          protein: Math.round(((itemPro * 4) / totalItemCal) * 100),
          carbs: Math.round(((itemCarb * 4) / totalItemCal) * 100),
          fat: Math.round(((itemFat * 9) / totalItemCal) * 100),
        },
      };
    });

    const totalCal = totals.calories || 1;
    const dailyGoals = {
      calories: { value: Math.round(totals.calories), goal: 2000, percent: Math.round((totals.calories / 2000) * 100) },
      protein: { value: Math.round(totals.protein_g * 10) / 10, goal: 50, percent: Math.round((totals.protein_g / 50) * 100) },
      carbs: { value: Math.round(totals.carbs_g * 10) / 10, goal: 275, percent: Math.round((totals.carbs_g / 275) * 100) },
      fat: { value: Math.round(totals.fat_g * 10) / 10, goal: 78, percent: Math.round((totals.fat_g / 78) * 100) },
      sodium: { value: Math.round(totals.sodium_mg), goal: 2300, percent: Math.round((totals.sodium_mg / 2300) * 100) },
      sugar: { value: Math.round(totals.sugar_g * 10) / 10, goal: 50, percent: Math.round((totals.sugar_g / 50) * 100) },
      fiber: { value: Math.round(totals.fiber_g * 10) / 10, goal: 28, percent: Math.round((totals.fiber_g / 28) * 100) },
    };

    res.json({
      breakdown,
      totals: {
        ...totals,
        calories: Math.round(totals.calories),
        protein_g: Math.round(totals.protein_g * 10) / 10,
        carbs_g: Math.round(totals.carbs_g * 10) / 10,
        fat_g: Math.round(totals.fat_g * 10) / 10,
        sodium_mg: Math.round(totals.sodium_mg),
        sugar_g: Math.round(totals.sugar_g * 10) / 10,
        fiber_g: Math.round(totals.fiber_g * 10) / 10,
        cholesterol_mg: Math.round(totals.cholesterol_mg),
      },
      macroPercents: {
        protein: Math.round(((totals.protein_g * 4) / totalCal) * 100),
        carbs: Math.round(((totals.carbs_g * 4) / totalCal) * 100),
        fat: Math.round(((totals.fat_g * 9) / totalCal) * 100),
      },
      dailyGoals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Calculation failed" });
  }
});

export default router;
