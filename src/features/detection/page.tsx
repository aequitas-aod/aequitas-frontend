import { Button } from "@/components/ui/button";
import { QuestionnaireContent } from "@/containers/layout";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Feature, features } from "../../../mocks/3/mock";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const DetectionPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("feature-view");
  const [enabled, setEnabled] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState<string | null>(null); // Stato per selezionare un grafico
  const [featureData, setFeatureData] = useState<Feature[]>(features);

  const onContinue = () => {
    // fare la chiamata per salvare i dati
    onNext();
  };

  const graphs = [
    {
      feature: "feature1",
      key: "graph-1",
      title: "SP(Y=y1 | FS1)",
      histogram: [
        { key: "low", value: 0 },
        { key: "medium", value: 0 },
        { key: "high", value: 0 },
      ],
    },
    {
      feature: "feature1",
      key: "graph-2",
      title: "SP(Y=y1 | FS1)",
      histogram: [
        { key: "low", value: 0 },
        { key: "medium", value: 0 },
        { key: "high", value: 0 },
      ],
    },
    {
      feature: "feature1",
      key: "graph-3",
      title: "SP(Y=y1 | FS1)",
      histogram: [
        { key: "low", value: 0 },
        { key: "medium", value: 0 },
        { key: "high", value: 0 },
      ],
    },
  ];

  const handleGraphClick = (graphKey: string) => {
    setSelectedGraph(selectedGraph === graphKey ? null : graphKey);
  };

  return (
    <QuestionnaireContent
      action={
        <Button onClick={onContinue} disabled={!enabled}>
          {t("buttons.continue")}
        </Button>
      }
      className="!bg-white"
    >
      <div className="flex p-2 h-full">
        <div className="w-60 p-6">
          <p className="mb-6">Detect bias in the data</p>

          {featureData.map((feature) => (
            <Accordion key={feature.name} type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center justify-between gap-4">
                    <div className="bg-primary-400 py-1 px-2.5 rounded-lg text-white">
                      30
                    </div>
                    {feature.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent>{feature.name}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
        <div className="flex flex-1 flex-col p-4 bg-neutral-100 gap-4 rounded">
          {graphs.map((graph) => (
            <div
              key={graph.key}
              onClick={() => handleGraphClick(graph.key)}
              className={`bg-white p-4 flex flex-col items-center rounded h-[20rem] w-full ${
                selectedGraph === graph.key
                  ? "shadow-2xl border-4 border-black ring-2 ring-neutral-400"
                  : ""
              }`}
            >
              <h1 className="py-6 px-4 border-b w-full font-medium text-xl">
                {graph.title}
              </h1>
              <div className="flex flex-1 justify-center items-center">
                Grafico Aequitas
              </div>
            </div>
          ))}
        </div>
      </div>
    </QuestionnaireContent>
  );
};
