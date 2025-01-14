import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";
import { FeatureCheckboxList } from "./accordion";
import { GraphsDisplay } from "./graphs";
import { DetectionData, Graph, MetricGraphs } from "@/hooks/useDetectionData";
import { useAequitasStore } from "@/store/store";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

export const Detection = ({
  onNext,
  data,
  metricGraphs,
}: {
  onNext: () => void;
  data: DetectionData;
  metricGraphs: MetricGraphs;
}) => {
  const t = useTranslations("FeatureView");
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [featureData, setFeatureData] = useState<DetectionData>(data);

  const onContinue = () => {
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
      <QuestionnaireBanner
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum"
      />
      <div className="flex p-2 h-full overflow-auto">
        <div className="w-90 p-6 overflow-auto">
          <p className="mb-6 text-neutral-800 text-base font-normal">
            Detect bias in the data
          </p>
          {Object.entries(featureData).map(([featureKey, attributes]) => {
            const suggestedCount = Object.entries(attributes).filter(
              ([_, attributeData]) => attributeData.selected === "true"
            ).length;

            return (
              <FeatureAccordion
                key={featureKey}
                featureKey={featureKey}
                suggestedCount={suggestedCount}
              >
                <FeatureCheckboxList
                  featureKey={featureKey}
                  attributes={attributes}
                  onCheckboxChange={handleCheckboxChange}
                />
              </FeatureAccordion>
            );
          })}
        </div>
        <div className="flex flex-1 flex-col p-4 bg-neutral-100 gap-4 rounded overflow-auto">
          <GraphsDisplay graphs={graphs} />
        </div>
      </div>
    </QuestionnaireLayout>
  );
};
