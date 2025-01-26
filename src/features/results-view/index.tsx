import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useEffect, useState } from "react";
import { DatasetView } from "./sections/dataset-view";
import { FeaturesView } from "./sections/feature-view";
import { ResultsViewSection } from "./sections/results-view";
import { Detection } from "./sections/detection";
import { AnswerResponse, QuestionnaireResponse } from "@/api/types";
import { RESULT_SECTIONS } from "./utils";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";
import {
  useQuestionnaireById,
  useUpdateQuestionnaire,
} from "@/api/questionnaire";
import { ButtonLoading } from "@/components/ui/loading-button";
import { useTranslations } from "next-intl";
import { useFeaturesData } from "@/hooks/useDetectionData";
import { MitigationType } from "@/types/types";
import { useContextVectorialData } from "@/api/context";

interface ResultsViewProps {
  questionnaire: QuestionnaireResponse;
  datasetKey: string;
  questionNumber: number;
  onNext: () => void;
  mitigationType: MitigationType;
}

export const ResultsView = ({
  questionnaire,
  datasetKey,
  questionNumber,
  onNext,
  mitigationType,
}: ResultsViewProps) => {
  const t = useTranslations("ResultsView");
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

  // TODO: to fix adding feature__ for new datasets
  const { target } = useFeaturesData(datasetKey.split("-")[0] + "-1");

  const handleAction = (answer: AnswerResponse) => {
    setSelectedAnswer(answer.id.code);
    mutate({
      n: questionNumber,
      answer_ids: [answer.id],
    });
  };
  let key: string | undefined;

  const {
    data: previousQuestion,
    isLoading: isLoadingPreviousQuestion,
    error: errorPreviousQuestion,
  } = useQuestionnaireById({
    params: { n: questionNumber - 1 },
  });

  if (mitigationType === MitigationType.Model) {
    let selectedAlgorithm: string | undefined;

    if (previousQuestion && !isLoadingPreviousQuestion) {
      console.log(previousQuestion);
      console.log(isLoadingPreviousQuestion);
      const selectedAnswer: AnswerResponse | undefined =
        previousQuestion.answers.find((a) => a.selected);
      if (selectedAnswer) {
        selectedAlgorithm = selectedAnswer.id.code;
        key = `${selectedAlgorithm}__${datasetKey}`;
      }
      console.log(key);
    }
  } else {
    key = datasetKey;
  }

  const { data: correlationMatrix, isLoading: isLoadingCorrelationMatrix } =
    useContextVectorialData("correlation_matrix", datasetKey);

  const { data: preprocessingPlot, isLoading: isLoadingPreprocessingPlot } =
    useContextVectorialData("preprocessing_plot", key);
  const { data: performancePlot, isLoading: isLoadingPerformancePlot } =
    useContextVectorialData("performance_plot", key);
  const { data: fairnessPlot, isLoading: isLoadingFairnessPlot } =
    useContextVectorialData("fairness_plot", key);
  const { data: polarizationPlot, isLoading: isLoadingPolarizationPlot } =
    useContextVectorialData("polarization_plot", key);

  const featuresImages: string[] = correlationMatrix
    ? [correlationMatrix]
    : undefined;

  const [imagesToShow, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    // Map all plots and loading states into a single array for processing.
    const preprocessing =
      mitigationType === MitigationType.Data
        ? [{ src: preprocessingPlot, isLoading: isLoadingPreprocessingPlot }]
        : [];

    const otherPlots = [
      { src: performancePlot, isLoading: isLoadingPerformancePlot },
      { src: fairnessPlot, isLoading: isLoadingFairnessPlot },
      { src: polarizationPlot, isLoading: isLoadingPolarizationPlot },
    ];

    // Combine preprocessing and other plots, ensuring preprocessing comes first
    const plots = [...preprocessing, ...otherPlots];

    // Filter and display images as they load.
    const availableImages = plots
      .filter((plot) => !plot.isLoading)
      .map((plot) => plot.src);

    setLoadedImages(availableImages);
  }, [
    preprocessingPlot,
    performancePlot,
    fairnessPlot,
    polarizationPlot,
    mitigationType,
    isLoadingPerformancePlot,
    isLoadingFairnessPlot,
    isLoadingPolarizationPlot,
    isLoadingPreprocessingPlot,
  ]);

  if (isLoadingPreviousQuestion) {
    return <div>Loading...</div>;
  }
  if (errorPreviousQuestion) {
    return <div>Error fetching data</div>;
  }

  return (
    <QuestionnaireLayout
      action={
        <div className="flex space-x-2">
          {questionnaire.answers.map((answer) => (
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
      <QuestionnaireBanner text={questionnaire.description} />

      <div className="flex items-center p-3 bg-primary-950 text-primary-50 gap-4">
        <p className="text-full-white">{t("subtitle")}</p>
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
          <ResultsViewSection images={imagesToShow} />
        )}
        {selectedSection === "DatasetView" && (
          <DatasetView datasetKey={key} mitigationType={mitigationType} />
        )}
        {selectedSection === "FeatureView" && (
          // <FeaturesView datasetKey={key} targetFeature={target} />
          <ResultsViewSection images={featuresImages} />
        )}
        {selectedSection === "Detection" && (
          <Detection datasetKey={key} targetFeature={target} />
        )}
      </div>
    </QuestionnaireLayout>
  );
};
