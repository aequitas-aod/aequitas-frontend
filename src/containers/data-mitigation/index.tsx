import { useQuestionnaireById } from "@/api/questionnaire";

import { DataMitigation } from "@/features/data-mitigation";
import { useAequitasStore } from "@/store/store";
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
  const { datasetKey } = useAequitasStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useQuestionnaireById({
    n: questionNumber,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <DataMitigation onNext={onNext} data={data} />;
};
