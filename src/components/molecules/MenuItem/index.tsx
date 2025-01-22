import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { IMenuItemWithState } from "../Menu";

export interface IMenuItem {
  id: string;
  step: number;
  name: string;
}

interface MenuItemProps {
  item: IMenuItemWithState;
  onNavigateBack: (path: number) => void;
}

const stateStyles = {
  current: {
    bg: "bg-primary-800",
    border: "border-primary-900",
    text: "text-primary-50",
    hoverBg: "hover:bg-primary-800",
    fontWeight: "font-extrabold",
  },
  past: {
    bg: "bg-primary-200",
    border: "border-primary-300",
    text: "text-primary-950",
    hoverBg: "hover:bg-primary-300",
    fontWeight: "font-normal",
  },
};

export const MenuItem = ({ item, onNavigateBack }: MenuItemProps) => {
  const { bg, border, text, hoverBg, fontWeight } = stateStyles[item.state];

  const [open, setOpen] = useState(false); // Stato per la dialog
  const [navigateTo, setNavigateTo] = useState<number | null>(null); // URL di navigazione dopo conferma

  const handlePastClick = (step: number) => {
    setNavigateTo(step);
    setOpen(true);
  };

  const handleConfirmNavigation = () => {
    if (navigateTo) {
      setOpen(false);
      onNavigateBack(navigateTo);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 justify-end">
        {item.state === "past" ? (
          <div
            className={`w-32 text-sm text-center py-3.5 rounded-md transition-colors border-2 ${bg} ${text} ${hoverBg} ${border} ${fontWeight} cursor-pointer`}
            onClick={() => handlePastClick(item.step)}
          >
            {item.name}
          </div>
        ) : (
          <div
            className={`w-32 text-sm text-center py-3.5 rounded-md transition-colors border-2 ${bg} ${text} ${hoverBg} ${border} ${fontWeight}`}
          >
            {item.name}
          </div>
        )}
      </div>

      {/* Dialog per la conferma della navigazione passata, cancellando dati */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Attenzione</DialogTitle>
          <p>
            Sicuro che vuoi navigare indietro? Perderai tutti i dati fino ad
            ora.
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <DialogClose asChild>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setOpen(false)}
              >
                Annulla
              </button>
            </DialogClose>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={handleConfirmNavigation}
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
