"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, FileText, Image, Video, Music, File, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveDialog } from "@/components/common/responsive-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileTypePreset = "image" | "document" | "video" | "audio";

export interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the validated File array when user clicks Upload */
  onUpload: (files: File[]) => void;
  /** High-level presets — mix and match freely */
  accept?: FileTypePreset[];
  /** Override with raw mime types e.g. ["image/png", "application/pdf"] */
  customAccept?: string[];
  /** Max number of files. Default: 10 */
  maxFiles?: number;
  /** Max size per file in MB. Default: 10 */
  maxSizeMB?: number;
  title?: string;
  description?: string;
}

interface SelectedFile {
  file: File;
  id: string;
  error?: string;
}

// ─── Preset maps ──────────────────────────────────────────────────────────────

const PRESET_MIMES: Record<FileTypePreset, string[]> = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
  video: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm", "video/x-matroska"],
  audio: ["audio/mpeg", "audio/wav", "audio/aac", "audio/flac", "audio/ogg"],
};

const PRESET_LABELS: Record<FileTypePreset, string> = {
  image: "Images",
  document: "Documents",
  video: "Videos",
  audio: "Audio",
};

const PRESET_EXTENSIONS: Record<FileTypePreset, string[]> = {
  image: ["JPG", "PNG", "GIF", "WEBP", "SVG"],
  document: ["PDF", "DOC", "DOCX", "XLS", "XLSX", "PPT", "TXT", "CSV"],
  video: ["MP4", "MOV", "AVI", "WEBM", "MKV"],
  audio: ["MP3", "WAV", "AAC", "FLAC", "OGG"],
};

// ─── File icon helper ─────────────────────────────────────────────────────────

function FileIcon({ file }: { file: File }) {
  const type = file.type;
  if (type.startsWith("image/"))
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(37,99,235,0.08)]">
        <Image className="h-4 w-4 text-[#2563EB]" />
      </div>
    );
  if (type.startsWith("video/"))
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(124,58,237,0.08)]">
        <Video className="h-4 w-4 text-[#7C3AED]" />
      </div>
    );
  if (type.startsWith("audio/"))
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(234,88,12,0.08)]">
        <Music className="h-4 w-4 text-[#C2410C]" />
      </div>
    );
  if (type === "application/pdf")
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(220,53,69,0.08)]">
        <FileText className="h-4 w-4 text-[#DC3545]" />
      </div>
    );
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(138,133,126,0.08)]">
      <File className="h-4 w-4 text-[#64748B]" />
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FileUploadDialog({
  open,
  onOpenChange,
  onUpload,
  accept = ["document"],
  customAccept,
  maxFiles = 10,
  maxSizeMB = 10,
  title = "Upload Files",
  description,
}: FileUploadDialogProps) {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedMimes = customAccept ?? accept.flatMap((p) => PRESET_MIMES[p]);
  const maxBytes = maxSizeMB * 1024 * 1024;

  const validate = useCallback(
    (file: File): string | undefined => {
      if (allowedMimes.length && !allowedMimes.includes(file.type)) return "File type not allowed";
      if (file.size > maxBytes) return `Exceeds ${maxSizeMB} MB limit`;
    },
    [allowedMimes, maxBytes, maxSizeMB],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming);
      setFiles((prev) => {
        const combined = [...prev];
        for (const file of arr) {
          if (combined.length >= maxFiles) break;
          if (combined.some((f) => f.file.name === file.name && f.file.size === file.size))
            continue;
          combined.push({
            file,
            id: `${file.name}-${file.size}-${Date.now()}`,
            error: validate(file),
          });
        }
        return combined;
      });
    },
    [maxFiles, validate],
  );

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  // Drag handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  function handleClose() {
    setFiles([]);
    setIsDragging(false);
    onOpenChange(false);
  }

  function handleUpload() {
    const valid = files.filter((f) => !f.error).map((f) => f.file);
    if (!valid.length) return;
    onUpload(valid);
    handleClose();
  }

  const validCount = files.filter((f) => !f.error).length;
  const hasFiles = files.length > 0;

  const acceptedExtensions = customAccept
    ? customAccept.map((m) => m.split("/")[1]?.toUpperCase() ?? m)
    : accept.flatMap((p) => PRESET_EXTENSIONS[p]);

  const dialogDescription =
    description ??
    (accept.length
      ? `Accepted: ${accept.map((p) => PRESET_LABELS[p]).join(", ")} · Max ${maxSizeMB} MB per file`
      : `Max ${maxSizeMB} MB per file`);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleClose}
      title={title}
      description={dialogDescription}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={handleUpload}
            disabled={validCount === 0}
          >
            {validCount > 0 ? `Upload ${validCount} File${validCount > 1 ? "s" : ""}` : "Upload"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Drop zone */}
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={allowedMimes.join(",")}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <motion.div
          animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.15 }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors duration-150",
            isDragging
              ? "border-[#2563EB] bg-[rgba(37,99,235,0.04)]"
              : "border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
          )}
        >
          <motion.div
            animate={isDragging ? { y: -4 } : { y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isDragging ? "bg-[rgba(37,99,235,0.10)]" : "bg-[#F1F5F9]",
            )}
          >
            <Upload className={cn("h-5 w-5", isDragging ? "text-[#2563EB]" : "text-[#2563EB]")} />
          </motion.div>

          <div className="text-center">
            <p className="text-[14px] font-medium text-[#0F172A]">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="mt-0.5 text-[13px] text-[#64748B]">
              or <span className="font-medium text-[#2563EB]">click to browse</span>
            </p>
          </div>

          {/* Accepted formats — single line */}
          <p className="text-center text-[12px] text-[#94A3B8]">
            Supports {acceptedExtensions.slice(0, 6).join(", ")}
            {acceptedExtensions.length > 6 && ` +${acceptedExtensions.length - 6} more`}
            {" · "}
            {maxSizeMB} MB max
          </p>
        </motion.div>

        {/* File list */}
        <AnimatePresence initial={false}>
          {hasFiles && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                Selected · {files.length}/{maxFiles}
              </p>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {files.map((f) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                        f.error
                          ? "border-[rgba(220,53,69,0.3)] bg-[rgba(220,53,69,0.03)]"
                          : "border-[#F1F5F9] bg-white",
                      )}
                    >
                      <FileIcon file={f.file} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-[#0F172A]">
                          {f.file.name}
                        </p>
                        {f.error ? (
                          <p className="flex items-center gap-1 text-[12px] text-[#DC3545]">
                            <AlertCircle className="h-3 w-3" />
                            {f.error}
                          </p>
                        ) : (
                          <p className="text-[12px] text-[#64748B]">{formatSize(f.file.size)}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(f.id);
                        }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[rgba(220,53,69,0.08)] hover:text-[#DC3545]"
                        aria-label="Remove file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ResponsiveDialog>
  );
}
