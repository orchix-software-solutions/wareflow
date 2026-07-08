import type { SelectOption } from "@/components/ui/select";

export interface PageToolbarFilter {
  id: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export interface PageToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: PageToolbarFilter[];
  onFilterChange?: (id: string, value: string) => void;
  /** Opens a FilterDrawer (or similar) for advanced filters; renders a "Filters" trigger button */
  onOpenFilters?: () => void;
  /** Count shown as a badge on the "Filters" trigger button */
  activeFilterCount?: number;
  onReset?: () => void;
  onExport?: () => void;
  exportLabel?: string;
  className?: string;
}
