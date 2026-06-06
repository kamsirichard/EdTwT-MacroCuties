const BASE = "/api";

export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  category: string;
  headquarters: string;
  country: string;
  description: string;
  logo_emoji: string;
  logo_color: string;
  website: string;
  dietary_options: string[];
  is_featured: boolean;
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  restaurant_name: string;
  restaurant_slug: string;
  logo_emoji: string;
  logo_color: string;
  name: string;
  category: string;
  description: string;
  base_calories: number;
  base_protein_g: number;
  base_carbs_g: number;
  base_fat_g: number;
  base_saturated_fat_g: number;
  base_sodium_mg: number;
  base_sugar_g: number;
  base_fiber_g: number;
  base_cholesterol_mg: number;
  serving_size_g: number;
  is_vegan: boolean;
  is_vegetarian: boolean;
  is_halal: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  allergens: string[];
}

export interface Condiment {
  id: number;
  name: string;
  category: string;
  brand: string;
  description: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  saturated_fat_g: number;
  sodium_mg: number;
  sugar_g: number;
  serving_size: string;
  serving_size_g: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
}

export interface MealItemCondiment {
  condimentId: number;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  sugar: number;
}

export interface MealItemModification {
  name: string;
  caloriesDelta: number;
  proteinDelta: number;
  carbsDelta: number;
  fatDelta: number;
  sodiumDelta: number;
}

export interface MealItem {
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
  condiments: MealItemCondiment[];
  modifications: MealItemModification[];
}

export interface NutritionResult {
  breakdown: Array<{
    name: string;
    restaurantName: string;
    quantity: number;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    sodium_mg: number;
    sugar_g: number;
    fiber_g: number;
    macroPercents: { protein: number; carbs: number; fat: number };
  }>;
  totals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    sodium_mg: number;
    sugar_g: number;
    fiber_g: number;
    cholesterol_mg: number;
  };
  macroPercents: { protein: number; carbs: number; fat: number };
  dailyGoals: Record<string, { value: number; goal: number; percent: number }>;
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  restaurants: {
    list: (params?: Record<string, string>) => get<Restaurant[]>("/restaurants", params),
    get: (slug: string) => get<Restaurant>(`/restaurants/${slug}`),
    categories: () => get<string[]>("/restaurants/categories"),
    stats: () => get<{ total_restaurants: string; total_items: string; total_condiments: string; total_categories: string }>("/restaurants/stats"),
  },
  menuItems: {
    list: (params?: Record<string, string>) => get<MenuItem[]>("/menu-items", params),
    get: (id: number) => get<MenuItem>(`/menu-items/${id}`),
    categories: (restaurantSlug?: string) => get<string[]>("/menu-items/categories", restaurantSlug ? { restaurant_slug: restaurantSlug } : undefined),
  },
  condiments: {
    list: (params?: Record<string, string>) => get<Condiment[]>("/condiments", params),
    categories: () => get<string[]>("/condiments/categories"),
  },
  nutrition: {
    calculate: (items: MealItem[]) =>
      fetch("/api/nutrition/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }).then((r) => r.json() as Promise<NutritionResult>),
  },
};
