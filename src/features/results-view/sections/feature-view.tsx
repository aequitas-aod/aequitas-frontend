import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { processDataset } from "@/lib/utils";
import { useContextVectorialData, usePredictionsContext } from "@/api/context";

import { CsvData, ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "@/features/feature-view/table";

export const FeaturesView = ({
  datasetKey,
}: {
  datasetKey: string;
  targetFeature: string;
}) => {
  const t = useTranslations();

  const [data, setData] = useState<ParsedDataset[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const {
    data: contextData,
    isLoading,
    error,
  } = usePredictionsContext(` ${datasetKey}`);

  useEffect(() => {
    const parseCsv = (csv: string) => {
      const result = Papa.parse<CsvData>(csv, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        toast({
          title: t("common.errors.parsing-csv"),
          description: result.errors[0].message,
          variant: "destructive",
        });
      } else {
        // Processa i dati e converte i valori booleani, stringhe, array e oggetti
        const processedData = processDataset(result.data);
        setData(processedData);
        if (result.data.length > 0) {
          setColumns(Object.keys(result.data[0]));
        }
      }
    };

    if (!contextData) {
      return;
    }
    parseCsv(contextData);
  }, [contextData, t]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  if (!contextData) {
    return <div>No data available</div>;
  }

  return <FeatureViewTable data={data} columns={columns} disabled />;
};
