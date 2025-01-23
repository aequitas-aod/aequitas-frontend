import { useCurrentDataset } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { ResultsView } from "@/features/results-view";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const TestResultsViewPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const {
    data: datasetKey,
    isLoading: datasetLoading,
    error: datasetError,
  } = useCurrentDataset();

  const {
    data: questionnaireData,
    isLoading: isLoadingQuestionnaire,
    error: errorQuestionnaire,
  } = useQuestionnaireById({
    n: questionNumber,
  });

  const isLoading = datasetLoading || isLoadingQuestionnaire;
  const error = datasetError || errorQuestionnaire;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!questionnaireData) {
    return <div>No questionnaire data available</div>;
  }

  if (!datasetKey) {
    return <div>No dataset available</div>;
  }

  return (
    <ResultsView
      questionNumber={questionNumber}
      questionnaire={questionnaireData}
      datasetKey={datasetKey}
      onNext={onNext}
    />
  );
};
