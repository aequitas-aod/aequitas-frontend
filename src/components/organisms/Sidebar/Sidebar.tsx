"use client";

import { useEffect, useMemo } from "react";
import { IMenuItem } from "@/components/molecules/MenuItem";
import { Menu, IMenuItemWithState } from "@/components/molecules/Menu";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useStore } from "@/store/store";
import { useDeleteQuestionnaireMutation } from "@/api/questionnaire";

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

  const { menuItems: dynamicMenuItems, setInitialMenuItems } = useStore();

  useEffect(() => {
    setInitialMenuItems(menuItems);
  }, [menuItems, setInitialMenuItems]);

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
        mutate({ n: step });
      }
      setCurrentStep(path);
      // If navigating before step 7, reset menuItems to initial state
      if (path <= 7) {
        useStore.getState().resetMenuItems(); // Reset the store's menuItems to the initial state
      }
      setCurrentStep(path); // Set current step
    } catch (error) {
      console.error("An error occurred while deleting steps: ", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Menu items={parsedMenuItems} onNavigate={handlePastClick} />
    </div>
  );
};
