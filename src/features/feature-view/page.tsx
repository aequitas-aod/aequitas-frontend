import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import type { AnswerResponse, FeaturesParams } from "@/api/types";
import { useMutationFeatures } from "@/api/context";
import { useAequitasStore } from "@/store/store";

export const FeaturesView = ({
  questionNumber,
  onNext,
  answers,
  features,
}: {
  questionNumber: number;
  onNext: () => void;
  answers: AnswerResponse[];
  features: ParsedDataset[];
}) => {
  const t = useTranslations("FeatureView");
  const { datasetKey } = useAequitasStore();

  /* default: all rows are selected */
  const [selectedRows, setSelectedRows] = useState<number[]>(
    Array.from({ length: features.length }, (_, index) => index)
  );
  const [data, setData] = useState<ParsedDataset[]>(features);

  const columns = features.length > 0 ? Object.keys(features[0]) : [];

  const { mutate: mutateFeatures, isPending: isPendingFeatures } =
    useMutationFeatures({
      onSuccess: () => {
        console.log("MUTATION SUCCESS");
        onNext();
      },
    });

  const { mutate: mutateQuestionnaire, isPending: isPendingQuestionnaire } =
    useUpdateQuestionnaire({
      onSuccess: async () => {
        console.log(data);
        // onNext();
        onMutateQuestionnaire();
      },
    });

  const handleCheckboxChange = (index: number, key: string) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [key]: !updatedData[index][key],
      };
      return updatedData;
    });
  };

  const onMutateQuestionnaire = () => {
    const features: FeaturesParams = {};

    data.forEach((record) => {
      const { feature, sensitive, target } = record;
      features[feature.toString()] = {
        sensitive: sensitive == true,
        target: target == true,
        drop: false /* TODO: filter the selectedRows */,
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

  const handleSelectRow = (index: number) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((rowIndex) => rowIndex !== index);
      }
      return [...prevSelectedRows, index];
    });
  };

  const onContinue = () => {
    mutateQuestionnaire({
      n: questionNumber,
      answer_ids: [answers[0].id],
    });
  };

  const isPending = isPendingFeatures || isPendingQuestionnaire;

  return (
    <QuestionnaireLayout
      action={
        <Button
          onClick={onContinue}
          disabled={selectedRows.length === 0 || isPending}
        >
          {t("buttons.continue")}
        </Button>
      }
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
      />
      <FeatureViewTable
        data={data}
        columns={columns}
        selectedRows={selectedRows}
        handleSelectRow={handleSelectRow}
        handleCheckboxChange={handleCheckboxChange}
        disabled={isPendingQuestionnaire}
      />
    </QuestionnaireLayout>
  );
};
