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
import { processDataset } from "@/lib/utils";
import { useMutationQuestionnaire } from "@/api/hooks";
import { CsvData, ParsedDataset } from "@/types/types";

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

    const targetFeatures = data
      .filter((feature) => feature.target)
      .map((feature) => ({
        code: `${feature.feature}-target`,
      }));

    const answerIds = {
      answer_ids: { ...sensitiveFeatures, ...targetFeatures },
    };
    mutate(answerIds);
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

  console.log(data);

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
                  key === "target" && "!bg-primary-950 !text-white !px-0 !w-16"
                } ${
                  key === "sensitive" &&
                  "!bg-primary-900 !text-white !w-16 !px-0"
                } 
                  ${key === "distribution" && "!w-[600px]"}
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
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell
                  key={col}
                  className={`text-left bg-neutral-50 font-medium text-sm text-primary-950 border-b-2 ${
                    col === "target" && "!bg-primary-200"
                  } 
                  ${
                    col === "sensitive" && "!bg-primary-300"
                  } ${col === "feature" && "!bg-neutral-100 !text-neutral-600 !border-neutral-200"} ${
                    colIndex !== columns.length - 1 && "border-r-2"
                  }
                  ${typeof row[col] === "number" && "!text-right"}
                  ${typeof row[col] === "boolean" && "!text-center"}
                  `}
                >
                  {Array.isArray(row[col]) ? (
                    row[col].join(", ")
                  ) : col === "target" || col === "sensitive" ? (
                    <Checkbox
                      checked={row[col] as boolean}
                      onCheckedChange={() =>
                        handleCheckboxChange(rowIndex, col)
                      }
                      className="mr-4"
                      variant="outlined-black"
                    />
                  ) : col === "distribution" ? (
                    <Histogram data={row[col] as Record<string, number>} />
                  ) : (
                    row[col]?.toString() || ""
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
