import { useCorrelationMatrix } from "@/api/context";
import Image from "next/image";
import DOMPurify from "dompurify";

export const ResultsViewSection = ({ datasetKey }: { datasetKey: string }) => {
  const { data: correlationMatrix } = useCorrelationMatrix(datasetKey);

  let secureCorrelationMatrix = correlationMatrix;
  if (correlationMatrix) {
    secureCorrelationMatrix = DOMPurify.sanitize(correlationMatrix);
  }

  return (
    <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
      <div className="bg-neutral-200 p-4 flex justify-center items-center rounded w-full min-h-auto relative">
        {secureCorrelationMatrix ? (
          <div
            className="flex-1 overflow-y-auto h-full"
            dangerouslySetInnerHTML={{ __html: secureCorrelationMatrix }}
          />
        ) : (
          <p className="text-neutral-600">Correlation matrix not available</p>
        )}
      </div>
    </div>
  );
};
