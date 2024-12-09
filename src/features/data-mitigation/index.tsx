import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import type {
  AnswerResponse,
  PreprocessingHyperparametersResponse,
  QuestionnaireResponse,
} from "@/api/types";
import { LaunchAlgorithm } from "./launch-algorithm";
import { useStore } from "@/store/store";

export const DataMitigation = ({
  data,
  onNext,
  formData,
}: {
  data: QuestionnaireResponse;
  onNext: () => void;
  formData: PreprocessingHyperparametersResponse;
}) => {
  const t = useTranslations("data-mitigation");
  const [selected, setSelected] = useState<AnswerResponse | null>(null);
  const [enableContinueButton, setEnableContinueButton] = useState(false);
  const { incrementDatasetKey } = useStore();
  const options = data.answers;

  const onSelect = (value: string) => {
    const selectedOption =
      options.find((option) => option.id.code === value) || null;
    if (!selectedOption) {
      return;
    }
    setSelected(selectedOption);
  };

  const onContinue = () => {
    incrementDatasetKey();
    onNext();
  };

  return (
    <>
      <QuestionnaireLayout
        action={
          <Button onClick={onContinue} disabled={!enableContinueButton}>
            {t("buttons.continue")}
          </Button>
        }
      >
        <div className="flex justify-between space-x-4 p-8 bg-neutral-50 rounded-b-md flex-1">
          <div id="dataset-selection" className="flex-1">
            <p className="text-base text-primary-950 font-extrabold">
              {data.text}
            </p>
            <p className="text-[#64748B] text-sm">{t("subtitle")}</p>
            <RadioGroup className="mt-4">
              {options.map((option) => (
                <RadioItem
                  key={option.id.code}
                  option={option}
                  selected={selected?.id.code === option.id.code}
                  onSelect={onSelect}
                />
              ))}
            </RadioGroup>
          </div>
          {selected && (
            <div id="dataset-preview" className="flex-1">
              <LaunchAlgorithm
                formData={formData}
                title={selected.text}
                algorithm={selected.id.code}
                onEnableContinueButton={() => setEnableContinueButton(true)}
              />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
