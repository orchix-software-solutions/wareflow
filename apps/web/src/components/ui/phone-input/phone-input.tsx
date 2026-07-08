"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PhoneInputProps, PhoneValue } from "./phone-input.types";

interface CountryOption {
  code: string;
  flag: string;
  name: string;
  iso: string;
}

const COUNTRY_CODES: CountryOption[] = [
  { code: "+91", flag: "🇮🇳", name: "India", iso: "IN" },
  { code: "+61", flag: "🇦🇺", name: "Australia", iso: "AU" },
  { code: "+1", flag: "🇺🇸", name: "United States", iso: "US" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", iso: "GB" },
  { code: "+65", flag: "🇸🇬", name: "Singapore", iso: "SG" },
  { code: "+971", flag: "🇦🇪", name: "UAE", iso: "AE" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia", iso: "MY" },
  { code: "+1", flag: "🇨🇦", name: "Canada", iso: "CA" },
];

function findDefaultCountry(code: string): CountryOption {
  return COUNTRY_CODES.find((c) => c.code === code) ?? COUNTRY_CODES[0]!;
}

export function PhoneInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  required,
  defaultCountryCode = "+91",
  placeholder = "Enter mobile number",
  disabled,
  className,
}: PhoneInputProps) {
  const autoId = useId();
  const errorId = error ? `${autoId}-error` : undefined;

  // Uncontrolled internal state
  const [internalValue, setInternalValue] = useState<PhoneValue>({
    countryCode: defaultCountryCode,
    number: "",
  });

  // Tracks exactly which country is selected (handles +1 US vs CA ambiguity)
  const [selectedIso, setSelectedIso] = useState<string>(
    () => findDefaultCountry(defaultCountryCode).iso,
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Resolved value: controlled when `value` is provided, otherwise internal
  const resolved: PhoneValue = value ?? internalValue;

  // Derive the displayed country from the tracked ISO (with code fallback)
  const selectedCountry =
    COUNTRY_CODES.find((c) => c.iso === selectedIso && c.code === resolved.countryCode) ??
    COUNTRY_CODES.find((c) => c.code === resolved.countryCode) ??
    COUNTRY_CODES[0]!;

  const emit = useCallback(
    (next: PhoneValue) => {
      if (!value) setInternalValue(next);
      onChange?.(next);
    },
    [value, onChange],
  );

  const handleCountrySelect = useCallback(
    (country: CountryOption) => {
      setSelectedIso(country.iso);
      emit({ countryCode: country.code, number: resolved.number });
      setDropdownOpen(false);
    },
    [emit, resolved.number],
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      emit({ countryCode: resolved.countryCode, number: e.target.value });
    },
    [emit, resolved.countryCode],
  );

  const handleDropdownToggle = useCallback(() => {
    if (disabled) return;
    setDropdownOpen((prev) => !prev);
  }, [disabled]);

  // Position the portaled dropdown under the input, tracking scroll/resize
  const updateMenuPosition = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    updateMenuPosition();
    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [dropdownOpen, updateMenuPosition]);

  // Close dropdown on outside pointerdown (account for the portaled menu)
  useEffect(() => {
    if (!dropdownOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropdownOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dropdownOpen]);

  const wrapperClasses = cn(
    "flex h-11 w-full items-stretch rounded-[10px] border bg-white transition-all duration-150",
    error
      ? "border-[#DC3545]"
      : isFocused || dropdownOpen
        ? "border-[#2563EB] ring-[3px] ring-[rgba(37,99,235,0.12)]"
        : "border-[#E2E8F0] hover:border-[#CBD5E1]",
    disabled && "cursor-not-allowed opacity-60",
    className,
  );

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={`${autoId}-number`}
          className="mb-1.5 block text-[13px] font-medium text-[#0F172A]"
        >
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Combined wrapper */}
        <div ref={wrapperRef} className={wrapperClasses}>
          {/* Country code trigger */}
          <button
            type="button"
            aria-label="Select country code"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            disabled={disabled}
            onClick={handleDropdownToggle}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "flex w-20 shrink-0 items-center justify-center gap-1 rounded-l-[10px] bg-transparent px-2 focus:outline-none",
              !disabled && "hover:bg-[#F8FAFC]",
            )}
          >
            <span className="text-[15px] leading-none">{selectedCountry.flag}</span>
            <span className="text-[13px] font-medium text-[#0F172A]">{selectedCountry.code}</span>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-[#64748B] transition-transform duration-200",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Separator */}
          <div className="my-2 w-px bg-[#E2E8F0]" />

          {/* Phone number input */}
          <input
            id={`${autoId}-number`}
            type="tel"
            inputMode="numeric"
            value={resolved.number}
            onChange={handleNumberChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={errorId}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            className="flex-1 bg-transparent pl-3 pr-3.5 text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Country dropdown — portaled so it escapes overflow/scroll ancestors */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {dropdownOpen && menuPos && (
              <motion.div
                ref={menuRef}
                role="listbox"
                aria-label="Country codes"
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: menuPos.top,
                  left: menuPos.left,
                  minWidth: Math.max(menuPos.width, 200),
                }}
                className="z-[60] overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(45,42,38,0.08)]"
              >
                <div className="max-h-52 overflow-y-auto p-1">
                  {COUNTRY_CODES.map((country) => {
                    const isSelected = country.iso === selectedCountry.iso;
                    return (
                      <button
                        key={`${country.iso}-${country.code}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleCountrySelect(country)}
                        className={cn(
                          "flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-left text-[13px] text-[#0F172A] transition-colors hover:bg-[#F8FAFC]",
                          isSelected && "bg-[#F1F5F9] font-medium text-[#2563EB]",
                        )}
                      >
                        <span className="text-[15px] leading-none">{country.flag}</span>
                        <span className="font-medium">{country.code}</span>
                        <span className="text-[#64748B]">{country.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* Error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-[12px] text-[#DC3545]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
