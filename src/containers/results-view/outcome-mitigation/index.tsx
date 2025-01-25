import { useContextVectorialData, useCurrentDataset } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { ResultsView } from "@/features/results-view";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const OutcomeResultsViewPage = ({
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
    params: { n: questionNumber },
  });

  const { data: correlationMatrix } = useContextVectorialData(
    "correlation_matrix",
    datasetKey
  );

  const { data: postProcessingPlot } = useContextVectorialData(
    "postprocessing_plot",
    datasetKey
  );

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

  const imagesToShow: string[] | undefined =
    correlationMatrix && postProcessingPlot
      ? [correlationMatrix, postProcessingPlot]
      : undefined;

  return (
    <ResultsView
      questionNumber={questionNumber}
      questionnaire={questionnaireData}
      datasetKey={datasetKey}
      images={imagesToShow}
      onNext={onNext}
    />
  );
};
