import React from "react";

import { useCurrentDataset } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { DataMitigation } from "@/features/data-mitigation";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DataMitigationPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { data: datasetKey } = useCurrentDataset();
  
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
