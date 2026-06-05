import { cn } from "@/lib/utils";

interface NutritionBarProps {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  emoji?: string;
}

export function NutritionBar({ label, value, goal, unit, color, emoji }: NutritionBarProps) {
  const percent = Math.min((value / goal) * 100, 100);
  const isOver = value > goal;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-600 flex items-center gap-1.5">
          {emoji && <span>{emoji}</span>}
          <span className="text-foreground/80">{label}</span>
        </span>
        <span className={cn("font-700", isOver ? "text-rose-500" : "text-foreground/70")}>
          {value.toLocaleString()}{unit}
          <span className="text-foreground/40 font-500 ml-1">/ {goal.toLocaleString()}{unit}</span>
        </span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", isOver ? "bg-rose-400" : color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
