import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/services/api-client";
import type { Branding, UpdateBrandingPayload } from "@/types/branding";

function toFormData(payload: UpdateBrandingPayload): FormData {
  const formData = new FormData();
  if (payload.logoLight) formData.append("logoLight", payload.logoLight);
  if (payload.logoDark) formData.append("logoDark", payload.logoDark);
  if (payload.favicon) formData.append("favicon", payload.favicon);
  return formData;
}

export function useUpdateBranding() {
  const queryClient = useQueryClient();

  return useMutation<Branding, ApiError, UpdateBrandingPayload>({
    mutationFn: (payload) => apiClient.putForm<Branding>("/settings/branding", toFormData(payload)),
    onSuccess: (data) => {
      queryClient.setQueryData(["branding"], data);
    },
  });
}
