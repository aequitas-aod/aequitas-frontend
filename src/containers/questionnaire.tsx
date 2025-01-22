"use client";

import { QUESTIONNAIRE_KEYS } from "@/config/constants";
import { useQuestionnaireFull } from "@/hooks/useQuestionnaireFull";

import { DatasetSelectionPage } from "./dataset-selection";
import { FeatureViewPage } from "./feature-view";
import { ProxiesPage } from "./proxies";
import { DatasetViewPage } from "./dataset-view";
import { DataMitigationPage } from "./data-mitigation";
import { DetectionPage } from "./detection";
import { ResultsViewPage } from "./results-view";
import { TestSelectionPage } from "./test-selection";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";

export default function QuestionnaireContainer() {
  const { onNext, currentQuestion, menuItems, onDelete } =
    useQuestionnaireFull();

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const questionKey = currentQuestion.id;
  const questionNumber = currentQuestion.step;

  return (
    <>
      <Sidebar menuItems={menuItems} onDelete={onDelete} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <>
          {questionKey === QUESTIONNAIRE_KEYS.DATASET_SELECTION && (
            <DatasetSelectionPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
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
            <DataMitigationPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
          )}
          {(questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION_SUMMARY ||
            questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION_SUMMARY ||
            questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION_SUMMARY ||
            questionKey === QUESTIONNAIRE_KEYS.TEST_SUMMARY) && (
            <ResultsViewPage onNext={onNext} questionNumber={questionNumber} />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.TEST_SET_CHOICE && (
            <TestSelectionPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.END_TEST && <>DONE</>}
        </>
      </div>
    </>
  );
}
