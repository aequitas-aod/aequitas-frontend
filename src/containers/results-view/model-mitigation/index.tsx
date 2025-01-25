import { useContextVectorialData, useCurrentDataset } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { ResultsView } from "@/features/results-view";

import React from "react";
import { AnswerResponse } from "@/api/types";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const ModelResultsViewPage = ({
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

  const {
    data: previousQuestion,
    isLoading: isLoadingPreviousQuestion,
    error: errorPreviousQuestion,
  } = useQuestionnaireById({
    params: { n: questionNumber - 1 },
  });

  let key: string | undefined

  if (questionnaireData && previousQuestion) {
    const selectedAlgorithm: string = previousQuestion.answers.find(
      (a) => a.selected
    ).id.code;

    key = `${selectedAlgorithm}__${datasetKey}`
    console.log(key);
  }

  const { data: correlationMatrix } = useContextVectorialData(
    "correlation_matrix",
    key
  );
  const { data: performancePlot } = useContextVectorialData(
    "performance_plot",
    key
  );
  const { data: fairnessPlot } = useContextVectorialData(
    "fairness_plot",
    key
  );

  const isLoading =
    datasetLoading || isLoadingQuestionnaire || isLoadingPreviousQuestion;
  const error = datasetError || errorQuestionnaire || errorPreviousQuestion;

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

  const imagesToShow: string[] =
    correlationMatrix && performancePlot && fairnessPlot
      ? [correlationMatrix, performancePlot, fairnessPlot]
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
