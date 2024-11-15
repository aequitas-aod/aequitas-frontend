import { AnswerResponse } from "@/api/types";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

export const RadioItem = ({
  option,
  selected,
  onSelect,
}: {
  option: AnswerResponse;
  selected: boolean;
  onSelect: (value: string) => void;
}) => {
  return (
    <div
      key={option.id.code}
      onClick={() => onSelect(option.id.code)}
      className={`flex items-center space-x-2 py-6 px-4 rounded-lg cursor-pointer hover:bg-primary-100 hover:border-primary-100 hover:font-medium	
        ${
          selected
            ? "bg-primary-200 border-primary-300 font-extrabold "
            : "border-gray-300 font-light"
        }`}
    >
      <RadioGroupItem value={option.id.code} checked={selected} />
      <p
        className={`text-sm hover:font-medium text-black ${
          selected
            ? "text-primary-950 font-extrabold"
            : "text-gray-900 font-light"
        }`}
      >
        {option.text}
      </p>
    </div>
  );
};
