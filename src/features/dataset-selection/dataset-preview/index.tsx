import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { capitalize } from "@/lib/utils";

export const DatasetPreview = ({
  title,
  description,
  details,
}: {
  title: string;
  description: string;
  details: {
    [key: string]: string | number; // Dettagli del dataset
  };
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

  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full">
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
