import { useQuestionnaire } from "@/api/questionnaire";
import { DatasetChoice } from "@/features/dataset-choice";
import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DatasetChoicePage: React.FC<QuestionnairePageProps> = ({
  questionNumber,
  onNext,
}) => {
  const { data, isLoading, error } = useQuestionnaire({ n: questionNumber });

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
