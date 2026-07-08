import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/services/api-client";
import type { ForgotPasswordPayload } from "@/types/auth";

export function useForgotPassword() {
  return useMutation<null, ApiError, ForgotPasswordPayload>({
    mutationFn: (payload) => apiClient.post<null>("/auth/forgot-password", payload),
  });
}
