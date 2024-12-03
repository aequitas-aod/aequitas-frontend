import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { processDataset } from "@/lib/utils";
import { useStatsContext } from "@/api/hooks";
import { CsvData, ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "@/features/features-view/table";

export const FeaturesView = () => {
  const t = useTranslations("feature-view");

  const [data, setData] = useState<ParsedDataset[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const { data: contextData, isLoading, error } = useStatsContext("custom-1");

  useEffect(() => {
    const parseCsv = (csv: string) => {
      const result = Papa.parse<CsvData>(csv, {
        header: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        toast({
          title: t("errors.parsing-csv"),
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
