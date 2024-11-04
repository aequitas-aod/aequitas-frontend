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
import { Menu, MenuItemWithState } from "@/components/molecules/Menu";
import { usePathname } from "next/navigation";
import { HelpCircleIcon } from "lucide-react";
import { IoInformationCircleOutline } from "react-icons/io5";

interface SidebarProps {
  lang: string;
  menuItems: IMenuItem[];
}

export const Sidebar = ({ lang, menuItems }: SidebarProps) => {
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
  );

  console.log("currentIndex", currentIndex);

  const parsedMenuItems: MenuItemWithState[] = menuItems.map((item) => ({
    ...item,
    icon: <IoInformationCircleOutline />,
    state:
      currentIndex < item.id
        ? "future"
        : currentIndex === item.id
        ? "current"
        : "past",
    path: item.path,
  }));
  return (
    <div className="h-full w-40 bg-white text-black flex flex-col">
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
