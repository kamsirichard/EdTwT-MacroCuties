import { Route, Switch, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import RestaurantPage from "@/pages/Restaurant";
import MealBuilder from "@/pages/MealBuilder";
import NutritionSummary from "@/pages/NutritionSummary";
import About from "@/pages/About";
import { useMeal } from "@/hooks/useMeal";

export default function App() {
  const [, setLocation] = useLocation();
  const meal = useMeal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar itemCount={meal.itemCount} totalCalories={meal.getTotalCalories()} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/restaurant/:slug">
          {(params) => (
            <RestaurantPage
              onAddItem={meal.addItem}
              entries={meal.entries}
              onGoToMeal={() => setLocation("/meal")}
              getTotalCalories={meal.getTotalCalories}
            />
          )}
        </Route>
        <Route path="/meal">
          <MealBuilder
            entries={meal.entries}
            onRemoveItem={meal.removeItem}
            onUpdateQuantity={meal.updateQuantity}
            onAddCondiment={meal.addCondiment}
            onRemoveCondiment={meal.removeCondiment}
            onUpdateCondimentQty={meal.updateCondimentQty}
            getTotalCalories={meal.getTotalCalories}
            onCalculate={() => setLocation("/results")}
            onClear={meal.clearMeal}
          />
        </Route>
        <Route path="/results">
          <NutritionSummary
            mealItems={meal.toMealItems()}
            onClear={meal.clearMeal}
          />
        </Route>
        <Route>
          <div className="min-h-screen gradient-hero flex flex-col items-center justify-center text-center px-4">
            <div className="text-6xl mb-4 float">🌸</div>
            <h1 className="text-3xl font-800 mb-2">Page not found</h1>
            <p className="text-foreground/50 mb-5 font-500">Looks like this page went for fries without us!</p>
            <button
              onClick={() => setLocation("/")}
              className="gradient-pink text-white px-6 py-3 rounded-2xl font-700 shadow-lg hover:scale-105 transition-transform"
            >
              Back to Home
            </button>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
