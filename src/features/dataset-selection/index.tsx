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
import { useCurrentDataset, useLaunchAlgorithmMutation } from "@/api/context";

export const DatasetSelection = ({
  data,
  questionNumber,
  onNext,
  isTest,
}: {
  data: Questionnaire;
  questionNumber: number;
  onNext: () => void;
  isTest: boolean;
}) => {
  const t = useTranslations("DatasetSelection");

  const [selected, setSelected] = useState<EnhancedAnswerResponse | null>(null);

  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });
  const { mutate: launchAlgorithm } = useLaunchAlgorithmMutation({
    onSuccess: () => {
      onNext();
    },
  });

  let options = data.answers;

  const { data: datasetKey } = useCurrentDataset();
  if (!datasetKey) {
    return <div>Loading...</div>;
  }

  const testDatasetKey = "Test-" + datasetKey.slice(0, -2) + "Dataset";
  if (isTest) {
    // In test mode, only show the answer of dataset relative to the current dataset
    options = options.filter(
      (option) =>
        option.id.code === TEST_CUSTOM_DATASET_KEY ||
        option.id.code === testDatasetKey
    );
  }

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
    if (isTest) {
      launchAlgorithm({
        dataset: selected.id.code.replace("Dataset", ""),
        body: {},
        hyperparameterType: "polarization",
      });
    }
    mutate({
      n: questionNumber,
      answer_ids: [selected.id],
    });
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
