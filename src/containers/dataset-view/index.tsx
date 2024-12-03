import { useDatasetContext } from "@/api/hooks";
import { DatasetView } from "@/features/dataset-view/page";
import { useStore } from "@/store/store";

import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DatasetViewPage = ({
  questionId,
  onNext,
}: QuestionnairePageProps) => {
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data: contextData, isLoading, error } = useDatasetContext(datasetKey);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!contextData) {
    return <div>No data available</div>;
  }

  return <DatasetView onNext={onNext} contextData={contextData} />;
};
