import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";
import { FeatureCheckbox } from "@/components/molecules/FeatureCheckbox";
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import parse from 'html-react-parser';

import {
  type AnswerResponse,
  ProxyDataParams,
  ProxyDataResponse,
  QuestionnaireResponse,
} from "@/api/types";
import { useMutationProxies } from "@/api/context";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import { ButtonLoading } from "@/components/ui/loading-button";
import DOMPurify from "dompurify";

export const Proxies = ({
  onNext,
  data,
  question,
  datasetKey,
  questionNumber,
  answers,
  correlationMatrix,
}: {
  onNext: () => void;
  data: ProxyDataResponse;
  question: QuestionnaireResponse;
  questionNumber: number;
  datasetKey: string;
  answers: AnswerResponse[];
  correlationMatrix?: string;
}) => {

  const parsingOptions = {
    replace: (domNode) => {
      if (domNode.tagName === 'svg') {
        domNode.attribs.class = 'w-full h-auto';
      }
      return domNode;
    },
  }

  let imagesToShow: (string | React.JSX.Element | React.JSX.Element[])[] = [];
  if (correlationMatrix) {
    const images: string[] = [correlationMatrix];
    imagesToShow = images.map((svg) => {
      return svg.substring(svg.indexOf("<svg"));
    }).map((svg) => parse(svg, parsingOptions))
  }

  const t = useTranslations("FeatureView");

  const { mutate: mutateProxies, isPending: isPendingProxies } =
    useMutationProxies({
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
    mutateProxies({ dataset: datasetKey, body });
  };

  return (
    <QuestionnaireLayout
      action={
        <ButtonLoading
          onClick={onContinue}
          isLoading={isPendingProxies || isPendingQuestionnaire}
        >
          {t("buttons.continue")}
        </ButtonLoading>
      }
      className="!bg-white !overflow-hidden"
    >
      <QuestionnaireBanner text={question.description} />
      <div className="flex p-2 overflow-y-auto overflow-x-hidden h-full">
        <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
            <div className="flex flex-wrap p-4 mx-auto">
              {imagesToShow.map((svg, index) => (
                <div key={index} className="w-full xl:w-1/2 p-2">
                  {svg}
                </div>
              ))}
            </div>
        </div>
        <div className="min-w-40rem p-6 overflow-auto">
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
