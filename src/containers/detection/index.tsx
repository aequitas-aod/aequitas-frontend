import React from "react";
import { Detection } from "@/features/detection/page";
import { useDetection } from "@/api/hooks/useDetectionData";
import { useSidebarStore } from "@/store/sidebarStore";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export const DetectionPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  onNext,
}) => {
  const { datasetKey } = useSidebarStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { isLoading, error, data, metrics } = useDetection(
    questionId,
    datasetKey
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }
  if (!metrics) {
    return <div>No metrics available</div>;
  }

  return <Detection onNext={onNext} data={data} metricGraphs={metrics} />;
};
