import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";
import { FeatureCheckbox } from "@/components/molecules/FeatureCheckbox";
import { useUpdateQuestionnaire } from "@/api/questionnaire";

import {
  type AnswerResponse,
  ProxyDataParams,
  ProxyDataResponse,
  QuestionnaireResponse,
} from "@/api/types";
import { useCurrentDataset, useDatasetContext, useMutationProxies } from "@/api/context";
import Image from "next/image";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

export const Proxies = ({
  onNext,
  data,
  question,
  questionNumber,
  answers
}: {
  onNext: () => void;
  data: ProxyDataResponse;
  question: QuestionnaireResponse;
  questionNumber: number;
  answers: AnswerResponse[];
}) => {
  const t = useTranslations("FeatureView");

  const { mutate: mutateProxies, isPending: isPendingProxies } = useMutationProxies({
    onSuccess: () => {
      mutateQuestionnaire({
        n: questionNumber,
        answer_ids: [answers[0]?.id],
      });
    },
  });
  const { mutate: mutateQuestionnaire, isPending: isPendingQuestionnaire } =
    useUpdateQuestionnaire({
      onSuccess: () => {
        onNext();
      },
    });

  const { data: currentDataset } = useCurrentDataset();

  const [featureData, setFeatureData] = useState<ProxyDataResponse>(data);

  const handleCheckboxChange = (featureKey: string, attributeKey: string) => {
    // Aggiorna la copia dello stato, modificando solo l'attributo specificato
    const updatedFeatureData = { ...featureData };

    if (
      updatedFeatureData[featureKey] &&
      updatedFeatureData[featureKey][attributeKey]
    ) {
      updatedFeatureData[featureKey][attributeKey] = {
        ...updatedFeatureData[featureKey][attributeKey],
        suggested_proxy:
          updatedFeatureData[featureKey][attributeKey].suggested_proxy ===
          "true"
            ? "false"
            : "true",
      };
    }

    // Imposta il nuovo stato
    setFeatureData(updatedFeatureData);
  };

  function transformProxyData(data: ProxyDataResponse): ProxyDataParams {
    const transformedData: ProxyDataParams = {};

    for (const category in data) {
      transformedData[category] = {};

      for (const attribute in data[category]) {
        const item = data[category][attribute];
        transformedData[category][attribute] = {
          correlation: item.correlation,
          proxy: item.suggested_proxy,
        };
      }
    }

    return transformedData;
  }
  const onContinue = () => {
    const body = transformProxyData(featureData);
    console.log(body);
    mutateProxies({ dataset: currentDataset, body });
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
      <div className="flex p-2 overflow-auto">
        <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded">
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded w-full min-h-[200px] relative">
            <Image
              src="/images/4_2_correlation_matrix.png"
              alt="Proxies"
              layout="fill"
              objectFit="contain"
              className="rounded"
            />
          </div>
        </div>
        <div className="w-[380px] p-6 overflow-auto">
          <p className="mb-6 text-neutral-800 text-base font-normal">
            {question.text}
          </p>
          {Object.entries(featureData).map(([featureKey, attributes]) => {
            const suggestedCount = Object.entries(attributes).filter(
              ([_, attributeData]) => attributeData.suggested_proxy === "true"
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
                      title={attributeKey.toUpperCase()}
                      featureKey={featureKey}
                      featureIndex={Object.entries(attributes).findIndex(
                        ([key]) => key === attributeKey
                      )}
                      onCheckboxChange={handleCheckboxChange}
                      selectionStatus={attributeData.suggested_proxy}
                      totalItems={Object.entries(attributes).length}
                      label={`${(attributeData.correlation * 100).toFixed(0)}%`}
                    />
                  )
                )}
              </FeatureAccordion>
            );
          })}
        </div>
      </div>
    </QuestionnaireLayout>
  );
};
