import { cn } from "@/lib/utils";
import type { SkeletonProps } from "./types";

/** Skeleton loading placeholder with shimmer animation */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-[#F1F5F9]", className)} {...props} />;
}
