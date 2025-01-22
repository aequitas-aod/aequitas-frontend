import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useState } from "react";
import { DatasetView } from "./sections/dataset-view";
import { FeaturesView } from "./sections/feature-view";
import { ResultsViewSection } from "./sections/results-view";
import { Detection } from "./sections/detection";
import { AnswerResponse, QuestionnaireResponse } from "@/api/types";
import { RESULT_SECTIONS } from "./utils";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import { ButtonLoading } from "@/components/ui/loading-button";

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
  const [selectedSection, setSelectedSection] = useState<string | null>(
    "ResultsView"
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const sections = RESULT_SECTIONS;

  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });

  const handleAction = (answer: AnswerResponse) => {
    setSelectedAnswer(answer.id.code);
    mutate({
      n: questionNumber,
      answer_ids: [answer.id],
    });
  };

  return (
    <QuestionnaireLayout
      action={
        <div className="flex space-x-2">
          {data.answers.map((answer) => (
            <ButtonLoading
              key={answer.id.code}
              onClick={() => handleAction(answer)}
              variant="outline"
              disabled={isPending}
              isLoading={isPending && selectedAnswer === answer.id.code}
            >
              {answer.text}
            </ButtonLoading>
          ))}
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
                setSelectedSection(section.id);
              }}
            >
              {section.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex justify-between rounded-b-md flex-1 mt-2 overflow-auto">
        {/* Content based on the selected section */}
        {selectedSection === "ResultsView" && (
          <ResultsViewSection datasetKey={datasetKey} />
        )}
        {selectedSection === "DatasetView" && (
          <DatasetView datasetKey={datasetKey} />
        )}
        {selectedSection === "FeatureView" && (
          <FeaturesView datasetKey={datasetKey} />
        )}
        {selectedSection === "Detection" && (
          <Detection datasetKey={datasetKey} />
        )}
      </div>
    </QuestionnaireLayout>
  );
};
