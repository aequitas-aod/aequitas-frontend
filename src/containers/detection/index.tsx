import { useFeaturesContext, useQuestionnaire } from "@/api/hooks";
import { FeaturesResponse } from "@/api/types";
import { Detection } from "@/features/detection/page";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

export type FeatureName = {
  text: string;
  value: FeaturesResponse;
};

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

  // Filtrare solo le caratteristiche sensibili
  const sensitiveFeatures = Object.keys(featuresData)
    .filter((key) => featuresData[key].sensitive) // Filtra le chiavi con sensitive = true
    .reduce((obj, key) => {
      obj[key] = featuresData[key]; // Aggiungi ogni chiave e valore a un nuovo oggetto
      return obj;
    }, {} as FeaturesResponse); // Usa il tipo FeaturesResponse per il risultato

  console.log(sensitiveFeatures);

  console.log(sensitiveFeatures);

  console.log(sensitiveFeatures);

  // per ogni text dentro questionnarieData, gli aggiungo come valore il valore di featuresData
  const featureName: FeatureName[] = questionnaireData.answers
    .map((question) => question.text)
    .map((text) => {
      return {
        text,

        value: sensitiveFeatures,
      };
    });

  console.log(featureName);

  return <Detection onNext={onNext} data={featureName} />;
};
