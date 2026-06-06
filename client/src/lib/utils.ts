import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCalories(cal: number): string {
  return Math.round(cal).toLocaleString();
}

export function formatMacro(val: number, unit: string = "g"): string {
  return `${Math.round(val * 10) / 10}${unit}`;
}

export function getCalorieColor(calories: number): string {
  if (calories < 300) return "text-emerald-500";
  if (calories < 600) return "text-amber-500";
  if (calories < 900) return "text-orange-500";
  return "text-rose-500";
}

export function getDietaryBadge(type: string): { label: string; color: string; emoji: string } {
  const badges: Record<string, { label: string; color: string; emoji: string }> = {
    vegan: { label: "Vegan", color: "bg-emerald-100 text-emerald-700", emoji: "🌱" },
    vegetarian: { label: "Vegetarian", color: "bg-green-100 text-green-700", emoji: "🥦" },
    halal: { label: "Halal", color: "bg-teal-100 text-teal-700", emoji: "☪️" },
    "gluten-free": { label: "Gluten Free", color: "bg-amber-100 text-amber-700", emoji: "🌾" },
    "dairy-free": { label: "Dairy Free", color: "bg-blue-100 text-blue-700", emoji: "🥛" },
  };
  return badges[type] || { label: type, color: "bg-gray-100 text-gray-700", emoji: "✓" };
}
