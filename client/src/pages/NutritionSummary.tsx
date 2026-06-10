import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RotateCcw, Heart, AlertCircle, CheckCircle,
  Flame, BookmarkPlus, Check, LogIn, X,
} from "lucide-react";
import { api, type NutritionResult, type MealItem } from "@/lib/api";
import { MacroRing } from "@/components/MacroRing";
import { NutritionBar } from "@/components/NutritionBar";
import { cn, formatCalories, getCalorieColor } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NutritionSummaryProps {
  mealItems: MealItem[];
  onClear: () => void;
}

const CALORIE_MESSAGES = {
  low: { emoji: "✨", label: "Light Meal", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200", desc: "Nice and light — a great snack or part of a balanced day!" },
  medium: { emoji: "🌸", label: "Balanced Meal", color: "text-amber-500", bg: "bg-amber-50 border-amber-200", desc: "A satisfying, well-rounded meal within typical guidelines." },
  high: { emoji: "🔥", label: "Hearty Meal", color: "text-orange-500", bg: "bg-orange-50 border-orange-200", desc: "This is quite calorie-dense — maybe skip the snack later!" },
  veryHigh: { emoji: "💥", label: "Indulgent Treat", color: "text-rose-500", bg: "bg-rose-50 border-rose-200", desc: "Living your best life! Just be mindful of the rest of your day." },
};

function getCalorieMessage(cal: number) {
  if (cal < 400) return CALORIE_MESSAGES.low;
  if (cal < 800) return CALORIE_MESSAGES.medium;
  if (cal < 1200) return CALORIE_MESSAGES.high;
  return CALORIE_MESSAGES.veryHigh;
}

export default function NutritionSummary({ mealItems, onClear }: NutritionSummaryProps) {
  const [, setLocation] = useLocation();
  const { user, token } = useAuth();
  const [result, setResult] = useState<NutritionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [saveOpen, setSaveOpen] = useState(false);
  const [mealName, setMealName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (mealItems.length === 0) return;
    setLoading(true);
    api.nutrition.calculate(mealItems)
      .then(setResult)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [mealItems]);

  const handleSave = async () => {
    if (!result || !token) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: mealName || "My Meal", result, mealItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSaved(true);
      setSaveOpen(false);
      setMealName("");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save meal");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center gap-4">
        <div className="text-5xl animate-bounce-gentle">🧮</div>
        <div className="text-lg font-700 text-foreground/70">Crunching the numbers...</div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">😬</div>
        <h2 className="text-xl font-700">Something went wrong</h2>
        <button onClick={() => window.history.back()} className="mt-4 text-primary font-700 underline">Go back</button>
      </div>
    );
  }

  const { totals, macroPercents, breakdown, dailyGoals } = result;
  const message = getCalorieMessage(totals.calories);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero border-b border-border px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <button
              data-testid="button-back"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-600 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Meal</span>
            </button>
            <div className="flex gap-2">
              {saved ? (
                <div className="flex items-center gap-1.5 text-xs font-700 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                  <Check size={13} />
                  Saved!
                </div>
              ) : (
                <button
                  onClick={() => user ? setSaveOpen(true) : setLocation("/auth")}
                  className="flex items-center gap-1.5 text-xs font-700 text-primary bg-white/80 border border-primary/30 px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  {user ? <BookmarkPlus size={13} /> : <LogIn size={13} />}
                  {user ? "Save Meal" : "Log in to Save"}
                </button>
              )}
              <button
                data-testid="button-reset"
                onClick={() => { onClear(); setLocation("/"); }}
                className="flex items-center gap-1.5 text-xs font-700 text-foreground/50 hover:text-foreground px-3 py-2 rounded-xl hover:bg-white/60 transition-all"
              >
                <RotateCcw size={13} />
                New Meal
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-4xl mb-3">{message.emoji}</div>
            <div className={cn("inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-700 border mb-3", message.bg, message.color)}>
              {message.label}
            </div>
            <div className={cn("text-6xl font-900 mb-1", getCalorieColor(totals.calories))}>
              {formatCalories(totals.calories)}
              <span className="text-2xl font-600 text-foreground/40 ml-2">cal</span>
            </div>
            <p className="text-foreground/50 font-500 text-sm">{message.desc}</p>
          </motion.div>
        </div>
      </div>

      {/* Save modal */}
      <AnimatePresence>
        {saveOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={(e) => e.target === e.currentTarget && setSaveOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-800 text-foreground">Save this meal</h3>
                  <p className="text-xs text-muted-foreground font-500 mt-0.5">
                    {formatCalories(totals.calories)} cal · {breakdown.length} item(s)
                  </p>
                </div>
                <button onClick={() => setSaveOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="Give this meal a name (optional)"
                className="w-full px-4 py-3 rounded-2xl border-2 border-border focus:border-primary focus:outline-none font-500 text-sm mb-3 transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              {saveError && (
                <p className="text-xs text-rose-500 font-600 mb-3">{saveError}</p>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs font-700 text-muted-foreground bg-muted rounded-2xl p-3 mb-4">
                <span>P: {Math.round(Number(totals.protein_g))}g</span>
                <span>C: {Math.round(Number(totals.carbs_g))}g</span>
                <span>F: {Math.round(Number(totals.fat_g))}g</span>
                <span>Na: {Math.round(Number(totals.sodium_mg))}mg</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSaveOpen(false)}
                  className="flex-1 border-2 border-border rounded-2xl py-3 font-700 text-foreground/60 hover:border-foreground/30 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 gradient-pink text-white rounded-2xl py-3 font-800 shadow-md hover:scale-105 transition-transform disabled:opacity-60 disabled:scale-100 text-sm flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <BookmarkPlus size={14} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Macro ring */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-sm border border-border p-5">
          <h2 className="text-base font-800 text-foreground mb-4">Macronutrients</h2>
          <div className="flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <MacroRing protein={macroPercents.protein} carbs={macroPercents.carbs} fat={macroPercents.fat} size={120} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame size={20} className="text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: "Protein", value: totals.protein_g, pct: macroPercents.protein, color: "bg-blue-400", textColor: "text-blue-500", emoji: "💪" },
                { label: "Carbs", value: totals.carbs_g, pct: macroPercents.carbs, color: "bg-amber-400", textColor: "text-amber-500", emoji: "⚡" },
                { label: "Fat", value: totals.fat_g, pct: macroPercents.fat, color: "bg-rose-400", textColor: "text-rose-500", emoji: "🫧" },
              ].map(({ label, value, pct, color, textColor, emoji }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-600 flex items-center gap-1">
                      <span>{emoji}</span>
                      <span className="text-foreground/70">{label}</span>
                    </span>
                    <span className="font-800">
                      <span className={textColor}>{pct}%</span>
                      <span className="text-foreground/40 font-500 ml-1.5">{Math.round(Number(value) * 10) / 10}g</span>
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Daily goals */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl shadow-sm border border-border p-5">
          <h2 className="text-base font-800 text-foreground mb-4">% of Daily Goals <span className="text-xs font-500 text-muted-foreground">(based on 2,000 cal diet)</span></h2>
          <div className="space-y-4">
            <NutritionBar label="Calories" value={dailyGoals.calories.value} goal={dailyGoals.calories.goal} unit=" cal" color="macro-protein bg-gradient-to-r from-rose-400 to-pink-400" emoji="🔥" />
            <NutritionBar label="Protein" value={dailyGoals.protein.value} goal={dailyGoals.protein.goal} unit="g" color="bg-blue-400" emoji="💪" />
            <NutritionBar label="Carbohydrates" value={dailyGoals.carbs.value} goal={dailyGoals.carbs.goal} unit="g" color="bg-amber-400" emoji="⚡" />
            <NutritionBar label="Total Fat" value={dailyGoals.fat.value} goal={dailyGoals.fat.goal} unit="g" color="bg-rose-400" emoji="🫧" />
            <NutritionBar label="Sodium" value={dailyGoals.sodium.value} goal={dailyGoals.sodium.goal} unit="mg" color="bg-purple-400" emoji="🧂" />
            <NutritionBar label="Sugar" value={dailyGoals.sugar.value} goal={dailyGoals.sugar.goal} unit="g" color="bg-pink-400" emoji="🍬" />
            <NutritionBar label="Fiber" value={dailyGoals.fiber.value} goal={dailyGoals.fiber.goal} unit="g" color="bg-emerald-400" emoji="🥦" />
          </div>
        </motion.div>

        {/* More details */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-3xl shadow-sm border border-border p-5">
          <h2 className="text-base font-800 text-foreground mb-4">More Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Cholesterol", value: `${totals.cholesterol_mg}mg`, emoji: "❤️", sub: "/ 300mg daily" },
              { label: "Fiber", value: `${totals.fiber_g}g`, emoji: "🌿", sub: "/ 28g daily" },
              { label: "Sugar", value: `${totals.sugar_g}g`, emoji: "🍭", sub: "/ 50g daily" },
              { label: "Sodium", value: `${totals.sodium_mg}mg`, emoji: "🧂", sub: "/ 2300mg daily" },
            ].map((d) => (
              <div key={d.label} className="bg-muted rounded-2xl p-3 text-center">
                <div className="text-2xl mb-1">{d.emoji}</div>
                <div className="font-800 text-sm text-foreground">{d.value}</div>
                <div className="text-xs text-muted-foreground font-500">{d.label}</div>
                <div className="text-xs text-muted-foreground/60 mt-0.5">{d.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Item breakdown */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-sm border border-border p-5">
          <h2 className="text-base font-800 text-foreground mb-4">Item Breakdown</h2>
          <div className="space-y-3">
            {breakdown.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground font-600 truncate">{item.restaurantName}</div>
                  <div className="font-700 text-sm text-foreground">
                    {item.quantity > 1 && <span className="text-primary mr-1">×{item.quantity}</span>}
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      <span className="text-xs bg-blue-100 text-blue-600 font-700 px-1.5 py-0.5 rounded-md">P {item.protein_g}g</span>
                      <span className="text-xs bg-amber-100 text-amber-600 font-700 px-1.5 py-0.5 rounded-md">C {item.carbs_g}g</span>
                      <span className="text-xs bg-rose-100 text-rose-600 font-700 px-1.5 py-0.5 rounded-md">F {item.fat_g}g</span>
                    </div>
                  </div>
                </div>
                <div className={cn("text-right flex-shrink-0", getCalorieColor(item.calories))}>
                  <div className="font-900 text-lg leading-none">{formatCalories(item.calories)}</div>
                  <div className="text-xs font-500 opacity-70">cal</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="font-800 text-foreground">Total</span>
            <span className={cn("font-900 text-2xl", getCalorieColor(totals.calories))}>{formatCalories(totals.calories)} cal</span>
          </div>
        </motion.div>

        {/* Health tips */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl overflow-hidden border border-border">
          {totals.sodium_mg > 1500 && (
            <div className="flex gap-3 bg-amber-50 border-amber-100 p-4 border-b">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-700 text-sm text-amber-700">High Sodium</div>
                <div className="text-xs text-amber-600 mt-0.5">This meal contains {totals.sodium_mg}mg sodium — that's {Math.round((Number(totals.sodium_mg) / 2300) * 100)}% of your daily limit. Stay hydrated!</div>
              </div>
            </div>
          )}
          {Number(totals.sugar_g) > 40 && (
            <div className="flex gap-3 bg-pink-50 border-pink-100 p-4 border-b">
              <AlertCircle size={18} className="text-pink-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-700 text-sm text-pink-700">High Sugar</div>
                <div className="text-xs text-pink-600 mt-0.5">{totals.sugar_g}g of sugar detected. Try skipping the sugary drink to balance it out.</div>
              </div>
            </div>
          )}
          {Number(totals.protein_g) >= 25 && (
            <div className="flex gap-3 bg-blue-50 border-blue-100 p-4">
              <CheckCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-700 text-sm text-blue-700">Good Protein!</div>
                <div className="text-xs text-blue-600 mt-0.5">This meal has {totals.protein_g}g of protein — great for muscle maintenance and staying full longer.</div>
              </div>
            </div>
          )}
          {Number(totals.sodium_mg) <= 1500 && Number(totals.sugar_g) <= 40 && Number(totals.protein_g) < 25 && (
            <div className="flex gap-3 bg-emerald-50 p-4">
              <Heart size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-700 text-sm text-emerald-700">Looking balanced!</div>
                <div className="text-xs text-emerald-600 mt-0.5">No major red flags with this meal. Pair it with water and some movement.</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-white border-2 border-border rounded-2xl py-3.5 font-700 text-foreground/70 hover:border-primary/40 hover:text-foreground transition-all"
          >
            Edit Meal
          </button>
          {!saved && user && (
            <button
              onClick={() => setSaveOpen(true)}
              className="flex items-center gap-1.5 bg-white border-2 border-primary/30 text-primary rounded-2xl px-4 py-3.5 font-700 hover:bg-primary/5 transition-all"
            >
              <BookmarkPlus size={16} />
              <span className="hidden sm:inline">Save</span>
            </button>
          )}
          <button
            data-testid="button-new-meal"
            onClick={() => { onClear(); setLocation("/"); }}
            className="flex-1 gradient-pink text-white rounded-2xl py-3.5 font-800 shadow-lg shadow-pink-200 hover:scale-105 transition-transform"
          >
            New Meal 🌸
          </button>
        </div>

        {!user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="pb-8">
            <button
              onClick={() => setLocation("/auth")}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/30 rounded-2xl py-3.5 text-primary font-700 text-sm hover:border-primary/60 hover:bg-primary/5 transition-all"
            >
              <LogIn size={16} />
              Log in to save this meal to your history
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
