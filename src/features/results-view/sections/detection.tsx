import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Graph, useMetricsData } from "@/hooks/useDetectionData";
import { GraphsDisplay } from "@/features/detection/graphs";

export const Detection = ({ datasetKey }: { datasetKey: string }) => {
  const t = useTranslations("FeatureView");
  const [graphs, setGraphs] = useState<Graph[]>([]);

  const { metrics, isLoading, error } = useMetricsData(datasetKey);

  useEffect(() => {
    if (!metrics) {
      return;
    }

    // Combinare i grafici in un unico array
    const nextGraphs = Object.values(metrics).reduce<Graph[]>((acc, metric) => {
      if (metric && metric.graphs) {
        acc.push(...metric.graphs);
      }
      return acc;
    }, []);

    setGraphs(nextGraphs); // Imposta correttamente l'array combinato
  }, [metrics]); // Solo dipende da metrics

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
