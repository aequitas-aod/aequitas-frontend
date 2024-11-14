import { Button } from "@/components/ui/button";
import { QuestionnaireContent } from "@/containers/layout";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { Feature, features } from "../../../mocks/3/mock";
import { getSensitiveFeatures } from "../../../mocks/4/mock";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const DependenciesPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("feature-view");
  const [enabled, setEnabled] = useState(false);

  const [featureData, setFeatureData] = useState<Feature[]>(features);

  const onContinue = () => {
    // fare la chiamata per salvare i dati
    onNext();
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
        <div className="flex flex-1 p-4 bg-neutral-100 grid grid-cols-2 grid-rows-2 gap-4 rounded">
          {/* Aggiungi i 4 quadrati nella griglia */}
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded">
            Grafico Aequitas
          </div>
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded">
            Grafico Aequitas
          </div>
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded">
            Grafico Aequitas
          </div>
          <div className="bg-neutral-200 p-4 flex justify-center items-center rounded">
            Grafico Aequitas
          </div>
        </div>
        <div className="w-60 p-6">
          <p className="mb-6">Select possibily proxy features</p>
          {/* accordion per ogni feature */}
          {featureData.map((feature, index) => (
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
      </div>
    </QuestionnaireContent>
  );
};
