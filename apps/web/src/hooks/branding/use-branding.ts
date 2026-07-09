import { useQuery } from "@tanstack/react-query";
import { apiClient, type ApiError } from "@/services/api-client";
import type { Branding } from "@/types/branding";

export function useBranding() {
  return useQuery<Branding, ApiError>({
    queryKey: ["branding"],
    queryFn: () => apiClient.get<Branding>("/settings/branding"),
  });
}
