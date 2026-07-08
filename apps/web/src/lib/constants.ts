export const APP_NAME = "WareFlow";
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEBOUNCE_MS = 300;

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST, UTC+5:30)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST, UTC+10)" },
  { value: "America/New_York", label: "America/New York (EST, UTC-5)" },
  { value: "Europe/London", label: "Europe/London (GMT, UTC+0)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GST, UTC+4)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT, UTC+8)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST, UTC-8)" },
  { value: "Europe/Paris", label: "Europe/Paris (CET, UTC+1)" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR — Indian Rupee (₹)" },
  { value: "AUD", label: "AUD — Australian Dollar (A$)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "SGD", label: "SGD — Singapore Dollar (S$)" },
  { value: "AED", label: "AED — UAE Dirham (د.إ)" },
] as const;
