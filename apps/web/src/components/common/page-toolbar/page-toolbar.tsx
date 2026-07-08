"use client";

import { Search, RotateCcw, Download, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageToolbarProps } from "./page-toolbar.types";

/** Compact, reusable list-page toolbar: search + filter selects + reset + export. */
export function PageToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onFilterChange,
  onOpenFilters,
  activeFilterCount = 0,
  onReset,
  onExport,
  exportLabel = "Export",
  className,
}: PageToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 sm:flex-row sm:items-center", className)}>
      <div className="min-w-[200px] flex-1">
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          leftIcon={<Search className="h-4 w-4" />}
          containerClassName="h-11"
          className="text-[13px]"
        />
      </div>

      {filters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <div
              key={filter.id}
              className={cn("w-full min-w-[150px] sm:w-[160px]", filter.className)}
            >
              <Select
                options={filter.options}
                value={filter.value}
                onValueChange={(v) => onFilterChange?.(filter.id, v)}
                placeholder={filter.placeholder}
                className="h-11 text-[13px]"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        {onOpenFilters && (
          <Button
            variant="outline"
            size="md"
            onClick={onOpenFilters}
            leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
        {onReset && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            size="md"
            onClick={onExport}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            {exportLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
