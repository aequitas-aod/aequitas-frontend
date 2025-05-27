import React from "react";

import {
  useCurrentDataset,
  useDatasetHeadContext,
  useDatasetType,
} from "@/api/context";
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

  const { data, isLoading, error } = useQuestionnaireById({
    params: { n: questionNumber },
  });

  const {
    data: contextData,
    isLoading: isLoadingContextData,
    error: errorContextData,
  } = useDatasetHeadContext(datasetKey);

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
