import {
  useFeaturesContext,
  useMetricsContext,
  useQuestionnaire,
} from "@/api/hooks";
import { ConditionResponse, MetricsResponse } from "@/api/types";
import { Detection } from "@/features/detection/page";
import React from "react";

interface QuestionnairePageProps {
  questionId: number;
  onNext: () => void;
}

// Definizione delle tipizzazioni per la conversione
// Definizione delle tipizzazioni per la conversione
export interface Graph {
  key: string;
  featureKey: string;
  values: GraphValue[];
}

interface GraphValue {
  label: string;
  data: ClassValue[];
}

interface ClassValue {
  class: string;
  value: number;
}

export type MetricGraphs = Record<
  string,
  {
    graphs: Graph[];
  }
>;

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

  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useMetricsContext("custom-1");

  if (isLoadingQuestionnaireData || featuresLoading || metricsLoading) {
    return <div>Loading...</div>;
  }

  if (errorQuestionnaireData || featuresError || metricsError) {
    return <div>Error...</div>;
  }

  if (!questionnaireData || !featuresData || !metricsData) {
    return <div>No data...</div>;
  }

  // Funzione per trasformare i dati in un formato leggibile
  function parseData<T>(
    data: MetricsResponse<T>
  ): Record<string, { graphs: Graph[] }> {
    const parsed: Record<string, { graphs: Graph[] }> = {};

    Object.keys(data).forEach((mainKey) => {
      parsed[mainKey] = {
        graphs: parseGraphs(data[mainKey]!, mainKey),
      };
    });

    return parsed;
  }

  // Funzione che raggruppa i dati in base a `sex` o `race`
  function parseGraphs<T>(
    items: ConditionResponse<T>[],
    mainKey: string
  ): Graph[] {
    const grouped: { [key: string]: { [label: string]: ClassValue[] } } = {};

    items.forEach((item) => {
      const key = Object.keys(item.when).find((k) => k !== "class")!; // "sex" o "race"
      const label = item.when["class"]; // "Male", "Female", "White", ecc.
      const classType = item.when[key]; // "<=50K" o ">50K"

      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][label]) grouped[key][label] = [];

      grouped[key][label].push({
        class: classType,
        value: typeof item.value === "number" ? item.value : NaN, // Gestione di "NaN"
      });
    });

    return Object.keys(grouped).map((key) => ({
      key,
      featureKey: mainKey,
      values: Object.keys(grouped[key]).map((label) => ({
        label,
        data: grouped[key][label],
      })),
    }));
  }

  // Convertiamo i dati
  const parsedData = parseData(metricsData);

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

  return (
    <Detection
      onNext={onNext}
      data={questionaireKeys}
      metricGraphs={parsedData}
    />
  );
};
