import { Button } from "@/components/ui/button";
import { QuestionnaireContent } from "@/containers/layout";
import { useTranslations } from "next-intl";

import { useState } from "react";

export const DatasetViewPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("dataset-view");
  const [enabled, setEnabled] = useState(false);

  const onContinue = () => {
    // fare la chiamata per salvare i dati
    onNext();
  };

  return (
    <QuestionnaireContent
      action={
        <Button onClick={onContinue} disabled={!enabled}>
          {t("buttons.continue")}
        </Button>
      }
    ></QuestionnaireContent>
  );
};
