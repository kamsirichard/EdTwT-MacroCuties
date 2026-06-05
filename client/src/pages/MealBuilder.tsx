import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Trash2, Plus, Minus, ChevronDown, ChevronUp,
  Search, ShoppingBag, Flame, Calculator
} from "lucide-react";
import { api, type Condiment } from "@/lib/api";
import { cn, formatCalories, getCalorieColor } from "@/lib/utils";
import type { MealEntry } from "@/hooks/useMeal";

interface MealBuilderProps {
  entries: MealEntry[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onAddCondiment: (entryId: string, condiment: Condiment) => void;
  onRemoveCondiment: (entryId: string, condimentId: number) => void;
  onUpdateCondimentQty: (entryId: string, condimentId: number, qty: number) => void;
  getTotalCalories: () => number;
  onCalculate: () => void;
  onClear: () => void;
}

const CONDIMENT_CATEGORY_EMOJIS: Record<string, string> = {
  Sauce: "🍶",
  Dressing: "🥗",
  Topping: "🧀",
  Dairy: "🥛",
  Bread: "🍞",
  Sweet: "🍯",
  Oil: "🫒",
  Protein: "🥩",
};

export default function MealBuilder({
  entries,
  onRemoveItem,
  onUpdateQuantity,
  onAddCondiment,
  onRemoveCondiment,
  onUpdateCondimentQty,
  getTotalCalories,
  onCalculate,
  onClear,
}: MealBuilderProps) {
  const [, setLocation] = useLocation();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [condiments, setCondiments] = useState<Condiment[]>([]);
  const [condimentSearch, setCondimentSearch] = useState("");
  const [condimentCategory, setCondimentCategory] = useState("");
  const [condimentCategories, setCondimentCategories] = useState<string[]>([]);

  useEffect(() => {
    api.condiments.categories().then(setCondimentCategories).catch(() => {});
    api.condiments.list().then(setCondiments).catch(() => {});
  }, []);

  const filteredCondiments = condiments.filter((c) => {
    if (condimentSearch && !c.name.toLowerCase().includes(condimentSearch.toLowerCase()) && !c.brand.toLowerCase().includes(condimentSearch.toLowerCase())) return false;
    if (condimentCategory && c.category !== condimentCategory) return false;
    return true;
  });

  const totalCalories = getTotalCalories();
  const itemCount = entries.reduce((s, e) => s + e.quantity, 0);

  if (entries.length === 0) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-7xl mb-5 float">🛒</div>
          <h2 className="text-2xl font-800 text-foreground mb-2">Your meal is empty!</h2>
          <p className="text-foreground/50 font-500 mb-6">Add items from a restaurant to get started</p>
          <button
            data-testid="button-browse-restaurants"
            onClick={() => setLocation("/")}
            className="gradient-pink text-white px-6 py-3 rounded-2xl font-700 shadow-lg shadow-pink-200 hover:scale-105 transition-transform"
          >
            Browse Restaurants
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-4 sticky top-[65px] z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            data-testid="button-back"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <span className="font-800 text-foreground">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            <span className={cn("font-800 text-lg ml-1", getCalorieColor(totalCalories))}>
              <Flame size={14} className="inline mr-0.5" />
              {formatCalories(totalCalories)} cal
            </span>
          </div>
          <div className="flex gap-2">
            <button
              data-testid="button-clear-meal"
              onClick={onClear}
              className="text-xs font-700 text-rose-400 hover:text-rose-600 transition-colors px-2 py-1.5"
            >
              Clear
            </button>
            <button
              data-testid="button-calculate"
              onClick={onCalculate}
              className="flex items-center gap-2 gradient-pink text-white px-4 py-2 rounded-xl font-700 text-sm shadow-md hover:scale-105 transition-transform"
            >
              <Calculator size={14} />
              Calculate
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-800 text-foreground">Your Meal</h2>
          <AnimatePresence>
            {entries.map((entry) => {
              const entryCalories =
                entry.menuItem.base_calories * entry.quantity +
                entry.condiments.reduce((s, { condiment, quantity }) => s + condiment.calories * quantity * entry.quantity, 0);
              const isExpanded = expandedEntry === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  data-testid={`card-entry-${entry.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden"
                >
                  {/* Entry header */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `${entry.menuItem.logo_color || "#FF9EC4"}15` }}
                      >
                        {entry.menuItem.logo_emoji || "🍽️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs text-muted-foreground font-600">{entry.menuItem.restaurant_name}</span>
                            <h3 className="font-700 text-foreground text-sm leading-tight">{entry.menuItem.name}</h3>
                          </div>
                          <button
                            data-testid={`button-remove-${entry.id}`}
                            onClick={() => onRemoveItem(entry.id)}
                            className="text-rose-300 hover:text-rose-500 transition-colors flex-shrink-0 mt-0.5"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={cn("font-800 text-sm", getCalorieColor(entryCalories))}>
                            <Flame size={12} className="inline mr-0.5" />
                            {formatCalories(entryCalories)} cal
                          </span>
                          {/* Quantity */}
                          <div className="flex items-center gap-1.5 bg-muted rounded-xl p-0.5">
                            <button
                              data-testid={`button-dec-${entry.id}`}
                              onClick={() => onUpdateQuantity(entry.id, entry.quantity - 1)}
                              disabled={entry.quantity <= 1}
                              className="w-6 h-6 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-800 text-sm w-5 text-center">{entry.quantity}</span>
                            <button
                              data-testid={`button-inc-${entry.id}`}
                              onClick={() => onUpdateQuantity(entry.id, entry.quantity + 1)}
                              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Applied condiments */}
                    {entry.condiments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.condiments.map(({ condiment, quantity }) => (
                          <div
                            key={condiment.id}
                            className="flex items-center gap-1 bg-secondary/50 rounded-lg px-2 py-1 text-xs font-600"
                          >
                            <span>{condiment.name.split(" ")[0]}</span>
                            {quantity > 1 && <span className="text-primary font-800">×{quantity}</span>}
                            <span className="text-muted-foreground">+{condiment.calories * quantity} cal</span>
                            <div className="flex items-center gap-0.5 ml-0.5">
                              <button
                                data-testid={`button-cond-dec-${entry.id}-${condiment.id}`}
                                onClick={() => onUpdateCondimentQty(entry.id, condiment.id, quantity - 1)}
                                className="w-4 h-4 rounded flex items-center justify-center hover:bg-white/60 transition-colors"
                              >
                                <Minus size={9} />
                              </button>
                              <button
                                data-testid={`button-cond-remove-${entry.id}-${condiment.id}`}
                                onClick={() => onRemoveCondiment(entry.id, condiment.id)}
                                className="text-rose-400 hover:text-rose-600 ml-0.5 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Expand condiments */}
                    <button
                      data-testid={`button-toggle-condiments-${entry.id}`}
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-700 text-primary hover:text-primary/70 transition-colors py-1"
                    >
                      <Plus size={12} />
                      <span>Add condiments & toppings</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>

                  {/* Condiment picker (inline) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border bg-muted/30 p-4">
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <input
                              data-testid={`input-condiment-search-${entry.id}`}
                              type="text"
                              placeholder="Search condiments, brand..."
                              value={condimentSearch}
                              onChange={(e) => setCondimentSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-border text-xs font-600 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div className="flex gap-1.5 flex-wrap mb-3">
                            <button
                              onClick={() => setCondimentCategory("")}
                              className={`px-2.5 py-1 rounded-lg text-xs font-700 transition-all ${!condimentCategory ? "bg-primary text-white" : "bg-white text-foreground/60 border border-border"}`}
                            >
                              All
                            </button>
                            {condimentCategories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setCondimentCategory(cat === condimentCategory ? "" : cat)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-700 transition-all ${condimentCategory === cat ? "bg-primary text-white" : "bg-white text-foreground/60 border border-border"}`}
                              >
                                {CONDIMENT_CATEGORY_EMOJIS[cat] || "🍴"} {cat}
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                            {filteredCondiments.slice(0, 30).map((c) => {
                              const alreadyAdded = entry.condiments.find((ec) => ec.condiment.id === c.id);
                              return (
                                <div
                                  key={c.id}
                                  className={cn(
                                    "flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border transition-all",
                                    alreadyAdded ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"
                                  )}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-700 text-xs text-foreground">{c.name}</div>
                                    <div className="text-xs text-muted-foreground font-500">{c.brand} · {c.serving_size}</div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-2">
                                    <span className="text-xs font-800 text-foreground/60">{c.calories} cal</span>
                                    <button
                                      data-testid={`button-add-condiment-${c.id}`}
                                      onClick={() => onAddCondiment(entry.id, c)}
                                      className="w-6 h-6 rounded-lg gradient-pink text-white flex items-center justify-center hover:scale-110 transition-transform"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            {filteredCondiments.length === 0 && (
                              <p className="text-center text-xs text-muted-foreground py-4">No condiments found</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <button
            onClick={() => setLocation("/")}
            className="w-full border-2 border-dashed border-primary/30 rounded-2xl py-4 text-primary font-700 text-sm hover:border-primary/60 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add more items
          </button>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-border p-5 sticky top-28">
            <h2 className="text-base font-800 text-foreground mb-4">Meal Summary</h2>

            <div className="text-center mb-5">
              <div className={cn("text-4xl font-900", getCalorieColor(totalCalories))}>
                {formatCalories(totalCalories)}
              </div>
              <div className="text-sm text-muted-foreground font-600">total calories</div>
              <div className="text-xs text-muted-foreground/60 mt-1">
                {Math.round((totalCalories / 2000) * 100)}% of 2,000 cal/day
              </div>
            </div>

            {/* Quick macros */}
            <div className="space-y-3">
              {[
                { label: "Protein", color: "bg-blue-400", key: "protein", unit: "g", factor: 4 },
                { label: "Carbs", color: "bg-amber-400", key: "carbs", unit: "g", factor: 4 },
                { label: "Fat", color: "bg-rose-400", key: "fat", unit: "g", factor: 9 },
              ].map(({ label, color, unit }) => {
                const val = entries.reduce((s, e) => {
                  const base = label === "Protein" ? e.menuItem.base_protein_g :
                    label === "Carbs" ? e.menuItem.base_carbs_g : e.menuItem.base_fat_g;
                  const condVal = e.condiments.reduce((cs, { condiment, quantity }) => {
                    const cv = label === "Protein" ? condiment.protein_g :
                      label === "Carbs" ? condiment.carbs_g : condiment.fat_g;
                    return cs + cv * quantity;
                  }, 0);
                  return s + (base + condVal) * e.quantity;
                }, 0);
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                    <span className="text-sm font-600 text-foreground/70 flex-1">{label}</span>
                    <span className="font-800 text-sm">{Math.round(val * 10) / 10}{unit}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-border text-xs text-muted-foreground space-y-1.5">
              <div className="flex justify-between">
                <span>Sodium</span>
                <span className="font-700">
                  {Math.round(entries.reduce((s, e) => s + e.menuItem.base_sodium_mg * e.quantity + e.condiments.reduce((cs, { condiment, quantity }) => cs + condiment.sodium_mg * quantity, 0), 0))}mg
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sugar</span>
                <span className="font-700">
                  {Math.round(entries.reduce((s, e) => s + e.menuItem.base_sugar_g * e.quantity + e.condiments.reduce((cs, { condiment, quantity }) => cs + condiment.sugar_g * quantity, 0), 0) * 10) / 10}g
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fiber</span>
                <span className="font-700">{Math.round(entries.reduce((s, e) => s + e.menuItem.base_fiber_g * e.quantity, 0) * 10) / 10}g</span>
              </div>
            </div>

            <button
              data-testid="button-calculate-full"
              onClick={onCalculate}
              className="mt-5 w-full gradient-pink text-white py-3.5 rounded-2xl font-800 shadow-lg shadow-pink-200 hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Calculator size={16} />
              Full Breakdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
