import { useSuggestedProxies } from "@/api/context";
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
