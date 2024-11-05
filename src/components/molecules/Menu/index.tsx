import { MenuItem, type IMenuItem } from "../MenuItem";

export interface MenuItemWithState extends IMenuItem {
  state: "past" | "current" | "future";
}

interface MenuProps {
  items: MenuItemWithState[];
  currentPath: string;
  onInfoClick: (item: IMenuItem) => void;
}

export const Menu = ({ items, onInfoClick }: MenuProps) => {
  return (
    <nav className="flex flex-col space-y-4">
      {items.map((item) => (
        <MenuItem key={item.path} item={item} onInfoClick={onInfoClick} />
      ))}
    </nav>
  );
};
