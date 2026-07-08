"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OptionToggle } from "@/components/ui/option-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { PLACEHOLDER_CATEGORIES } from "@/lib/placeholder-data/categories";

export const NO_PARENT = "none";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Keep it under 100 characters"),
  parentId: z.string(),
  description: z.string().max(500, "Keep it under 500 characters").optional(),
  status: z.enum(["active", "inactive"]),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues?: Partial<CategoryFormValues>;
}

/** Shared Create/Edit Category form — UI only, no backend integration. */
export function CategoryForm({ mode, categoryId, defaultValues }: CategoryFormProps) {
  const router = useRouter();

  const parentOptions = [
    { label: "None (Top-Level Category)", value: NO_PARENT },
    ...PLACEHOLDER_CATEGORIES.filter((c) => c.id !== categoryId).map((c) => ({
      label: c.name,
      value: c.id,
    })),
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      parentId: NO_PARENT,
      description: "",
      status: "active",
      ...defaultValues,
    },
  });

  const onSubmit = async (_values: CategoryFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success({
      title: mode === "create" ? "Category Created" : "Category Updated",
      description:
        mode === "create" ? "The new category has been saved." : "Your changes have been saved.",
    });
    router.push("/products/categories");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-5">
      <Card className="p-6">
        <h2 className="text-[15px] font-semibold text-slate-900">Category Information</h2>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Manage your product category information.
        </p>

        <div className="mt-5 flex flex-col gap-5">
          <Input
            label="Category Name"
            placeholder="e.g. Electronics"
            required
            error={errors.name?.message}
            {...register("name")}
          />

          <Controller
            control={control}
            name="parentId"
            render={({ field }) => (
              <Select
                label="Parent Category"
                placeholder="Select a parent category"
                options={parentOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.parentId?.message}
              />
            )}
          />

          <Textarea
            label="Description"
            placeholder="Briefly describe this category"
            rows={4}
            error={errors.description?.message}
            {...register("description")}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <OptionToggle
                label="Status"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/products/categories")}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Save Category" : "Update Category"}
        </Button>
      </div>
    </form>
  );
}
