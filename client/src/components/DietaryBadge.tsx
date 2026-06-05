import { cn } from "@/lib/utils";
import { getDietaryBadge } from "@/lib/utils";

interface DietaryBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export function DietaryBadge({ type, size = "md" }: DietaryBadgeProps) {
  const badge = getDietaryBadge(type);
  return (
    <span
      className={cn(
        "badge-cute font-700",
        badge.color,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label}</span>
    </span>
  );
}
