import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/services/api-client";
import type { VerifyOtpPayload } from "@/types/auth";

export function useVerifyOtp() {
  return useMutation<null, ApiError, VerifyOtpPayload>({
    mutationFn: (payload) => apiClient.post<null>("/auth/verify-otp", payload),
  });
}
