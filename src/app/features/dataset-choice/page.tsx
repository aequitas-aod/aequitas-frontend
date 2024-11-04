import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateDatasetDialog } from "./create-dataset-dialog";

export const DatasetChoicePage = ({}) => {
  const router = useRouter();
  const t = useTranslations("dataset-choice");
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  return (
    <>
      <div>
        <div className="flex flex-col">
          <div className="flex space-x-4">
            <p>{t("create-custom-dataset")}</p>
            <CreateDatasetDialog />
          </div>
          <div>
            <p>{t("title")}</p>
            <p>{t("subtitle")}</p>
          </div>
        </div>
        <Button onClick={() => router.push("/dataset-view")}>
          {t("buttons.continue")}
        </Button>
      </div>
    </>
  );
};
