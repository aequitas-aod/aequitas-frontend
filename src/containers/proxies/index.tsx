import { useSuggestedProxies } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";
import { Proxies } from "@/features/proxies/page";
import { useAequitasStore } from "@/store/store";
import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const ProxiesPage: React.FC<QuestionnairePageProps> = ({
  questionNumber,
  onNext,
}) => {
  const { datasetKey } = useAequitasStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const {
    data: question,
    isLoading: questionIsLoading,
    error: questionError,
  } = useQuestionnaireById({ n: questionNumber });

  const { data, isLoading, error } = useSuggestedProxies(datasetKey);

  if (isLoading || questionIsLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (questionError instanceof Error) {
    return <div>Error: {questionError.message}</div>;
  }

  if (!data) {
    return <div>No proxies available</div>;
  }

  if (!question) {
    return <div>No question available</div>;
  }

  return <Proxies onNext={onNext} data={data} question={question} />;
};
