"use client";

import { Tooltip } from "@/components/ui/tooltip";

// ─── Pure JS date helpers ────────────────────────────────────────────────────

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

const MONTHS_LONG = [
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

function formatShort(d: Date): string {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  return `${h12}:${mm} ${ampm}`;
}

function formatFull(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${h12}:${mm}:${ss} ${ampm}`;
}

function formatRelative(d: Date): string {
  const nowMs = Date.now();
  const diffMs = nowMs - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatShort(d);
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DateTimeCellProps {
  date: string | Date;
  showTime?: boolean;
  showRelative?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DateTimeCell({ date, showTime = true, showRelative = false }: DateTimeCellProps) {
  const d = date instanceof Date ? date : new Date(date);

  const line1 = showRelative ? formatRelative(d) : formatShort(d);
  const tooltipContent = formatFull(d);

  return (
    <Tooltip content={tooltipContent} side="top">
      <div className="inline-flex flex-col cursor-default">
        <span className="text-[13px] font-medium text-[#0F172A] leading-tight">{line1}</span>
        {showTime && (
          <span className="text-[12px] text-[#64748B] leading-tight mt-0.5">{formatTime(d)}</span>
        )}
      </div>
    </Tooltip>
  );
}
