import { useQuestionnaireById } from "@/api/questionnaire";
import { DatasetSelection } from "@/features/dataset-selection";
import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DatasetSelectionPage: React.FC<QuestionnairePageProps> = ({
  questionNumber,
  onNext,
}) => {
  const { data, isLoading, error } = useQuestionnaireById({
    n: questionNumber,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <DatasetSelection
      onNext={onNext}
      questionNumber={questionNumber}
      data={data}
    />
  );
};
