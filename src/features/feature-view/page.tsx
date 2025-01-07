import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";

import { useUpdateQuestionnaireMutation } from "@/api/questionnaire";
import { ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";
import { AnswerId } from "@/api/questionnaire/types";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import type { AnswerResponse, FeaturesParams } from "@/api/types";
import { useMutationFeatures } from "@/api/context";
import { useStore } from "@/store/store";
import { sleep } from "@/lib/utils";

export const FeaturesView = ({
  questionNumber,
  onNext,
  answers,
  features,
}: {
  questionNumber: number;
  onNext: () => void;
  answers: AnswerResponse[];
  features: ParsedDataset[];
}) => {
  const t = useTranslations("FeatureView");

  const {
    mutate: mutateFeatures,
    isPending: isPendingFeatures,
  } = useMutationFeatures({
    onSuccess: () => {
      console.log("MUTATION SUCCESS");
      onNext();
    },
  });

  const {
    mutate: mutateQuestionnaire,
    isPending: isPendingQuestionnaire,
  } = useUpdateQuestionnaireMutation({
    onSuccess: async () => {
      console.log(data);
      // onNext();
      onMutateQuestionnaire();
    },
  });
  const [data, setData] = useState<ParsedDataset[]>(features);
  const columns = features.length > 0 ? Object.keys(features[0]) : [];
  const { datasetKey } = useStore();

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

  const onMutateQuestionnaire = () => {
    const features: FeaturesParams = {};
    data.forEach(record => {
      const { feature, sensitive, target } = record;
      features[feature.toString()] = {
        sensitive: sensitive == true,
        target: target == true,
        drop: false
      }
    });
    console.log(features);
    console.log("DATASET KEY");
    console.log(datasetKey);
    mutateFeatures({
      dataset: datasetKey!,
      body: features
    })

  };

  const onContinue = () => {
    mutateQuestionnaire({
      n: questionNumber,
      answer_ids: [answers[0].id],
    });

  };

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <QuestionnaireBanner>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum
      </QuestionnaireBanner>
      <FeatureViewTable
        data={data}
        columns={columns}
        handleCheckboxChange={handleCheckboxChange}
        disabled={isPendingQuestionnaire}
      />
    </QuestionnaireLayout>
  );
};
