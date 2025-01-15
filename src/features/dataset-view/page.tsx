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
import { useUpdateQuestionnaire } from "@/api/questionnaire";
import type { AnswerResponse, QuestionnaireResponse } from "@/api/types";
import { isMocked } from "@/api/api";

export const DatasetView = ({
  questionnaire,
  onNext,
  answers,
  questionNumber,
  contextData,
}: {
  questionnaire: QuestionnaireResponse;
  onNext: () => void;
  answers: AnswerResponse[];
  questionNumber: number;
  contextData: string;
}) => {
  const t = useTranslations("DatasetView");
  const [data, setData] = useState<ParsedDataset[]>([]); // Stato per i dati del CSV
  const [columns, setColumns] = useState<string[]>([]); // Stato per le colonne dinamiche
  const { mutate, isPending } = useUpdateQuestionnaire({
    onSuccess: () => {
      onNext();
    },
  });

  const onContinue = () => {
    if (isMocked()) {
      console.log("Using mocked response for putQuestionnaire");
      onNext();
      return;
    }
    mutate({
      n: questionNumber,
      answer_ids: [
        questionnaire.answers.find((answer) => answer.id.code.includes("Yes"))!
          .id,
      ],
    });
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
      action={
        <Button onClick={onContinue} disabled={isPending}>
          {t("buttons.continue")}
        </Button>
      }
      classNameWrapper="!overflow-hidden"
      className="!bg-neutral-50"
    >
      <QuestionnaireBanner text={questionnaire.description} />
      <DatasetViewTable data={data} columns={columns} />
    </QuestionnaireLayout>
  );
};
