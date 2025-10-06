import { useState } from "react";
import { useTranslations } from "next-intl";

import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";
import { ButtonLoading } from "@/components/ui/loading-button";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

import { FeatureCheckboxList } from "./accordion";
import { GraphsDisplay } from "./graphs";

import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { useMutationDetected } from "@/api/context";

import type { AnswerId } from "@/api/questionnaire/types";
import type {
  AnswerResponse,
  DetectionDataParams,
  QuestionnaireResponse,
} from "@/api/types";
import type { DetectionData, Graph, MetricGraphs } from "@/types/types";

export const Detection = ({
  onNext,
  questionnaireKeys,
  metricGraphs,
  datasetKey,
  questionNumber,
  questionAnswers,
  questionnaireData,
  targetFeature,
}: {
  onNext: () => void;
  questionnaireKeys: DetectionData;
  questionnaireData: QuestionnaireResponse;
  datasetKey: string;
  metricGraphs: MetricGraphs;
  questionNumber: number;
  questionAnswers: AnswerResponse[] | undefined;
  targetFeature: string;
}) => {
  const t = useTranslations("FeatureView");
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [featureData, setFeatureData] =
    useState<DetectionData>(questionnaireKeys);

  const { mutateAsync: mutateQuestionnaire, isPending } =
    useUpdateQuestionnaire({
      onSuccess: () => {
        console.log("Questionnaire mutation success");
      },
    });

  const { mutateAsync: mutateDetected } = useMutationDetected({
    onSuccess: () => {
      console.log("Detected mutation success");
    },
  });

  const onContinue = async () => {
    const keysWithSelectedAttributes: string[] = Object.keys(
      featureData
    ).filter((key) =>
      Object.values(featureData[key]).some(
        (attributeData) => attributeData.selected === "true"
      )
    );
    const answerIds: AnswerId[] = questionAnswers!
      .map((answer) => answer.id)
      .filter((id) => keysWithSelectedAttributes.includes(id.code));

    const body: DetectionDataParams = {};

    keysWithSelectedAttributes.forEach((key) => {
      body[key] = Object.entries(featureData[key])
        .filter(([_, attributeData]) => attributeData.selected === "true")
        .map(([attributeKey]) => ({
          sensitive: attributeKey,
          target: targetFeature,
        }));
    });
    try {
      await mutateDetected({
        dataset: datasetKey,
        body: body,
      });

      await mutateQuestionnaire({
        n: questionNumber,
        answer_ids: answerIds,
      });

      onNext();
    } catch (error) {
      console.error("Error during mutation:", error);
    }
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
    const find = metricGraphs[featureKey].graphs?.find(
      (graph) => graph.key === attributeKey
    );
    if (!find) return;
    setGraphs((prev) => [find, ...prev]);
  };

  const isDisabled = Object.values(featureData).every((attributes) =>
    Object.values(attributes).every(
      (attributeData) => attributeData.selected === "false"
    )
  );

  return (
    <QuestionnaireLayout
      action={
        <ButtonLoading
          onClick={onContinue}
          isLoading={isPending}
          disabled={isDisabled || isPending}
        >
          {t("buttons.continue")}
        </ButtonLoading>
      }
      className="!bg-white !overflow-hidden"
    >
      <QuestionnaireBanner text={questionnaireData.description} />
      <div className="flex p-2 h-full overflow-auto">
        <div className="max-w-md p-6 overflow-auto">
          <p className="mb-6 text-neutral-800 text-base font-normal">
            {questionnaireData.text}
          </p>
          {Object.entries(featureData).map(([featureKey, attributes]) => {
            const suggestedCount = Object.entries(attributes).filter(
              ([_, attributeData]) => attributeData.selected === "true"
            ).length;

            return (
              <FeatureAccordion
                key={featureKey}
                featureKey={featureKey}
                description={
                  questionAnswers.find(
                    (answer) => answer.id.code === featureKey
                  ).description
                }
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
