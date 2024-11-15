import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireContent } from "@/containers/layout";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { Histogram } from "@/components/molecules/Histogram";
import { parseArrayOrObject, parseBoolean } from "@/lib/utils";
import { useMutationQuestionnaire } from "@/api/hooks";
import { CsvData } from "@/types/types";

// Tipo per i dati parsati, in cui ogni chiave ha un valore che può essere un booleano, un array, un oggetto, ecc.
interface ParsedDataset {
  [key: string]: string | boolean | string[] | Record<string, number>;
}

export const FeaturesView = ({
  onNext,
  contextData,
}: {
  onNext: () => void;
  contextData: string;
}) => {
  const t = useTranslations("feature-view");

  const { mutate, isPending } = useMutationQuestionnaire({
    onSuccess: () => {
      alert("Updated");
      onNext();
    },
  });

  const [data, setData] = useState<ParsedDataset[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleCheckboxChange = (index: number, key: string) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        [key]: !updatedData[index][key],
      };
      return updatedData;
    });
  };

  const onContinue = () => {
    const sensitiveFeatures = data
      .filter((feature) => feature.sensitive)
      .map((feature) => ({
        code: `${feature.feature}-sensitive`,
      }));

    const outputFeatures = data
      .filter((feature) => feature.output)
      .map((feature) => ({
        code: `${feature.feature}-output`,
      }));

    const answerIds = {
      answer_ids: { ...sensitiveFeatures, ...outputFeatures },
    };
    mutate(answerIds);
  };

  useEffect(() => {
    parseCsv(contextData);
  }, [contextData]);

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
      // Processa i dati e converte i valori booleani, array e oggetti
      const processedData = result.data.map((row) => {
        const updatedRow: ParsedDataset = {};
        Object.keys(row).forEach((key) => {
          let value: string | boolean = row[key]; // Assicurati che value possa essere una stringa o un booleano.
          // Converte i valori booleani
          value = parseBoolean(value);
          if (typeof value === "boolean") {
            updatedRow[key] = value;
          }
          if (typeof value === "string") {
            const parsedValue = parseArrayOrObject(value);
            updatedRow[key] = parsedValue;
          }
          // Gestisce il parsing di array/oggetti
        });
        return updatedRow;
      });
      setData(processedData);
      if (result.data.length > 0) {
        setColumns(Object.keys(result.data[0]));
      }
    }
  };

  return (
    <QuestionnaireContent
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((key, colIndex) => (
              <TableHead
                key={key}
                className={`text-center bg-neutral-100 text-neutral-400 border-b-2 border-neutral-200 px-6 ${
                  key === "output" && "!bg-primary-950 !text-white !px-0 !w-16"
                } ${
                  key === "sensitive" &&
                  "!bg-primary-900 !text-white !w-16 !px-0"
                } 
                  ${key === "distribution" && "!w-[600px]"}
                  ${key === "values" && "!w-[300px]"}
                ${
                  key === "feature" && "!bg-neutral-50"
                } ${colIndex !== columns.length - 1 && "border-r-2"}`}
              >
                {key === "feature"
                  ? ""
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((feature, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((key, colIndex) => (
                <TableCell
                  key={key}
                  className={`text-center bg-neutral-50 font-medium text-sm text-primary-950 border-b-2 ${
                    key === "output" && "!bg-primary-200"
                  } 
              
                  ${key === "distribution" && "!h-[200px]"}
                  
                  ${
                    key === "sensitive" && "!bg-primary-300"
                  } ${key === "feature" && "!bg-neutral-100 !text-neutral-600 !border-neutral-200"} ${
                    colIndex !== columns.length - 1 && "border-r-2"
                  }`}
                >
                  {Array.isArray(feature[key]) ? (
                    feature[key].join(", ")
                  ) : key === "output" || key === "sensitive" ? (
                    <Checkbox
                      checked={feature[key] as boolean}
                      onCheckedChange={() =>
                        handleCheckboxChange(rowIndex, key)
                      }
                      className="mr-4"
                      variant="outlined-black"
                    />
                  ) : key === "distribution" ? (
                    <Histogram data={feature[key] as Record<string, number>} />
                  ) : (
                    feature[key]?.toString() || ""
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </QuestionnaireContent>
  );
};
