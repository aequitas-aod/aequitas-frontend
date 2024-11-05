import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const DatasetPreview = ({
  title,
  description,
  details,
}: {
  title?: string;
  description?: string;
  details?: Record<string, string>[];
}) => {
  return (
    <div className="flex flex-col border p-4 shadow-md rounded-md bg-white">
      {title ? (
        <p className="text-2xl text-black">{title}</p>
      ) : (
        <p className="text-base text-wild-sand-300">No dataset selected</p>
      )}
      {description && (
        <p className="text-[#94A3B8] text-sm mt-2">{description}</p>
      )}

      <div className="flex flex-col mt-4">
        {details?.map((detail) => (
          <div
            key={detail.key}
            className="flex justify-start items-center gap-8 mt-4"
          >
            <Label className="text-wild-sand-400 text-sm">{detail.key}</Label>
            <Input readOnly value={detail.value} className="w-46" />
          </div>
        ))}
      </div>
    </div>
  );
};
