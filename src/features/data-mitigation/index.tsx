import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/containers/layout";

import type {
  AnswerResponse,
  PreprocessingHyperparametersResponse,
  QuestionnaireResponse,
} from "@/api/types";
import { LaunchAlgorithm } from "./launch-algorithm";

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
    // chiamata per salvare i dati (se necessario)
    onNext();
  };

  return (
    <>
      <QuestionnaireLayout
        action={
          <Button
            onClick={onContinue}
            disabled={!selected}
            variant={selected ? "default" : "secondary"}
          >
            {t("buttons.continue")}
          </Button>
        }
      >
        <div className="flex justify-between space-x-4 p-8 bg-neutral-50 rounded-b-md flex-1">
          <div id="dataset-selection" className="flex-1">
            <p className="text-base text-primary-950 font-extrabold">
              {t("title")}
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
              <LaunchAlgorithm formData={formData} title={selected.text} />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
