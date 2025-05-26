import { useTranslations } from "next-intl";
import { useState } from "react";

import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { isMocked } from "@/api/api";

import type { EnhancedAnswerResponse, Questionnaire } from "@/types/types";
import { ButtonLoading } from "@/components/ui/loading-button";

export const DatasetTypeSelection = ({
  data,
  questionNumber,
  onNext,
}: {
  data: Questionnaire;
  questionNumber: number;
  onNext: () => void;
}) => {
  const t = useTranslations();

  const [selected, setSelected] = useState<EnhancedAnswerResponse | null>(null);

  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
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
    if (isMocked()) {
      console.log("Using mocked response for putQuestionnaire");
      onNext();
      return;
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
            {t("common.continue")}
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
        </div>
      </QuestionnaireLayout>
    </>
  );
};
