"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateDatasetDialog } from "./create-dataset-dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { DatasetPreview } from "./dataset-preview";
import { Answers, dataset } from "../../../mocks/1/mock";

export const DatasetChoicePage = () => {
  const router = useRouter();
  const t = useTranslations("dataset-choice");
  const [selected, setSelected] = useState<Answers | null>(null);

  // fare la chiamata per ottenere i dati
  const options = dataset.answers;

  const onSelect = (value: string) => {
    setSelected(options.find((option) => option.id.code === value) || null);
  };

  const onContinue = () => {
    router.push(`questionnaire?question=2`);
  };

  return (
    <>
      <div
        className="flex flex-col flex-1 border h-full rounded-md"
        id="content"
      >
        <div className="flex space-x-4 items-center justify-center py-5 bg-indigo-600 text-indigo-50 rounded-t-md">
          <p>{t("create-custom-dataset")}</p>
          <CreateDatasetDialog />
        </div>
        <div className="flex justify-between space-x-4 p-4 bg-wild-sand-50 rounded-b-md flex-1">
          <div id="dataset-selection" className="flex-1">
            <p className="text-sm">{t("title")}</p>
            <p>{t("subtitle")}</p>
            <RadioGroup defaultValue="" className="">
              {options.map((option) => (
                <RadioItem
                  key={option.id.code}
                  option={option}
                  selected={option.select}
                  onSelect={onSelect}
                />
              ))}
            </RadioGroup>
          </div>
          <div id="dataset-preview" className="flex-1">
            <DatasetPreview
              title={selected?.text}
              description={selected?.description}
              details={selected?.details}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4">
        <Button onClick={onContinue} disabled={!selected}>
          {t("buttons.continue")}
        </Button>
      </div>
    </>
  );
};
