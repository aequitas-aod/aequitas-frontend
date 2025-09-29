import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CUSTOM_DATASET_KEY,
  TEST_CUSTOM_DATASET_KEY,
} from "@/config/constants";
import { capitalize } from "@/lib/utils";
import { CreateDatasetDialog } from "../create-dataset-dialog";

import type { EnhancedAnswerResponse, Questionnaire } from "@/types/types";

type DatasetPreviewProps = {
  data: Questionnaire;
  questionNumber: number;
  onNext: () => void;
  isTest: boolean;
  selected: EnhancedAnswerResponse;
};

export const DatasetPreview = ({
  data,
  questionNumber,
  onNext,
  isTest,
  selected,
}: DatasetPreviewProps) => {
  const isValidDate = (date: string) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      return value.toString();
    }
    if (typeof value === "string" && isValidDate(value)) {
      // Formatta la data nel formato "18 Oct 2024"
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value));
    }
    return value.toString(); // Assicura sempre il ritorno come stringa
  };

  const formatKey = (key: string) => {
    const cleanedKey = key.replace(/[-_]/g, " "); // Rimuove tutti i "-" e "_"
    return capitalize(cleanedKey);
  };

  // Se è un custom dataset
  if (
    selected.id.code === CUSTOM_DATASET_KEY ||
    selected.id.code === TEST_CUSTOM_DATASET_KEY
  ) {
    return (
      <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full gap-4">
        <p className="text-2xl text-primary-950">{selected.text}</p>
        {selected.description && (
          <p className="text-neutral-400 text-sm mt-2">
            {selected.description}
          </p>
        )}
        <div className="mt-auto flex justify-end">
          <CreateDatasetDialog
            onNext={onNext}
            data={data}
            selected={selected}
            isTest={isTest}
            questionNumber={questionNumber}
          />
        </div>
      </div>
    );
  }

  // Comportamento standard per dataset non custom
  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full gap-4">
      <p className="text-2xl text-primary-950">{selected.text}</p>
      {selected.description && (
        <p className="text-neutral-400 text-sm mt-2">{selected.description}</p>
      )}
      <div className="flex flex-col mt-auto">
        {selected.details && (
          <>
            {Object.entries(selected.details).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-start items-center gap-8 mt-4"
              >
                <Label className="text-neutral-400 text-sm min-w-16">
                  {formatKey(key)}
                </Label>
                <Input readOnly value={formatValue(value)} className="w-auto" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
