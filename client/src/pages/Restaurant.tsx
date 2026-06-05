import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Search, ShoppingCart, Plus, Info, Flame, Beef, Wheat, Droplets } from "lucide-react";
import { api, type Restaurant as RestaurantType, type MenuItem } from "@/lib/api";
import { DietaryBadge } from "@/components/DietaryBadge";
import { cn, formatCalories, getCalorieColor } from "@/lib/utils";
import type { MealEntry } from "@/hooks/useMeal";

interface RestaurantPageProps {
  onAddItem: (item: MenuItem) => void;
  entries: MealEntry[];
  onGoToMeal: () => void;
  getTotalCalories: () => number;
}

const DIETARY_ITEM_FILTERS = [
  { value: "", label: "All" },
  { value: "vegetarian", label: "🥦 Veg" },
  { value: "vegan", label: "🌱 Vegan" },
  { value: "halal", label: "☪️ Halal" },
  { value: "gluten_free", label: "🌾 GF" },
];

export default function RestaurantPage({ onAddItem, entries, onGoToMeal, getTotalCalories }: RestaurantPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      api.restaurants.get(slug),
      api.menuItems.list({ restaurant_slug: slug }),
      api.menuItems.categories(slug),
    ]).then(([rest, menuItems, cats]) => {
      setRestaurant(rest);
      setItems(menuItems);
      setCategories(cats);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (dietaryFilter === "vegetarian" && !item.is_vegetarian) return false;
    if (dietaryFilter === "vegan" && !item.is_vegan) return false;
    if (dietaryFilter === "halal" && !item.is_halal) return false;
    if (dietaryFilter === "gluten_free" && !item.is_gluten_free) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleAdd = (item: MenuItem) => {
    onAddItem(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const mealItemCount = entries.reduce((s, e) => s + e.quantity, 0);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="shimmer h-40 rounded-3xl mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="shimmer h-28 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😢</div>
        <h2 className="text-xl font-700">Restaurant not found</h2>
        <button onClick={() => setLocation("/")} className="mt-4 text-primary font-700 underline">Back to home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="gradient-hero border-b border-border px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <button
            data-testid="button-back"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-600 mb-5 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>All Restaurants</span>
          </button>
          <div className="flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg flex-shrink-0"
              style={{ background: `${restaurant.logo_color}20`, border: `3px solid ${restaurant.logo_color}30` }}
            >
              {restaurant.logo_emoji}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-900 text-foreground">{restaurant.name}</h1>
              <p className="text-foreground/60 font-500 mt-1 text-sm leading-relaxed">{restaurant.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {restaurant.dietary_options.map((d) => (
                  <DietaryBadge key={d} type={d} size="sm" />
                ))}
              </div>
            </div>
          </div>

          {/* Search & filters */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
              <input
                data-testid="input-search-items"
                type="text"
                placeholder={`Search ${restaurant.name} menu...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-border focus:border-primary focus:outline-none font-600 text-sm transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {DIETARY_ITEM_FILTERS.map((f) => (
                <button
                  key={f.value}
                  data-testid={`filter-item-${f.value || "all"}`}
                  onClick={() => setDietaryFilter(f.value)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-700 transition-all ${
                    dietaryFilter === f.value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-border text-foreground/60 hover:border-primary/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          {categories.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-700 transition-all ${
                  !selectedCategory ? "bg-foreground text-white" : "bg-white/60 text-foreground/60 hover:bg-white"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-700 transition-all ${
                    selectedCategory === cat ? "bg-foreground text-white" : "bg-white/60 text-foreground/60 hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating meal cart */}
      {mealItemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <button
            data-testid="button-view-meal"
            onClick={onGoToMeal}
            className="flex items-center gap-3 bg-foreground text-white px-6 py-3.5 rounded-2xl shadow-2xl font-700 hover:scale-105 transition-all"
          >
            <ShoppingCart size={18} />
            <span>{mealItemCount} item{mealItemCount !== 1 ? "s" : ""} in meal</span>
            <span className="bg-primary text-white text-sm px-2.5 py-0.5 rounded-xl font-800">
              {formatCalories(getTotalCalories())} cal
            </span>
          </button>
        </motion.div>
      )}

      {/* Menu */}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-foreground/50 font-600">No items match your filters</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, categoryItems]) => (
            <section key={category} className="mb-8">
              <h2 className="text-base font-800 text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                {category}
                <span className="text-xs font-500 text-muted-foreground">({categoryItems.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    data-testid={`card-menu-item-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-border hover:border-primary/30 transition-colors group relative"
                  >
                    {addedId === item.id && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-emerald-50 rounded-2xl flex items-center justify-center z-10"
                      >
                        <span className="text-emerald-600 font-800 text-sm">✓ Added!</span>
                      </motion.div>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <h3 className="font-700 text-foreground text-sm leading-tight">{item.name}</h3>
                          <button
                            data-testid={`button-info-${item.id}`}
                            onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                            className="flex-shrink-0 mt-0.5"
                          >
                            <Info size={14} className="text-muted-foreground hover:text-primary transition-colors" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={cn("font-800 text-base", getCalorieColor(item.base_calories))}>
                            <Flame size={13} className="inline mr-0.5" />
                            {formatCalories(item.base_calories)} cal
                          </span>
                          <span className="text-xs text-foreground/40 font-600">
                            P:{Math.round(item.base_protein_g)}g · C:{Math.round(item.base_carbs_g)}g · F:{Math.round(item.base_fat_g)}g
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.is_vegetarian && <DietaryBadge type="vegetarian" size="sm" />}
                          {item.is_vegan && <DietaryBadge type="vegan" size="sm" />}
                          {item.is_halal && <DietaryBadge type="halal" size="sm" />}
                          {item.is_gluten_free && <DietaryBadge type="gluten-free" size="sm" />}
                        </div>
                      </div>
                      <button
                        data-testid={`button-add-${item.id}`}
                        onClick={() => handleAdd(item)}
                        className="flex-shrink-0 w-9 h-9 rounded-xl gradient-pink text-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Expanded info */}
                    {selectedItem?.id === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-border"
                      >
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[
                            { icon: <Flame size={14} />, label: "Calories", value: item.base_calories, unit: "" },
                            { icon: <Beef size={14} />, label: "Protein", value: item.base_protein_g, unit: "g" },
                            { icon: <Wheat size={14} />, label: "Carbs", value: item.base_carbs_g, unit: "g" },
                            { icon: <Droplets size={14} />, label: "Fat", value: item.base_fat_g, unit: "g" },
                          ].map((n) => (
                            <div key={n.label} className="bg-muted rounded-xl p-2">
                              <div className="text-primary flex justify-center mb-0.5">{n.icon}</div>
                              <div className="font-800 text-xs">{Math.round(Number(n.value))}{n.unit}</div>
                              <div className="text-muted-foreground text-xs font-500">{n.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <div className="font-700">{Math.round(item.base_sodium_mg)}mg</div>
                            <div className="text-muted-foreground">Sodium</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <div className="font-700">{Math.round(item.base_sugar_g)}g</div>
                            <div className="text-muted-foreground">Sugar</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2 text-center">
                            <div className="font-700">{Math.round(item.base_fiber_g)}g</div>
                            <div className="text-muted-foreground">Fiber</div>
                          </div>
                        </div>
                        {item.allergens.length > 0 && (
                          <div className="mt-2 text-xs text-rose-500 font-600">
                            ⚠️ Contains: {item.allergens.join(", ")}
                          </div>
                        )}
                        {item.data_source && (
                          <div className="text-xs text-muted-foreground mt-1.5">Source: {item.data_source}</div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
