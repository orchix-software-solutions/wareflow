import type React from "react";

export interface OptionToggleItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface OptionToggleProps {
  label?: string;
  options: OptionToggleItem[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
}
