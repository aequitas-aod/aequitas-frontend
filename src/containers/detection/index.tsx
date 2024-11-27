import { useFeaturesContext, useQuestionnaire } from "@/api/hooks";
import { FeaturesResponse } from "@/api/types";
import { Detection } from "@/features/detection/page";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export type DetectionData = Record<
  string,
  Record<
    string,
    {
      selected: string;
    }
  >
>;

export const DetectionPage: React.FC<QuestionnairePageProps> = ({
  questionId,
  onNext,
}) => {
  const {
    data: questionnaireData,
    isLoading: isLoadingQuestionnaireData,

    error: errorQuestionnaireData,
  } = useQuestionnaire(questionId);
  const {
    data: featuresData,
    isLoading: featuresLoading,
    error: featuresError,
  } = useFeaturesContext("custom-1");

  if (isLoadingQuestionnaireData || featuresLoading) {
    return <div>Loading...</div>;
  }

  if (errorQuestionnaireData || featuresError) {
    return <div>Error...</div>;
  }

  if (!questionnaireData || !featuresData) {
    return <div>No data...</div>;
  }

  // Filtra le chiavi con sensitive=true e assegna loro il valore false
  const sensitiveFeatures = Object.keys(featuresData)
    .filter((key) => featuresData[key].sensitive === true)
    .reduce(
      (obj, key) => {
        obj[key] = {
          selected: "false",
        };
        return obj;
      },
      {} as Record<string, { selected: string }>
    );

  const questionaireKeys: DetectionData = questionnaireData.answers.reduce(
    (acc, answer) => {
      const keys = Object.keys(answer);
      acc = { ...acc, [answer.id.code]: sensitiveFeatures };
      return acc;
    },
    {}
  );

  return <Detection onNext={onNext} data={questionaireKeys} />;
};
