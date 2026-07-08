"use client";

import { useId, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChipSelectProps } from "./chip-select.types";

const chipHeightClass: Record<NonNullable<ChipSelectProps["size"]>, string> = {
  sm: "h-10",
  md: "h-11",
};

const columnsClass: Record<NonNullable<ChipSelectProps["columns"]>, string> = {
  2: "grid grid-cols-2",
  3: "grid grid-cols-3",
  4: "grid grid-cols-4",
};

export function ChipSelect({
  label,
  options,
  value,
  onChange,
  multiple = false,
  error,
  required,
  columns,
  size = "md",
  className,
}: ChipSelectProps) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const height = chipHeightClass[size];

  const isSelected = useCallback(
    (optionValue: string): boolean => {
      if (multiple) {
        return Array.isArray(value) ? value.includes(optionValue) : false;
      }
      return typeof value === "string" ? value === optionValue : false;
    },
    [value, multiple],
  );

  const handleClick = useCallback(
    (optionValue: string) => {
      if (!onChange) return;

      if (multiple) {
        const current = Array.isArray(value) ? value : [];
        const next = current.includes(optionValue)
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];
        onChange(next);
      } else {
        const current = typeof value === "string" ? value : "";
        onChange(current === optionValue ? "" : optionValue);
      }
    },
    [value, multiple, onChange],
  );

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label id={`${id}-label`} className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      <div
        role="group"
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-describedby={errorId}
        className={cn(columns ? columnsClass[columns] : "flex flex-wrap", "gap-2")}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);

          return (
            <motion.button
              key={option.value}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={selected}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
              onClick={() => handleClick(option.value)}
              className={cn(
                "inline-flex cursor-pointer items-center justify-center rounded-[8px] border px-4 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(37,99,235,0.12)]",
                height,
                selected
                  ? "border-[#0F172A] bg-[#0F172A] font-semibold text-white"
                  : "border-[#E2E8F0] bg-white font-medium text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
              )}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-[12px] text-[#DC3545]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
