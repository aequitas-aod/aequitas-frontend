import React from "react";
import { Detection } from "@/features/detection/page";
import {
  useFeaturesData,
  useMetricsData,
  useQuestionnaireData,
} from "@/hooks/useDetectionData";
import { useCurrentDataset } from "@/api/context";
import data from "../../../mocks/correlation_matrix/custom-1";

interface QuestionnairePageProps {
  questionNumber: number;
  onNext: () => void;
}

export const DetectionPage = ({
  questionNumber,
  onNext,
}: QuestionnairePageProps) => {
  const { data: datasetKey } = useCurrentDataset();

  const {
    isLoading: featuresLoading,
    error: featuresError,
    sensitiveFeatures,
    target,
  } = useFeaturesData(datasetKey);

  const {
    isLoading: metricsLoading,
    error: metricsError,
    metrics,
  } = useMetricsData(datasetKey, target);

  const {
    isLoading: questionnaireLoading,
    error: questionnaireError,
    questionnaireKeys,
    questionnaireData,
    answers,
  } = useQuestionnaireData(questionNumber, sensitiveFeatures);

  const isLoading = metricsLoading || featuresLoading || questionnaireLoading;
  const error = metricsError || featuresError || questionnaireError;

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
      data={questionnaireKeys}
      metricGraphs={metrics}
      questionNumber={questionNumber}
      questionAnswers={answers}
      questionnaireData={questionnaireData!}
    />
  );
};
