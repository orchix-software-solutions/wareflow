"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { usePageHeader } from "@/hooks/use-page-header";
import { CategoryForm, NO_PARENT } from "@/components/products/categories";
import { PLACEHOLDER_CATEGORIES } from "@/lib/placeholder-data/categories";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const category = PLACEHOLDER_CATEGORIES.find((c) => c.id === id);

  usePageHeader("Edit Category", "Manage your product category information.");

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-5">
      <CategoryForm
        mode="edit"
        categoryId={category.id}
        defaultValues={{
          name: category.name,
          parentId: category.parentId ?? NO_PARENT,
          description: category.description ?? "",
          status: category.status,
        }}
      />
    </div>
  );
}
