export interface DynamicDropdownOption {
  id: string;
  label: string;
  meta?: Record<string, unknown>;
}

export interface DynamicDropdownProps {
  /** Current page of options — the caller owns fetching */
  options: DynamicDropdownOption[];
  /** Selected option id OR a free-text label stored in the DB */
  value: string | null;
  /** Label to render when value isn't found in options */
  displayValue?: string;
  onChange: (option: DynamicDropdownOption) => void;
  /** Called with the search text, debounced internally (300ms) */
  onSearchChange: (search: string) => void;
  loading?: boolean;
  allowCreate?: boolean;
  /** Component selects the returned option automatically */
  onCreate?: (name: string) => Promise<DynamicDropdownOption>;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}
