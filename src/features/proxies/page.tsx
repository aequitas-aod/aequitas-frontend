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
import { useCorrelationMatrix, useMutationProxies } from "@/api/context";
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
}: {
  onNext: () => void;
  data: ProxyDataResponse;
  question: QuestionnaireResponse;
  questionNumber: number;
  datasetKey: string;
  answers: AnswerResponse[];
}) => {
  const t = useTranslations("FeatureView");
  const {
    data: correlationMatrix,
    isLoading: isCorrelationMatrixLoading,
    error: correlationMatrixError,
  } = useCorrelationMatrix(datasetKey);

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

  let secureCorrelationMatrix = correlationMatrix;
  if (correlationMatrix) {
    secureCorrelationMatrix = DOMPurify.sanitize(correlationMatrix);
  }

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
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded min-h-auto relative">
            {secureCorrelationMatrix ? (
              <div
                className="flex-1 overflow-y-auto h-full"
                dangerouslySetInnerHTML={{ __html: secureCorrelationMatrix }}
              />
            ) : (
              <p className="text-neutral-600">
                Correlation matrix not available
              </p>
            )}
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
