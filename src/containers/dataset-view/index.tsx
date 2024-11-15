import { useDatasetContext } from "@/api/hooks";
import { DatasetView } from "@/features/dataset-view/page";

import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DatasetViewPage = ({
  questionId,
  onNext,
}: QuestionnairePageProps) => {
  //const { data, isLoading, error } = useQuestionnaire(questionId);
  const { data: contextData, isLoading, error } = useDatasetContext("custom-1");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!contextData) {
    return <div>No data available</div>;
  }

  console.log({ contextData });
  return <DatasetView onNext={onNext} contextData={contextData} />;
};
