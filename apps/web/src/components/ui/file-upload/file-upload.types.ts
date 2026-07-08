export interface FileUploadProps {
  label?: string;
  /** Existing File object or a remote URL string for the current value. */
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  /** Accepted file types, e.g. "image/*". */
  accept?: string;
  /** Maximum file size in megabytes. Defaults to 5. */
  maxSizeMB?: number;
  error?: string;
  required?: boolean;
  hint?: string;
  disabled?: boolean;
  className?: string;
}
