import { useSuggestedProxies } from "@/api/hooks";
import { Dependencies } from "@/features/dependencies/page";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DependenciesPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  onNext,
}) => {
  const { data, isLoading, error } = useSuggestedProxies("custom-1");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <Dependencies onNext={onNext} data={data} />;
};
