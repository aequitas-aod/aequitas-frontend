"use client";
import { useRouter } from "next/navigation";

import { DatasetChoicePage } from "./dataset-choice";
import { FeatureViewPage } from "./feature-view";
import { DependenciesPage } from "./dependencies";
import { DatasetViewPage } from "./dataset-view";
import { DataMitigationPage } from "./data-mitigation";
import { DetectionPage } from "./detection";
import { ResultsViewPage } from "./results-view";
import { useStore } from "@/store/store";
import { QUESTIONNAIRE_KEYS } from "@/config/constants";

export default function QuestionnaireContainer() {
  const router = useRouter();

  const { currentStep, setCurrentStep, menuItems } = useStore();

  const onNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const selectedStep = menuItems.find((step) => step.step === currentStep);

  if (!selectedStep) {
    router.push("/en");
    return null;
  }

  // console.log("selectedStep", selectedStep);
  const questionKey = selectedStep?.id || "";
  const questionNumber = selectedStep?.step || 0;

  // console.log("questionKey", questionKey);
  // console.log("questionNumber", questionNumber);

  return (
    <>
      {/* questionKey as string */}
      {questionKey === QUESTIONNAIRE_KEYS.DATASET_SELECTION && (
        <DatasetChoicePage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.DATASET_VIEW && (
        <DatasetViewPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.FEATURE_VIEW && (
        <FeatureViewPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.PROXIES && (
        <DependenciesPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.DETECTION && (
        <DetectionPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {(questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION ||
        questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION ||
        questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION) && (
        <DataMitigationPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {(questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION_SUMMARY ||
        questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION_SUMMARY ||
        questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION_SUMMARY) && (
        <ResultsViewPage onNext={onNext} questionNumber={questionNumber} />
      )}
      {questionKey === QUESTIONNAIRE_KEYS.TEST_SET_CHOICE && <>TestSetChoice</>}
      {questionKey === QUESTIONNAIRE_KEYS.POLARIZATION && <>Polarization</>}
      {questionKey === QUESTIONNAIRE_KEYS.TEST_SUMMARY && <>TestSummary</>}
    </>
  );
}
