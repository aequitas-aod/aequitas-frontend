import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateDatasetDialog } from "./create-dataset-dialog";
import { dataset } from "../../../mocks/1_dataset-choice/mock";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioItem } from "@/components/molecules/RadioItem";

export const DatasetChoicePage = ({}) => {
  const router = useRouter();
  const t = useTranslations("dataset-choice");
  const [selected, setSelected] = useState<string | null>(null);

  const options = dataset.answers;

  const onSelect = (value: string) => {
    setSelected(value);
  };

  return (
    <>
      <div>
        <div className="flex flex-col border">
          <div className="flex space-x-4 items-center justify-center py-5">
            <p>{t("create-custom-dataset")}</p>
            <CreateDatasetDialog />
          </div>
          <div className="px-">
            <p>{t("title")}</p>
            <p>{t("subtitle")}</p>
            <RadioGroup defaultValue="comfortable" className="">
              {options.map((option) => (
                <RadioItem
                  key={option.id.code}
                  option={option}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </RadioGroup>
          </div>
        </div>
        <Button onClick={() => router.push("/dataset-view")}>
          {t("buttons.continue")}
        </Button>
      </div>
    </>
  );
};
