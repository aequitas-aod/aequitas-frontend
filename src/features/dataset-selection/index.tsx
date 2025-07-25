import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { DatasetPreview } from "./dataset-preview";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

import { useUpdateQuestionnaire } from "@/api/questionnaire";

import type { EnhancedAnswerResponse, Questionnaire } from "@/types/types";
import { ButtonLoading } from "@/components/ui/loading-button";
import {
  CUSTOM_DATASET_KEY,
  TEST_CUSTOM_DATASET_KEY,
} from "@/config/constants";

export const DatasetSelection = ({
  data,
  questionNumber,
  onNext,
}: {
  data: Questionnaire;
  questionNumber: number;
  onNext: () => void;
}) => {
  const t = useTranslations("DatasetSelection");

  const [selected, setSelected] = useState<EnhancedAnswerResponse | null>(null);

  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });
  // const { mutate: mutatePolarization } = useLaunchAlgorithmMutation({
  //   onSuccess: () => {
  //     console.log("Polarization algorithm launched successfully");
  //   },
  // });

  const options = data.answers;

  // If there is "CustomDataset" option, it should be the last
  if (options && options.length > 1) {
    const customOptionIndex = options.findIndex(
      (option) =>
        option.id.code === CUSTOM_DATASET_KEY ||
        option.id.code === TEST_CUSTOM_DATASET_KEY
    );
    if (customOptionIndex !== -1) {
      const customOption = options.splice(customOptionIndex, 1)[0];
      options.push(customOption);
    }
  }

  const onSelect = (value: string) => {
    const selectedOption =
      options?.find((option) => option.id.code === value) || null;
    if (!selectedOption) {
      return;
    }
    setSelected(selectedOption);
  };

  const onContinue = () => {
    if (!selected) {
      return;
    }
    mutate({
      n: questionNumber,
      answer_ids: [selected.id],
    });
    // const parsedHyperparameters = {
    //   hidden_dim: 8,
    //   input_dim: 8,
    //   lambda_adv: 5,
    //   output_dim: 1,
    //   sensitive_dim: 1,
    // }
    // mutatePolarization({
    //   dataset: "Test-Adecco",
    //   body: {
    //     $algorithm: "AdversarialDebiasing",
    //     ...parsedHyperparameters,
    //   },
    //   hyperparameterType: "polarizationprocessing",
    // })
  };

  return (
    <>
      <QuestionnaireLayout
        action={
          <ButtonLoading
            onClick={onContinue}
            disabled={!selected}
            variant={selected ? "default" : "secondary"}
            isLoading={isPending}
          >
            {t("buttons.continue")}
          </ButtonLoading>
        }
        classNameWrapper="!overflow-hidden"
        className="!bg-neutral-50 !overflow-hidden"
      >
        <QuestionnaireBanner text={data.description}></QuestionnaireBanner>
        <div className="flex justify-between space-x-4 p-8 bg-neutral-50 rounded-b-md flex-1 overflow-auto">
          <div id="dataset-selection" className="flex-1 overflow-auto">
            <p className="text-base text-primary-950 font-extrabold">
              {data.text}
            </p>
            <p className="text-[#64748B] text-sm">{t("subtitle")}</p>
            <RadioGroup className="mt-4">
              {options?.map((option) => (
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
            <div className="flex-1 h-full">
              <DatasetPreview
                selected={selected}
                questionNumber={questionNumber}
                onNext={onNext}
              />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
