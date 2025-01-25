import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useMetricsData } from "@/hooks/useDetectionData";
import { GraphsDisplay } from "@/features/detection/graphs";

import type { Graph } from "@/types/types";

type DetectionProps = {
  datasetKey: string;
  targetFeature: string;
};

export const Detection = ({ datasetKey, targetFeature }: DetectionProps) => {
  const t = useTranslations("FeatureView");
  const [graphs, setGraphs] = useState<Graph[]>([]);
  console.log(datasetKey + ".   " + targetFeature);
  const { metrics, isLoading, error } = useMetricsData(
    datasetKey,
    targetFeature
  );

  useEffect(() => {
    if (!metrics) {
      return;
    }

    // Integrate the graphs into a single array
    const nextGraphs = Object.values(metrics).reduce<Graph[]>((acc, metric) => {
      if (metric && metric.graphs) {
        acc.push(...metric.graphs);
      }
      return acc;
    }, []);

    setGraphs(nextGraphs);
  }, [metrics]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  if (!metrics) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex flex-1 flex-col p-4 bg-neutral-100 gap-4 rounded overflow-auto">
      <GraphsDisplay graphs={graphs} />
    </div>
  );
};
