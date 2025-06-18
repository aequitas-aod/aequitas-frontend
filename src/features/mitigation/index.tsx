import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { LaunchAlgorithm } from "./launch-algorithm";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { useProcessingHyperparameters } from "@/api/context";

import type { AnswerResponse, QuestionnaireResponse } from "@/api/types";
import { ButtonLoading } from "@/components/ui/loading-button";
import type { ProcessingType } from "@/types/types";
import {
  DONE_KEY,
  NO_DATA_MITIGATION_KEY,
  NO_MODEL_MITIGATION_KEY,
  NO_OUTCOME_MITIGATION_KEY,
  TEST_KEY,
} from "@/config/constants";

export const DataMitigation = ({
  questionNumber,
  data,
  onNext,
  hyperparameterType,
}: {
  questionNumber: number;
  data: QuestionnaireResponse;
  onNext: () => void;
  hyperparameterType: ProcessingType;
}) => {
  const t = useTranslations("DataMitigation");

  const [selected, setSelected] = useState<AnswerResponse | null>(null);
  const [enableContinueButton, setEnableContinueButton] = useState(false);
  const options = data.answers;
  // If there are "Do not mitigate" and "Done" options, they must be the last ones
  if (options && options.length > 1) {
    const optionsToMove = [
      NO_DATA_MITIGATION_KEY,
      NO_MODEL_MITIGATION_KEY,
      NO_OUTCOME_MITIGATION_KEY,
      DONE_KEY,
    ];
    const toMove: typeof options = [];
    for (let i = options.length - 1; i >= 0; i--) {
      if (optionsToMove.includes(options[i].id.code)) {
        toMove.unshift(options.splice(i, 1)[0]);
      }
    }
    options.push(...toMove);
  }
  const { data: formData } = useProcessingHyperparameters(
    selected?.id.code ?? null,
    hyperparameterType
  );

  const { mutateAsync: updateQuestionnaire, isPending } =
    useUpdateQuestionnaire({
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
    if (!selected) {
      return;
    }
    try {
      await updateQuestionnaire({
        n: questionNumber,
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
    (selected && selected.id.code === DONE_KEY) ||
    (selected && selected.id.code === NO_DATA_MITIGATION_KEY) ||
    (selected && selected.id.code === NO_MODEL_MITIGATION_KEY) ||
    (selected && selected.id.code === NO_OUTCOME_MITIGATION_KEY) ||
    (selected && selected.id.code === TEST_KEY) ||
    enableContinueButton;

  return (
    <>
      <QuestionnaireLayout
        action={
          <ButtonLoading
            onClick={onContinue}
            disabled={!isDisabled}
            isLoading={isPending}
          >
            {t("buttons.continue")}
          </ButtonLoading>
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
                hyperparameterType={hyperparameterType}
              />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
