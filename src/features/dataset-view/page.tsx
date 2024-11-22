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
import { useTranslations } from "next-intl";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { processDataset } from "@/lib/utils";
import { CsvData, ParsedDataset } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { TRUNCATE_TEXT } from "@/config/constants";

export const DatasetView = ({
  onNext,
  contextData,
}: {
  onNext: () => void;
  contextData: string;
}) => {
  const t = useTranslations("dataset-view");
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
    <QuestionnaireContent
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <div className="overflow-auto flex-grow bg-neutral-50">
        <Table>
          <TableHeader>
            <TableRow className="h-14">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`min-w-30 bg-neutral-100 text-center text-neutral-600 border-b-2
                
                    ${index !== columns.length - 1 ? "border-r-2" : ""}`}
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="bg-neutral-50 text-primary-950">
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-b">
                {columns.map((col, colIndex) => {
                  const cellContent = Array.isArray(row[col])
                    ? row[col].join(", ")
                    : row[col]?.toString() || "";

                  const isTruncated = cellContent.length > TRUNCATE_TEXT;
                  const displayedContent = isTruncated
                    ? `${cellContent.slice(0, TRUNCATE_TEXT)}...`
                    : cellContent;

                  return (
                    <TableCell
                      key={colIndex}
                      className={`min-h-14 border-b-2 border-neutral-100 py-4 px-4
                      
                  ${(typeof row[col] === "number" || row[col] === "-") && "!text-right"}
                  ${typeof row[col] === "boolean" && "!text-center"}
                  ${
                    colIndex !== 0 ? "border-l-2" : ""
                  } ${colIndex !== columns.length - 1 ? "border-r-2" : ""}`}
                      title={isTruncated ? cellContent : ""}
                    >
                      {displayedContent}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </QuestionnaireContent>
  );
};
