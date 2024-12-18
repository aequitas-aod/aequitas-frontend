import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/components/molecules/Layout/layout";
import { useTranslations } from "next-intl";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { processDataset } from "@/lib/utils";
import { CsvData, ParsedDataset } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { DatasetViewTable } from "./table";
import { QuestionnaireBanner } from "@/components/molecules/Layout/banner";

export const DatasetView = ({
  onNext,
  contextData,
}: {
  onNext: () => void;
  contextData: string;
}) => {
  const t = useTranslations("DatasetView");
  const [data, setData] = useState<ParsedDataset[]>([]); // Stato per i dati del CSV
  const [columns, setColumns] = useState<string[]>([]); // Stato per le colonne dinamiche

  const onContinue = () => {
    onNext();
  };

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

    parseCsv(contextData);
  }, [contextData, t]);

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      classNameWrapper="!overflow-hidden"
      className="!bg-neutral-50"
    >
      <QuestionnaireBanner
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum"
      />
      <DatasetViewTable data={data} columns={columns} />
    </QuestionnaireLayout>
  );
};
