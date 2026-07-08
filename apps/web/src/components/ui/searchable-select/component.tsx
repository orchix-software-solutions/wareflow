"use client";

import { useId, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchableSelectProps } from "./types";

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  disabled,
  error,
  label,
  hint,
  required,
  className,
}: SearchableSelectProps) {
  const autoId = useId();
  const errorId = error ? `${autoId}-error` : undefined;
  const hintId = hint && !error ? `${autoId}-hint` : undefined;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const handleSelect = useCallback(
    (val: string) => {
      onValueChange?.(val);
      setOpen(false);
      setSearch("");
    },
    [onValueChange],
  );

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, handleClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  // Focus search when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }, [open]);

  // Scroll selected item into view when opening
  useEffect(() => {
    if (open && value && listRef.current) {
      setTimeout(() => {
        const el = listRef.current?.querySelector("[data-selected=true]");
        el?.scrollIntoView({ block: "nearest" });
      }, 50);
    }
  }, [open, value]);

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={errorId ?? hintId}
          disabled={disabled}
          onClick={handleOpen}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-[14px] text-[#0F172A] transition-all duration-150 hover:border-[#CBD5E1] focus:outline-none focus:ring-[3px] focus:ring-[rgba(37,99,235,0.12)] disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60",
            open ? "border-[#2563EB] ring-[3px] ring-[rgba(37,99,235,0.12)]" : "",
            error && !open
              ? "border-[#DC3545] focus:border-[#DC3545] focus:ring-[rgba(220,53,69,0.1)]"
              : "",
            className,
          )}
        >
          <span className={cn("truncate", !selectedOption ? "text-[#94A3B8]" : "text-[#0F172A]")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "ml-2 h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(45,42,38,0.10)]"
            >
              {/* Search input */}
              <div className="flex items-center gap-2 border-b border-[#F1F5F9] px-3 py-2">
                <Search className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex-1 bg-transparent text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="shrink-0 text-[#94A3B8] hover:text-[#64748B]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Options list */}
              <div ref={listRef} className="max-h-52 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <p className="px-3 py-4 text-center text-[13px] text-[#94A3B8]">
                    No results found
                  </p>
                ) : (
                  filtered.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        data-selected={isSelected}
                        disabled={option.disabled}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3.5 text-left text-[14px] text-[#0F172A] transition-colors hover:bg-[#F8FAFC] disabled:pointer-events-none disabled:opacity-50",
                          isSelected && "bg-[#F1F5F9] text-[#2563EB] font-medium",
                        )}
                      >
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
