import React from "react";

import { useQuestionnaireById } from "@/api/questionnaire";
import { DataMitigation } from "@/features/data-mitigation";
import type { ProcessingType } from "@/types/types";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
  type: ProcessingType;
}

export const DataMitigationPage = ({
  questionNumber,
  onNext,
  type,
}: QuestionnairePageProps) => {
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
    <DataMitigation
      onNext={onNext}
      data={data}
      questionNumber={questionNumber}
      hyperparameterType={type}
    />
  );
};
