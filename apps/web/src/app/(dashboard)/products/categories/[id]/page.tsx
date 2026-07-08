"use client";

import { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { usePageHeader } from "@/hooks/use-page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DateTimeCell } from "@/components/common/date-time-cell";
import { PLACEHOLDER_CATEGORIES } from "@/lib/placeholder-data/categories";

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] font-medium uppercase tracking-[0.06em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] text-slate-900">{value}</dd>
    </div>
  );
}

export default function ViewCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const category = PLACEHOLDER_CATEGORIES.find((c) => c.id === id);

  usePageHeader(category?.name ?? "Category", "Category details.");

  if (!category) notFound();

  const parentName = category.parentId
    ? PLACEHOLDER_CATEGORIES.find((c) => c.id === category.parentId)?.name
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.push("/products/categories")}
        >
          Back
        </Button>
        <Button
          leftIcon={<Pencil className="h-4 w-4" />}
          onClick={() => router.push(`/products/categories/${id}/edit`)}
        >
          Edit Category
        </Button>
      </div>

      <Card className="max-w-2xl p-6">
        <h2 className="text-[15px] font-semibold text-slate-900">Category Information</h2>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailField label="Category Name" value={category.name} />
          <DetailField label="Parent Category" value={parentName ?? "— Top Level —"} />
          <DetailField label="Products Count" value={String(category.productsCount)} />
          <DetailField label="Status" value={<StatusBadge status={category.status} />} />
          <DetailField label="Created At" value={<DateTimeCell date={category.createdAt} />} />
          <DetailField label="Updated At" value={<DateTimeCell date={category.updatedAt} />} />
          <div className="sm:col-span-2">
            <DetailField label="Description" value={category.description || "—"} />
          </div>
        </dl>
      </Card>
    </div>
  );
}
