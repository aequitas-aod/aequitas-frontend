import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useState } from "react";
import { DatasetView } from "./sections/dataset-view";
import { FeaturesView } from "./sections/feature-view";
import { ResultsViewSection } from "./sections/results-view";
import { Detection } from "./sections/detection";
import { ActionButtons } from "./buttons";
import { AnswerResponse, QuestionnaireResponse } from "@/api/types";
import { RESULT_SECTIONS } from "./utils";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import { useUpdateQuestionnaire } from "@/api/questionnaire";

interface ResultsViewProps {
  data: QuestionnaireResponse;
  datasetKey: string;
  questionNumber: number;
  onNext: () => void;
}

export const ResultsView = ({
  data,
  datasetKey,
  questionNumber,
  onNext,
}: ResultsViewProps) => {
  const [selected, setSelected] = useState<string | null>("ResultsView");

  const sections = RESULT_SECTIONS;

  const { mutate } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });

  const handleAction = (answer: AnswerResponse) => {
    mutate({
      n: questionNumber,
      answer_ids: [answer.id],
    });
  };

  const onDownloadDataset = () => {};

  const onDownloadResults = () => {};

  const onTest = () => {};

  return (
    <QuestionnaireLayout
      action={
        <div className="flex space-x-2">
          <ActionButtons
            answers={data.answers}
            onAction={handleAction}
            onDownloadDataset={onDownloadDataset}
            onDownloadResults={onDownloadResults}
            onTest={onTest}
          />
        </div>
      }
      className="!bg-transparent !border-0 !overflow-hidden"
    >
      <QuestionnaireBanner text={data.description} />

      <div className="flex items-center p-3 bg-primary-950 text-primary-50 gap-4">
        <p className="text-full-white">
          Check the operations performed so far:
        </p>
        <ToggleGroup type="single" className="p-1 bg-primary-900 rounded-md">
          {sections.map((section) => (
            <ToggleGroupItem
              key={section.id}
              value={section.id}
              aria-label={section.name}
              onClick={() => {
                setSelected(section.id);
              }}
            >
              {section.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex justify-between rounded-b-md flex-1 mt-2 overflow-auto">
        {/* Content based on the selected section */}
        {selected === "ResultsView" && (
          <ResultsViewSection datasetKey={datasetKey} />
        )}
        {selected === "DatasetView" && <DatasetView datasetKey={datasetKey} />}
        {selected === "FeatureView" && <FeaturesView datasetKey={datasetKey} />}
        {selected === "Detection" && <Detection datasetKey={datasetKey} />}
      </div>
    </QuestionnaireLayout>
  );
};
