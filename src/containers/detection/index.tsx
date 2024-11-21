import { useQuestionnaire } from "@/api/hooks";
import { Detection } from "@/features/detection/page";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DetectionPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  onNext,
}) => {
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

  return <Detection onNext={onNext} />;
};
