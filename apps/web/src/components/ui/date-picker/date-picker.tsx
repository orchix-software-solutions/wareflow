"use client";

import { useState, useRef, useEffect, useCallback, useId, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
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
import type { DatePickerProps } from "./date-picker.types";

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatDate(date: Date, fmt: string): string {
  return fmt
    .replace("dd", pad(date.getDate()))
    .replace("MM", pad(date.getMonth() + 1))
    .replace("yyyy", String(date.getFullYear()));
}

export function parseDate(str: string): Date | null {
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31 || yyyy < 1000) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type CalView = "day" | "month" | "year";

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "dd/MM/yyyy",
  error,
  required,
  disabled,
  minDate,
  maxDate,
  format = "dd/MM/yyyy",
  className,
}: DatePickerProps) {
  const autoId = useId();
  const errorId = error ? `${autoId}-error` : undefined;

  const normalizeValue = useCallback((v: Date | string | null | undefined): Date | null => {
    if (!v) return null;
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
    const fromFmt = parseDate(v);
    if (fromFmt) return fromFmt;
    const fromIso = new Date(v);
    return isNaN(fromIso.getTime()) ? null : fromIso;
  }, []);

  const selectedDate = normalizeValue(value);
  const today = stripTime(new Date());

  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());
  const [calView, setCalView] = useState<CalView>("day");
  // yearRangeStart: first year shown in year-picker grid (block of 12)
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const base = selectedDate?.getFullYear() ?? today.getFullYear();
    return Math.floor(base / 12) * 12;
  });
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 12, rootBoundary: "viewport" }),
      shift({ padding: 12, rootBoundary: "viewport" }),
      size({
        padding: 12,
        rootBoundary: "viewport",
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            overflowY: "auto",
          });
        },
      }),
    ],
  });

  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      if (refs.domReference.current?.contains(target) || refs.floating.current?.contains(target))
        return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open, refs.domReference, refs.floating]);

  // ---- Day grid ----
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const firstDayIndex = firstDay;

  interface DayCell {
    day: number | null;
    date: Date | null;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
  }
  const cells: DayCell[] = [];
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: null, date: null, isToday: false, isSelected: false, isDisabled: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    cells.push({
      day: d,
      date,
      isToday: isSameDay(date, today),
      isSelected: !!selectedDate && isSameDay(date, selectedDate),
      isDisabled:
        (!!minDate && date < stripTime(minDate)) || (!!maxDate && date > stripTime(maxDate)),
    });
  }

  // ---- Helpers ----
  function openCalendar() {
    if (disabled) return;
    setCalView("day");
    setOpen(true);
    const ft = selectedDate ?? today;
    if (ft.getFullYear() === viewYear && ft.getMonth() === viewMonth)
      setFocusedIndex(firstDayIndex + ft.getDate() - 1);
    else setFocusedIndex(firstDayIndex);
  }

  function closeCalendar() {
    setOpen(false);
    setCalView("day");
    setFocusedIndex(null);
    (refs.domReference.current as HTMLButtonElement | null)?.focus();
  }

  function selectDay(date: Date) {
    onChange?.(date);
    closeCalendar();
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
    setFocusedIndex(firstDayIndex);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
    setFocusedIndex(firstDayIndex);
  }

  useEffect(() => {
    if (open && calView === "day" && focusedIndex !== null) {
      dayRefs.current[focusedIndex]?.focus();
    }
  }, [open, calView, focusedIndex, viewMonth, viewYear]);

  function handleDayGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!open || calView !== "day") return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeCalendar();
      return;
    }
    if (focusedIndex === null) return;
    const totalCells = cells.length;
    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        let n = focusedIndex + 1;
        while (n < totalCells && cells[n]?.day === null) n++;
        if (n < totalCells) setFocusedIndex(n);
        else {
          nextMonth();
          setFocusedIndex(
            getFirstDayOfMonth(
              viewMonth === 11 ? viewYear + 1 : viewYear,
              viewMonth === 11 ? 0 : viewMonth + 1,
            ),
          );
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        let p = focusedIndex - 1;
        while (p >= 0 && cells[p]?.day === null) p--;
        if (p >= 0) setFocusedIndex(p);
        else {
          const pm = viewMonth === 0 ? 11 : viewMonth - 1;
          const py = viewMonth === 0 ? viewYear - 1 : viewYear;
          setFocusedIndex(getFirstDayOfMonth(py, pm) + getDaysInMonth(py, pm) - 1);
          prevMonth();
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        const dn = focusedIndex + 7;
        if (dn < totalCells && cells[dn]?.day !== null) setFocusedIndex(dn);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const up = focusedIndex - 7;
        if (up >= 0 && cells[up]?.day !== null) setFocusedIndex(up);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        const cell = cells[focusedIndex];
        if (cell?.date && !cell.isDisabled) selectDay(cell.date);
        break;
      }
      case "PageUp": {
        e.preventDefault();
        prevMonth();
        break;
      }
      case "PageDown": {
        e.preventDefault();
        nextMonth();
        break;
      }
    }
  }

  // ---- Year picker ----
  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  function selectYear(y: number) {
    setViewYear(y);
    setYearRangeStart(Math.floor(y / 12) * 12);
    setCalView("month");
  }

  // ---- Month picker ----
  function selectMonth(m: number) {
    setViewMonth(m);
    setCalView("day");
  }

  const displayValue = selectedDate ? formatDate(selectedDate, format) : "";

  // ---- Header label & nav for each view ----
  const headerContent = () => {
    if (calView === "year") {
      return (
        <>
          <button
            type="button"
            onClick={() => setYearRangeStart((s) => s - 12)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[12px] font-semibold text-[#0F172A] select-none">
            {yearRangeStart} – {yearRangeStart + 11}
          </span>
          <button
            type="button"
            onClick={() => setYearRangeStart((s) => s + 12)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            <ChevronRight size={14} />
          </button>
        </>
      );
    }
    if (calView === "month") {
      return (
        <>
          <button
            type="button"
            onClick={() => setViewYear((y) => y - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setYearRangeStart(Math.floor(viewYear / 12) * 12);
              setCalView("year");
            }}
            className="text-[12px] font-semibold text-[#0F172A] select-none rounded-lg px-2 py-0.5 hover:bg-[#F8FAFC] transition-colors"
          >
            {viewYear}
          </button>
          <button
            type="button"
            onClick={() => setViewYear((y) => y + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            <ChevronRight size={14} />
          </button>
        </>
      );
    }
    // day view
    return (
      <>
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => {
            setYearRangeStart(Math.floor(viewYear / 12) * 12);
            setCalView("year");
          }}
          className="text-[12px] font-semibold text-[#0F172A] select-none rounded-lg px-2 py-0.5 hover:bg-[#F8FAFC] transition-colors"
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
        </button>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
        >
          <ChevronRight size={14} />
        </button>
      </>
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={autoId} className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <button
          ref={refs.setReference}
          id={autoId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={errorId}
          onClick={openCalendar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openCalendar();
            }
            if (e.key === "Escape" && open) closeCalendar();
          }}
          className={cn(
            "flex h-11 w-full items-center rounded-[10px] border border-[#E2E8F0] bg-white px-3.5 text-[14px] text-[#0F172A] transition-all duration-150",
            "hover:border-[#CBD5E1]",
            "focus-visible:border-[#2563EB] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(37,99,235,0.12)]",
            "disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:opacity-60",
            open && "border-[#2563EB] ring-[3px] ring-[rgba(37,99,235,0.12)] outline-none",
            error &&
              "border-[#DC3545] focus-visible:border-[#DC3545] focus-visible:ring-[rgba(220,53,69,0.1)]",
            "pr-[42px] text-left",
            className,
          )}
        >
          {displayValue ? (
            <span>{displayValue}</span>
          ) : (
            <span className="text-[#94A3B8]">{placeholder}</span>
          )}
        </button>
        <span
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
          aria-hidden="true"
        >
          <CalendarDays size={16} />
        </span>
      </div>

      <FloatingPortal>
        <AnimatePresence>
          {open && (
            <div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 9999 }}>
              <motion.div
                role="dialog"
                aria-label="Date picker"
                aria-modal="true"
                initial={{ opacity: 0, scaleY: 0.96, y: -4 }}
                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                exit={{ opacity: 0, scaleY: 0.96, y: -4 }}
                transition={{ duration: 0.13 }}
                style={{ transformOrigin: "top center" }}
                className="w-[252px] overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(45,42,38,0.12)]"
                onKeyDown={handleDayGridKeyDown}
              >
                {/* Header — shared across all views */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#F1F5F9]">
                  {headerContent()}
                </div>

                <AnimatePresence mode="wait">
                  {/* ---- YEAR VIEW ---- */}
                  {calView === "year" && (
                    <motion.div
                      key="year"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="grid grid-cols-4 gap-1 p-2"
                    >
                      {years.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => selectYear(y)}
                          className={cn(
                            "rounded-lg py-1.5 text-[12px] font-medium transition-colors hover:bg-[#F8FAFC]",
                            y === viewYear
                              ? "bg-[#2563EB] text-white hover:bg-[#2563EB]"
                              : "text-[#0F172A]",
                            y === today.getFullYear() &&
                              y !== viewYear &&
                              "border border-[#93C5FD]",
                          )}
                        >
                          {y}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* ---- MONTH VIEW ---- */}
                  {calView === "month" && (
                    <motion.div
                      key="month"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="grid grid-cols-3 gap-1 p-2"
                    >
                      {MONTH_SHORT.map((name, idx) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => selectMonth(idx)}
                          className={cn(
                            "rounded-lg py-1.5 text-[12px] font-medium transition-colors hover:bg-[#F8FAFC]",
                            idx === viewMonth && viewYear === (selectedDate?.getFullYear() ?? -1)
                              ? "bg-[#2563EB] text-white hover:bg-[#2563EB]"
                              : idx === viewMonth
                                ? "bg-[#F1F5F9] text-[#2563EB]"
                                : "text-[#0F172A]",
                            idx === today.getMonth() &&
                              viewYear === today.getFullYear() &&
                              idx !== viewMonth &&
                              "border border-[#93C5FD]",
                          )}
                        >
                          {name}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* ---- DAY VIEW ---- */}
                  {calView === "day" && (
                    <motion.div
                      key="day"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {/* Day-of-week headers */}
                      <div className="grid grid-cols-7 px-2 pt-1.5 pb-0.5">
                        {DAY_HEADERS.map((h, i) => (
                          <div
                            key={i}
                            className="flex h-7 items-center justify-center text-[10px] uppercase tracking-[0.04em] text-[#64748B] select-none"
                          >
                            {h}
                          </div>
                        ))}
                      </div>
                      {/* Day cells */}
                      <div className="grid grid-cols-7 px-2 pb-2">
                        {cells.map((cell, idx) => {
                          if (cell.day === null)
                            return <div key={`blank-${idx}`} className="h-8 w-8" />;
                          const isKbFocused = focusedIndex === idx;
                          return (
                            <button
                              key={`day-${cell.day}`}
                              ref={(el) => {
                                dayRefs.current[idx] = el;
                              }}
                              type="button"
                              tabIndex={isKbFocused ? 0 : -1}
                              disabled={cell.isDisabled}
                              onClick={() => cell.date && selectDay(cell.date)}
                              onFocus={() => setFocusedIndex(idx)}
                              aria-label={cell.date?.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                              aria-pressed={cell.isSelected}
                              aria-current={cell.isToday ? "date" : undefined}
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition-colors duration-100 select-none",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.25)]",
                                !cell.isSelected && "text-[#0F172A]",
                                !cell.isSelected && !cell.isDisabled && "hover:bg-[#F8FAFC]",
                                cell.isToday && !cell.isSelected && "border border-[#93C5FD]",
                                cell.isSelected && "bg-[#2563EB] text-white",
                                cell.isDisabled && "pointer-events-none opacity-30 text-[#94A3B8]",
                              )}
                            >
                              {cell.day}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
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
      </AnimatePresence>
    </div>
  );
}
