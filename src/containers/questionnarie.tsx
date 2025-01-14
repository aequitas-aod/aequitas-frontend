"use client";
import { useRouter } from "next/navigation";

import { DatasetSelectionPage } from "./dataset-selection";
import { FeatureViewPage } from "./feature-view";
import { ProxiesPage } from "./proxies";
import { DatasetViewPage } from "./dataset-view";
import { DataMitigationPage } from "./data-mitigation";
import { DetectionPage } from "./detection";
import { ResultsViewPage } from "./results-view";
import { QUESTIONNAIRE_KEYS } from "@/config/constants";
import { useQuestionnaireData } from "@/hooks/useQuestionnaireData";

export default function QuestionnaireContainer() {
  const router = useRouter();
  const { onNext, currentQuestion } = useQuestionnaireData();

  if (!currentQuestion) {
    router.push("/en");
    return null;
  }

  console.log("selectedStep", currentQuestion);
  const questionKey = currentQuestion?.id || "";
  const questionNumber = currentQuestion?.step || 0;

  return (
    <>
      {(questionKey === QUESTIONNAIRE_KEYS.DATASET_SELECTION ||
        questionKey === QUESTIONNAIRE_KEYS.TEST_SET_CHOICE) && (
        <DatasetSelectionPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.DATASET_VIEW && (
        <DatasetViewPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.FEATURE_VIEW && (
        <FeatureViewPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.PROXIES && (
        <ProxiesPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.DETECTION && (
        <DetectionPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {(questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION ||
        questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION ||
        questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION ||
        questionKey === QUESTIONNAIRE_KEYS.POLARIZATION) && (
        <DataMitigationPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {(questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION_SUMMARY ||
        questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION_SUMMARY ||
        questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION_SUMMARY ||
        questionKey === QUESTIONNAIRE_KEYS.TEST_SUMMARY) && (
        <ResultsViewPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.END_TEST && <>DONE</>}
    </>
  );
}
