import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useState } from "react";
import { DatasetView } from "./sections/dataset-view";
import { FeaturesView } from "./sections/feature-view";
import { ResultsViewSection } from "./sections/results-view";
import { useAequitasStore } from "@/store/store";
import { Detection } from "./sections/detection";
import { ActionButtons } from "./buttons";
import { QuestionnaireResponse } from "@/api/types";
import {
  parseAnswerId,
  parseAnswerIdName,
  parseAnswerIdNameSummary,
  RESULT_SECTIONS,
} from "./utils";
import { QUESTIONNAIRE_KEYS } from "@/config/constants";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

interface ResultsViewProps {
  data: QuestionnaireResponse;
  datasetKey: string;
}

export const ResultsView = ({ data, datasetKey }: ResultsViewProps) => {
  const {
    menuItems: dynamicMenuItems,
    addMenuItem,
    currentStep,
    setCurrentStep,
  } = useAequitasStore();
  const [selected, setSelected] = useState<string | null>("ResultsView");

  const sections = RESULT_SECTIONS;

  const handleAction = (id: string) => {
    // Usa il parser per convertire answerId
    const answerId = parseAnswerId(id);

    // Creiamo dinamicamente l'item per il menu usando direttamente i parametri passati
    const newAction = {
      id: `${answerId}`,
      step: dynamicMenuItems.length + 1,
      name: parseAnswerIdName(answerId),
    };

    // Aggiungiamo la nuova voce al menu
    addMenuItem(newAction);

    // e aggiungo anche la results
    addMenuItem({
      id: `${answerId}Summary`,
      step: dynamicMenuItems.length + 2,
      name: `${parseAnswerIdNameSummary(answerId)}`,
    });
    setCurrentStep(currentStep + 1);
    // Eseguiamo la navigazione
  };

  const onDownloadDataset = () => {};

  const onDownloadResults = () => {};

  const onTest = () => {
    const testActions = [
      {
        id: QUESTIONNAIRE_KEYS.TEST_SET_CHOICE,
        step: dynamicMenuItems.length + 1,
        name: "Test Set Choice",
      },
      {
        id: QUESTIONNAIRE_KEYS.POLARIZATION,
        step: dynamicMenuItems.length + 2,
        name: "Polarization",
      },
      {
        id: QUESTIONNAIRE_KEYS.TEST_SUMMARY,
        step: dynamicMenuItems.length + 3,
        name: "Test Summary",
      },
    ];

    testActions.forEach((action) => {
      addMenuItem(action);
    });

    setCurrentStep(currentStep + 1);
  };

  

  return (
    <QuestionnaireLayout
      action={
        <div className="flex space-x-2">
          <ActionButtons
            datasetKey={datasetKey}
            answers={data.answers} // Passiamo le risposte dinamiche
            onAction={handleAction} // Funzione che gestisce l'azione selezionata
            onDownloadDataset={onDownloadDataset}
            onDownloadResults={onDownloadResults}
            onTest={onTest}
          />
        </div>
      }
      className="!bg-transparent !border-0 !overflow-hidden"
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
        {/* Contenuto in base alla section selezionata dal toggle*/}
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
