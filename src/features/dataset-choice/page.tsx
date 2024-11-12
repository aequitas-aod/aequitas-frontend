import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CreateDatasetDialog } from "./create-dataset-dialog";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";
import { DatasetPreview } from "./dataset-preview";
import { Answers, dataset } from "../../../mocks/1/mock";
import { QuestionnaireContent } from "@/containers/layout";

export const DatasetChoicePage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("dataset-choice");
  const [selected, setSelected] = useState<Answers | null>(null);

  const options = dataset.answers;

  const onSelect = (value: string) => {
    const selectedOption =
      options.find((option) => option.id.code === value) || null;
    setSelected(selectedOption);
  };

  const onContinue = () => {
    // chiamata per salvare i dati (se necessario)
    onNext();
  };

  return (
    <>
      <QuestionnaireContent
        action={
          <Button
            onClick={onContinue}
            disabled={!selected}
            variant={!selected ? "default" : "secondary"}
          >
            {t("buttons.continue")}
          </Button>
        }
      >
        <div className="flex space-x-4 items-center justify-center py-5 bg-indigo-600 text-indigo-50 rounded-t-md">
          <p>{t("create-custom-dataset")}</p>
          <CreateDatasetDialog onContinue={onNext} />
        </div>
        <div className="flex justify-between space-x-4 p-8 bg-wild-sand-50 rounded-b-md flex-1">
          <div id="dataset-selection" className="flex-1">
            <p className="text-base text-primary-950 font-extrabold">
              {t("title")}
            </p>
            <p className="text-[#64748B] text-sm">{t("subtitle")}</p>
            <RadioGroup className="mt-4">
              {options.map((option) => (
                <RadioItem
                  key={option.id.code}
                  option={option}
                  selected={selected?.id.code === option.id.code}
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
      </QuestionnaireContent>
    </>
  );
};
