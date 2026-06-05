# MacroCutie 🍓

A cute, hyper-detailed fast food nutrition calculator for North America. Track calories, macros, and condiments from 30+ major chains down to the last pickle.

## Architecture

- **Frontend**: React + TypeScript + Vite (port 5000) with Tailwind CSS
- **Backend**: Express + TypeScript API server (port 3001)
- **Database**: PostgreSQL (Replit built-in)
- **Font**: Nunito (Google Fonts)

## Running the App

Two workflows run simultaneously:
1. **Backend API** — `tsx server/index.ts` (port 3001) — auto-seeds the database on startup
2. **Start application** — `npx vite` (port 5000) — React dev server, proxies `/api` to the backend

## Key Features

- 30+ North American restaurant chains (US + Canada)
- 140+ menu items with full nutritional data (calories, protein, carbs, fat, saturated fat, sodium, sugar, fiber, cholesterol)
- 43+ condiments with brand info (Heinz, Hellmann's, Frank's RedHot, etc.)
- Dietary filters: vegetarian, vegan, halal, gluten-free
- Allergen information
- Meal builder with condiment customization
- Full nutrition breakdown with daily goal percentages
- Macro ring visualization

## Project Structure

```
client/           React frontend
  src/
    pages/        Home, Restaurant, MealBuilder, NutritionSummary
    components/   Navbar, MacroRing, NutritionBar, DietaryBadge
    hooks/        useMeal (global meal state)
    lib/          api.ts (API client), utils.ts
server/           Express backend
  db/             schema.ts, seed.ts, migrate.ts
  routes/         restaurants.ts, menuItems.ts, condiments.ts, nutrition.ts
```

## User Preferences

- Cute, pastel UI with pink/purple/mint color scheme
- Rounded corners everywhere (2xl-4xl border radius)
- Floating food emoji animations on hero
- North American focus (US + Canada)
- Monetization-ready structure
