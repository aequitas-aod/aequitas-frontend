import { FeaturesView } from "@/features/feature-view/page";
import { useFeatureView } from "@/hooks/useFeatureView";
import { useStore } from "@/store/store";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const FeatureViewPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useFeatureView(datasetKey);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <FeaturesView
      onNext={onNext}
      features={data}
      questionNumber={questionNumber}
    />
  );
};
