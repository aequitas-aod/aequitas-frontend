import { Checkbox } from "@/components/ui/checkbox";
import { ReactNode } from "react";

interface FeatureCheckboxProps {
  attributeKey: string;
  attributeData: { suggested_proxy: string; correlation: number };
  featureIndex: number;
  featureKey: string;
  onCheckboxChange: (featureKey: string, attributeKey: string) => void;
  label?: ReactNode;
  totalItems: number;
}

export const FeatureCheckbox = ({
  attributeKey,
  attributeData,
  featureIndex,
  featureKey,
  onCheckboxChange,
  totalItems,
}: FeatureCheckboxProps) => {
  // Determine height based on whether it's the last item
  const itemHeight =
    featureIndex === totalItems - 1 ? "h-[27.5px]" : "h-[55px]";
  const align = featureIndex === totalItems - 1 ? "items-end" : "items-center";

  const attributeDataCorrelation = (attributeData.correlation * 100).toFixed(0);

  return (
    <div className="flex items-center relative">
      {/* Vertical border on the left */}
      <div className={`border-l ${itemHeight} border-black flex ${align}`}>
        <div className="w-[34px] h-[1px] bg-black"></div>
      </div>
      <div
        className={`absolute ${
          featureIndex === totalItems - 1
            ? "bottom-[-10px] transform left-9"
            : "top-1/2 transform -translate-y-1/2 left-9"
        }`}
      >
        {/* Checkbox positioned at the left, aligned to the horizontal line */}
        <Checkbox
          checked={attributeData.suggested_proxy === "true"}
          onCheckedChange={
            () => onCheckboxChange(featureKey, attributeKey) // Update to handle only featureKey and attributeKey
          }
          variant="outlined-black"
          className="mr-2 mt-1"
        />
      </div>
      <div
        className={`absolute ${
          featureIndex === totalItems - 1
            ? "bottom-[-8px] transform left-16"
            : "top-1/2 transform -translate-y-1/2 left-16"
        }`}
      >
        {/* Label or default text */}
        <div className="mt-1 flex gap-2">
          <p className="font-extrabold">{attributeKey.toUpperCase()}</p>
          <p>{`${attributeDataCorrelation}%`}</p>
        </div>
      </div>
    </div>
  );
};
