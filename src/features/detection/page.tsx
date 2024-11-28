import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/containers/layout";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DetectionData } from "@/containers/detection";
import { FeatureCheckbox } from "@/components/molecules/FeatureCheckbox";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";

export const Detection = ({
  onNext,
  data,
}: {
  onNext: () => void;
  data: DetectionData;
}) => {
  const t = useTranslations("feature-view");
  const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
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
    setFeatureData(updatedFeatureData);
  };

  const handleGraphClick = (graphKey: string) => {
    setSelectedGraph(selectedGraph === graphKey ? null : graphKey);
  };

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-white"
    >
      <div className="flex p-2 h-full">
        <div className="w-90 p-6">
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
        <div className="flex flex-1 flex-col p-4 bg-neutral-100 gap-4 rounded">
          {/*graphs.map((graph) => (
            <div
              key={graph.key}
              onClick={() => handleGraphClick(graph.key)}
              className={`bg-white p-4 flex flex-col items-center rounded h-[20rem] w-full ${
                selectedGraph === graph.key
                  ? "shadow-2xl border-4 border-black ring-2 ring-neutral-400"
                  : ""
              }`}
            >
              <h1 className="py-6 px-4 border-b w-full font-medium text-xl">
                {graph.title}
              </h1>
              <div className="flex flex-1 justify-center items-center">
                Grafico Aequitas
              </div>
            </div>
          ))*/}
        </div>
      </div>
    </QuestionnaireLayout>
  );
};
