import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Answers } from "../../../../mocks/1_dataset-choice/mock";

export const RadioItem = ({
  option,
  selected,
  onSelect,
}: {
  option: Answers;
  selected: string | null;
  onSelect: (value: string) => void;
}) => {
  const isSelected = selected === option.id.code;

  return (
    <div
      key={option.id.code}
      onClick={() => onSelect(option.id.code)}
      className={`flex items-center space-x-2 py-6 px-4 border rounded-lg cursor-pointer ${
        isSelected
          ? "bg-indigo-200 border-indigo-300 font-extrabold"
          : "border-gray-300"
      }`}
    >
      <RadioGroupItem value={option.id.code} checked={isSelected} />
      <Label htmlFor={option.id.code}>{option.text}</Label>
    </div>
  );
};
