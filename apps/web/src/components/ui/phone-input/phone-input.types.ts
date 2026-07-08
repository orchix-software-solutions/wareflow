export interface PhoneValue {
  countryCode: string;
  number: string;
}

export interface PhoneInputProps {
  label?: string;
  value?: PhoneValue;
  onChange?: (value: PhoneValue) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  defaultCountryCode?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
