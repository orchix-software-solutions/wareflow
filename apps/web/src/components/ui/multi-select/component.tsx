"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MultiSelectProps } from "./types";

/** MultiSelect with tags, search filter, checkbox options, and animated dropdown */
export function MultiSelect({
  label,
  error,
  hint,
  placeholder = "Select...",
  options,
  value = [],
  onChange,
  disabled,
  required,
  maxSelections,
}: MultiSelectProps) {
  const autoId = useId();
  const errorId = error ? `${autoId}-error` : undefined;
  const hintId = hint && !error ? `${autoId}-hint` : undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedLabels = new Map(options.map((o) => [o.value, o.label]));

  const toggleOption = useCallback(
    (optionValue: string) => {
      if (disabled) return;
      const isSelected = value.includes(optionValue);
      let next: string[];
      if (isSelected) {
        next = value.filter((v) => v !== optionValue);
      } else {
        if (maxSelections && value.length >= maxSelections) return;
        next = [...value, optionValue];
      }
      onChange?.(next);
    },
    [value, onChange, disabled, maxSelections],
  );

  const removeTag = useCallback(
    (optionValue: string) => {
      if (disabled) return;
      onChange?.(value.filter((v) => v !== optionValue));
    },
    [value, onChange, disabled],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((i) => (i < filteredOptions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => (i > 0 ? i - 1 : filteredOptions.length - 1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const opt = filteredOptions[focusedIndex];
      if (opt && !opt.disabled) toggleOption(opt.value);
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={!!error}
        aria-describedby={errorId ?? hintId}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex min-h-[44px] w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2 text-[14px] transition-all duration-150 hover:border-[#CBD5E1] focus-within:border-[#2563EB] focus-within:ring-[3px] focus-within:ring-[rgba(37,99,235,0.12)]",
          error &&
            "border-[#DC3545] focus-within:border-[#DC3545] focus-within:ring-[rgba(220,53,69,0.1)]",
          disabled && "cursor-not-allowed bg-[#F8FAFC] opacity-60",
        )}
      >
        {value.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-md bg-[#F1F5F9] px-2 py-1 text-[12px] text-[#0F172A]"
          >
            {selectedLabels.get(v) ?? v}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(v);
              }}
              className="text-[#64748B] transition-colors hover:text-[#2563EB]"
              aria-label={`Remove ${selectedLabels.get(v) ?? v}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {value.length === 0 && !isOpen && <span className="text-[#94A3B8]">{placeholder}</span>}
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            transition={{ duration: 0.15, type: "spring", stiffness: 500, damping: 30 }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(45,42,38,0.08)]"
          >
            <div className="border-b border-[#F1F5F9] px-3.5 py-2">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setFocusedIndex(-1);
                }}
                placeholder="Search..."
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
              />
            </div>
            <ul role="listbox" aria-multiselectable="true" className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length === 0 && (
                <li className="px-3.5 py-2.5 text-[13px] text-[#64748B]">No results found</li>
              )}
              {filteredOptions.map((opt, i) => {
                const isSelected = value.includes(opt.value);
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!opt.disabled) toggleOption(opt.value);
                    }}
                    className={cn(
                      "flex h-10 cursor-pointer select-none items-center gap-3 rounded-lg px-3.5 text-[14px] text-[#0F172A] outline-none hover:bg-[#F8FAFC]",
                      i === focusedIndex && "bg-[#F8FAFC]",
                      isSelected && "bg-[#F1F5F9]",
                      opt.disabled && "pointer-events-none opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors",
                        isSelected ? "border-[#2563EB] bg-[#2563EB]" : "border-[#CBD5E1] bg-white",
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </span>
                    {opt.label}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

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
        {hint && !error && (
          <motion.p
            id={hintId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-[12px] text-[#64748B]"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
