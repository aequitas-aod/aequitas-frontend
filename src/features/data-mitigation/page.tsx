import { Button } from "@/components/ui/button";
import { QuestionnaireContent } from "@/containers/layout";
import { on } from "events";
import { useTranslations } from "next-intl";

import { useState } from "react";

export const DataMitigationPage = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("feature-view");
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
