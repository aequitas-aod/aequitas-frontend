import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuestionnaireLayout } from "@/containers/layout";

import Papa from "papaparse";
import { toast } from "@/hooks/use-toast";
import { processDataset } from "@/lib/utils";
import { useMutationQuestionnaire } from "@/api/hooks";
import { CsvData, ParsedDataset } from "@/types/types";
import { FeatureViewTable } from "./table";

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

  return (
    <QuestionnaireLayout
      action={<Button onClick={onContinue}>{t("buttons.continue")}</Button>}
      className="!bg-neutral-50"
    >
      <FeatureViewTable
        data={data}
        columns={columns}
        handleCheckboxChange={handleCheckboxChange}
        disabled={isPending}
      />
    </QuestionnaireLayout>
  );
};
