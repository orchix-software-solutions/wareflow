import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/services/api-client";
import { useAuthStore } from "@/store/use-auth-store";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation<null, ApiError, void>({
    mutationFn: () => apiClient.post<null>("/auth/logout"),
    onSettled: () => clearAuth(),
  });
}
