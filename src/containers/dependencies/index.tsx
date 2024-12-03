import { useSuggestedProxies } from "@/api/hooks";
import { Dependencies } from "@/features/dependencies/page";
import { useSidebarStore } from "@/store/sidebarStore";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DependenciesPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  onNext,
}) => {
  const { datasetKey } = useSidebarStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useSuggestedProxies(datasetKey);

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
