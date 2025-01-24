import { FEEDBACK_LINK } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const QuestionnaireBanner = ({
  children,
  text,
}: {
  children?: React.ReactNode;
  text: string;
}) => {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between p-3 bg-primary-600 text-primary-50 rounded-t-md gap-2">
      <span className="text-left">{text}</span>
      <div>{children}</div>
      <Button
        onClick={() => window.open(FEEDBACK_LINK, "_blank")}
        variant="secondary"
      >
        {t("common.feedback")}
      </Button>
    </div>
  );
};
