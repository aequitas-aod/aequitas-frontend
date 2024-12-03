import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/containers/layout";
import { DetectionData, Graph, MetricGraphs } from "@/containers/detection";
import { FeatureCheckbox } from "@/components/molecules/FeatureCheckbox";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";
import { Histogram } from "@/components/molecules/Histogram";

export const Detection = ({
  onNext,
  data,
  metricGraphs,
}: {
  onNext: () => void;
  data: DetectionData;
  metricGraphs: MetricGraphs;
}) => {
  const t = useTranslations("feature-view");
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [featureData, setFeatureData] = useState<DetectionData>(data);

  const onContinue = () => {
    // fare la chiamata per salvare i dati
    onNext();
  };

  const handleCheckboxChange = (featureKey: string, attributeKey: string) => {
    const updatedFeatureData = {
      ...featureData,
      [featureKey]: {
        ...featureData[featureKey],
        [attributeKey]: {
          ...featureData[featureKey][attributeKey],
          selected:
            featureData[featureKey][attributeKey].selected === "true"
              ? "false"
              : "true",
        },
      },
    };

    if (updatedFeatureData[featureKey][attributeKey].selected === "true") {
      handleGraphClick(featureKey, attributeKey);
    } else {
      removeGraph(featureKey, attributeKey);
    }

    setFeatureData(updatedFeatureData);
  };

  const removeGraph = (featureKey: string, attributeKey: string) => {
    const updatedGraphs = graphs.filter(
      (graph) =>
        !(graph.featureKey === featureKey && graph.key === attributeKey)
    );

    setGraphs(updatedGraphs);
  };

  const handleGraphClick = (featureKey: string, attributeKey: string) => {
    const find = metricGraphs[featureKey].graphs.find(
      (graph) => graph.key === attributeKey
    );
    if (!find) return;
    setGraphs((prev) => [find, ...prev]);
  };

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-white !overflow-hidden"
    >
      <div className="flex p-2 h-full">
        <div className="w-90 p-6 overflow-auto">
          <p className="mb-6 text-neutral-800 text-base font-normal">
            Detect bias in the data
          </p>
          {Object.entries(featureData).map(([featureKey, attributes]) => {
            // devo prendere tutti gli attributi con selected = true
            const suggestedCount = Object.entries(attributes).filter(
              ([_, attributeData]) => attributeData.selected === "true"
            ).length;
            return (
              <FeatureAccordion
                key={featureKey}
                featureKey={
                  featureKey
                    .replace(/([a-z])([A-Z])/g, "$1 $2") // Aggiunge uno spazio tra lettere minuscole e maiuscole
                    .toLowerCase() // Converte tutto in minuscolo
                    .replace(/\b\w/g, (char) => char.toUpperCase()) // Rende la prima lettera di ogni parola maiuscola
                }
                suggestedCount={suggestedCount}
              >
                {Object.entries(attributes).map(
                  ([attributeKey, attributeData]) => (
                    <FeatureCheckbox
                      key={attributeKey}
                      attributeKey={attributeKey}
                      featureKey={featureKey}
                      featureIndex={Object.entries(attributes).findIndex(
                        ([key]) => key === attributeKey
                      )}
                      onCheckboxChange={handleCheckboxChange}
                      selectionStatus={attributeData.selected}
                      totalItems={Object.entries(attributes).length}
                      title={attributeKey.toUpperCase()}
                    />
                  )
                )}
              </FeatureAccordion>
            );
          })}
        </div>
        <div className="flex flex-1 flex-col p-4 bg-neutral-100 gap-4 rounded overflow-auto">
          {graphs?.map((graph) => (
            <div
              key={`${graph.featureKey}-${graph.key}`}
              className={`bg-white p-4 flex flex-col rounded h-[20rem] w-full`}
            >
              <h1 className="py-6 px-4 border-b w-full font-medium text-xl">
                {`${graph.featureKey} - ${graph.key.charAt(0).toUpperCase() + graph.key.slice(1)}`}
              </h1>
              <div className="flex overflow-auto gap-4">
                {graph.values.map((value) => (
                  <div
                    key={`${graph.featureKey}-${graph.key}-${value.label}`}
                    className="flex flex-col items-center justify-center min-w-[25rem] p-4 "
                  >
                    <h2 className="text-lg font-medium">{value.label}</h2>
                    {value.data.length > 0 ? (
                      <Histogram
                        data={value.data.reduce(
                          (acc, curr) => ({
                            ...acc,
                            [curr.class]: curr.value,
                          }),
                          {}
                        )}
                        className="min-w-[25rem] h-[10rem]"
                      />
                    ) : (
                      <p className="text-neutral-500 text-sm">
                        No data available
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </QuestionnaireLayout>
  );
};
