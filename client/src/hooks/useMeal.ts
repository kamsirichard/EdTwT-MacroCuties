import { useState, useCallback } from "react";
import type { MenuItem, Condiment, MealItem, MealItemCondiment } from "../lib/api";

export interface MealEntry {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  condiments: Array<{ condiment: Condiment; quantity: number }>;
  modifications: Array<{ name: string; caloriesDelta: number; proteinDelta: number; carbsDelta: number; fatDelta: number; sodiumDelta: number }>;
}

export function useMeal() {
  const [entries, setEntries] = useState<MealEntry[]>([]);

  const addItem = useCallback((menuItem: MenuItem) => {
    const entry: MealEntry = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity: 1,
      condiments: [],
      modifications: [],
    };
    setEntries((prev) => [...prev, entry]);
    return entry.id;
  }, []);

  const removeItem = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, quantity: Math.max(1, quantity) } : e))
    );
  }, []);

  const addCondiment = useCallback((entryId: string, condiment: Condiment) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== entryId) return e;
        const existing = e.condiments.find((c) => c.condiment.id === condiment.id);
        if (existing) {
          return {
            ...e,
            condiments: e.condiments.map((c) =>
              c.condiment.id === condiment.id ? { ...c, quantity: c.quantity + 1 } : c
            ),
          };
        }
        return { ...e, condiments: [...e.condiments, { condiment, quantity: 1 }] };
      })
    );
  }, []);

  const removeCondiment = useCallback((entryId: string, condimentId: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, condiments: e.condiments.filter((c) => c.condiment.id !== condimentId) }
          : e
      )
    );
  }, []);

  const updateCondimentQty = useCallback((entryId: string, condimentId: number, quantity: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? {
              ...e,
              condiments: quantity <= 0
                ? e.condiments.filter((c) => c.condiment.id !== condimentId)
                : e.condiments.map((c) => c.condiment.id === condimentId ? { ...c, quantity } : c),
            }
          : e
      )
    );
  }, []);

  const clearMeal = useCallback(() => setEntries([]), []);

  const toMealItems = useCallback((): MealItem[] => {
    return entries.map((e) => ({
      menuItemId: e.menuItem.id,
      name: e.menuItem.name,
      restaurantName: e.menuItem.restaurant_name,
      quantity: e.quantity,
      baseCalories: e.menuItem.base_calories,
      baseProtein: e.menuItem.base_protein_g,
      baseCarbs: e.menuItem.base_carbs_g,
      baseFat: e.menuItem.base_fat_g,
      baseSodium: e.menuItem.base_sodium_mg,
      baseSugar: e.menuItem.base_sugar_g,
      baseFiber: e.menuItem.base_fiber_g,
      baseCholesterol: e.menuItem.base_cholesterol_mg,
      condiments: e.condiments.map(({ condiment, quantity }): MealItemCondiment => ({
        condimentId: condiment.id,
        name: condiment.name,
        quantity,
        calories: condiment.calories,
        protein: condiment.protein_g,
        carbs: condiment.carbs_g,
        fat: condiment.fat_g,
        sodium: condiment.sodium_mg,
        sugar: condiment.sugar_g,
      })),
      modifications: e.modifications,
    }));
  }, [entries]);

  const getTotalCalories = useCallback(() => {
    return entries.reduce((total, e) => {
      let itemCal = e.menuItem.base_calories * e.quantity;
      for (const { condiment, quantity } of e.condiments) {
        itemCal += condiment.calories * quantity * e.quantity;
      }
      return total + itemCal;
    }, 0);
  }, [entries]);

  return {
    entries,
    addItem,
    removeItem,
    updateQuantity,
    addCondiment,
    removeCondiment,
    updateCondimentQty,
    clearMeal,
    toMealItems,
    getTotalCalories,
    itemCount: entries.reduce((sum, e) => sum + e.quantity, 0),
  };
}
