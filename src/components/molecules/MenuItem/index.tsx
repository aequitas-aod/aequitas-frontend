import Link from "next/link";
import { MenuItemWithState } from "../Menu";

export interface IMenuItem {
  id: number;
  name: string;
  path: string;
  longDescription?: string;
  icon?: React.ReactNode;
}

interface MenuItemProps {
  item: MenuItemWithState;
  onInfoClick?: (item: IMenuItem) => void;
}

const stateStyles = {
  current: {
    bg: "bg-indigo-800",
    border: "border-indigo-900",
    text: "text-indigo-50",
    hoverBg: "hover:bg-indigo-800",
    fontWeight: "font-extrabold",
  },
  past: {
    bg: "bg-indigo-200",
    border: "border-indigo-300",
    text: "text-indigo-950",
    hoverBg: "hover:bg-indigo-300",
    fontWeight: "font-normal",
  },
  future: {
    bg: "bg-wild-sand-100",
    border: "border-wild-sand-200",
    text: "text-wild-sand-700",
    hoverBg: "hover:bg-wild-sand-100",
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
