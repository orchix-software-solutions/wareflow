"use client";

import { useQuery } from "@tanstack/react-query";

const HEALTH_URL = process.env.NEXT_PUBLIC_HEALTH_URL || "/api/health";

async function checkHealth(): Promise<boolean> {
  const response = await fetch(HEALTH_URL, { credentials: "include" });
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return true;
}

export function HealthIndicator() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: checkHealth,
    refetchInterval: 30_000,
    staleTime: 10_000,
    retry: 1,
  });

  const isConnected = !isError && !!data;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          isLoading
            ? "animate-pulse bg-amber-500"
            : isConnected
              ? "animate-[pulse_3s_ease-in-out_infinite] bg-emerald-500"
              : "bg-red-500"
        }`}
      />
      <span className={`text-[12px] font-normal ${isError ? "text-red-500" : "text-slate-500"}`}>
        {isLoading ? "Checking..." : isConnected ? "API Connected" : "API Unavailable"}
      </span>
    </div>
  );
}
