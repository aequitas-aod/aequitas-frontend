import { usePreprocessingHyperparameters, useQuestionnaire } from "@/api/hooks";
import { DataMitigation } from "@/features/data-mitigation";
import { useStore } from "@/store/store";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DataMitigationPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  onNext,
}) => {
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useQuestionnaire(questionId);
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
