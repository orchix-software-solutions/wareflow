"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface FilterGroup {
  id: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface ActiveFilterChipsProps {
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onRemoveGroup: (groupId: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  groups,
  values,
  onRemoveGroup,
  onClearAll,
}: ActiveFilterChipsProps) {
  const activeChips = groups
    .filter((group) => (values[group.id]?.length ?? 0) > 0)
    .map((group) => {
      const activeValues = values[group.id] ?? [];
      const labels = activeValues
        .map((v) => group.options.find((o) => o.value === v)?.label ?? v)
        .join(", ");
      return { groupId: group.id, groupLabel: group.label, labels };
    });

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <AnimatePresence>
        {activeChips.map(({ groupId, groupLabel, labels }, index) => (
          <motion.div
            key={groupId}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.15, delay: index * 0.05 }}
          >
            <div className="flex items-center gap-1.5 rounded-[20px] bg-[#F1F5F9] px-3 py-1.5">
              <span className="text-[13px] text-[#0F172A]">
                {groupLabel}: {labels}
              </span>
              <button
                onClick={() => onRemoveGroup(groupId)}
                className={cn(
                  "flex items-center justify-center text-[#64748B] transition-colors hover:text-[#2563EB]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.25)] focus-visible:ring-offset-1",
                )}
                aria-label={`Remove ${groupLabel} filter`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={onClearAll}
        className={cn(
          "text-[13px] uppercase tracking-[0.05em] font-semibold text-[#64748B] transition-colors hover:text-[#2563EB]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.25)] focus-visible:ring-offset-1",
        )}
      >
        Clear All
      </button>
    </div>
  );
}
