import { useQuestionnaireById } from "@/api/questionnaire";
import { FeaturesView } from "@/features/feature-view/page";
import { useFeatureView } from "@/hooks/useFeatureView";
import { useAequitasStore } from "@/store/store";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const FeatureViewPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { datasetKey } = useAequitasStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const {
    data,
    isLoading: isLoadingQuestionnaireData,
    error: errorQuestionnaireData,
  } = useQuestionnaireById({
    n: questionNumber,
  });
  const {
    data: featureViewData,
    isLoading: isLoadingFeatureViewData,
    error: errorFeatureViewData,
  } = useFeatureView(datasetKey);

  const isLoading = isLoadingQuestionnaireData || isLoadingFeatureViewData;
  const error = errorQuestionnaireData || errorFeatureViewData;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No Questionnaire available</div>;
  }

  if (!featureViewData || featureViewData.length === 0) {
    return <div>No features available</div>;
  }

  return (
    <FeaturesView
      onNext={onNext}
      question={data}
      features={featureViewData}
      answers={data.answers}
      questionNumber={questionNumber}
    />
  );
};
