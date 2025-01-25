import { useTranslations } from "next-intl";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { processDataset } from "@/lib/utils";
import { CsvData, ParsedDataset } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { DatasetViewTable } from "@/features/dataset-view/table";
import { useDatasetHeadContext } from "@/api/context";

export const DatasetView = ({ datasetKey }: { datasetKey: string }) => {
  const t = useTranslations("DatasetView");
  const [data, setData] = useState<ParsedDataset[]>([]); // Stato per i dati del CSV
  const [columns, setColumns] = useState<string[]>([]); // Stato per le colonne dinamiche

  const {
    data: contextData,
    isLoading,
    error,
  } = useDatasetHeadContext(datasetKey);

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

  return <DatasetViewTable data={data} columns={columns} />;
};
