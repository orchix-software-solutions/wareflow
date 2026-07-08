export type CategoryStatus = "active" | "inactive";

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  description?: string;
  status: CategoryStatus;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}
