import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { DatasetPreview } from "./dataset-preview";
import { useAequitasStore } from "@/store/store";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import {
  EnhancedAnswerResponse,
  Questionnaire,
} from "@/containers/dataset-selection";
import { useUpdateQuestionnaire } from "@/api/questionnaire";

export const DatasetSelection = ({
  data,
  onNext,
}: {
  data: Questionnaire;
  onNext: () => void;
}) => {
  const t = useTranslations("DatasetSelection");
  const [selected, setSelected] = useState<EnhancedAnswerResponse | null>(null);
  const { setDatasetKey, currentStep } = useAequitasStore();

  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
      // TODO: remove when the API is ready
      setDatasetKey("custom-1");
      //
      onNext();
    },
  });
  const options = data.answers;

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
      n: currentStep,
      answer_ids: [selected.id],
    });
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
        classNameWrapper="!overflow-hidden"
        className="!bg-neutral-50"
      >
        <QuestionnaireBanner
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum"
        >
          <Button onClick={() => alert("feedback")} variant="secondary">
            {t("buttons.feedback")}
          </Button>
        </QuestionnaireBanner>
        <div className="flex justify-between space-x-4 p-8 bg-neutral-50 rounded-b-md flex-1">
          <div id="dataset-selection" className="flex-1">
            <p className="text-base text-primary-950 font-extrabold">
              {data.text}
            </p>
            <p className="text-[#64748B] text-sm">{t("subtitle")}</p>
            <RadioGroup className="mt-4">
              {options?.map((option) => (
                <RadioItem
                  key={option.id.code}
                  option={option}
                  selected={selected?.text === option.text}
                  onSelect={onSelect}
                />
              ))}
            </RadioGroup>
          </div>
          {selected && (
            <div className="flex-1 h-full">
              <DatasetPreview
                questionNumber={questionNumber}
                selected={selected}
                title={selected.text}
                description={selected.description || ""}
                details={selected.details}
                onNext={onNext}
              />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
