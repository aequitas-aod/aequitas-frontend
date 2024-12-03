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
import { IoInformationCircleOutline } from "react-icons/io5";
import { useStore } from "@/store/store";
import { useDeleteQuestionnaireMutation } from "@/api/hooks";

type SidebarProps = {
  menuItems: IMenuItem[];
};

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const { currentStep, setCurrentStep } = useStore();
  const { mutate } = useDeleteQuestionnaireMutation({
    onSuccess: () => {
      console.log("Step deleted successfully");
    },
  });

  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogContent, setDialogContent] = useState<string>("");

  const { menuItems: dynamicMenuItems, setInitialMenuItems } = useStore();

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
    const stepsToDelete = [];
    for (let step = currentIndex; step > path; step--) {
      stepsToDelete.push(step);
    }

    try {
      for (const step of stepsToDelete) {
        mutate(step);
      }
      setCurrentStep(path);
    } catch (error) {
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
