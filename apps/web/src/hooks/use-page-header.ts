"use client";

import { useEffect } from "react";
import { usePageHeaderStore } from "@/store/use-page-header-store";

/** Sets the global page header. Call once per page component. */
export function usePageHeader(
  title: string,
  description?: string,
  actions?: React.ReactNode,
  breadcrumbs?: { label: string; href?: string }[],
) {
  const setHeader = usePageHeaderStore((s) => s.setHeader);

  useEffect(() => {
    setHeader(title, description, actions, breadcrumbs);
  }, [title, description, actions, breadcrumbs, setHeader]);
}
