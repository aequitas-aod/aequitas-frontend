import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { parseFeatureKey } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureAccordionProps {
  featureKey: string;
  description: string | undefined;
  suggestedCount: number;
  children: ReactNode;
}

export const FeatureAccordion = ({
  featureKey,
  description,
  suggestedCount,
  children,
}: FeatureAccordionProps) => (
  <Accordion type="single" collapsible>
    <AccordionItem value={featureKey}>
      <AccordionTrigger>
        <div className="flex items-center justify-between gap-4">
          <div className="bg-primary-400 py-1 px-2.5 rounded-lg text-white">
            {suggestedCount}
          </div>
          <div className="flex flex-col text-left gap-1">
            <p>{parseFeatureKey(featureKey)}</p>
            {description && (
              <p className="text-xs  max-w-xs leading-tight">{description}</p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
);
