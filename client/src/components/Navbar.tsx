import { useLocation } from "wouter";
import { ShoppingCart, BookOpen } from "lucide-react";
import { cn, formatCalories } from "@/lib/utils";

interface NavbarProps {
  itemCount: number;
  totalCalories: number;
}

export function Navbar({ itemCount, totalCalories }: NavbarProps) {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-30 shadow-sm shadow-pink-50">
      <div className="max-w-6xl mx-auto px-4 h-[65px] flex items-center justify-between">
        <button
          data-testid="link-home"
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 gradient-pink rounded-xl flex items-center justify-center shadow-md shadow-pink-200">
            <span className="text-white text-lg">🍓</span>
          </div>
          <div>
            <span className="font-900 text-lg text-foreground leading-none block">MacroCutie</span>
            <span className="text-xs text-muted-foreground font-500 leading-none">North America Nutrition Tracker</span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocation("/about")}
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-600 transition-all",
              location === "/about"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <BookOpen size={15} />
            <span>About & Data</span>
          </button>

          <button
            data-testid="button-meal-cart"
            onClick={() => setLocation("/meal")}
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-xl font-700 text-sm transition-all",
              itemCount > 0
                ? "gradient-pink text-white shadow-md shadow-pink-200 hover:scale-105"
                : "bg-muted text-foreground/50 hover:bg-secondary hover:text-secondary-foreground"
            )}
          >
            <ShoppingCart size={16} />
            {itemCount > 0 ? (
              <>
                <span>{itemCount}</span>
                <span className="hidden sm:inline">· {formatCalories(totalCalories)} cal</span>
              </>
            ) : (
              <span>My Meal</span>
            )}
            {itemCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full text-white text-xs flex items-center justify-center font-800 shadow-sm">
                {itemCount > 9 ? "9+" : itemCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
