import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DatasetPreview = ({
  title,
  description,
  details,
}: {
  title?: string;
  description?: string;
  details?: {
    [key: string]: string | number; // Dettagli del dataset
  };
}) => {
  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white h-full">
      {title ? (
        <p className="text-2xl text-primary-950">{title}</p>
      ) : (
        <p className="text-base text-neutral-300">No dataset selected</p>
      )}
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
                <Label className="text-neutral-400 text-sm min-w-12">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Label>
                <Input readOnly value={value} className="w-48" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
