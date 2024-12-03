import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import Link from "next/link";
import { IMenuItemWithState } from "../Menu";
import { SidebarItem } from "../../../../mocks/sidebar";

export interface IMenuItem extends SidebarItem {
  icon?: React.ReactNode;
}

interface MenuItemProps {
  item: IMenuItemWithState;
  onInfoClick?: (item: IMenuItem) => void;
  onNavigate: (path: number) => void;
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
  future: {
    bg: "bg-neutral-100",
    border: "border-neutral-200",
    text: "text-neutral-700",
    hoverBg: "hover:bg-neutral-100",
    fontWeight: "font-normal",
  },
};

export const MenuItem = ({ item, onInfoClick, onNavigate }: MenuItemProps) => {
  const { bg, border, text, hoverBg, fontWeight } = stateStyles[item.state];
  const isDisabled = item.state === "future";

  const [open, setOpen] = useState(false); // Stato per la dialog
  const [navigateTo, setNavigateTo] = useState<number | null>(null); // URL di navigazione dopo conferma

  const handlePastClick = (step: number) => {
    setNavigateTo(step);
    setOpen(true);
  };

  const handleConfirmNavigation = () => {
    if (navigateTo) {
      setOpen(false);
      onNavigate(navigateTo);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 justify-end">
        {item.state === "current" && onInfoClick && (
          <div
            className="cursor-pointer text-lg hover:text-blue-400"
            onClick={() => onInfoClick(item)}
          >
            {item.icon}
          </div>
        )}
        {isDisabled ? (
          <div
            className={`w-32 text-sm text-center py-3.5 rounded-md border-2 ${bg} ${text} ${border} ${fontWeight} cursor-not-allowed opacity-50`}
          >
            {item.name}
          </div>
        ) : item.state === "past" ? (
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
