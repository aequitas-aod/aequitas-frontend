import { IMenuItem } from "@/components/molecules/MenuItem";
import { create } from "zustand";
import { sidebarItems } from "../../mocks/sidebar";

interface SidebarState {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  menuItems: IMenuItem[];
  setMenuItems: (items: IMenuItem[]) => void;
  resetMenuItems: () => void;
  addMenuItem: (item: IMenuItem) => void;
  deleteMenuItem: (item: IMenuItem) => void;
}

export const useAequitasStore = create<SidebarState>((set, get) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  menuItems: sidebarItems,
  setMenuItems: (items) => set({ menuItems: items }),
  resetMenuItems: () => set({ menuItems: [] }),
  addMenuItem: (item) =>
    set((state) => ({
      menuItems: [...state.menuItems, item],
    })),
  deleteMenuItem: (item) =>
    set((state) => ({
      menuItems: state.menuItems.filter((i) => i.id !== item.id),
    })),
}));
