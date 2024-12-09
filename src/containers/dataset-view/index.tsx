import { useDatasetContext } from "@/api/context";
import { DatasetView } from "@/features/dataset-view/page";
import { useStore } from "@/store/store";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DatasetViewPage = ({
  questionNumber,
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
