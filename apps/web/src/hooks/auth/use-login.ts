import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/services/api-client";
import { useAuthStore } from "@/store/use-auth-store";
import type { LoginPayload, LoginResponse } from "@/types/auth";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: (payload) => apiClient.post<LoginResponse>("/auth/login", payload),
    onSuccess: (data) => setAuth(data),
  });
}
