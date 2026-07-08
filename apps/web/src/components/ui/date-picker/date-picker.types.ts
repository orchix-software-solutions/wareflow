export interface DatePickerProps {
  label?: string;
  value?: Date | string | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  /** Display format, default "dd/MM/yyyy" */
  format?: string;
  className?: string;
}
