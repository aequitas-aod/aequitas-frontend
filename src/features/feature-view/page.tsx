import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { useUpdateQuestionnaireMutation } from "@/api/questionnaire";
import { ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";
import { AnswerId } from "@/api/questionnaire/types";

export const FeaturesView = ({
  questionNumber,
  onNext,
  features,
}: {
  questionNumber: number;
  onNext: () => void;
  features: ParsedDataset[];
}) => {
  const t = useTranslations("FeatureView");

  const { mutate, isPending } = useUpdateQuestionnaireMutation({
    onSuccess: () => {
      onNext();
    },
  });
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

    const answerIds: {
      answer_ids: AnswerId[];
    } = {
      answer_ids: { ...sensitiveFeatures, ...targetFeatures },
    };
    mutate({
      n: questionNumber,
      answer_ids: answerIds.answer_ids,
    });
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
