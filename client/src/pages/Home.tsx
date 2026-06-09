import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, MapPin, Zap, ChevronRight, Star, ChevronDown, X, Globe } from "lucide-react";
import { api, type Restaurant, type LocationData } from "@/lib/api";
import { DietaryBadge } from "@/components/DietaryBadge";

const DIETARY_FILTERS = [
  { value: "", label: "All", emoji: "🍽️" },
  { value: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "halal", label: "Halal", emoji: "☪️" },
  { value: "gluten-free", label: "Gluten Free", emoji: "🌾" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Burgers & Fast Food": "from-rose-400 to-orange-400",
  "Mexican Fast Food": "from-amber-400 to-yellow-400",
  "Chicken": "from-orange-400 to-amber-400",
  "Pizza": "from-red-400 to-rose-400",
  "Coffee & Drinks": "from-emerald-400 to-teal-400",
  "Coffee & Baked Goods": "from-amber-500 to-yellow-500",
  "Sandwiches & Subs": "from-lime-400 to-green-400",
  "Ice Cream & Burgers": "from-pink-400 to-purple-400",
  "Asian Fast Food": "from-red-400 to-pink-400",
  "Bakery & Cafe": "from-amber-300 to-yellow-400",
  "Chicken & Ribs": "from-orange-500 to-red-400",
  "Wings & Chicken": "from-yellow-400 to-orange-400",
  "Sandwiches": "from-teal-400 to-cyan-400",
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featured, setFeatured] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dietary, setDietary] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    total_restaurants: "0",
    total_items: "0",
    total_condiments: "0",
    total_categories: "0",
    total_cities: "0",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.restaurants.stats().then(setStats).catch(() => {});
    api.restaurants.list({ featured: "true" }).then(setFeatured).catch(() => {});
    api.restaurants.locations().then(setLocationData).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { search, dietary };
    if (selectedCity) params.city = selectedCity;
    if (selectedNeighborhood) params.neighborhood = selectedNeighborhood;
    api.restaurants
      .list(params)
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [search, dietary, selectedCity, selectedNeighborhood]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const grouped = restaurants.reduce<Record<string, Restaurant[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSelectedNeighborhood("");
    setCityDropdownOpen(false);
  };

  const clearLocation = () => {
    setSelectedCity("");
    setSelectedNeighborhood("");
  };

  const locationLabel = selectedNeighborhood
    ? `${selectedNeighborhood}, ${selectedCity}`
    : selectedCity || "All Locations";

  const isTorontoSelected = selectedCity.toLowerCase() === "toronto";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero px-4 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 left-10 text-5xl float opacity-60">🍔</div>
          <div className="absolute top-16 right-16 text-4xl float-slow opacity-50">🌮</div>
          <div className="absolute bottom-8 left-20 text-3xl float opacity-40">🍟</div>
          <div className="absolute bottom-12 right-12 text-4xl float-slow opacity-50">🍕</div>
          <div className="absolute top-1/2 left-6 text-2xl float opacity-30">☕</div>
          <div className="absolute top-1/3 right-8 text-3xl float-slow opacity-40">🌯</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-5 text-sm font-700 text-primary border border-primary/20 shadow-sm">
            <Sparkles size={14} className="text-primary" />
            <span>North America's Most Detailed Nutrition Tracker</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-900 text-foreground mb-4 leading-tight">
            Eat smart,{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              stay cute
            </span>{" "}
            🌸
          </h1>
          <p className="text-lg text-foreground/60 font-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Track every calorie, macro, and condiment from 30+ North American chains — down to the last pickle.
          </p>

          {/* Search + Location row */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search McDonald's, Subway, Chipotle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-lg shadow-pink-100 border-2 border-pink-100 focus:border-primary focus:outline-none font-600 text-base transition-all"
              />
            </div>

            {/* City picker */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCityDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 px-4 py-4 rounded-2xl bg-white shadow-lg border-2 font-600 text-base transition-all whitespace-nowrap ${
                  selectedCity
                    ? "border-primary text-primary shadow-primary/20"
                    : "border-pink-100 text-muted-foreground shadow-pink-100"
                }`}
              >
                <MapPin size={18} className={selectedCity ? "text-primary" : "text-muted-foreground"} />
                <span className="max-w-[140px] truncate">{locationLabel}</span>
                {selectedCity ? (
                  <X
                    size={16}
                    className="ml-1 opacity-60 hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); clearLocation(); }}
                  />
                ) : (
                  <ChevronDown size={16} className="opacity-50" />
                )}
              </button>

              <AnimatePresence>
                {cityDropdownOpen && locationData && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl shadow-pink-100 border border-border z-50 overflow-hidden"
                  >
                    <div className="p-2 max-h-80 overflow-y-auto">
                      <button
                        onClick={() => selectCity("")}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-600 text-left transition-colors ${
                          !selectedCity ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <Globe size={14} />
                        All Locations
                      </button>

                      <div className="px-3 py-1.5 text-xs font-800 text-muted-foreground uppercase tracking-wider mt-2">
                        🍁 Canada
                      </div>
                      {locationData.canada.map((loc) => (
                        <button
                          key={`${loc.city}-${loc.province_state}`}
                          onClick={() => selectCity(loc.city)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-600 text-left transition-colors ${
                            selectedCity === loc.city
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>
                            {loc.city}
                            <span className="text-muted-foreground font-500 ml-1 text-xs">
                              {loc.province_state}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {loc.chain_count} chains
                          </span>
                        </button>
                      ))}

                      <div className="px-3 py-1.5 text-xs font-800 text-muted-foreground uppercase tracking-wider mt-2">
                        🇺🇸 United States
                      </div>
                      {locationData.usa.map((loc) => (
                        <button
                          key={`${loc.city}-${loc.province_state}`}
                          onClick={() => selectCity(loc.city)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-600 text-left transition-colors ${
                            selectedCity === loc.city
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          <span>
                            {loc.city}
                            <span className="text-muted-foreground font-500 ml-1 text-xs">
                              {loc.province_state}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {loc.chain_count} chains
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mt-8 relative z-10"
        >
          {[
            { label: "Restaurants", value: stats.total_restaurants, emoji: "🏪" },
            { label: "Menu Items", value: stats.total_items, emoji: "🍽️" },
            { label: "Condiments", value: stats.total_condiments, emoji: "🧂" },
            { label: "Cities", value: stats.total_cities, emoji: "🌎" },
          ].map((s) => (
            <div key={s.label} className="bg-white/80 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-sm border border-white/60">
              <span className="text-lg mr-1.5">{s.emoji}</span>
              <span className="font-800 text-foreground">{s.value}+</span>
              <span className="text-foreground/50 text-sm font-500 ml-1">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Sticky filter bar */}
      <div className="bg-white border-b border-border sticky top-[65px] z-20">
        {/* Dietary filters */}
        <div className="px-4 pt-3 pb-2">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {DIETARY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setDietary(f.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-700 transition-all ${
                  dietary === f.value
                    ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                    : "bg-muted text-foreground/60 hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toronto neighbourhood chips */}
        <AnimatePresence>
          {isTorontoSelected && locationData && locationData.toronto_neighborhoods.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3">
                <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs font-700 text-muted-foreground pr-1">
                    <MapPin size={11} />
                    <span>Neighbourhood:</span>
                  </div>
                  <button
                    onClick={() => setSelectedNeighborhood("")}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-700 transition-all ${
                      !selectedNeighborhood
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : "bg-muted text-foreground/60 hover:bg-secondary"
                    }`}
                  >
                    All Toronto
                  </button>
                  {locationData.toronto_neighborhoods.map((n) => (
                    <button
                      key={n}
                      onClick={() => setSelectedNeighborhood(n === selectedNeighborhood ? "" : n)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-700 transition-all ${
                        selectedNeighborhood === n
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-muted text-foreground/60 hover:bg-secondary"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Location context banner */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3"
          >
            <MapPin size={16} className="text-primary flex-shrink-0" />
            <div className="flex-1">
              <span className="font-700 text-foreground">
                Showing chains available in{" "}
                <span className="text-primary">
                  {selectedNeighborhood ? `${selectedNeighborhood}, ` : ""}
                  {selectedCity}
                </span>
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                — nutrition data is standardized across all locations of each chain
              </span>
            </div>
            <button
              onClick={clearLocation}
              className="text-xs font-700 text-primary/70 hover:text-primary transition-colors flex-shrink-0"
            >
              Clear ×
            </button>
          </motion.div>
        )}

        {/* Featured section */}
        {!search && !dietary && !selectedCity && featured.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <h2 className="text-xl font-800 text-foreground">Popular Chains</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {featured.map((r, i) => (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => setLocation(`/restaurant/${r.slug}`)}
                  className="card-hover bg-white rounded-2xl p-4 text-center shadow-sm border border-border flex flex-col items-center gap-2 group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                    style={{ background: `${r.logo_color}20`, border: `2px solid ${r.logo_color}30` }}
                  >
                    {r.logo_emoji}
                  </div>
                  <span className="text-xs font-700 text-foreground/80 leading-tight group-hover:text-primary transition-colors">
                    {r.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* All restaurants by category */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="shimmer h-40 rounded-3xl" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-700 text-foreground/60">No restaurants found</h3>
            <p className="text-foreground/40 mt-2">
              {selectedCity
                ? `No chains found in ${selectedNeighborhood || selectedCity} matching your filters`
                : "Try a different search or filter"}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                    CATEGORY_COLORS[category] || "from-primary to-purple-400"
                  }`}
                />
                <h2 className="text-lg font-800 text-foreground">{category}</h2>
                <span className="text-sm text-muted-foreground font-500 ml-1">({items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    onClick={() => setLocation(`/restaurant/${r.slug}`)}
                    className="card-hover gradient-card rounded-3xl p-5 shadow-sm border border-border cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
                        style={{ background: `${r.logo_color}15`, border: `2px solid ${r.logo_color}25` }}
                      >
                        {r.logo_emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-800 text-foreground group-hover:text-primary transition-colors text-base">
                          {r.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5 mb-2">
                          <MapPin size={11} className="text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">
                            {selectedCity
                              ? `${selectedNeighborhood || selectedCity}${selectedCity !== r.headquarters ? "" : ""}`
                              : r.headquarters}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/50 font-500 leading-relaxed line-clamp-2">
                          {r.description}
                        </p>
                      </div>
                    </div>
                    {r.dietary_options.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {r.dietary_options.slice(0, 3).map((d) => (
                          <DietaryBadge key={d} type={d} size="sm" />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground font-500">{r.category}</span>
                      <div className="flex items-center gap-1 text-primary font-700 text-xs group-hover:gap-2 transition-all">
                        <Zap size={12} />
                        <span>View Menu</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
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
