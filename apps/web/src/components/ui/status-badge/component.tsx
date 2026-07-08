import { cn } from "@/lib/utils";
import type { StatusBadgeProps } from "./types";

const STATUS_CONFIG: Record<
  StatusBadgeProps["status"],
  { dot: string; text: string; bg: string; label: string }
> = {
  active: {
    dot: "bg-[#28A745]",
    text: "text-[#1E7A34]",
    bg: "bg-[rgba(40,167,69,0.08)]",
    label: "Active",
  },
  inactive: {
    dot: "bg-[#64748B]",
    text: "text-[#475569]",
    bg: "bg-[rgba(138,133,126,0.08)]",
    label: "Inactive",
  },
  pending: {
    dot: "bg-[#EA580C]",
    text: "text-[#C2410C]",
    bg: "bg-[rgba(234,88,12,0.08)]",
    label: "Pending",
  },
  suspended: {
    dot: "bg-[#DC3545]",
    text: "text-[#1D4ED8]",
    bg: "bg-[rgba(220,53,69,0.08)]",
    label: "Suspended",
  },
};

/** Status badge pill with colored dot */
export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bg,
        config.text,
        size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
