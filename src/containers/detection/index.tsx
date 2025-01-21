import React from "react";
import { Detection } from "@/features/detection/page";
import { useDetection } from "@/hooks/useDetectionData";
import { useCurrentDataset } from "@/api/context";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DetectionPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { data: datasetKey } = useCurrentDataset();
  
  const { isLoading, error, data, metrics, answers } = useDetection(
    questionNumber,
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

  return (
    <Detection
      onNext={onNext}
      data={data}
      metricGraphs={metrics}
      questionNumber={questionNumber}
      questionAnswers={answers}
    />
  );
};
