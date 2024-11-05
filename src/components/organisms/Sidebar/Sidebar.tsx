"use client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMenuItem } from "@/components/molecules/MenuItem";
import { Menu, IMenuItemWithState } from "@/components/molecules/Menu";
import { usePathname } from "next/navigation";
import { IoInformationCircleOutline } from "react-icons/io5";

interface SidebarProps {
  menuItems: IMenuItem[];
}

export const Sidebar = ({ menuItems }: SidebarProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogContent, setDialogContent] = useState<string>("");

  const handleInfoClick = (item: IMenuItem) => {
    setDialogTitle("Test");
    setDialogContent(item.longDescription || "");
    setOpen(true);
  };

  const currentIndex = menuItems.findIndex((item) =>
    pathname.includes(item.path)
  ) + 1;

  const parsedMenuItems: IMenuItemWithState[] = menuItems.map((item) => ({
    ...item,
    icon: <IoInformationCircleOutline />,
    state:
      currentIndex < item.step
        ? "future"
        : currentIndex === item.step
        ? "current"
        : "past",
    path: item.path,
  }));
  return (
    <div className="h-full flex flex-col">
      <Menu
        items={parsedMenuItems}
        currentPath={pathname}
        onInfoClick={handleInfoClick}
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
