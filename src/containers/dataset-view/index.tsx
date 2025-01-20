import React from "react";

import { useCurrentDataset, useDatasetContext } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { DatasetView } from "@/features/dataset-view/page";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DatasetViewPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { data: datasetKey } = useCurrentDataset();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useQuestionnaireById({
    n: questionNumber,
  });

  const {
    data: contextData,
    isLoading: isLoadingContextData,
    error: errorContextData,
  } = useDatasetContext(datasetKey);

  if (isLoading || isLoadingContextData) {
    return <div>Loading...</div>;
  }

  if (error || errorContextData) {
    return <div>Error: {error?.message}</div>;
  }

  if (!data) {
    return <div>No Questionnaire available</div>;
  }

  if (!contextData) {
    return <div>No ContextData available</div>;
  }

  return (
    <DatasetView
      onNext={onNext}
      questionNumber={questionNumber}
      questionnaire={data}
      answers={data.answers}
      contextData={contextData}
    />
  );
};
