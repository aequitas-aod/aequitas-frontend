import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useState } from "react";
import { DatasetView } from "./sections/dataset-view";
import { FeaturesView } from "./sections/feature-view";
import { ResultsView } from "./sections/results-view";
import { useSidebarStore } from "@/store/sidebarStore";
import { useRouter } from "next/navigation";
import { Detection } from "./sections/detection";
import { ActionButtons } from "./buttons";
import { QuestionnaireResponse } from "@/api/types";

const sections = [
  {
    id: "results-view",
    name: "Results View",
  },
  {
    id: "dataset-view",
    name: "Dataset View",
  },
  // feature view
  {
    id: "features-view",
    name: "Features View",
  },
  {
    id: "detection",
    name: "Detection",
  },
];

export const DMResults = ({ data }: { data: QuestionnaireResponse }) => {
  const { menuItems: dynamicMenuItems, addMenuItem } = useSidebarStore();
  const { datasetKey, currentStep, setCurrentStep } = useSidebarStore();

  const [selected, setSelected] = useState<string | null>("results-view");

  const handleAction = (answerId: string, answerText: string) => {
    // Creiamo dinamicamente l'item per il menu usando direttamente i parametri passati
    const newAction = {
      id: `${answerId}-mitigation`,
      step: dynamicMenuItems.length + 1,
      name: "MM Mitigation", // Usando answerText come nome del bottone
      longDescription: "This is a dynamically added item.",
    };

    // Aggiungiamo la nuova voce al menu
    addMenuItem(newAction);

    // e aggiungo anche la results
    addMenuItem({
      id: `${answerId}-results`,
      step: dynamicMenuItems.length + 2,
      name: "MM Results",
      longDescription: "This is a dynamically added item.",
    });
    setCurrentStep(currentStep + 1);
    // Eseguiamo la navigazione
  };

  const onDownloadDataset = () => {};

  const onDownloadResults = () => {};

  const onTest = () => {};

  if (!datasetKey) {
    throw new Error("Dataset key is missing");
  }

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
      <div className="flex items-center p-5 bg-primary-950 text-primary-50 rounded-t-md gap-4">
        <p className="text-secondary-200">
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
        {selected === "results-view" && <ResultsView datasetKey={datasetKey} />}
        {selected === "dataset-view" && <DatasetView datasetKey={datasetKey} />}
        {selected === "features-view" && (
          <FeaturesView datasetKey={datasetKey} />
        )}
        {selected === "detection" && <Detection datasetKey={datasetKey} />}
      </div>
    </QuestionnaireLayout>
  );
};
