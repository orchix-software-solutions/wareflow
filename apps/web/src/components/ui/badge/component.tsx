import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { BadgeProps } from "./types";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sidebar-accent/10 text-sidebar-accent",
        success: "bg-emerald-500/10 text-emerald-400",
        warning: "bg-orange-500/10 text-orange-600",
        destructive: "bg-red-500/10 text-red-400",
        secondary: "bg-charcoal-300 text-warm-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/** Badge component for status labels and tags */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
