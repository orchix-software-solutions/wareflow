export interface ChipSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  error?: string;
  required?: boolean;
  columns?: 2 | 3 | 4;
  size?: "sm" | "md";
  className?: string;
}
