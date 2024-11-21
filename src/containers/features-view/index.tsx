import { useStatsContext } from "@/api/hooks";
import { FeaturesView } from "@/features/features-view/page";

import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const FeaturesViewPage = ({
  questionId,
  onNext,
}: QuestionnairePageProps) => {
  //const { data, isLoading, error } = useQuestionnaire(questionId);
  const { data: contextData, isLoading, error } = useStatsContext("custom-1");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!contextData) {
    return <div>No data available</div>;
  }

  return <FeaturesView onNext={onNext} contextData={contextData} />;
};
