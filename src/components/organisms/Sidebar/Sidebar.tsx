"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMenuItem } from "@/components/molecules/MenuItem";
import { Menu, IMenuItemWithState } from "@/components/molecules/Menu";
import { useSearchParams } from "next/navigation";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useSidebarStore } from "@/store/sidebarStore";
import { useDeleteQuestionnaireMutation } from "@/api/hooks";

type SidebarProps = {
  menuItems: IMenuItem[];
};

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const { currentStep, setCurrentStep } = useSidebarStore();
  const { mutate } = useDeleteQuestionnaireMutation({
    onSuccess: () => {
      console.log("Step deleted successfully  ");
    },
  });

  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogContent, setDialogContent] = useState<string>("");

  const { menuItems: dynamicMenuItems, setInitialMenuItems } =
    useSidebarStore();

  useEffect(() => {
    setInitialMenuItems(menuItems);
  }, [menuItems, setInitialMenuItems]);

  const handleInfoClick = (item: IMenuItem) => {
    setDialogTitle(item.name || "Info");
    setDialogContent(item.longDescription || "No description available.");
    setOpen(true);
  };

  const currentIndex = useMemo(
    () => dynamicMenuItems.findIndex((item) => item.step === currentStep) + 1,

    [currentStep, dynamicMenuItems]
  );

  const parsedMenuItems: IMenuItemWithState[] = dynamicMenuItems.map(
    (item) => ({
      ...item,
      icon: <IoInformationCircleOutline />,
      state:
        currentIndex < item.step
          ? "future"
          : currentIndex === item.step
            ? "current"
            : "past",
    })
  );

  const handlePastClick = (path: number) => {
    // Step 1: Calcola i passi da eliminare
    const stepsToDelete = [];
    for (let step = currentIndex; step > path; step--) {
      stepsToDelete.push(step);
    }

    // Step 2: Esegui le richieste DELETE per ogni step
    try {
      for (const step of stepsToDelete) {
        mutate(step);
      }

      // Step 3: Una volta eliminati i passi, aggiorna lo stato e torna al passo precedente
      setCurrentStep(path);
    } catch (error) {
      // Gestisci gli errori qui, magari notificando l'utente
      console.error("An error occurred while deleting steps: ", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Menu
        items={parsedMenuItems}
        onInfoClick={handleInfoClick}
        onNavigate={handlePastClick}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogContent}</DialogDescription>
          <DialogClose className="mt-4">Close</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};
