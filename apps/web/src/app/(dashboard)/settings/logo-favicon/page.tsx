"use client";

import { useState } from "react";
import { usePageHeader } from "@/hooks/use-page-header";
import { useMounted } from "@/hooks/use-mounted";
import { useBranding, useUpdateBranding } from "@/hooks/branding";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import type { UpdateBrandingPayload } from "@/types/branding";

const LOGO_ACCEPT = "image/png,image/jpeg,image/svg+xml,.png,.jpg,.jpeg,.svg";
// Browsers are inconsistent about the MIME type they report for `.ico`
// files (some report "image/x-icon", some "image/vnd.microsoft.icon", some
// nothing at all) so the native file picker's MIME-based filter can hide
// valid .ico files. Including the extension keeps selection reliable while
// still matching the backend's mimetype allowlist for files that do report one.
const FAVICON_ACCEPT =
  "image/png,image/jpeg,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.png,.jpg,.jpeg,.svg,.ico";

export default function LogoFaviconPage() {
  usePageHeader("Logo and Favicon", "Upload your logo and favicon here.");

  const { data: branding, isLoading } = useBranding();
  const { mutate, isPending } = useUpdateBranding();
  const mounted = useMounted();

  // Three states per field: `undefined` = untouched (show the saved server
  // asset), a `File` = a newly picked replacement, `null` = explicitly cleared
  // via the X (show the empty dropzone so a new file can be chosen).
  const [pendingLogoLight, setPendingLogoLight] = useState<File | null | undefined>(undefined);
  const [pendingLogoDark, setPendingLogoDark] = useState<File | null | undefined>(undefined);
  const [pendingFavicon, setPendingFavicon] = useState<File | null | undefined>(undefined);

  // On the server and first client render `mounted` is false, so every field
  // resolves to `null` (empty dropzone) — matching the SSR HTML and avoiding a
  // hydration mismatch. Saved assets appear once the branding query resolves.
  const resolveValue = (pending: File | null | undefined, url: string | null | undefined) => {
    if (!mounted) return null;
    return pending === undefined ? (url ?? null) : pending;
  };

  const controlsDisabled = !mounted || isLoading || isPending;

  const hasPendingChanges =
    pendingLogoLight instanceof File ||
    pendingLogoDark instanceof File ||
    pendingFavicon instanceof File;

  const handleSave = () => {
    const payload: UpdateBrandingPayload = {};
    if (pendingLogoLight instanceof File) payload.logoLight = pendingLogoLight;
    if (pendingLogoDark instanceof File) payload.logoDark = pendingLogoDark;
    if (pendingFavicon instanceof File) payload.favicon = pendingFavicon;

    mutate(payload, {
      onSuccess: () => {
        toast.success({
          title: "Branding Updated",
          description: "Your branding assets have been saved.",
        });
        setPendingLogoLight(undefined);
        setPendingLogoDark(undefined);
        setPendingFavicon(undefined);
      },
      onError: (error) => {
        toast.error({ title: "Update Failed", description: error.message });
      },
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <Card className="p-6">
        <h2 className="text-[15px] font-semibold text-slate-900">Branding Assets</h2>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Upload the logos and favicon used across the app and login page.
        </p>

        <div className="mt-5 flex flex-col gap-5">
          <FileUpload
            label="Light Logo"
            hint="Used on light backgrounds. PNG, JPG, or SVG."
            accept={LOGO_ACCEPT}
            disabled={controlsDisabled}
            value={resolveValue(pendingLogoLight, branding?.logoLight?.url)}
            onChange={setPendingLogoLight}
          />

          <FileUpload
            label="Dark Logo"
            hint="Used on dark backgrounds. PNG, JPG, or SVG."
            accept={LOGO_ACCEPT}
            disabled={controlsDisabled}
            value={resolveValue(pendingLogoDark, branding?.logoDark?.url)}
            onChange={setPendingLogoDark}
          />

          <FileUpload
            label="Favicon"
            hint="Shown in the browser tab. PNG, JPG, SVG, or ICO."
            accept={FAVICON_ACCEPT}
            disabled={controlsDisabled}
            value={resolveValue(pendingFavicon, branding?.favicon?.url)}
            onChange={setPendingFavicon}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          isLoading={isPending}
          disabled={isPending || !hasPendingChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
