import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Flame, Clock, ChevronDown, ChevronUp, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatCalories, getCalorieColor } from "@/lib/utils";

interface SavedMeal {
  id: number;
  name: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_sodium_mg: number;
  total_sugar_g: number;
  total_fiber_g: number;
  restaurant_names: string[];
  items: unknown[];
  saved_at: string;
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: diffDays > 365 ? "numeric" : undefined });
}

function MealCard({ meal, onDelete }: { meal: SavedMeal; onDelete: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${meal.name}"?`)) return;
    setDeleting(true);
    onDelete(meal.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      className="bg-white rounded-3xl shadow-sm border border-border overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-800 text-foreground text-base leading-tight">{meal.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={12} className="text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground font-500">{formatRelativeDate(meal.saved_at)}</span>
              {meal.restaurant_names.length > 0 && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground font-500 truncate">
                    {meal.restaurant_names.slice(0, 3).join(", ")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={cn("text-right", getCalorieColor(meal.total_calories))}>
              <div className="font-900 text-xl leading-none">
                <Flame size={13} className="inline mr-0.5 mb-0.5" />
                {formatCalories(meal.total_calories)}
              </div>
              <div className="text-xs opacity-60 font-500">cal</div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-rose-300 hover:text-rose-500 transition-colors p-1 disabled:opacity-40"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Macro pills */}
        <div className="flex gap-2 mb-3">
          {[
            { label: "P", value: Math.round(Number(meal.total_protein_g)), color: "bg-blue-100 text-blue-600", unit: "g" },
            { label: "C", value: Math.round(Number(meal.total_carbs_g)), color: "bg-amber-100 text-amber-600", unit: "g" },
            { label: "F", value: Math.round(Number(meal.total_fat_g)), color: "bg-rose-100 text-rose-600", unit: "g" },
            { label: "Na", value: Math.round(Number(meal.total_sodium_mg)), color: "bg-purple-100 text-purple-600", unit: "mg" },
          ].map((m) => (
            <div key={m.label} className={`${m.color} rounded-lg px-2 py-0.5 text-xs font-800`}>
              {m.label} {m.value}{m.unit}
            </div>
          ))}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-700 text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide items" : `Show ${Array.isArray(meal.items) ? meal.items.length : 0} item(s)`}
        </button>
      </div>

      <AnimatePresence>
        {expanded && Array.isArray(meal.items) && meal.items.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-5 py-3 bg-muted/30 space-y-2">
              {(meal.items as Array<{ name?: string; restaurantName?: string; quantity?: number; baseCalories?: number; condiments?: Array<{name: string; quantity: number; calories: number}> }>).map((item, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">{item.restaurantName} · </span>
                      <span className="font-700">
                        {(item.quantity || 1) > 1 && <span className="text-primary mr-1">×{item.quantity}</span>}
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-700 text-foreground/60 ml-2">{item.baseCalories} cal</span>
                  </div>
                  {item.condiments && item.condiments.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 ml-2">
                      {item.condiments.map((c, j) => (
                        <span key={j} className="text-xs bg-secondary rounded-md px-1.5 py-0.5 text-foreground/60 font-500">
                          +{c.name}{c.quantity > 1 ? ` ×${c.quantity}` : ""} ({c.calories * c.quantity} cal)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function History() {
  const [, setLocation] = useLocation();
  const { user, token, loading: authLoading } = useAuth();
  const [meals, setMeals] = useState<SavedMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) { setLoading(false); return; }
    fetch("/api/meals", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setMeals)
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, [user, token, authLoading]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/meals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete meal");
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4 float">📋</div>
        <h2 className="text-2xl font-800 text-foreground mb-2">Your Meal History</h2>
        <p className="text-foreground/50 font-500 mb-6 max-w-sm">
          Log in to save meals and track what you're eating over time.
        </p>
        <button
          onClick={() => setLocation("/auth")}
          className="gradient-pink text-white px-6 py-3 rounded-2xl font-700 shadow-lg shadow-pink-200 hover:scale-105 transition-transform flex items-center gap-2"
        >
          <LogIn size={18} />
          Log In or Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-border px-4 py-4 sticky top-[65px] z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-600 transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h1 className="font-800 text-foreground">My Meal History</h1>
          <div className="text-sm text-muted-foreground font-500">
            {meals.length} meal{meals.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shimmer h-32 rounded-3xl" />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-700 text-foreground/60">No saved meals yet</h3>
            <p className="text-foreground/40 mt-2 mb-6">
              Build a meal and tap "Save this meal" after calculating your nutrition.
            </p>
            <button
              onClick={() => setLocation("/")}
              className="gradient-pink text-white px-6 py-3 rounded-2xl font-700 shadow-md hover:scale-105 transition-transform"
            >
              Start Building a Meal
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">📊</div>
                <div>
                  <p className="font-800 text-foreground text-sm">
                    Hi {user?.displayName}! You've logged {meals.length} meal{meals.length !== 1 ? "s" : ""}.
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Avg: {meals.length > 0 ? Math.round(meals.reduce((s, m) => s + m.total_calories, 0) / meals.length) : 0} cal per meal
                  </p>
                </div>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
