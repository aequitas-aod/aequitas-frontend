import Image from "next/image";

export const ResultsView = ({ datasetKey }: { datasetKey: string }) => {
  return (
    <div className="flex flex-1 p-4 bg-neutral-100 gap-4 rounded overflow-auto">
      <div className="bg-neutral-200 p-4 flex justify-center items-center rounded w-full min-h-[200px] relative">
        <Image
          src="/images/4_2_correlation_matrix.png"
          alt="Dependencies"
          layout="fill"
          objectFit="contain"
          className="rounded"
        />
      </div>
    </div>
  );
};