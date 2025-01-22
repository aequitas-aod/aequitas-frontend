import {
  useCorrelationMatrix,
  useCurrentDataset,
  useSuggestedProxies,
} from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { Proxies } from "@/features/proxies/page";

import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const ProxiesPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { data: datasetKey } = useCurrentDataset();

  const {
    data: question,
    isLoading: questionIsLoading,
    error: questionError,
  } = useQuestionnaireById({ n: questionNumber });

  const {
    data: proxiesData,
    isLoading,
    error,
  } = useSuggestedProxies(datasetKey);

  const { data: correlationMatrix } = useCorrelationMatrix(datasetKey);

  if (isLoading || questionIsLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (questionError instanceof Error) {
    return <div>Error: {questionError.message}</div>;
  }

  if (!proxiesData) {
    return <div>No proxies available</div>;
  }

  if (!question) {
    return <div>No question available</div>;
  }

  return (
    <Proxies
      onNext={onNext}
      data={proxiesData}
      question={question}
      questionNumber={questionNumber}
      answers={question.answers}
      correlationMatrix={correlationMatrix}
      datasetKey={datasetKey!}
    />
  );
};
