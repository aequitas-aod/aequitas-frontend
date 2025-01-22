import { useFeaturesContext, useMetricsContext } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";

import { ConditionResponse, MetricsResponse } from "@/api/types";
import { useCallback, useMemo } from "react";

// ------------------------------
// Types
// ------------------------------
export type Graph = {
  key: string;
  featureKey: string;
  values: GraphValue[];
};

type GraphValue = {
  label: string;
  data: ClassValue[];
};

type ClassValue = {
  class: string;
  value: number;
};

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

// ------------------------------
// Hook: useMetricsData
// ------------------------------
export const useMetricsData = (dataset?: string) => {
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useMetricsContext(dataset);

  const parseGraphs = useCallback(
    <T>(items: ConditionResponse<T>[], mainKey: string): Graph[] => {
      const grouped: { [key: string]: { [label: string]: ClassValue[] } } = {};

      items.forEach((item) => {
        const key = Object.keys(item.when).find((k) => k !== "class")!;
        const label = item.when["class"];
        const classType = item.when[key];

        if (!grouped[key]) grouped[key] = {};
        if (!grouped[key][label]) grouped[key][label] = [];

        grouped[key][label].push({
          class: classType,
          value: typeof item.value === "number" ? item.value : NaN,
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
    },
    []
  );

  const parseMetricsData = useCallback(
    <T>(data: MetricsResponse<T>): MetricGraphs => {
      const parsed: MetricGraphs = {};

      Object.keys(data).forEach((mainKey) => {
        parsed[mainKey] = {
          graphs: parseGraphs(data[mainKey]!, mainKey),
        };
      });
      return parsed;
    },
    [parseGraphs]
  );

  const parsedData = useMemo(() => {
    if (!metricsData) return null;
    return parseMetricsData(metricsData);
  }, [metricsData, parseMetricsData]);

  return {
    isLoading: metricsLoading,
    error: metricsError,
    metrics: parsedData,
  };
};

// ------------------------------
// Hook: useFeaturesData
// ------------------------------
const useFeaturesData = (dataset?: string) => {
  const {
    data: featuresData,
    isLoading: featuresLoading,
    error: featuresError,
  } = useFeaturesContext(dataset);

  const sensitiveFeatures = useMemo(() => {
    if (!featuresData) return {};

    return Object.keys(featuresData)
      .filter((key) => featuresData[key].sensitive === true)
      .reduce(
        (obj, key) => {
          obj[key] = { selected: "false" };
          return obj;
        },
        {} as Record<string, { selected: string }>
      );
  }, [featuresData]);

  return {
    isLoading: featuresLoading,
    error: featuresError,
    sensitiveFeatures,
  };
};

// ------------------------------
// Hook: useQuestionnaireData
// ------------------------------
const useQuestionnaireData = (
  questionId: number,
  sensitiveFeatures: Record<string, { selected: string }>
) => {
  const {
    data: questionnaireData,
    isLoading: isLoadingQuestionnaireData,
    error: errorQuestionnaireData,
  } = useQuestionnaireById({ n: questionId });

  const questionnaireKeys = useMemo(() => {
    if (!questionnaireData) return null;

    return questionnaireData.answers.reduce((acc, answer) => {
      acc[answer.id.code] = sensitiveFeatures;
      return acc;
    }, {} as DetectionData);
  }, [questionnaireData, sensitiveFeatures]);

  return {
    isLoading: isLoadingQuestionnaireData,
    error: errorQuestionnaireData,
    questionnaireKeys,
    answers: questionnaireData?.answers,
    questionnaireData,
  };
};

// ------------------------------
// Hook: useDetection (Combines all hooks)
// ------------------------------
export const useDetection = (questionId: number, dataset?: string) => {
  const {
    isLoading: metricsLoading,
    error: metricsError,
    metrics,
  } = useMetricsData(dataset);
  const {
    isLoading: featuresLoading,
    error: featuresError,
    sensitiveFeatures,
  } = useFeaturesData(dataset);
  const {
    isLoading: questionnaireLoading,
    error: questionnaireError,
    questionnaireKeys,
    questionnaireData,
    answers,
  } = useQuestionnaireData(questionId, sensitiveFeatures);
  const isLoading = metricsLoading || featuresLoading || questionnaireLoading;
  const error = metricsError || featuresError || questionnaireError;

  return {
    isLoading,
    error,
    metrics,
    data: questionnaireKeys,
    answers,
    questionnaireData,
  };
};
