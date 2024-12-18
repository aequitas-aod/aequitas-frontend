import { useDatasetSelectionAnswersInfo } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import {
  AnswerContextResponse,
  AnswerResponse,
  QuestionnaireResponse,
} from "@/api/types";
import { DatasetSelection } from "@/features/dataset-selection";
import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export type Questionnaire = Omit<QuestionnaireResponse, "answers"> & {
  answers: EnhancedAnswerResponse[] | undefined;
};

export type EnhancedAnswerResponse = AnswerResponse & {
  details: AnswerContextResponse | {}; // Dataset details (now utilized)
};
export const DatasetSelectionPage: React.FC<QuestionnairePageProps> = ({
  questionNumber,
  onNext,
}) => {
  const { data, isLoading, error } = useQuestionnaireById({
    n: questionNumber,
  });

  const { data: answersDetails } = useDatasetSelectionAnswersInfo({
    nth: questionNumber,
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

  console.log(nextData);

  return <DatasetSelection onNext={onNext} data={nextData} />;
};
