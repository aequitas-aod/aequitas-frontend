import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { processDataset } from "@/lib/utils";
import { CsvData, ParsedDataset } from "@/types/types";
import Papa from "papaparse";
import { useStatsContext } from "@/api/context";

export const useFeatureView = (datasetKey: string) => {
  const { data: contextData, isLoading, error } = useStatsContext(datasetKey);
  const t = useTranslations("FeatureView");
  const [data, setData] = useState<ParsedDataset[]>([]);

  useEffect(() => {
    if (!contextData) {
      return;
    }
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
        const processedData = processDataset(result.data);
        setData(processedData);
      }
    };

    parseCsv(contextData);
  }, [contextData, t]);

  return { data, isLoading, error };
};
