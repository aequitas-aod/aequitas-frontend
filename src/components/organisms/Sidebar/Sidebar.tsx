"use client";

import { IMenuItem } from "@/components/molecules/MenuItem";
import { Menu, IMenuItemWithState } from "@/components/molecules/Menu";

type SidebarProps = {
  menuItems: IMenuItem[];
  onDelete: (n: number) => void;
};

export const Sidebar = ({ menuItems, onDelete }: SidebarProps) => {
  const currentIndex = menuItems[menuItems.length - 1].step;

  const parsedMenuItems: IMenuItemWithState[] = menuItems.map((item) => ({
    ...item,
    state: currentIndex === item.step ? "current" : "past",
  }));

  return (
    <div className="h-full flex flex-col overflow-auto">
      <Menu items={parsedMenuItems} onNavigateBack={onDelete} />
    </div>
  );
};
