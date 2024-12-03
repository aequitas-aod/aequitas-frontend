import { useQuestionnaire, useStatsContext } from "@/api/hooks";
import { DMResults } from "@/features/results-view";
import { useStore } from "@/store/store";

import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DMResultsPage = ({
  questionId,
  onNext,
}: QuestionnairePageProps) => {
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useQuestionnaire(questionId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <DMResults data={data} />;
};
