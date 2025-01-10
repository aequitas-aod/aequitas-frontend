import { FeatureCheckbox } from "@/components/molecules/FeatureCheckbox";

export const FeatureCheckboxList = ({
  featureKey,
  attributes,
  onCheckboxChange,
}: {
  featureKey: string;
  attributes: {
    [key: string]: {
      selected: string;
    };
  };
  onCheckboxChange: (featureKey: string, attributeKey: string) => void;
}) => {
  return (
    <>
      {Object.entries(attributes).map(([attributeKey, attributeData]) => (
        <FeatureCheckbox
          key={attributeKey}
          attributeKey={attributeKey}
          featureKey={featureKey}
          featureIndex={Object.entries(attributes).findIndex(
            ([key]) => key === attributeKey
          )}
          onCheckboxChange={onCheckboxChange}
          selectionStatus={attributeData.selected}
          totalItems={Object.entries(attributes).length}
          title={attributeKey.toUpperCase()}
        />
      ))}
    </>
  );
};
