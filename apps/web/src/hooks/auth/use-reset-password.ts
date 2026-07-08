import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/services/api-client";
import type { ResetPasswordPayload } from "@/types/auth";

export function useResetPassword() {
  return useMutation<null, ApiError, ResetPasswordPayload>({
    mutationFn: (payload) => apiClient.post<null>("/auth/reset-password", payload),
  });
}
