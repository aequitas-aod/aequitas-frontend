import { MenuItem, type IMenuItem } from "../MenuItem";

export interface IMenuItemWithState extends IMenuItem {
  state: "past" | "current" | "future";
}

interface MenuProps {
  items: IMenuItemWithState[];
  onNavigate: (path: number) => void;
}

export const Menu = ({ items, onNavigate }: MenuProps) => {
  return (
    <nav className="flex flex-col space-y-4">
      {items.map((item) => (
        <MenuItem
          key={`${item.id}-${item.step}`}
          item={item}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
};
