import { useCurrentDataset } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { ResultsView } from "@/features/results-view";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const ResultsViewPage = ({
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

  return <ResultsView data={data} datasetKey={datasetKey} />;
};
