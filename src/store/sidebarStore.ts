import { IMenuItem } from "@/components/molecules/MenuItem";
import { create } from "zustand";

interface SidebarState {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  menuItems: IMenuItem[];
  setInitialMenuItems: (items: IMenuItem[]) => void;
  addMenuItem: (item: IMenuItem) => void;
  deleteMenuItem: (item: IMenuItem) => void;
  datasetKey: string | null; // Ora può essere anche null
  setDatasetKey: (name: string | null) => void;
  incrementDatesetKey: () => void; // Funzione per incrementare il nome del dataset
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  menuItems: [],
  setInitialMenuItems: (items) => set({ menuItems: items }),
  addMenuItem: (item) =>
    set((state) => ({
      menuItems: [...state.menuItems, item],
    })),
  deleteMenuItem: (item) =>
    set((state) => ({
      menuItems: state.menuItems.filter((i) => i.id !== item.id),
    })),

  datasetKey: "custom-1",
  setDatasetKey: (name) => set({ datasetKey: name }),
  incrementDatesetKey: () => {
    set((state) => {
      const datasetPrefix = "custom-";
      // Se il valore è null o vuoto, inizializza con "custom-1"
      if (!state.datasetKey) {
        return { datasetKey: `${datasetPrefix}1` };
      }

      // Estrai il numero, gestendo anche valori non validi o assenti
      const currentNumber = parseInt(
        state.datasetKey.replace(datasetPrefix, ""),
        10
      );

      // Controlla se il parsing ha avuto successo, altrimenti inizia da 1
      const newNumber = isNaN(currentNumber) ? 1 : currentNumber + 1;
      const newDatesetKey = `${datasetPrefix}${newNumber}`;

      return { datasetKey: newDatesetKey };
    });
  },
}));
