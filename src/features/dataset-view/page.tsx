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

const csvData = `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
4.7,3.2,1.3,0.2,setosa`;

interface Dataset {
  [key: string]: string;
}

export const DatasetViewPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("dataset-view");
  const [enabled, setEnabled] = useState(false);
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
  const emptyRowsCount = Math.max(30 - data.length, 0);

  return (
    <QuestionnaireContent
      action={
        <Button onClick={onContinue} disabled={!enabled}>
          {t("buttons.continue")}
        </Button>
      }
    >
      <Table className="w-full overflow-auto">
        <TableHeader>
          <TableRow className="h-14">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className="w-32 bg-neutral-100 text-center border-l text-neutral-600"
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-neutral-50 text-primary-950 text-center">
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className="border-l h-14">
                  {row[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* Aggiungi righe vuote per arrivare a un totale di 30 */}
          {Array.from({ length: emptyRowsCount }).map((_, index) => (
            <TableRow key={`empty-${index}`}>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex} className="border-l h-14">
                  &nbsp;
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </QuestionnaireContent>
  );
};
