import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sparkles, MapPin, Zap, ChevronRight, Star,
  X, Globe, Navigation, ChevronDown, Check,
} from "lucide-react";
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

function RestaurantCard({ r, isLocal, onClick }: { r: Restaurant; isLocal: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="card-hover gradient-card rounded-3xl p-4 sm:p-5 shadow-sm border border-border cursor-pointer group relative active:scale-95 transition-transform"
    >
      {isLocal && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-50 border border-green-200 text-green-600 rounded-full px-2 py-0.5 text-xs font-700">
          <MapPin size={9} />
          Near You
        </div>
      )}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md"
          style={{ background: `${r.logo_color}15`, border: `2px solid ${r.logo_color}25` }}
        >
          {r.logo_emoji}
        </div>
        <div className="flex-1 min-w-0 pr-10 sm:pr-12">
          <h3 className="font-800 text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
            {r.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 mb-1.5">
            <MapPin size={10} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{r.headquarters}</span>
          </div>
          <p className="text-xs text-foreground/50 font-500 leading-relaxed line-clamp-2 hidden sm:block">
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
        <div className="flex items-center gap-1 text-primary font-700 text-xs">
          <Zap size={12} />
          <span>View Menu</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

// ── City Picker Modal ─────────────────────────────────────────────────────────
function CityPickerModal({
  open,
  onClose,
  locationData,
  selectedCity,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  locationData: LocationData | null;
  selectedCity: string;
  onSelect: (city: string) => void;
}) {
  const [citySearch, setCitySearch] = useState("");

  const filterLoc = (list: LocationData["canada"]) =>
    list.filter((l) =>
      !citySearch || l.city.toLowerCase().includes(citySearch.toLowerCase()) ||
      l.province_state.toLowerCase().includes(citySearch.toLowerCase())
    );

  useEffect(() => {
    if (!open) setCitySearch("");
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Panel — bottom sheet on mobile, centered card on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[101] pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-white w-full sm:w-[480px] sm:max-h-[85vh] rounded-t-[2rem] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1.5 rounded-full bg-muted" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="font-800 text-foreground text-lg">📍 Set your city</h2>
                  <p className="text-xs text-muted-foreground font-500 mt-0.5">
                    Chains available near you will appear first
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="px-5 py-3 flex-shrink-0 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search city..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted text-sm font-600 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              {/* City list */}
              <div className="overflow-y-auto flex-1 p-3">
                {/* All North America */}
                <button
                  onClick={() => { onSelect(""); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-700 text-left transition-colors mb-1 ${
                    !selectedCity ? "bg-primary text-white shadow-md shadow-primary/30" : "hover:bg-muted"
                  }`}
                >
                  <Globe size={16} className={!selectedCity ? "text-white" : "text-muted-foreground"} />
                  <span className="flex-1">All of North America</span>
                  {!selectedCity && <Check size={15} />}
                </button>

                {/* Canada */}
                {locationData && filterLoc(locationData.canada).length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-800 text-muted-foreground uppercase tracking-wider">
                      🍁 Canada
                    </div>
                    {filterLoc(locationData.canada).map((loc) => (
                      <button
                        key={`${loc.city}-${loc.province_state}`}
                        onClick={() => onSelect(loc.city)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-700 text-left transition-colors mb-1 ${
                          selectedCity === loc.city
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "hover:bg-muted"
                        }`}
                      >
                        <MapPin size={14} className={selectedCity === loc.city ? "text-white" : "text-muted-foreground"} />
                        <span className="flex-1">
                          {loc.city}
                          <span className={`ml-2 text-xs font-500 ${selectedCity === loc.city ? "text-white/80" : "text-muted-foreground"}`}>
                            {loc.province_state}
                          </span>
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-700 ${
                          selectedCity === loc.city ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {loc.chain_count}
                        </span>
                        {selectedCity === loc.city && <Check size={14} />}
                      </button>
                    ))}
                  </>
                )}

                {/* USA */}
                {locationData && filterLoc(locationData.usa).length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-800 text-muted-foreground uppercase tracking-wider mt-1">
                      🇺🇸 United States
                    </div>
                    {filterLoc(locationData.usa).map((loc) => (
                      <button
                        key={`${loc.city}-${loc.province_state}`}
                        onClick={() => onSelect(loc.city)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-700 text-left transition-colors mb-1 ${
                          selectedCity === loc.city
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "hover:bg-muted"
                        }`}
                      >
                        <MapPin size={14} className={selectedCity === loc.city ? "text-white" : "text-muted-foreground"} />
                        <span className="flex-1">
                          {loc.city}
                          <span className={`ml-2 text-xs font-500 ${selectedCity === loc.city ? "text-white/80" : "text-muted-foreground"}`}>
                            {loc.province_state}
                          </span>
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-700 ${
                          selectedCity === loc.city ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {loc.chain_count}
                        </span>
                        {selectedCity === loc.city && <Check size={14} />}
                      </button>
                    ))}
                  </>
                )}

                {locationData && filterLoc(locationData.canada).length === 0 && filterLoc(locationData.usa).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm font-600">
                    No cities match "{citySearch}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Home component ──────────────────────────────────────────────────────
export default function Home() {
  const [, setLocation] = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [featured, setFeatured] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dietary, setDietary] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [selectedCity, setSelectedCity] = useState(() => localStorage.getItem("mc_city") ?? "");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(() => localStorage.getItem("mc_hood") ?? "");
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [locationPromptDismissed, setLocationPromptDismissed] = useState(
    () => localStorage.getItem("mc_prompt_dismissed") === "true"
  );
  const [stats, setStats] = useState({
    total_restaurants: "0",
    total_items: "0",
    total_condiments: "0",
    total_cities: "0",
  });

  useEffect(() => {
    api.restaurants.stats().then(setStats).catch(() => {});
    api.restaurants.list({ featured: "true" }).then(setFeatured).catch(() => {});
    api.restaurants.locations().then(setLocationData).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("mc_city", selectedCity);
      localStorage.setItem("mc_hood", selectedNeighborhood);
    } else {
      localStorage.removeItem("mc_city");
      localStorage.removeItem("mc_hood");
    }
  }, [selectedCity, selectedNeighborhood]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { search, dietary };
    if (selectedCity) params.city = selectedCity;
    if (selectedNeighborhood) params.neighborhood = selectedNeighborhood;
    api.restaurants.list(params)
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [search, dietary, selectedCity, selectedNeighborhood]);

  const grouped = restaurants.reduce<Record<string, Restaurant[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const localRestaurants = restaurants.filter((r) => r.available_locally);
  const otherRestaurants = restaurants.filter((r) => !r.available_locally);
  const isTorontoSelected = selectedCity.toLowerCase() === "toronto";

  const selectCity = (city: string) => {
    setSelectedCity(city);
    setSelectedNeighborhood("");
    setCityModalOpen(false);
    setLocationPromptDismissed(true);
    localStorage.setItem("mc_prompt_dismissed", "true");
  };

  const clearLocation = () => {
    setSelectedCity("");
    setSelectedNeighborhood("");
  };

  const locationLabel = selectedNeighborhood
    ? `${selectedNeighborhood}, ${selectedCity}`
    : selectedCity || "Set city";

  return (
    <div className="min-h-screen">
      {/* City Picker Modal — rendered at root level, no overflow issues */}
      <CityPickerModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        locationData={locationData}
        selectedCity={selectedCity}
        onSelect={selectCity}
      />

      {/* Hero */}
      <section className="gradient-hero px-4 pt-10 pb-10 text-center relative">
        {/* Floating food emojis */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 left-6 sm:left-10 text-4xl sm:text-5xl float opacity-40 sm:opacity-60">🍔</div>
          <div className="absolute top-14 right-10 sm:right-16 text-3xl sm:text-4xl float-slow opacity-30 sm:opacity-50">🌮</div>
          <div className="absolute bottom-6 left-12 sm:left-20 text-2xl sm:text-3xl float opacity-25 sm:opacity-40">🍟</div>
          <div className="absolute bottom-10 right-8 sm:right-12 text-3xl sm:text-4xl float-slow opacity-30 sm:opacity-50">🍕</div>
          <div className="absolute top-1/2 left-4 sm:left-6 text-xl sm:text-2xl float opacity-20 sm:opacity-30 hidden sm:block">☕</div>
          <div className="absolute top-1/3 right-6 sm:right-8 text-2xl sm:text-3xl float-slow opacity-25 sm:opacity-40 hidden sm:block">🌯</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 text-xs sm:text-sm font-700 text-primary border border-primary/20 shadow-sm">
            <Sparkles size={13} className="text-primary" />
            <span>Canada &amp; North America's Nutrition Tracker</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-900 text-foreground mb-3 leading-tight">
            Eat smart,{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              stay cute
            </span>{" "}
            🌸
          </h1>
          <p className="text-sm sm:text-base text-foreground/60 font-500 mb-7 max-w-xl mx-auto leading-relaxed">
            Look up exact calories &amp; macros for 30+ chains before you eat — from Tim Hortons to Taco Bell, down to the last pickle.
          </p>

          {/* Search + Location */}
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search McDonald's, Tim Hortons, Subway..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white shadow-lg shadow-pink-100 border-2 border-pink-100 focus:border-primary focus:outline-none font-600 text-sm sm:text-base transition-all"
              />
            </div>

            {/* City picker button — opens modal */}
            <button
              onClick={() => setCityModalOpen(true)}
              className={`w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl bg-white shadow-lg border-2 font-600 text-sm sm:text-base transition-all ${
                selectedCity
                  ? "border-primary text-primary shadow-primary/20"
                  : "border-pink-100 text-muted-foreground shadow-pink-100"
              }`}
            >
              <Navigation
                size={17}
                className={selectedCity ? "text-primary fill-primary/20 flex-shrink-0" : "text-muted-foreground flex-shrink-0"}
              />
              <span className="flex-1 text-left truncate">{locationLabel}</span>
              {selectedCity ? (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); clearLocation(); }}
                  className="flex-shrink-0 opacity-50 hover:opacity-100 p-1 -m-1 rounded-lg hover:bg-primary/10 transition-all"
                >
                  <X size={15} />
                </span>
              ) : (
                <ChevronDown size={15} className="flex-shrink-0 opacity-50" />
              )}
            </button>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-7"
          >
            {[
              { label: "Restaurants", value: stats.total_restaurants, emoji: "🏪" },
              { label: "Menu Items", value: stats.total_items, emoji: "🍽️" },
              { label: "Condiments", value: stats.total_condiments, emoji: "🧂" },
              { label: "Cities", value: stats.total_cities, emoji: "🌎" },
            ].map((s) => (
              <div key={s.label} className="bg-white/80 backdrop-blur-sm rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm border border-white/60">
                <span className="text-sm sm:text-base mr-1">{s.emoji}</span>
                <span className="font-800 text-foreground text-sm sm:text-base">{s.value}+</span>
                <span className="text-foreground/50 text-xs sm:text-sm font-500 ml-1 hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky filter bar */}
      <div className="bg-white border-b border-border sticky top-[65px] z-20 shadow-sm">
        <div className="px-4 pt-2.5 pb-2">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            {DIETARY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setDietary(f.value)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-700 transition-all ${
                  dietary === f.value
                    ? "bg-primary text-white shadow-md shadow-primary/30"
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
              className="overflow-hidden border-t border-border/50"
            >
              <div className="px-4 py-2">
                <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto no-scrollbar items-center">
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs font-700 text-muted-foreground pr-1">
                    <MapPin size={10} />
                    <span className="hidden sm:inline">Neighbourhood:</span>
                    <span className="sm:hidden">Area:</span>
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

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* Location set prompt */}
        <AnimatePresence>
          {!selectedCity && !locationPromptDismissed && !search && !dietary && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4"
            >
              <div className="text-2xl sm:text-3xl flex-shrink-0">📍</div>
              <div className="flex-1 min-w-0">
                <p className="font-700 text-foreground text-xs sm:text-sm">Set your location for personalised results</p>
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  We'll show chains available near you first.
                </p>
              </div>
              <button
                onClick={() => setCityModalOpen(true)}
                className="flex-shrink-0 gradient-pink text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-700 shadow-sm hover:scale-105 transition-transform"
              >
                Set City
              </button>
              <button
                onClick={() => { setLocationPromptDismissed(true); localStorage.setItem("mc_prompt_dismissed", "true"); }}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active location banner */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 sm:px-5 py-3"
          >
            <Navigation size={14} className="text-green-600 fill-green-100 flex-shrink-0" />
            <span className="font-700 text-foreground text-xs sm:text-sm flex-1">
              Showing chains near{" "}
              <span className="text-green-700">
                {selectedNeighborhood ? `${selectedNeighborhood}, ` : ""}
                {selectedCity}
              </span>
            </span>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
              <span>
                <span className="font-700 text-green-600">{localRestaurants.length}</span> near you
              </span>
              <button
                onClick={() => setCityModalOpen(true)}
                className="font-700 text-primary/70 hover:text-primary transition-colors"
              >
                Change
              </button>
              <button onClick={clearLocation} className="font-700 text-rose-400 hover:text-rose-600 transition-colors">
                Clear ×
              </button>
            </div>
          </motion.div>
        )}

        {/* ── No city: categorised view ── */}
        {!selectedCity && (
          <>
            {!search && !dietary && featured.length > 0 && (
              <section className="mb-8 sm:mb-10">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <h2 className="text-lg sm:text-xl font-800 text-foreground">Popular Chains</h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
                  {featured.map((r, i) => (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      onClick={() => setLocation(`/restaurant/${r.slug}`)}
                      className="card-hover bg-white rounded-2xl p-2.5 sm:p-4 text-center shadow-sm border border-border flex flex-col items-center gap-1.5 sm:gap-2 group active:scale-95 transition-transform"
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm sm:shadow-md"
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

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shimmer h-32 sm:h-40 rounded-3xl" />
                ))}
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-700 text-foreground/60">No restaurants found</h3>
                <p className="text-foreground/40 mt-2 text-sm">Try a different search or filter</p>
              </div>
            ) : (
              Object.entries(grouped).map(([category, items]) => (
                <section key={category} className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category] || "from-primary to-purple-400"}`} />
                    <h2 className="text-base sm:text-lg font-800 text-foreground">{category}</h2>
                    <span className="text-xs sm:text-sm text-muted-foreground font-500 ml-1">({items.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {items.map((r) => (
                      <RestaurantCard key={r.id} r={r} isLocal={false} onClick={() => setLocation(`/restaurant/${r.slug}`)} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </>
        )}

        {/* ── City selected: local-first two-section view ── */}
        {selectedCity && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shimmer h-32 sm:h-40 rounded-3xl" />
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-700 text-foreground/60">No restaurants found</h3>
                <p className="text-foreground/40 mt-2 text-sm">Try adjusting your search or dietary filters</p>
              </div>
            ) : (
              <>
                {localRestaurants.length > 0 && (
                  <section className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 mb-4 sm:mb-5">
                      <div className="w-7 h-7 bg-green-100 rounded-xl flex items-center justify-center">
                        <Navigation size={13} className="text-green-600" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-800 text-foreground">
                        Near You in {selectedNeighborhood || selectedCity}
                      </h2>
                      <span className="text-xs sm:text-sm text-muted-foreground font-500">({localRestaurants.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {localRestaurants.map((r) => (
                        <RestaurantCard key={r.id} r={r} isLocal={true} onClick={() => setLocation(`/restaurant/${r.slug}`)} />
                      ))}
                    </div>
                  </section>
                )}

                {otherRestaurants.length > 0 && (
                  <section className="mb-8">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="w-7 h-7 bg-muted rounded-xl flex items-center justify-center">
                        <Globe size={13} className="text-muted-foreground" />
                      </div>
                      <h2 className="text-base sm:text-lg font-700 text-muted-foreground">Other Chains</h2>
                      <span className="text-xs sm:text-sm text-muted-foreground font-500">
                        ({otherRestaurants.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 opacity-75">
                      {otherRestaurants.map((r) => (
                        <RestaurantCard key={r.id} r={r} isLocal={false} onClick={() => setLocation(`/restaurant/${r.slug}`)} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
