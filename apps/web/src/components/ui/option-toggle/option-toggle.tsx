"use client";

import { useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { OptionToggleProps } from "./option-toggle.types";

export function OptionToggle({
  label,
  options,
  value,
  onChange,
  error,
  required,
  fullWidth = false,
  size = "md",
  className,
  disabled = false,
}: OptionToggleProps) {
  const instanceId = useId();
  const errorId = error ? `${instanceId}-error` : undefined;
  const pillId = `option-toggle-pill-${instanceId}`;

  const height = size === "md" ? "h-11" : "h-9";
  const textSize = size === "md" ? "text-[14px]" : "text-[13px]";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      <div
        role="group"
        aria-label={label}
        aria-describedby={errorId}
        className={cn("flex", fullWidth && "w-full")}
      >
        {options.map((option, index) => {
          const isFirst = index === 0;
          const isLast = index === options.length - 1;
          const isSelected = option.value === value;

          const borderRadius =
            isFirst && isLast
              ? "rounded-[10px]"
              : isFirst
                ? "rounded-l-[10px] rounded-r-none"
                : isLast
                  ? "rounded-r-[10px] rounded-l-none"
                  : "rounded-none";

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => !disabled && onChange?.(option.value)}
              className={cn(
                "relative inline-flex items-center justify-center gap-1.5 border px-4 transition-colors duration-150 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.25)]",
                height,
                textSize,
                borderRadius,
                isSelected
                  ? "border-[#93C5FD] bg-[#93C5FD] font-semibold text-white"
                  : "border-[#E2E8F0] bg-white font-medium text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
                !isFirst && !isSelected && "-ml-px",
                !isFirst && isSelected && "-ml-px",
                fullWidth && "flex-1",
                disabled && "cursor-not-allowed opacity-60",
              )}
              disabled={disabled}
            >
              {isSelected && (
                <motion.div
                  layoutId={pillId}
                  className="absolute inset-0 rounded-[inherit] bg-[#93C5FD]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {option.icon && (
                <span className="relative z-10 shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                  {option.icon}
                </span>
              )}
              <span className="relative z-10">{option.label}</span>
            </button>
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
