import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { useUpdateQuestionnaireMutation } from "@/api/hooks";
import { ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";

export const FeaturesView = ({
  onNext,
  features,
}: {
  onNext: () => void;
  features: ParsedDataset[];
}) => {
  const t = useTranslations("feature-view");

  const { mutate, isPending } = useUpdateQuestionnaireMutation({
    onSuccess: () => {
      onNext();
    },
  });
  console.log(features);

  const [data, setData] = useState<ParsedDataset[]>(features);
  const columns = features.length > 0 ? Object.keys(features[0]) : [];

  const handleCheckboxChange = (index: number, key: string) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [key]: !updatedData[index][key],
      };
      return updatedData;
    });
  };

  const onContinue = () => {
    const sensitiveFeatures = data
      .filter((feature) => feature.sensitive)
      .map((feature) => ({
        code: `${feature.feature}-sensitive`,
      }));

    const targetFeatures = data
      .filter((feature) => feature.target)
      .map((feature) => ({
        code: `${feature.feature}-target`,
      }));

    const answerIds = {
      answer_ids: { ...sensitiveFeatures, ...targetFeatures },
    };
    mutate(answerIds);
  };

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <FeatureViewTable
        data={data}
        columns={columns}
        handleCheckboxChange={handleCheckboxChange}
        disabled={isPending}
      />
    </QuestionnaireLayout>
  );
};
