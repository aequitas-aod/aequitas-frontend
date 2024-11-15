import { useQuestionnaire } from "@/api/hooks";
import { DatasetChoice } from "@/features/dataset-choice";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DatasetChoicePage: React.FC<QuestionnairePageProps> = ({
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

  return <DatasetChoice onNext={onNext} data={data} />;
};
