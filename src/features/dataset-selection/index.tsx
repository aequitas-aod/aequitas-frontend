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
import { AnswerId } from "@/api/questionnaire/types";
import { isMocked } from "@/api/api";

export const DatasetSelection = ({
  data,
  questionNumber,
  onNext,
}: {
  data: Questionnaire;
  questionNumber: number;
  onNext: () => void;
}) => {
  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });
  const t = useTranslations("DatasetSelection");
  const [selected, setSelected] = useState<EnhancedAnswerResponse | null>(null);
  const { setDatasetKey, currentStep } = useAequitasStore();
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
      setDatasetKey("custom-1");
      onNext();
      return;
    }
    mutate({
      n: currentStep,
      answer_ids: [selected.id],
    });
    const answerIds: {
      answer_ids: AnswerId[];
    } = {
      answer_ids: [selected!.id],
    };
    mutate({
      n: questionNumber,
      answer_ids: answerIds.answer_ids,
    });
    const datasetKey: string = selected!.id.code + "-1";
    setDatasetKey(datasetKey);
    // here i need to uplo
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
        classNameWrapper="!overflow-hidden"
        className="!bg-neutral-50 !overflow-hidden"
      >
        <QuestionnaireBanner text={data.description}>
          <Button onClick={() => alert("feedback")} variant="secondary">
            {t("buttons.feedback")}
          </Button>
        </QuestionnaireBanner>
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
