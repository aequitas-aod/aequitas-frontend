import {
  useDynamicQuestionnaire,
  usePreprocessingHyperparameters,
  useQuestionnaire,
} from "@/api/hooks";
import { DataMitigation } from "@/features/data-mitigation";
import { useStore } from "@/store/store";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  questionkey: string;
  onNext: () => void;
}

export const DynamicDataMitigationPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  questionkey,
  onNext,
}) => {
  console.log("DynamicDataMitigationPage", questionkey);
  console.log("DynamicDataMitigationPage");
  const { datasetKey } = useStore();
  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }
  const { data, isLoading, error } = useDynamicQuestionnaire(questionkey);
  const { data: formData } = usePreprocessingHyperparameters(datasetKey);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  if (!formData) {
    return <div>No form data available</div>;
  }

  return <DataMitigation onNext={onNext} data={data} formData={formData} />;
};
