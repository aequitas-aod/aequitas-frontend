import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuestionnaireLayout } from "@/containers/layout";
import { useState } from "react";
import { DatasetView } from "./sections/dataset-view";

type DMResultsProps = {};

export const DMResults = ({}: DMResultsProps) => {
  const onContinue = () => {
    // chiamata per salvare i dati (se necessario)
  };
  const [selected, setSelected] = useState<string | null>("results-view");

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

  return (
    <QuestionnaireLayout
      action={
        <div className="flex space-x-2">
          <Button onClick={onContinue} variant="outline">
            Mitigate data again
          </Button>
          <Button onClick={onContinue} variant="outline">
            Mitigate model
          </Button>
          <Button onClick={onContinue} variant="outline">
            Mitigare outcome
          </Button>
        </div>
      }
      classNameWrapper="!overflow-hidden"
      className="!bg-transparent !border-0"
    >
      <div className="flex flex-col items-start p-5 bg-primary-950 text-primary-50 rounded-t-md">
        <p className="text-secondary-200">
          Check the operations performed so far:
        </p>
        <ToggleGroup
          type="single"
          className="mt-4 p-2 bg-primary-900 rounded-md"
        >
          {sections.map((section) => (
            <ToggleGroupItem
              key={section.id}
              value={section.id}
              aria-label={section.name}
              onClick={() => {
                // seleziona
                setSelected(section.id);
              }}
            >
              {section.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex justify-between rounded-b-md flex-1 mt-2">
        {/* Contenuto in base alla section selezionata dal toggle*/}
        {selected === "results-view" && <div>Results view content</div>}
        {selected === "dataset-view" && <DatasetView />}
        {selected === "features-view" && <div>Features view content</div>}
        {selected === "detection" && <div>Detection content</div>}
      </div>
    </QuestionnaireLayout>
  );
};
