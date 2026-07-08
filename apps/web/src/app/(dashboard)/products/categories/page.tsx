"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { usePageHeader } from "@/hooks/use-page-header";
import { PageToolbar } from "@/components/common/page-toolbar";
import { DataTable } from "@/components/common/data-table";
import type { Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { ActionMenu } from "@/components/common/action-menu";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { FilterDrawer, countActiveFilters } from "@/components/common/filter-drawer";
import { DateTimeCell } from "@/components/common/date-time-cell";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { PLACEHOLDER_CATEGORIES } from "@/lib/placeholder-data/categories";
import type { Category } from "@/types/category";

const DEFAULT_PAGE_SIZE = 50;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const SORT_FIELDS = ["name", "parent", "products", "status", "createdat", "updatedat"] as const;
type SortField = (typeof SORT_FIELDS)[number];
const DEFAULT_SORT: SortField = "createdat";

function nameOf(id: string | null): string {
  if (!id) return "";
  return PLACEHOLDER_CATEGORIES.find((c) => c.id === id)?.name ?? "";
}

function compare(a: Category, b: Category, sortBy: SortField): number {
  switch (sortBy) {
    case "name":
      return a.name.localeCompare(b.name);
    case "parent":
      return nameOf(a.parentId).localeCompare(nameOf(b.parentId));
    case "products":
      return a.productsCount - b.productsCount;
    case "status":
      return a.status.localeCompare(b.status);
    case "createdat":
      return a.createdAt.localeCompare(b.createdAt);
    case "updatedat":
      return a.updatedAt.localeCompare(b.updatedAt);
    default:
      return 0;
  }
}

function exportToCsv(rows: Category[]) {
  const header = [
    "Category Name",
    "Parent Category",
    "Products",
    "Status",
    "Created At",
    "Updated At",
  ];
  const body = rows.map((c) => [
    c.name,
    nameOf(c.parentId),
    String(c.productsCount),
    c.status,
    c.createdAt,
    c.updatedAt,
  ]);
  const csv = [header, ...body]
    .map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "categories.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = Number(value);
  return value && Number.isFinite(n) && n > 0 ? Math.trunc(n) : fallback;
}

function CategoriesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    const status = searchParams.get("status");
    const parent = searchParams.get("parent");
    if (status) initial.status = [status];
    if (parent) initial.parent = [parent];
    return initial;
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>(() => {
    const raw = searchParams.get("sortby");
    return raw && (SORT_FIELDS as readonly string[]).includes(raw)
      ? (raw as SortField)
      : DEFAULT_SORT;
  });
  const [order, setOrder] = useState<"asc" | "desc">(() =>
    searchParams.get("order") === "desc" ? "desc" : "asc",
  );
  const [page, setPage] = useState(() => parsePositiveInt(searchParams.get("page"), 1));
  const [limit, setLimit] = useState(() =>
    parsePositiveInt(searchParams.get("limit"), DEFAULT_PAGE_SIZE),
  );
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusFilter = filterValues.status?.[0] ?? "";
  const parentFilter = filterValues.parent?.[0] ?? "";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Keep the URL (lowercase keys: search, status, parent, page, limit, sortby, order) in sync with table state
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (parentFilter) params.set("parent", parentFilter);
      if (page > 1) params.set("page", String(page));
      if (limit !== DEFAULT_PAGE_SIZE) params.set("limit", String(limit));
      if (sortBy !== DEFAULT_SORT) params.set("sortby", sortBy);
      if (order !== "asc") params.set("order", order);

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 300);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [search, statusFilter, parentFilter, page, limit, sortBy, order, pathname, router]);

  const parentFilterGroupOptions = useMemo(() => {
    const parentIds = Array.from(
      new Set(PLACEHOLDER_CATEGORIES.map((c) => c.parentId).filter((id): id is string => !!id)),
    );
    return [
      { label: "Top-Level Only", value: "none" },
      ...parentIds.map((id) => ({ label: nameOf(id), value: id })),
    ];
  }, []);

  const filterGroups = [
    {
      id: "status",
      label: "Status",
      type: "single" as const,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      id: "parent",
      label: "Parent Category",
      type: "single" as const,
      options: parentFilterGroupOptions,
    },
  ];

  const filteredData = useMemo(() => {
    return PLACEHOLDER_CATEGORIES.filter((c) => {
      const matchesSearch =
        !search.trim() ||
        c.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        c.description?.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      const matchesParent =
        !parentFilter ||
        (parentFilter === "none" ? c.parentId === null : c.parentId === parentFilter);
      return matchesSearch && matchesStatus && matchesParent;
    });
  }, [search, statusFilter, parentFilter]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => compare(a, b, sortBy));
    return order === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortBy, order]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return sortedData.slice(start, start + limit);
  }, [sortedData, page, limit]);

  const handleReset = () => {
    setSearch("");
    setFilterValues({});
    setSortBy(DEFAULT_SORT);
    setOrder("asc");
    setPage(1);
    setLimit(DEFAULT_PAGE_SIZE);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsDeleting(false);
    setDeleteTarget(null);
    toast.success({
      title: "Category Deleted",
      description: `"${deleteTarget?.name}" has been removed.`,
    });
  };

  const columns: Column<Category>[] = [
    {
      id: "name",
      header: "Category Name",
      accessor: (row) => <span className="font-medium text-slate-900">{row.name}</span>,
      sortable: true,
      isPrimary: true,
      minWidth: "180px",
    },
    {
      id: "parent",
      header: "Parent Category",
      accessor: (row) =>
        row.parentId ? nameOf(row.parentId) : <span className="text-slate-400">— Top Level —</span>,
      sortable: true,
      minWidth: "160px",
    },
    {
      id: "products",
      header: "Products",
      accessor: (row) => row.productsCount,
      sortable: true,
      align: "right",
      width: "100px",
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      sortable: true,
      width: "110px",
    },
    {
      id: "createdat",
      header: "Created At",
      accessor: (row) => <DateTimeCell date={row.createdAt} showTime={false} />,
      sortable: true,
      hideOnMobile: true,
      width: "130px",
    },
    {
      id: "updatedat",
      header: "Updated At",
      accessor: (row) => <DateTimeCell date={row.updatedAt} showTime={false} />,
      sortable: true,
      hideOnMobile: true,
      width: "130px",
    },
    {
      id: "actions",
      header: "",
      accessor: (row) => (
        <div className="flex justify-end">
          <ActionMenu
            items={[
              {
                id: "view",
                label: "View",
                icon: <Eye />,
                onClick: () => router.push(`/products/categories/${row.id}`),
              },
              {
                id: "edit",
                label: "Edit",
                icon: <Pencil />,
                onClick: () => router.push(`/products/categories/${row.id}/edit`),
              },
              {
                id: "delete",
                label: "Delete",
                icon: <Trash2 />,
                destructive: true,
                separatorBefore: true,
                onClick: () => setDeleteTarget(row),
              },
            ]}
          />
        </div>
      ),
      align: "right",
      width: "60px",
    },
  ];

  const emptyState =
    PLACEHOLDER_CATEGORIES.length > 0 && filteredData.length === 0 ? (
      <EmptyState
        title="No Matching Categories"
        description="Try adjusting your search or filters."
        action={
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
        }
      />
    ) : (
      <EmptyState
        title="No Categories Found"
        description="Start organizing your inventory by creating your first category."
        action={
          <Button
            onClick={() => router.push("/products/categories/create")}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Category
          </Button>
        }
      />
    );

  usePageHeader("Categories", "Organize product categories for better inventory management.");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end">
        <Button
          onClick={() => router.push("/products/categories/create")}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Category
        </Button>
      </div>

      <PageToolbar
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search categories..."
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={countActiveFilters(filterValues)}
        onReset={handleReset}
        onExport={() => exportToCsv(sortedData)}
      />

      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="Filter Categories"
        description="Narrow down categories by status and parent category."
        groups={filterGroups}
        values={filterValues}
        onChange={(values) => {
          setFilterValues(values);
          setPage(1);
        }}
        onReset={() => {
          setFilterValues({});
          setPage(1);
        }}
      />

      <DataTable<Category>
        columns={columns}
        data={paginatedData}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        emptyState={emptyState}
        density="compact"
        bodyHeight="560px"
        selectable
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
        sorting={{
          sortBy,
          order,
          onSortChange: (id, o) => {
            setSortBy(id as SortField);
            setOrder(o);
            setPage(1);
          },
        }}
        pagination={{
          page,
          limit,
          total: sortedData.length,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageChange: setPage,
          onLimitChange: (l) => {
            setLimit(l);
            setPage(1);
          },
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        warning="Products assigned to this category will need to be reassigned."
        variant="destructive"
        confirmLabel="Delete"
        loading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={null}>
      <CategoriesPageContent />
    </Suspense>
  );
}
