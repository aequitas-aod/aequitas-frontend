import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuestionnaireContent } from "@/containers/layout";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { csvData } from "../../../mocks/2/csv";

interface Dataset {
  [key: string]: string;
}

export const DatasetViewPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("dataset-view");
  const [data, setData] = useState<Dataset[]>([]); // Stato per i dati del CSV
  const [columns, setColumns] = useState<string[]>([]); // Stato per le colonne dinamiche
  const { toast } = useToast();

  const onContinue = () => {
    onNext();
  };

  useEffect(() => {
    parseCsv(csvData);
  }, []);

  // Funzione per convertire CSV in JSON e aggiornare le colonne
  const parseCsv = (csv: string) => {
    const result = Papa.parse<Dataset>(csv, {
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
      setData(result.data);
      if (result.data.length > 0) {
        // Prendi le chiavi dal primo oggetto per impostare le colonne dinamiche
        setColumns(Object.keys(result.data[0]));
      }
    }
  };

  // temp solution to avoid error

  return (
    <QuestionnaireContent
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <div className="overflow-auto flex-grow bg-neutral-50">
        <Table className="">
          <TableHeader>
            <TableRow className="h-14">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="min-w-32 bg-neutral-100 text-center border-l text-neutral-600"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-neutral-50 text-primary-950 text-center">
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-b">
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="border-l min-h-14 border-b"
                  >
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </QuestionnaireContent>
  );
};
