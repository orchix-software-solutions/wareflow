"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useFilterParams(filterKeys: string[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const values = useMemo<Record<string, string[]>>(() => {
    const result: Record<string, string[]> = {};
    for (const key of filterKeys) {
      const raw = searchParams.get(key);
      if (raw) {
        result[key] = raw.split(",").filter(Boolean);
      }
    }
    return result;
  }, [searchParams, filterKeys]);

  const setValues = useCallback(
    (newValues: Record<string, string[]>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("page", "1");
      for (const key of filterKeys) {
        newParams.delete(key);
      }
      for (const [key, vals] of Object.entries(newValues)) {
        if (vals && vals.length > 0) {
          newParams.set(key, vals.join(","));
        }
      }
      router.push(`${pathname}?${newParams.toString()}`);
    },
    [searchParams, router, pathname, filterKeys],
  );

  const resetValues = useCallback(() => {
    setValues({});
  }, [setValues]);

  const removeGroup = useCallback(
    (groupId: string) => {
      const next = { ...values };
      delete next[groupId];
      setValues(next);
    },
    [values, setValues],
  );

  return { values, setValues, resetValues, removeGroup };
}
