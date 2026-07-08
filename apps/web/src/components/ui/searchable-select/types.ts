export interface SearchableSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: readonly SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}
