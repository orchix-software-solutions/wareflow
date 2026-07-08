"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { DateRangePicker } from "@/components/common/date-range-picker";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableProps, Column, Action } from "./data-table.types";

function fmtDateRangeBar(from: Date, to: Date | null): string {
  const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const s = (d: Date) => M[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  return to ? s(from) + " — " + s(to) : s(from);
}

/** Generic data table: full table on desktop, card list on mobile */
export function DataTable<T>({
  columns,
  data,
  actions,
  isLoading,
  emptyState,
  searchable,
  searchPlaceholder = "Search...",
  pagination,
  sorting,
  onSearch,
  searchValue,
  getRowId,
  filterButton,
  dateRange,
  activeFilters,
  getRowClassName,
  getRowStyle,
}: DataTableProps<T>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Local input state so keystrokes are instant — onSearch (→ URL push) fires after debounce
  const [inputValue, setInputValue] = useState(searchValue ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync if parent resets search externally (e.g. clear button)
  useEffect(() => {
    setInputValue(searchValue ?? "");
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(value);
    }, 300);
  };

  const getCellValue = (row: T, col: Column<T>, index: number): React.ReactNode => {
    if (typeof col.accessor === "function") return col.accessor(row, index);
    return row[col.accessor] as React.ReactNode;
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  const paginationInfo = pagination
    ? {
        start: (pagination.page - 1) * pagination.limit + 1,
        end: Math.min(pagination.page * pagination.limit, pagination.total),
        total: pagination.total,
      }
    : null;

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const pages: (number | "ellipsis")[] = [];
    const total = totalPages;
    const current = pagination.page;
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push("ellipsis");
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push("ellipsis");
      pages.push(total);
    }
    return pages;
  }, [pagination, totalPages]);

  const visibleActions = (row: T) => actions?.filter((a) => !a.show || a.show(row)) ?? [];

  const paginationBlock = pagination && data.length > 0 && (
    <div className="flex flex-col gap-3 border-t border-[#F1F5F9] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-[#64748B]">
        Showing {paginationInfo!.start}-{paginationInfo!.end} of {paginationInfo!.total} results
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={pagination.page <= 1}
          onClick={() => pagination.onPageChange(pagination.page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageNumbers.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e${i}`} className="px-1 text-[13px] text-[#94A3B8]">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => pagination.onPageChange(p)}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-medium transition-colors",
                p === pagination.page
                  ? "bg-[#F1F5F9] text-[#2563EB]"
                  : "text-[#64748B] hover:bg-[#F8FAFC]",
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          disabled={pagination.page >= totalPages}
          onClick={() => pagination.onPageChange(pagination.page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              placeholder={searchPlaceholder}
              leftIcon={<Search className="h-[18px] w-[18px]" />}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </div>
          {dateRange && (
            <div className="shrink-0">
              <DateRangePicker
                value={dateRange.value}
                onChange={dateRange.onChange}
                onReset={dateRange.onReset}
              />
            </div>
          )}
          {filterButton && <div className="flex justify-end sm:shrink-0">{filterButton}</div>}
        </div>
      )}

      <AnimatePresence>
        {dateRange?.value.from && (
          <motion.div
            key="drb"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between rounded-lg border border-[#F1F5F9] bg-[#F8FAFC] px-4 py-2.5">
              <span className="flex items-center gap-2 text-[13px] text-[#0F172A]">
                <CalendarDays className="h-3.5 w-3.5 text-[#2563EB]" />
                Showing results from {fmtDateRangeBar(dateRange.value.from, dateRange.value.to)}
              </span>
              <button
                onClick={dateRange.onReset}
                className="flex h-6 w-6 items-center justify-center rounded text-[#64748B] transition-colors hover:text-[#2563EB]"
                aria-label="Clear date range"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeFilters && activeFilters.length > 0 && (
          <motion.div
            key="afc"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] px-3 py-1 text-[13px] font-medium text-[#0F172A]"
                >
                  {filter.label}
                  <button
                    onClick={filter.onRemove}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#E2E8F0] hover:text-[#2563EB]"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="overflow-hidden rounded-xl border border-[#F1F5F9] bg-white">
          <LoadingSkeleton columns={columns} isDesktop={isDesktop} />
        </div>
      ) : data.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-[#F1F5F9] bg-white p-6">
          {emptyState}
        </div>
      ) : isDesktop ? (
        <div className="overflow-hidden rounded-xl border border-[#F1F5F9] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      style={{
                        ...(col.width ? { width: col.width } : {}),
                        ...(col.minWidth ? { minWidth: col.minWidth } : {}),
                      }}
                      className={cn(
                        "h-11 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]",
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                            ? "text-center"
                            : "text-left",
                        col.sortable && "cursor-pointer select-none hover:text-[#0F172A]",
                        col.isPrimary &&
                          "sticky left-0 z-20 bg-[#F8FAFC] shadow-[2px_0_0_0_#F1F5F9]",
                      )}
                      onClick={
                        col.sortable && sorting
                          ? () => {
                              const newOrder =
                                sorting.sortBy === col.id && sorting.order === "asc"
                                  ? "desc"
                                  : "asc";
                              sorting.onSortChange(col.id, newOrder);
                            }
                          : undefined
                      }
                    >
                      <div
                        className={cn(
                          "inline-flex items-center gap-1",
                          col.align === "right" && "justify-end",
                        )}
                      >
                        {col.header}
                        {col.sortable && sorting && (
                          <SortIcon active={sorting.sortBy === col.id} order={sorting.order} />
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && actions.length > 0 && (
                    <th className="h-11 px-4 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <motion.tr
                    key={getRowId(row)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    style={getRowStyle?.(row, i)}
                    className={cn(
                      "group h-14 border-t border-[#F1F5F9] transition-colors duration-100 hover:bg-[#F8FAFC]",
                      i % 2 === 1 && "bg-[#FFFFFF]",
                      getRowClassName?.(row, i),
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          "px-4 text-[14px] text-[#0F172A]",
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                              ? "text-center"
                              : "text-left",
                          col.isPrimary &&
                            "sticky left-0 z-10 shadow-[2px_0_0_0_#F1F5F9] group-hover:bg-[#F8FAFC] transition-colors duration-100",
                          col.isPrimary && (i % 2 === 1 ? "bg-[#FFFFFF]" : "bg-white"),
                        )}
                      >
                        {getCellValue(row, col, i)}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {visibleActions(row).map((action) => (
                            <ActionButton key={action.id} action={action} row={row} />
                          ))}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginationBlock}
        </div>
      ) : (
        <>
          <MobileCardList
            data={data}
            columns={columns}
            actions={actions}
            getRowId={getRowId}
            getCellValue={getCellValue}
            visibleActions={visibleActions}
            getRowClassName={getRowClassName}
            getRowStyle={getRowStyle}
          />
          {pagination && data.length > 0 && (
            <div className="rounded-xl border border-[#F1F5F9] bg-white px-4 py-3">
              <p className="text-[13px] text-[#64748B]">
                Showing {paginationInfo!.start}-{paginationInfo!.end} of {paginationInfo!.total}{" "}
                results
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {pageNumbers.map((p, i) =>
                  p === "ellipsis" ? (
                    <span key={`e${i}`} className="px-1 text-[13px] text-[#94A3B8]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => pagination.onPageChange(p)}
                      className={cn(
                        "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-medium transition-colors",
                        p === pagination.page
                          ? "bg-[#F1F5F9] text-[#2563EB]"
                          : "text-[#64748B] hover:bg-[#F8FAFC]",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={pagination.page >= totalPages}
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F8FAFC] disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SortIcon({ active, order }: { active: boolean; order: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-[#94A3B8]" />;
  return order === "asc" ? (
    <ArrowUp className="h-3 w-3 text-[#2563EB]" />
  ) : (
    <ArrowDown className="h-3 w-3 text-[#2563EB]" />
  );
}

function ActionButton<T>({ action, row }: { action: Action<T>; row: T }) {
  const extraClassName =
    typeof action.className === "function" ? action.className(row) : (action.className ?? "");
  const label = typeof action.label === "function" ? action.label(row) : action.label;
  return (
    <Tooltip content={label} side="top">
      <button
        onClick={() => action.onClick(row)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors",
          action.variant === "danger"
            ? "hover:bg-[rgba(220,53,69,0.08)] hover:text-[#DC3545]"
            : "hover:bg-[#F8FAFC] hover:text-[#0F172A]",
          extraClassName,
        )}
        aria-label={label}
      >
        {typeof action.icon === "function" ? action.icon(row) : action.icon}
      </button>
    </Tooltip>
  );
}

function MobileCardList<T>({
  data,
  columns,
  actions,
  getRowId,
  getCellValue,
  visibleActions,
  getRowClassName,
  getRowStyle,
}: {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  getRowId: (row: T) => string;
  getCellValue: (row: T, col: Column<T>, index: number) => React.ReactNode;
  visibleActions: (row: T) => Action<T>[];
  getRowClassName?: (row: T, index: number) => string;
  getRowStyle?: (row: T, index: number) => React.CSSProperties;
}) {
  const primaryCol = columns.find((c) => c.isPrimary);
  const secondaryCol = columns.find((c) => c.isSecondary && !c.hideOnMobile);
  const detailCols = columns.filter((c) => !c.hideOnMobile && !c.isPrimary && !c.isSecondary);

  return (
    <div className="space-y-3">
      {data.map((row, i) => (
        <motion.div
          key={getRowId(row)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03 }}
          style={getRowStyle?.(row, i)}
          className={cn(
            "rounded-xl border border-[#F1F5F9] bg-white p-4",
            getRowClassName?.(row, i),
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {primaryCol && (
                <div className="text-[15px] font-semibold text-[#0F172A]">
                  {getCellValue(row, primaryCol, i)}
                </div>
              )}
              {secondaryCol && (
                <div className="mt-0.5 text-[13px] text-[#64748B]">
                  {getCellValue(row, secondaryCol, i)}
                </div>
              )}
            </div>
            {actions && actions.length > 0 && (
              <div className="flex shrink-0 items-center gap-0.5">
                {visibleActions(row).map((action) => (
                  <ActionButton key={action.id} action={action} row={row} />
                ))}
              </div>
            )}
          </div>
          {detailCols.length > 0 && (
            <div className="mt-3 border-t border-[#F1F5F9] pt-3">
              {detailCols.map((col) => (
                <div key={col.id} className="flex items-center justify-between py-1.5">
                  <span className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#64748B]">
                    {col.header}
                  </span>
                  <span className="text-[14px] text-[#0F172A]">{getCellValue(row, col, i)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function LoadingSkeleton<T>({ columns, isDesktop }: { columns: Column<T>[]; isDesktop: boolean }) {
  if (!isDesktop) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[#F1F5F9] p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-3 space-y-2 border-t border-[#F1F5F9] pt-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-11 items-center gap-4 bg-[#F8FAFC] px-4">
        {columns.map((col) => (
          <Skeleton key={col.id} className="h-3 w-20" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex h-14 items-center gap-4 border-t border-[#F1F5F9] px-4">
          {columns.map((col) => (
            <Skeleton key={col.id} className="h-4" style={{ width: col.width ?? "100px" }} />
          ))}
        </div>
      ))}
    </div>
  );
}
