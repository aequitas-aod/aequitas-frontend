import Link from "next/link";
import { IMenuItemWithState } from "../Menu";
import { SidebarItem } from "../../../../mocks/sidebar";

export interface IMenuItem extends SidebarItem {
  icon?: React.ReactNode;
}

interface MenuItemProps {
  item: IMenuItemWithState;
  onInfoClick?: (item: IMenuItem) => void;
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

export const MenuItem = ({ item, onInfoClick }: MenuItemProps) => {
  const { bg, border, text, hoverBg, fontWeight } = stateStyles[item.state];

  return (
    <div className="flex items-center space-x-2 justify-end">
      {item.state === "current" && onInfoClick && (
        <div
          className="cursor-pointer text-lg hover:text-blue-400"
          onClick={() => onInfoClick(item)}
        >
          {item.icon}
        </div>
      )}
      <Link href={item.path}>
        <div
          className={`w-32 text-sm text-center py-3.5 rounded-md transition-colors border-2 ${bg} ${text} ${hoverBg} ${border} ${fontWeight}`}
        >
          {item.name}
        </div>
      </Link>
    </div>
  );
};
