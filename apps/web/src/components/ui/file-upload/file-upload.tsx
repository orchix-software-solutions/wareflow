"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X } from "lucide-react";
import type { FileUploadProps } from "./file-upload.types";

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Drag-and-drop file picker with image preview. Controlled via `value` /
 * `onChange`; accepts a `File` (newly chosen) or a string URL (existing).
 */
export function FileUpload({
  label,
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
  error,
  required,
  hint,
  disabled,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File && isImage(value)) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof value === "string" && value) {
      setPreviewUrl(value);
      return;
    }
    setPreviewUrl(null);
  }, [value]);

  const fileName = value instanceof File ? value.name : null;
  const fileSize = value instanceof File ? formatSize(value.size) : null;
  const shownError = error ?? localError ?? undefined;

  const validateAndEmit = (file: File | null) => {
    setLocalError(null);
    if (!file) {
      onChange?.(null);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File must be under ${maxSizeMB}MB`);
      return;
    }
    onChange?.(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0] ?? null;
    validateAndEmit(file);
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (inputRef.current) inputRef.current.value = "";
    validateAndEmit(null);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const borderColor = shownError ? "#DC3545" : isDragging ? "#2563EB" : "#E2E8F0";
  const background = shownError ? "#FDF2F3" : isDragging ? "#F1F5F9" : "#F8FAFC";

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-[13px] font-medium text-[#0F172A]">
          {label}
          {required && <span className="ml-0.5 text-[#DC3545]">*</span>}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-[10px] px-4 py-5 text-center outline-none transition-colors"
        style={{
          border: `2px dashed ${borderColor}`,
          borderStyle: isDragging ? "solid" : "dashed",
          backgroundColor: background,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => validateAndEmit(e.target.files?.[0] ?? null)}
        />

        <AnimatePresence mode="wait">
          {previewUrl || fileName ? (
            <motion.div
              key="filled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-2"
            >
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt={fileName ?? "Reference"}
                    className="max-h-[100px] rounded-[8px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemove}
                    aria-label="Remove file"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F172A] text-white shadow-sm transition-colors hover:bg-[#2563EB]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {fileName && (
                <div className="max-w-full">
                  <p className="truncate text-[13px] text-[#0F172A]">{fileName}</p>
                  {fileSize && <p className="text-[12px] text-[#64748B]">{fileSize}</p>}
                </div>
              )}
              {!fileName && previewUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-[12px] text-[#2563EB] underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-1.5"
            >
              <ImagePlus className="h-8 w-8" style={{ color: "#94A3B8" }} />
              <p className="text-[14px] text-[#64748B]">Drag &amp; drop an image here</p>
              <p className="text-[13px] text-[#2563EB] underline-offset-2 hover:underline">
                or click to browse
              </p>
              <p className="text-[12px]" style={{ color: "#94A3B8" }}>
                PNG, JPG up to {maxSizeMB}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {shownError ? (
        <p className="mt-1.5 text-[12px] text-[#DC3545]">{shownError}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-[#64748B]">{hint}</p>
      ) : null}
    </div>
  );
}
