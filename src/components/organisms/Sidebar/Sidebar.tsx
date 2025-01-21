"use client";

import { IMenuItem } from "@/components/molecules/MenuItem";
import { Menu, IMenuItemWithState } from "@/components/molecules/Menu";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useDeleteQuestionnaireById } from "@/api/questionnaire";
import { useQuestionnaireData } from "@/hooks/useQuestionnaireData";

type SidebarProps = {
  menuItems: IMenuItem[];
};

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const { onDelete } = useQuestionnaireData();

  const { mutate } = useDeleteQuestionnaireById({
    onSuccess: () => {
      console.log("Step deleted successfully");
    },
  });

  const currentIndex = menuItems[menuItems.length - 1].step;

  const parsedMenuItems: IMenuItemWithState[] = menuItems.map((item) => ({
    ...item,
    icon: <IoInformationCircleOutline />,
    state:
      currentIndex < item.step
        ? "future"
        : currentIndex === item.step
          ? "current"
          : "past",
  }));

  const handlePastClick = (path: number) => {
    const stepsToDelete = [];
    for (let step = currentIndex; step > path; step--) {
      stepsToDelete.push(step);
    }
    try {
      for (const step of stepsToDelete) {
        mutate({ n: step });
      }
      onDelete();
    } catch (error) {
      console.error("An error occurred while deleting steps: ", error);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-auto">
      <Menu items={parsedMenuItems} onNavigate={handlePastClick} />
    </div>
  );
};
