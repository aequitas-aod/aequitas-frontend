"use client";

import { QUESTIONNAIRE_KEYS } from "@/config/constants";
import { useFullQuestionnaire } from "@/hooks/useFullQuestionnaire";

import { DatasetSelectionPage } from "./dataset-selection";
import { FeatureViewPage } from "./feature-view";
import { ProxiesPage } from "./proxies";
import { DatasetViewPage } from "./dataset-view";
import { MitigationPage } from "./data-mitigation";
import { DetectionPage } from "./detection";
import { DataMitigationResultsViewPage } from "./results-view/data-mitigation";
import { TestSelectionPage } from "./test-selection";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { TestResultsViewPage } from "./results-view/test";
import { OutcomeResultsViewPage } from "./results-view/outcome-mitigation";
import { ModelResultsViewPage } from "./results-view/model-mitigation";
import { DatasetTypeSelectionPage } from "./dataset-type-selection";

export default function QuestionnaireContainer() {
  const { onNext, currentQuestion, menuItems, onDelete } =
    useFullQuestionnaire();

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
          {questionKey === QUESTIONNAIRE_KEYS.DATASET_TYPE_SELECTION && (
            <DatasetTypeSelectionPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
          )}
          {(questionKey === QUESTIONNAIRE_KEYS.TABULAR_DATASET_SELECTION ||
            questionKey === QUESTIONNAIRE_KEYS.IMAGE_DATASET_SELECTION) && (
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
          {questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION && (
            <MitigationPage
              onNext={onNext}
              questionNumber={questionNumber}
              type={"preprocessing"}
            />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION && (
            <MitigationPage
              onNext={onNext}
              questionNumber={questionNumber}
              type="inprocessing"
            />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION && (
            <MitigationPage
              onNext={onNext}
              questionNumber={questionNumber}
              type="postprocessing"
            />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.POLARIZATION && (
            <MitigationPage
              onNext={onNext}
              questionNumber={questionNumber}
              type="inprocessing"
            />
          )}
          {/* Results */}
          {questionKey === QUESTIONNAIRE_KEYS.DATA_MITIGATION_SUMMARY && (
            <DataMitigationResultsViewPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.MODEL_MITIGATION_SUMMARY && (
            <ModelResultsViewPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
          )}
          {questionKey === QUESTIONNAIRE_KEYS.OUTCOME_MITIGATION_SUMMARY && (
            <OutcomeResultsViewPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
          )}
          {/* Test */}
          {questionKey === QUESTIONNAIRE_KEYS.TEST_SUMMARY && (
            <TestResultsViewPage
              onNext={onNext}
              questionNumber={questionNumber}
            />
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
