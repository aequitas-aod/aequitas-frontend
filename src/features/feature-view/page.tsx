import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import { useCurrentDataset, useMutationFeatures } from "@/api/context";

import type {
  AnswerResponse,
  FeaturesParams,
  QuestionnaireResponse,
} from "@/api/types";

interface FeatureViewProps {
  question: QuestionnaireResponse;
  questionNumber: number;
  onNext: () => void;
  answers: AnswerResponse[];
  features: ParsedDataset[];
}

export const FeaturesView = ({
  question,
  questionNumber,
  onNext,
  answers,
  features,
}: FeatureViewProps) => {
  const t = useTranslations("FeatureView");
  const { data: datasetKey } = useCurrentDataset();

  const [selectedRows, setSelectedRows] = useState<number[]>(
    Array.from({ length: features.length }, (_, index) => index)
  );
  const [data, setData] = useState<ParsedDataset[]>(features);

  const columns = features.length > 0 ? Object.keys(features[0]) : [];

  const { mutate: mutateFeatures, isPending: isPendingFeatures } =
    useMutationFeatures({
      onSuccess: () => {
        // todo: invalidate questionnaire: queryKey: ["questionnaire", "full"],
        onNext();
      },
    });

  const { mutate: mutateQuestionnaire, isPending: isPendingQuestionnaire } =
    useUpdateQuestionnaire({
      onSuccess: () => {
        onMutateFeatures();
      },
    });

  const handleTargetCheckboxChange = (index: number, key: string) => {
    /* only one target can be selected */
    setData((prevData) => {
      const updatedData = prevData.map((record, i) => {
        if (i === index) {
          return {
            ...record,
            target: true,
          };
        }
        return {
          ...record,
          target: false,
        };
      });
      return updatedData;
    });
  };

  const handleSensitiveCheckboxChange = (index: number, key: string) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [key]: !updatedData[index][key],
      };
      return updatedData;
    });
  };

  const handleSelectRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((row) => row !== index)
        : [...prev, index]
    );
  };

  const onMutateFeatures = () => {
    const features: FeaturesParams = {};

    /* it can be improved with a reduce function */
    data.forEach((record, idx) => {
      const { feature, sensitive, target } = record;
      features[feature.toString()] = {
        sensitive: sensitive == true,
        target: target == true,
        drop: !selectedRows.includes(idx),
      };
    });

    console.log(features);
    console.log("DATASET KEY");
    console.log(datasetKey);
    mutateFeatures({
      dataset: datasetKey!,
      body: features,
    });
  };

  const onContinue = () => {
    mutateQuestionnaire({
      n: questionNumber,
      answer_ids: [answers[0]?.id],
    });
  };

  const isPending = isPendingFeatures || isPendingQuestionnaire;
  const selectedTarget = data.find((record) => record.target)?.feature as
    | string
    | undefined;

  return (
    <QuestionnaireLayout
      action={
        <div className="flex justify-end gap-4">
          <span>
            {t("selected-features", {
              selected: selectedRows.length,
              total: features.length,
            })}
          </span>
          <span>
            {t("selected-target", {
              target: selectedTarget || "None",
            })}
          </span>
          <Button
            onClick={onContinue}
            disabled={selectedRows.length === 0 || isPending}
          >
            {t("buttons.continue")}
          </Button>
        </div>
      }
      className="!bg-neutral-50"
    >
      <QuestionnaireBanner text={question.text} />
      <FeatureViewTable
        data={data}
        columns={columns}
        selectedRows={selectedRows}
        handleSelectRow={handleSelectRow}
        handleTargetCheckboxChange={handleTargetCheckboxChange}
        handleSensitiveCheckboxChange={handleSensitiveCheckboxChange}
        disabled={isPendingQuestionnaire}
      />
    </QuestionnaireLayout>
  );
};
