import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Answers } from "../../../../mocks/1/mock";

export const RadioItem = ({
  option,
  selected,
  onSelect,
}: {
  option: Answers;
  selected: boolean;
  onSelect: (value: string) => void;
}) => {
  return (
    <div
      key={option.id.code}
      onClick={() => onSelect(option.id.code)}
      className={`flex items-center space-x-2 py-6 px-4 border rounded-lg cursor-pointer hover:bg-indigo-100 hover:border-indigo-100 hover:font-medium	
        ${
          selected
            ? "bg-indigo-200 border-indigo-300 font-extrabold"
            : "border-gray-300"
        }`}
    >
      <RadioGroupItem value={option.id.code} checked={selected} />
      <Label
        className={`text-sm hover:font-medium text-black ${
          selected
            ? "text-indigo-950 font-extrabold"
            : "text-gray-900 font-light"
        }`}
        htmlFor={option.id.code}
      >
        {option.text}
      </Label>
    </div>
  );
};
