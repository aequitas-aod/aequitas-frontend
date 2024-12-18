import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";
import { AnswerId } from "@/api/questionnaire/types";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

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

  const { mutate, isPending } = useUpdateQuestionnaire({
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
      <QuestionnaireBanner
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum"
      />
      <FeatureViewTable
        data={data}
        columns={columns}
        handleCheckboxChange={handleCheckboxChange}
        disabled={isPending}
      />
    </QuestionnaireLayout>
  );
};
