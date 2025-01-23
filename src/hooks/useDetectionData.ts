import { useCallback, useMemo } from "react";

import { useFeaturesContext, useMetricsContext } from "@/api/context";
import { useQuestionnaireById } from "@/api/questionnaire";

import { ConditionResponse, MetricsResponse } from "@/api/types";
import type {
  ClassValue,
  DetectionData,
  Graph,
  MetricGraphs,
} from "@/types/types";

// ------------------------------
// Hook: useMetricsData
// ------------------------------
export const useMetricsData = (dataset?: string, selectedTarget?: string) => {
  const {
    data: metricsData,
    isLoading: metricsLoading,
    error: metricsError,
  } = useMetricsContext(dataset, selectedTarget);
  const parseGraphs = useCallback(
    <T>(
      items: ConditionResponse<T>[],
      mainKey: string,
      targetFeature: string
    ): Graph[] => {
      const grouped: { [key: string]: { [label: string]: ClassValue[] } } = {};
      if (!targetFeature) return [];
      const feature = targetFeature;

      items.forEach((item) => {
        const key = Object.keys(item.when).find((k) => k !== feature)!;
        const label = item.when[feature];
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
        targetFeature: feature,
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
    <T>(data: MetricsResponse<T>, targetFeature: string): MetricGraphs => {
      const parsed: MetricGraphs = {};
      Object.keys(data).forEach((mainKey) => {
        parsed[mainKey] = {
          graphs: parseGraphs(data[mainKey]!, mainKey, targetFeature),
        };
      });
      return parsed;
    },
    [parseGraphs]
  );

  const parsedData = useMemo(() => {
    // If no target is selected, return null
    if (!selectedTarget) return null;
    // If no metrics data is available
    if (!metricsData) return null;
    // Parse the metrics data with the selected target
    return parseMetricsData(metricsData, selectedTarget);
  }, [selectedTarget, metricsData, parseMetricsData]);

  return {
    isLoading: metricsLoading,
    error: metricsError,
    metrics: parsedData,
  };
};

// ------------------------------
// Hook: useFeaturesData
// ------------------------------
export const useFeaturesData = (dataset?: string) => {
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

  const target = useMemo(() => {
    if (!featuresData) return undefined;

    return Object.keys(featuresData).find(
      (key) => featuresData[key].target === true
    )!;
  }, [featuresData]);

  return {
    isLoading: featuresLoading,
    error: featuresError,
    sensitiveFeatures,
    target,
  };
};

// ------------------------------
// Hook: useQuestionnaireData
// ------------------------------
export const useQuestionnaireData = (
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
