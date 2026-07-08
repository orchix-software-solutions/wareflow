"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FilterDrawerProps, FilterGroup, FilterOption } from "./filter-drawer.types";

interface FilterOptionRowProps {
  option: FilterOption;
  type: "single" | "multi";
  checked: boolean;
  onToggle: () => void;
}

function FilterOptionRow({ option, type, checked, onToggle }: FilterOptionRowProps) {
  return (
    <button
      type="button"
      role={type === "multi" ? "checkbox" : "radio"}
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        "flex h-10 w-full items-center gap-3 rounded-lg px-3 transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.25)] focus-visible:ring-offset-1",
        checked ? "bg-[#F1F5F9]" : "hover:bg-[#F8FAFC]",
      )}
    >
      {type === "multi" ? (
        <span
          className={cn(
            "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] transition-colors duration-100",
            checked
              ? "border border-[#2563EB] bg-[#2563EB]"
              : "border-[1.5px] border-[#CBD5E1] bg-white hover:border-[#2563EB]",
          )}
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            {checked && (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <Check className="h-[11px] w-[11px] text-white" strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      ) : (
        <span
          className={cn(
            "relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors duration-100",
            checked ? "border border-[#2563EB]" : "border-[1.5px] border-[#CBD5E1] bg-white",
          )}
          aria-hidden="true"
        >
          <AnimatePresence initial={false}>
            {checked && (
              <motion.span
                key="dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, duration: 0.15 }}
                className="h-2 w-2 rounded-full bg-[#2563EB]"
              />
            )}
          </AnimatePresence>
        </span>
      )}
      <span className="flex-1 text-left text-[14px] text-[#0F172A]">{option.label}</span>
      {option.count !== undefined && (
        <span className="text-[13px] text-[#64748B]">{option.count}</span>
      )}
    </button>
  );
}

/** Returns the total number of active filter values across all groups. */
export function countActiveFilters(values: Record<string, string[]>): number {
  return Object.values(values).reduce((sum, arr) => sum + (arr?.length ?? 0), 0);
}

/** Slide-from-right filter drawer with draft state, focus trap, and body scroll lock. */
export function FilterDrawer({
  open,
  onOpenChange,
  title,
  description,
  groups,
  values,
  onChange,
  onReset,
}: FilterDrawerProps) {
  const titleId = useId();
  const descId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const [draft, setDraft] = useState<Record<string, string[]>>(values);

  useEffect(() => {
    if (open) {
      setDraft(values);
    }
  }, [open, values]);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
    } else if (wasOpenRef.current) {
      document.body.style.overflow = "";
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    }
    wasOpenRef.current = open;
    return () => {
      if (wasOpenRef.current) {
        document.body.style.overflow = "";
      }
    };
  }, [open]);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const toggleOption = useCallback((groupId: string, value: string, type: "single" | "multi") => {
    setDraft((prev) => {
      const current = prev[groupId] ?? [];
      if (value === "") {
        const next = { ...prev };
        delete next[groupId];
        return next;
      }
      if (type === "single") {
        return { ...prev, [groupId]: [value] };
      }
      if (current.includes(value)) {
        const updated = current.filter((v) => v !== value);
        if (updated.length === 0) {
          const next = { ...prev };
          delete next[groupId];
          return next;
        }
        return { ...prev, [groupId]: updated };
      }
      return { ...prev, [groupId]: [...current, value] };
    });
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[rgba(45,42,38,0.4)]"
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />

          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="fixed inset-y-0 right-0 z-40 flex w-full flex-col bg-white pb-16 sm:w-[380px] sm:border-l sm:border-[#E2E8F0] lg:pb-0"
          >
            <div className="flex shrink-0 items-start justify-between border-b border-[#F1F5F9] px-6 py-5">
              <div className="min-w-0 flex-1 pr-4">
                <h2 id={titleId} className="text-lg font-semibold text-[#0F172A]">
                  {title}
                </h2>
                <p id={descId} className="mt-1 text-[13px] text-[#64748B]">
                  {description}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close filter drawer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition-colors duration-150 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.25)] focus-visible:ring-offset-1"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {groups.map((group: FilterGroup) => {
                const groupSelections = draft[group.id] ?? [];
                const hasSelections = groupSelections.length > 0;
                const allOption: FilterOption = { value: "", label: "All" };
                const allOptions: FilterOption[] = [allOption, ...group.options];

                return (
                  <div key={group.id}>
                    <div className="mb-2 flex items-center">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                        {group.label}
                      </span>
                      {hasSelections && (
                        <span
                          className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div
                      role={group.type === "single" ? "radiogroup" : "group"}
                      aria-label={group.label}
                      className="flex flex-col gap-0.5"
                    >
                      {allOptions.map((option) => {
                        const isAllOption = option.value === "";
                        const checked = isAllOption
                          ? !hasSelections
                          : groupSelections.includes(option.value);

                        return (
                          <FilterOptionRow
                            key={option.value === "" ? "__all__" : option.value}
                            option={option}
                            type={group.type}
                            checked={checked}
                            onToggle={() => toggleOption(group.id, option.value, group.type)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="shrink-0 border-t border-[#F1F5F9] bg-white px-6 py-5"
              style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
            >
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    setDraft({});
                    onReset();
                  }}
                >
                  Reset All
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    onChange(draft);
                    onOpenChange(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
