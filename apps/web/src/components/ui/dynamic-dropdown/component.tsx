"use client";

import { useId, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check, Search, X, Plus, Loader2 } from "lucide-react";
import {
  useFloating,
  offset,
  flip,
  shift,
  size,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { cn } from "@/lib/utils";
import type { DynamicDropdownOption, DynamicDropdownProps } from "./types";

export function DynamicDropdown({
  options,
  value,
  displayValue,
  onChange,
  onSearchChange,
  loading,
  allowCreate,
  onCreate,
  label,
  hint,
  error,
  required,
  disabled,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
}: DynamicDropdownProps) {
  const autoId = useId();
  const errorId = error ? `${autoId}-error` : undefined;
  const hintId = hint && !error ? `${autoId}-hint` : undefined;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [creating, setCreating] = useState(false);
  const creatingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const onSearchChangeRef = useRef(onSearchChange);
  onSearchChangeRef.current = onSearchChange;

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(160, availableHeight)}px`,
          });
        },
      }),
    ],
  });

  // Detect mobile via matchMedia (bottom sheet below 640px)
  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    setIsMobile(media.matches);
    const listener = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Internal 300ms debounce before notifying the caller
  useEffect(() => {
    const timer = setTimeout(() => onSearchChangeRef.current(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const uniqueOptions = useMemo(() => {
    const seen = new Set<string>();
    return options.filter((o) => {
      if (!o.id) return false;
      if (seen.has(o.id)) return false;
      seen.add(o.id);
      return true;
    });
  }, [options]);

  const selectedOption = useMemo(
    () => uniqueOptions.find((o) => o.id === value),
    [uniqueOptions, value],
  );

  const trimmedSearch = search.trim();
  const showCreate =
    !!allowCreate &&
    !!onCreate &&
    trimmedSearch.length > 0 &&
    !uniqueOptions.some((o) => o.label.toLowerCase() === trimmedSearch.toLowerCase());
  const totalRows = uniqueOptions.length + (showCreate ? 1 : 0);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
    setActiveIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (option: DynamicDropdownOption) => {
      onChange(option);
      handleClose();
    },
    [onChange, handleClose],
  );

  const handleCreate = useCallback(async () => {
    if (!onCreate || creatingRef.current) return;
    const name = search.trim();
    if (!name) return;
    creatingRef.current = true;
    setCreating(true);
    try {
      const created = await onCreate(name);
      onChange(created);
      handleClose();
    } catch {
      // The caller's hook reports the error via toast; keep the panel open.
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  }, [onCreate, search, onChange, handleClose]);

  // Focus search + position highlight on the selected option when opening
  useEffect(() => {
    if (open) {
      const idx = uniqueOptions.findIndex((o) => o.id === value);
      setActiveIndex(idx >= 0 ? idx : 0);
      setTimeout(() => searchRef.current?.focus(), 30);
    }
  }, [open]);

  // Clamp the highlight when the option set changes
  useEffect(() => {
    setActiveIndex((prev) => {
      if (totalRows === 0) return -1;
      return Math.min(Math.max(prev, 0), totalRows - 1);
    });
  }, [totalRows]);

  // Keep the highlighted row in view
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  // Close on outside click (panel is portaled, so check trigger + panel)
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const trigger = refs.domReference.current;
      const panel = isMobile ? sheetRef.current : refs.floating.current;
      if (trigger?.contains(target) || panel?.contains(target)) return;
      handleClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, isMobile, handleClose, refs.domReference, refs.floating]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    if (!open || !isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || open) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        handleOpen();
      }
    },
    [disabled, open, handleOpen],
  );

  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (totalRows > 0) setActiveIndex((prev) => (prev + 1) % totalRows);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (totalRows > 0) {
          setActiveIndex((prev) => (prev - 1 + totalRows) % totalRows);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (showCreate && activeIndex === uniqueOptions.length) {
          void handleCreate();
        } else {
          const active = activeIndex >= 0 ? uniqueOptions[activeIndex] : undefined;
          if (active) handleSelect(active);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      } else if (e.key === "Tab") {
        handleClose();
      }
    },
    [totalRows, showCreate, activeIndex, uniqueOptions, handleCreate, handleSelect, handleClose],
  );

  const triggerLabel = selectedOption
    ? selectedOption.label
    : value
      ? (displayValue ?? value)
      : null;

  const searchRow = (
    <div className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-[#F1F5F9] bg-white px-2.5 py-1.5">
      <Search className="h-3 w-3 shrink-0 text-[#94A3B8]" />
      <input
        ref={searchRef}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
        className="flex-1 bg-transparent text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
      />
      {loading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#64748B]" />}
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
  );

  const renderRows = (rowHeightClass: string) => {
    if (uniqueOptions.length === 0 && !showCreate) {
      return <p className="px-3 py-4 text-center text-[13px] text-[#94A3B8]">{emptyMessage}</p>;
    }
    return (
      <>
        {uniqueOptions.map((option, index) => {
          const isSelected = option.id === value;
          const isActive = index === activeIndex;
          return (
            <button
              key={option.id}
              type="button"
              data-index={index}
              data-selected={isSelected}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-[13px] text-[#0F172A] transition-colors hover:bg-[#F8FAFC]",
                rowHeightClass,
                isActive && "bg-[#F8FAFC]",
                isSelected && "bg-[#F1F5F9] text-[#2563EB] font-medium",
              )}
            >
              <span className="flex-1 truncate">{option.label}</span>
              {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />}
            </button>
          );
        })}
        {showCreate && (
          <button
            type="button"
            data-index={uniqueOptions.length}
            disabled={creating}
            onClick={() => void handleCreate()}
            onMouseEnter={() => setActiveIndex(uniqueOptions.length)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-[13px] font-medium text-[#2563EB] transition-colors hover:bg-[#F8FAFC] disabled:pointer-events-none disabled:opacity-60",
              rowHeightClass,
              activeIndex === options.length && "bg-[#F8FAFC]",
            )}
          >
            {creating ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="flex-1 truncate">Add &quot;{trimmedSearch}&quot;</span>
          </button>
        )}
      </>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={refs.setReference}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-invalid={!!error}
        aria-describedby={errorId ?? hintId}
        disabled={disabled}
        onClick={handleOpen}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-[14px] text-[#0F172A] transition-all duration-150 hover:border-[#CBD5E1] focus:outline-none focus:ring-[3px] focus:ring-[rgba(37,99,235,0.12)] disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60",
          open ? "border-[#2563EB] ring-[3px] ring-[rgba(37,99,235,0.12)]" : "",
          error && !open
            ? "border-[#DC3545] focus:border-[#DC3545] focus:ring-[rgba(220,53,69,0.1)]"
            : "",
          className,
        )}
      >
        <span className={cn("truncate", !triggerLabel ? "text-[#94A3B8]" : "text-[#0F172A]")}>
          {triggerLabel ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 text-[#64748B] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <FloatingPortal>
        {/* Desktop: floating panel */}
        <AnimatePresence>
          {open && !isMobile && (
            <div ref={refs.setFloating} style={floatingStyles} className="z-[60]">
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                style={{ maxHeight: "inherit" }}
                className="flex flex-col overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(45,42,38,0.10)]"
                onKeyDown={handlePanelKeyDown}
              >
                {searchRow}
                <div ref={listRef} className="flex-1 max-h-60 overflow-y-auto p-1">
                  {renderRows("h-8")}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile: bottom sheet */}
        <AnimatePresence>
          {open && isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] bg-black/50"
                onClick={handleClose}
                aria-hidden="true"
              />
              <motion.div
                ref={sheetRef}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[85vh] flex-col overflow-hidden rounded-t-2xl bg-white"
                onKeyDown={handlePanelKeyDown}
              >
                {label && (
                  <div className="shrink-0 px-4 pb-1 pt-3">
                    <p className="text-[15px] font-semibold text-[#0F172A]">{label}</p>
                  </div>
                )}
                {searchRow}
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto p-1"
                  style={{
                    paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))",
                  }}
                >
                  {renderRows("h-9")}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </FloatingPortal>

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
