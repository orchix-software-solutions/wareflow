"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface ListParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
  datePreset?: string;
}

export function useListParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params: ListParams = useMemo(
    () => ({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || DEFAULT_PAGE_SIZE,
      search: searchParams.get("search") ?? "",
      sort: searchParams.get("sort") ?? "createdAt",
      order: (searchParams.get("order") as "asc" | "desc") ?? "desc",
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      datePreset: searchParams.get("datePreset") ?? undefined,
    }),
    [searchParams],
  );

  const setParams = useCallback(
    (updates: Partial<ListParams>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      if (
        updates.search !== undefined ||
        updates.sort !== undefined ||
        updates.dateFrom !== undefined ||
        updates.dateTo !== undefined ||
        updates.datePreset !== undefined
      ) {
        newParams.set("page", "1");
      }

      router.push(`${pathname}?${newParams.toString()}`);
    },
    [searchParams, router, pathname],
  );

  return { params, setParams };
}
