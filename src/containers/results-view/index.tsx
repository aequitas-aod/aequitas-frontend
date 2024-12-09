import { useQuestionnaire } from "@/api/questionnaire";
import { ResultsView } from "@/features/results-view";
import { useStore } from "@/store/store";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const ResultsViewPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useQuestionnaire({ n: questionNumber });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <ResultsView data={data} />;
};
