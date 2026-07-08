"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePageHeaderStore } from "@/store/use-page-header-store";

interface PageHeaderProps {
  title?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

/** Global page header with breadcrumbs, title, description, and right-side action slot */
export function PageHeader({
  title: propTitle,
  description: propDescription,
  breadcrumbs,
  children: propChildren,
}: PageHeaderProps = {}) {
  const store = usePageHeaderStore();

  const title = propTitle ?? store.title;
  const description = propDescription ?? store.description;
  const actions = propChildren ?? store.actions;
  const crumbs = breadcrumbs ?? store.breadcrumbs;

  if (!title) return null;

  return (
    <div className="shrink-0 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center gap-1 text-[13px] text-slate-400">
            {crumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-slate-900">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl lg:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
