import { useSuggestedProxies } from "@/api/context";
import { useQuestionnaire } from "@/api/questionnaire";
import { Dependencies } from "@/features/dependencies/page";
import { useStore } from "@/store/store";
import React from "react";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DependenciesPage: React.FC<QuestionnairePageProps> = ({
  questionNumber,
  onNext,
}) => {
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const {
    data: question,
    isLoading: questionIsLoading,
    error: questionError,
  } = useQuestionnaire({ n: questionNumber });

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

  return <Dependencies onNext={onNext} data={data} question={question} />;
};
