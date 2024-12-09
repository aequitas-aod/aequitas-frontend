import { Graph } from "@/hooks/useDetectionData";
import { Histogram } from "@/components/molecules/Histogram/Histogram";
import { capitalize, parseFeatureKey } from "@/lib/utils";

export const GraphsDisplay = ({ graphs }: { graphs: Graph[] }) => {
  return (
    <>
      {graphs.map((graph) => (
        <div
          key={`${graph.featureKey}-${graph.key}`}
          className="bg-white p-4 flex flex-col rounded h-[20rem] w-full"
        >
          <h1 className="py-6 px-4 border-b w-full font-medium text-xl">
            {`${parseFeatureKey(graph.featureKey)} - Class/${capitalize(graph.key)}`}
          </h1>
          <div className="flex overflow-auto gap-4">
            {graph.values.map((value) => (
              <div
                key={`${graph.featureKey}-${graph.key}-${value.label}`}
                className="flex flex-col items-center justify-center min-w-[25rem] p-4 "
              >
                <h2 className="text-lg font-medium">{value.label}</h2>
                {value.data.length > 0 ? (
                  <Histogram
                    data={value.data.reduce(
                      (acc, curr) => ({
                        ...acc,
                        [curr.class]: curr.value,
                      }),
                      {}
                    )}
                    className="min-w-[25rem] h-[10rem]"
                  />
                ) : (
                  <p className="text-neutral-500 text-sm">No data available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
