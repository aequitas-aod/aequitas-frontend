import { usePreprocessingHyperparameters } from "@/api/context";
import { useQuestionnaire } from "@/api/questionnaire";

import { DataMitigation } from "@/features/data-mitigation";
import { useStore } from "@/store/store";
import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DataMitigationPage: React.FC<QuestionnairePageProps> = ({
  questionNumber,
  onNext,
}) => {
  console.log("DataMitigationPage");
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useQuestionnaire({ n: questionNumber });
  const { data: formData } = usePreprocessingHyperparameters(datasetKey);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  if (!formData) {
    return <div>No form data available</div>;
  }

  return <DataMitigation onNext={onNext} data={data} formData={formData} />;
};
