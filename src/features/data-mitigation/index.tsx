import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { LaunchAlgorithm } from "./launch-algorithm";
import { useAequitasStore } from "@/store/store";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { usePreprocessingHyperparameters } from "@/api/context";

import type { AnswerResponse, QuestionnaireResponse } from "@/api/types";

export const DataMitigation = ({
  data,
  onNext,
}: {
  data: QuestionnaireResponse;
  onNext: () => void;
}) => {
  const t = useTranslations("DataMitigation");
  const { incrementDatasetKey, currentStep } = useAequitasStore();

  const [selected, setSelected] = useState<AnswerResponse | null>(null);
  const [enableContinueButton, setEnableContinueButton] = useState(false);
  const options = data.answers;

  const { data: formData } = usePreprocessingHyperparameters(
    selected?.id.code ?? null
  );

  const { mutateAsync: updateQuestionnaire } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });

  const onSelect = async (value: string) => {
    const selectedOption =
      options.find((option) => option.id.code === value) || null;
    if (!selectedOption) {
      return;
    }
    setEnableContinueButton(false);
    setSelected(selectedOption);
  };

  const onContinue = async () => {
    incrementDatasetKey();
    if (!selected) {
      return;
    }
    try {
      await updateQuestionnaire({
        n: currentStep,
        answer_ids: [
          {
            code: selected.id.code,
            question_code: selected.id.question_code,
            project_code: selected.id.project_code,
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isDisabled =
    (selected && selected.id.code === "NoMitigation") || enableContinueButton;

  return (
    <>
      <QuestionnaireLayout
        action={
          <Button onClick={onContinue} disabled={!isDisabled}>
            {t("buttons.continue")}
          </Button>
        }
        classNameWrapper="!overflow-hidden"
        className="!bg-neutral-50"
      >
        <QuestionnaireBanner text={data.description} />
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
          {selected && formData && (
            <div id="dataset-preview" className="flex-1">
              <LaunchAlgorithm
                formData={formData}
                title={selected.text}
                description={selected.description ?? ""}
                algorithm={selected.id.code}
                onEnableContinueButton={() => setEnableContinueButton(true)}
                enableContinueButton={enableContinueButton}
              />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
