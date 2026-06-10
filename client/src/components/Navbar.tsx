import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, BookOpen, LogIn, User, History, LogOut, ChevronDown } from "lucide-react";
import { cn, formatCalories } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  itemCount: number;
  totalCalories: number;
}

export function Navbar({ itemCount, totalCalories }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary font-700 text-sm hover:bg-primary/20 transition-colors"
              >
                <div className="w-6 h-6 gradient-pink rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-900">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.displayName}</span>
                <ChevronDown size={13} className={cn("transition-transform", menuOpen && "rotate-180")} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-pink-100 border border-border z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="font-700 text-foreground text-sm">{user.displayName}</div>
                    <div className="text-xs text-muted-foreground font-500 truncate">{user.email}</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => { setLocation("/history"); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-600 text-foreground hover:bg-muted transition-colors"
                    >
                      <History size={15} className="text-primary" />
                      My Meal History
                    </button>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); setLocation("/"); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-600 text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setLocation("/auth")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-700 text-primary hover:bg-primary/10 transition-colors"
            >
              <LogIn size={15} />
              <span>Log In</span>
            </button>
          )}

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
