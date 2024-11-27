import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/containers/layout";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FeatureAccordion } from "@/components/molecules/FeatureAccordion";
import { FeatureCheckbox } from "@/components/molecules/FeatureCheckbox";
import { ProxyDataParams, ProxyDataResponse } from "@/api/types";
import { useMutationProxies } from "@/api/hooks";
import Image from "next/image";

export const Dependencies = ({
  onNext,
  data,
}: {
  onNext: () => void;
  data: ProxyDataResponse;
}) => {
  const t = useTranslations("feature-view");

  const { mutate, isPending } = useMutationProxies({
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
    mutate({ dataset: "custom-1", body });
  };

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-white !overflow-hidden"
    >
      <div className="flex p-2 h-full">
        <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded">
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded w-full min-h-[200px] relative">
            <Image
              src="/images/4_2_correlation_matrix.png"
              alt="Dependencies"
              layout="fill"
              objectFit="contain"
              className="rounded"
            />
          </div>
        </div>
        <div className="w-[380px] p-6 overflow-auto">
          <p className="mb-6 text-neutral-800 text-base font-normal">
            Select possibly proxy features
          </p>
          {Object.entries(featureData).map(([featureKey, attributes]) => {
            const suggestedCount = Object.entries(attributes).filter(
              ([_, attributeData]) => attributeData.suggested_proxy === "true"
            ).length;
            return (
              <FeatureAccordion
                key={featureKey}
                featureKey={featureKey}
                suggestedCount={suggestedCount}
              >
                {Object.entries(attributes).map(
                  ([attributeKey, attributeData]) => (
                    <FeatureCheckbox
                      key={attributeKey}
                      attributeKey={attributeKey}
                      attributeData={attributeData}
                      featureKey={featureKey}
                      featureIndex={Object.entries(attributes).findIndex(
                        ([key]) => key === attributeKey
                      )}
                      onCheckboxChange={handleCheckboxChange}
                      totalItems={Object.entries(attributes).length}
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
