"use client";

import { cn } from "@/lib/utils";
import type { SegmentedTabsProps } from "./types";

export function SegmentedTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div className={cn("flex rounded-xl bg-slate-100 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 rounded-lg py-2 text-[13px] font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-white text-brand-900 shadow-sm"
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
