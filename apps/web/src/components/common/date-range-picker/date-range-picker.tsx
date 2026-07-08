"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { DateRange, DateRangePickerProps } from "./date-range-picker.types";

// ---------------------------------------------------------------------------
// Date utilities
// ---------------------------------------------------------------------------

const MONTHS_SHORT = [
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
] as const;

function formatShort(d: Date): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatRange(from: Date | null, to: Date | null): string {
  if (!from) return "";
  if (!to || isSameDay(from, to)) return formatShort(from);
  const fromStr = `${MONTHS_SHORT[from.getMonth()]} ${from.getDate()}`;
  const toStr = `${MONTHS_SHORT[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;
  return `${fromStr} — ${toStr}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isToday(d: Date): boolean {
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

// ---------------------------------------------------------------------------
// Preset computation
// ---------------------------------------------------------------------------

type PresetKey =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "last90days"
  | "thisYear";

interface PresetDef {
  key: PresetKey;
  label: string;
}

const PRESETS: PresetDef[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last7days", label: "Last 7 Days" },
  { key: "last30days", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "last90days", label: "Last 90 Days" },
  { key: "thisYear", label: "This Year" },
];

function computePreset(key: PresetKey): DateRange {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const today = startOfDay(now);

  switch (key) {
    case "today":
      return { from: today, to: today };
    case "yesterday": {
      const d = new Date(y, m, today.getDate() - 1);
      return { from: d, to: d };
    }
    case "last7days":
      return {
        from: new Date(y, m, today.getDate() - 6),
        to: today,
      };
    case "last30days":
      return {
        from: new Date(y, m, today.getDate() - 29),
        to: today,
      };
    case "thisMonth":
      return { from: new Date(y, m, 1), to: today };
    case "lastMonth": {
      const firstOfLastMonth = new Date(y, m - 1, 1);
      const lastOfLastMonth = new Date(y, m, 0);
      return { from: firstOfLastMonth, to: lastOfLastMonth };
    }
    case "last90days":
      return {
        from: new Date(y, m, today.getDate() - 89),
        to: today,
      };
    case "thisYear":
      return { from: new Date(y, 0, 1), to: today };
  }
}

// ---------------------------------------------------------------------------
// CalendarMonth (internal)
// ---------------------------------------------------------------------------

interface CalendarMonthProps {
  year: number;
  month: number;
  draftFrom: Date | null;
  draftTo: Date | null;
  hoverDate: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  showPrev: boolean;
  showNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

function CalendarMonth({
  year,
  month,
  draftFrom,
  draftTo,
  hoverDate,
  onDayClick,
  onDayHover,
  showPrev,
  showNext,
  onPrev,
  onNext,
}: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Determine effective range end for hover highlighting
  const rangeEnd = draftFrom && !draftTo ? hoverDate : draftTo;

  function isInRange(d: Date): boolean {
    if (!draftFrom) return false;
    const end = rangeEnd;
    if (!end) return false;
    const from = draftFrom < end ? draftFrom : end;
    const to = draftFrom < end ? end : draftFrom;
    return d > from && d < to;
  }

  function isFrom(d: Date): boolean {
    return draftFrom !== null && isSameDay(d, draftFrom);
  }

  function isTo(d: Date): boolean {
    return draftTo !== null && isSameDay(d, draftTo);
  }

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(year, month, i));
  }

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
  ] as const;

  return (
    <div className="flex flex-col gap-1 select-none w-full">
      {/* Header */}
      <div className="flex items-center justify-between h-6">
        {showPrev ? (
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#F8FAFC] text-[#64748B] transition-colors"
          >
            <ChevronLeft size={13} />
          </button>
        ) : (
          <div className="w-6" />
        )}
        <span className="text-[12px] font-semibold text-[#0F172A]">
          {MONTH_NAMES[month]} {year}
        </span>
        {showNext ? (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-[#F8FAFC] text-[#64748B] transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-6 text-[10px] text-[#64748B] font-medium"
          >
            {d}
          </div>
        ))}

        {/* Day cells — full-width columns, fixed 28px row height */}
        {cells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="h-7" />;
          }

          const from = isFrom(cell);
          const to = isTo(cell);
          const inRange = isInRange(cell);
          const today = isToday(cell);

          return (
            <div key={cell.toISOString()} className="flex items-center justify-center h-7">
              <button
                type="button"
                onClick={() => onDayClick(cell)}
                onMouseEnter={() => onDayHover(cell)}
                onMouseLeave={() => onDayHover(null)}
                className={cn(
                  "w-7 h-7 text-[12px] text-center cursor-pointer rounded-full transition-colors flex items-center justify-center shrink-0",
                  from || to
                    ? "bg-[#2563EB] text-white"
                    : inRange
                      ? "bg-[#F1F5F9] text-[#0F172A]"
                      : "hover:bg-[#F8FAFC] text-[#0F172A]",
                  today && !from && !to && "ring-1 ring-[#93C5FD] ring-inset",
                )}
              >
                {cell.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DateRangePicker({
  value,
  onChange,
  onReset,
  presets = true,
  className,
}: DateRangePickerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [isOpen, setIsOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState<Date | null>(null);
  const [draftTo, setDraftTo] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const now = new Date();
  const [leftViewYear, setLeftViewYear] = useState(now.getFullYear());
  const [leftViewMonth, setLeftViewMonth] = useState(now.getMonth());

  const prevIsOpen = useRef(false);
  const [panelMaxHeight, setPanelMaxHeight] = useState<number | undefined>(undefined);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "bottom-end",
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight }) {
          setPanelMaxHeight(availableHeight);
        },
      }),
    ],
  });

  // Seed draft when opening
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setDraftFrom(value.from);
      setDraftTo(value.to);
      setActivePreset(null);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, value.from, value.to]);

  // Close on outside click (desktop)
  useEffect(() => {
    if (!isDesktop || !isOpen) return;
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (refs.domReference.current?.contains(target) || refs.floating.current?.contains(target))
        return;
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isDesktop, isOpen, refs.domReference, refs.floating]);

  // Right month view is always leftView + 1
  const rightViewMonth = leftViewMonth === 11 ? 0 : leftViewMonth + 1;
  const rightViewYear = leftViewMonth === 11 ? leftViewYear + 1 : leftViewYear;

  function handlePrev() {
    if (leftViewMonth === 0) {
      setLeftViewMonth(11);
      setLeftViewYear((y) => y - 1);
    } else {
      setLeftViewMonth((m) => m - 1);
    }
  }

  function handleNext() {
    if (leftViewMonth === 11) {
      setLeftViewMonth(0);
      setLeftViewYear((y) => y + 1);
    } else {
      setLeftViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(d: Date) {
    if (!draftFrom) {
      setDraftFrom(d);
      setDraftTo(null);
      setActivePreset(null);
    } else if (draftFrom && !draftTo) {
      let from = draftFrom;
      let to = d;
      if (to < from) {
        [from, to] = [to, from];
      }
      setDraftFrom(from);
      setDraftTo(to);
      setActivePreset(null);
    } else {
      setDraftFrom(d);
      setDraftTo(null);
      setActivePreset(null);
    }
  }

  function handlePresetClick(key: PresetKey) {
    const range = computePreset(key);
    setDraftFrom(range.from);
    setDraftTo(range.to);
    setActivePreset(key);
  }

  function handleApply() {
    onChange({ from: draftFrom, to: draftTo });
    setIsOpen(false);
  }

  function handleReset() {
    setDraftFrom(null);
    setDraftTo(null);
    setActivePreset(null);
    onReset();
    setIsOpen(false);
  }

  const hasRange = value.from !== null;

  // ---------------------------------------------------------------------------
  // Trigger button
  // ---------------------------------------------------------------------------
  const TriggerButton = (
    <div
      ref={refs.setReference}
      className={cn(
        "h-11 rounded-[10px] flex items-center border font-semibold transition-colors overflow-hidden",
        hasRange
          ? "bg-[#F1F5F9] border-[#CBD5E1] text-[#2563EB]"
          : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 px-4 h-full"
      >
        <CalendarDays size={18} />
        <span className="text-[13px] font-semibold tracking-[0.05em] uppercase">
          {hasRange ? formatRange(value.from, value.to) : "Date Range"}
        </span>
      </button>
      {hasRange && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="mr-2 flex items-center justify-center rounded-full hover:bg-[#E2E8F0] w-5 h-5 transition-colors shrink-0"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );

  // ---------------------------------------------------------------------------
  // Presets section
  // ---------------------------------------------------------------------------
  const PresetsSection = presets ? (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-[0.08em] text-[#64748B] font-medium">
        Quick Select
      </span>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => handlePresetClick(p.key)}
            className={cn(
              "h-7 px-3 rounded-[8px] text-[11px] uppercase font-medium tracking-[0.05em] border cursor-pointer transition-colors",
              activePreset === p.key
                ? "bg-[#2563EB] text-white border-[#2563EB]"
                : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // Custom range section
  // ---------------------------------------------------------------------------
  function CustomRangeSection({ single = false }: { single?: boolean }) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[#64748B] font-medium">
          Custom Range
        </span>
        <div className="flex gap-2">
          <div
            className={cn(
              "flex-1 border border-[#E2E8F0] rounded-[8px] h-7 px-3 text-[12px] flex items-center gap-1",
            )}
          >
            <span className="text-[11px] uppercase text-[#64748B] font-medium mr-1">From:</span>
            {draftFrom ? (
              <span className="text-[#0F172A]">{formatShort(draftFrom)}</span>
            ) : (
              <span className="text-[#94A3B8]">Select date</span>
            )}
          </div>
          <div
            className={cn(
              "flex-1 border border-[#E2E8F0] rounded-[8px] h-7 px-3 text-[12px] flex items-center gap-1",
            )}
          >
            <span className="text-[11px] uppercase text-[#64748B] font-medium mr-1">To:</span>
            {draftTo ? (
              <span className="text-[#0F172A]">{formatShort(draftTo)}</span>
            ) : (
              <span className="text-[#94A3B8]">Select date</span>
            )}
          </div>
        </div>
        {single ? (
          <CalendarMonth
            year={leftViewYear}
            month={leftViewMonth}
            draftFrom={draftFrom}
            draftTo={draftTo}
            hoverDate={hoverDate}
            onDayClick={handleDayClick}
            onDayHover={setHoverDate}
            showPrev
            showNext
            onPrev={handlePrev}
            onNext={handleNext}
          />
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <CalendarMonth
                year={leftViewYear}
                month={leftViewMonth}
                draftFrom={draftFrom}
                draftTo={draftTo}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                showPrev
                showNext={false}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
            <div className="w-px bg-[#F1F5F9]" />
            <div className="flex-1 min-w-0">
              <CalendarMonth
                year={rightViewYear}
                month={rightViewMonth}
                draftFrom={draftFrom}
                draftTo={draftTo}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
                showPrev={false}
                showNext
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------------
  const Footer = (
    <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
      <Button variant="outline" size="sm" onClick={handleReset}>
        Reset
      </Button>
      <Button variant="primary" size="sm" disabled={!draftFrom} onClick={handleApply}>
        Apply
      </Button>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isDesktop) {
    return (
      <div className="relative inline-block">
        {TriggerButton}
        <FloatingPortal>
          <AnimatePresence>
            {isOpen && (
              <div ref={refs.setFloating} style={floatingStyles} className="z-[60]">
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.97 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.97 }}
                  transition={{
                    duration: isOpen ? 0.15 : 0.1,
                    ease: "easeOut",
                  }}
                  style={{
                    transformOrigin: "top right",
                    maxHeight: panelMaxHeight ? `${panelMaxHeight}px` : "90vh",
                  }}
                  className="w-[780px] rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0px_4px_20px_rgba(45,42,38,0.1)] flex flex-col overflow-hidden"
                >
                  <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-2">
                    {PresetsSection}
                    <CustomRangeSection single={false} />
                  </div>
                  <div className="shrink-0 px-2.5 pb-2">{Footer}</div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </div>
    );
  }

  // Mobile: bottom drawer (white, matches ResponsiveDialog MobileDrawer style)
  return (
    <div>
      {TriggerButton}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Date Range"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white max-h-[85vh] rounded-t-2xl"
            >
              {/* Drag handle */}
              <div className="flex shrink-0 items-center justify-center px-4 pt-3 pb-2">
                <div className="h-1 w-10 rounded-full bg-[#CBD5E1]" />
              </div>
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between px-4 pb-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#0F172A]">Date Range</h2>
                  <p className="text-[12px] text-[#64748B]">
                    Select a date range to filter results
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1.5 text-[#64748B] transition-colors hover:text-[#0F172A]"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto border-t border-[#F1F5F9] px-4 py-4">
                <div className="flex flex-col gap-4">
                  {presets && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] uppercase tracking-[0.08em] text-[#64748B] font-medium">
                        Quick Select
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {PRESETS.map((p) => (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => handlePresetClick(p.key)}
                            className={cn(
                              "h-8 px-2 rounded-[8px] text-[11px] uppercase font-medium tracking-[0.04em] border cursor-pointer transition-colors",
                              activePreset === p.key
                                ? "bg-[#2563EB] text-white border-[#2563EB]"
                                : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]",
                            )}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[#64748B] font-medium">
                      Custom Range
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="border border-[#E2E8F0] rounded-[8px] h-9 px-3 text-[13px] flex items-center gap-1">
                        <span className="text-[11px] uppercase text-[#64748B] font-medium mr-1">
                          From:
                        </span>
                        {draftFrom ? (
                          <span className="text-[#0F172A]">{formatShort(draftFrom)}</span>
                        ) : (
                          <span className="text-[#94A3B8]">Select date</span>
                        )}
                      </div>
                      <div className="border border-[#E2E8F0] rounded-[8px] h-9 px-3 text-[13px] flex items-center gap-1">
                        <span className="text-[11px] uppercase text-[#64748B] font-medium mr-1">
                          To:
                        </span>
                        {draftTo ? (
                          <span className="text-[#0F172A]">{formatShort(draftTo)}</span>
                        ) : (
                          <span className="text-[#94A3B8]">Select date</span>
                        )}
                      </div>
                    </div>
                    <CalendarMonth
                      year={leftViewYear}
                      month={leftViewMonth}
                      draftFrom={draftFrom}
                      draftTo={draftTo}
                      hoverDate={hoverDate}
                      onDayClick={handleDayClick}
                      onDayHover={setHoverDate}
                      showPrev
                      showNext
                      onPrev={handlePrev}
                      onNext={handleNext}
                    />
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div
                className="shrink-0 border-t border-[#F1F5F9] bg-white px-4 py-4"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button variant="primary" size="sm" disabled={!draftFrom} onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
