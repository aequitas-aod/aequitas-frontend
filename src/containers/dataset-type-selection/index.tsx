import { useDatasetsContext } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { DatasetSelection } from "@/features/dataset-selection";
import { Questionnaire } from "@/types/types";
import React from "react";
import { DatasetTypeSelection } from "@/features/dataset-type-selection";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DatasetTypeSelectionPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { data, isLoading, error } = useQuestionnaireById({
    params: { n: questionNumber },
  });

  const { data: answersDetails } = useDatasetsContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  if (!answersDetails) {
    return <div>No answers details available</div>;
  }

  const nextData: Questionnaire = {
    ...data,
    answers: data.answers.map((answer) => {
      const answerDetails = answersDetails.find(
        (answerDetail) => answerDetail.name === answer.text
      );

      const filteredDetails =
        answerDetails &&
        Object.fromEntries(
          Object.entries(answerDetails).filter(
            ([key]) => key !== "name" && key !== "description"
          )
        );

      return {
        ...answer,
        details: filteredDetails || {},
      };
    }),
  };

  return (
    <DatasetTypeSelection
      onNext={onNext}
      questionNumber={questionNumber}
      data={nextData}
    />
  );
};
