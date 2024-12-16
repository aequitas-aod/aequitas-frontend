import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { CreateDatasetDialog } from "./create-dataset-dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import type { AnswerResponse, QuestionnaireResponse } from "@/api/types";
import { DatasetPreview } from "./dataset-preview";
import { useStore } from "@/store/store";
import { useUpdateQuestionnaireMutation } from "@/api/questionnaire";
import { AnswerId } from "@/api/questionnaire/types";

export const DatasetChoice = ({
  data,
  questionNumber,
  onNext,
}: {
  data: QuestionnaireResponse;
  questionNumber: number;
  onNext: () => void;
}) => {
  const { mutate, isPending } = useUpdateQuestionnaireMutation({
    onSuccess: () => {
      onNext();
    },
  });
  const t = useTranslations("DatasetSelection");
  const [selected, setSelected] = useState<AnswerResponse | null>(null);
  const { setDatasetKey } = useStore();

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
    if (!selected) {
      return;
    }
    const answerIds: {
      answer_ids: AnswerId[];
    } = {
      answer_ids: [selected!.id],
    };
    mutate({
      n: questionNumber,
      answer_ids: answerIds.answer_ids,
    });
    const datasetKey: string = selected!.id.code.replace("Dataset", "") + "-1";
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
        className="!bg-neutral-50"
      >
        <div className="flex space-x-4 items-center justify-center py-5 bg-primary-600 text-primary-50 rounded-t-md">
          <p>{t("create-custom-dataset")}</p>
          <CreateDatasetDialog onContinue={onNext} />
        </div>
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
            <div className="flex-1 h-full">
              <DatasetPreview
                title={selected.text}
                description={selected.description || ""}
                details={selected.details}
              />
            </div>
          )}
        </div>
      </QuestionnaireLayout>
    </>
  );
};
