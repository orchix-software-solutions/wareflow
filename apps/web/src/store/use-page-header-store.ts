import { create } from "zustand";

interface PageHeaderState {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  setHeader: (
    title: string,
    description?: string,
    actions?: React.ReactNode,
    breadcrumbs?: { label: string; href?: string }[],
  ) => void;
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  title: "",
  description: undefined,
  actions: undefined,
  breadcrumbs: undefined,
  setHeader: (title, description, actions, breadcrumbs) =>
    set({ title, description, actions, breadcrumbs }),
}));
