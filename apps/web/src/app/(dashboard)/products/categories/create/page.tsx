"use client";

import { usePageHeader } from "@/hooks/use-page-header";
import { CategoryForm } from "@/components/products/categories";

export default function CreateCategoryPage() {
  usePageHeader("Create Category", "Manage your product category information.");

  return (
    <div className="flex flex-col gap-5">
      <CategoryForm mode="create" />
    </div>
  );
}
