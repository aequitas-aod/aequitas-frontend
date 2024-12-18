import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Per il bottone Create
import { CUSTOM_DATASET_KEY } from "@/config/constants";
import { capitalize } from "@/lib/utils";
import { CreateDatasetDialog } from "../create-dataset-dialog";
import { EnhancedAnswerResponse } from "@/containers/dataset-selection";

export const DatasetPreview = ({
  title,
  description,
  details,
  onNext,
  selected,
}: {
  selected: EnhancedAnswerResponse;
  title: string;
  description: string;
  details: {
    [key: string]: string | number;
  };
  onNext: () => void;
}) => {
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
  if (title === CUSTOM_DATASET_KEY) {
    return (
      <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full gap-4">
        <p className="text-2xl text-primary-950">{title}</p>
        {description && (
          <p className="text-neutral-400 text-sm mt-2">{description}</p>
        )}
        <div className="mt-auto flex justify-end">
          <CreateDatasetDialog onNext={onNext} selected={selected} />
        </div>
      </div>
    );
  }

  // Comportamento standard per dataset non custom
  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full gap-4">
      <p className="text-2xl text-primary-950">{title}</p>
      {description && (
        <p className="text-neutral-400 text-sm mt-2">{description}</p>
      )}
      <div className="flex flex-col mt-auto">
        {details && (
          <>
            {Object.entries(details).map(([key, value]) => (
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
