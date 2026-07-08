export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "single" | "multi";
  options: FilterOption[];
}

export interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onChange: (values: Record<string, string[]>) => void;
  onReset: () => void;
}
