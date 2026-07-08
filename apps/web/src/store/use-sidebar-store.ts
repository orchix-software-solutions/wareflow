import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  expandedGroup: string | null;
  isMobileSheetOpen: boolean;
  isSheetFullscreen: boolean;
  toggleCollapsed: () => void;
  toggleGroup: (label: string) => void;
  setMobileSheetOpen: (open: boolean) => void;
  toggleSheetFullscreen: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  expandedGroup: null,
  isMobileSheetOpen: false,
  isSheetFullscreen: false,
  toggleCollapsed: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
      expandedGroup: !state.isCollapsed ? null : state.expandedGroup,
    })),
  toggleGroup: (label) =>
    set((state) => ({
      expandedGroup: state.expandedGroup === label ? null : label,
    })),
  setMobileSheetOpen: (open) => set({ isMobileSheetOpen: open, isSheetFullscreen: false }),
  toggleSheetFullscreen: () => set((state) => ({ isSheetFullscreen: !state.isSheetFullscreen })),
}));
