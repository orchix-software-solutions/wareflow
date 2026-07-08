export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T, index: number) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  minWidth?: string;
  align?: "left" | "center" | "right";
  hideOnMobile?: boolean;
  isPrimary?: boolean;
  isSecondary?: boolean;
}

export interface Action<T> {
  id: string;
  icon: React.ReactNode | ((row: T) => React.ReactNode);
  label: string | ((row: T) => string);
  onClick: (row: T) => void;
  variant?: "default" | "danger";
  show?: (row: T) => boolean;
  className?: string | ((row: T) => string);
}

export interface DataTablePagination {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export interface DataTableSorting {
  sortBy: string;
  order: "asc" | "desc";
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: DataTablePagination;
  sorting?: DataTableSorting;
  onSearch?: (query: string) => void;
  searchValue?: string;
  getRowId: (row: T) => string;
  /** Optional button rendered to the right of the search input (e.g. a filter trigger) */
  filterButton?: React.ReactNode;
  /** Optional date range picker with value, onChange, and onReset handlers */
  dateRange?: {
    value: { from: Date | null; to: Date | null };
    onChange: (r: { from: Date | null; to: Date | null }) => void;
    onReset: () => void;
  };
  /** Active filter chips rendered below the search bar */
  activeFilters?: Array<{ label: string; onRemove: () => void }>;
  /** Optional callbacks to apply custom class names or styles to table rows */
  getRowClassName?: (row: T, index: number) => string;
  getRowStyle?: (row: T, index: number) => React.CSSProperties;
}
