import { useQuestionnaire } from "@/api/context/hooks";
import { XProcessAlgorithm } from "@/features/x-processing-alg";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const XProcessAlgorithmPage: React.FC<QuestionnairePageProps> = ({
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

  return <XProcessAlgorithm onNext={onNext} data={data} />;
};
