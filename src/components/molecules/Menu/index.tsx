import { MenuItem, type IMenuItem } from "../MenuItem";

export interface IMenuItemWithState extends IMenuItem {
  state: "past" | "current";
}

interface MenuProps {
  items: IMenuItemWithState[];
  onNavigateBack: (path: number) => void;
}

export const Menu = ({ items, onNavigateBack }: MenuProps) => {
  return (
    <nav className="flex flex-col space-y-4">
      {items.map((item) => (
        <MenuItem
          key={`${item.id}-${item.step}`}
          item={item}
          onNavigateBack={onNavigateBack}
        />
      ))}
    </nav>
  );
};
