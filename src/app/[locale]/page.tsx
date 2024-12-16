"use client";
import { Button } from "@/components/ui/button";
import { GOOGLE_FORM_LINK } from "@/config/constants";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-2xl p-6">
        <p className="text-lg md:text-xl mb-8 text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href={GOOGLE_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="outline"
              className="py-3 px-6 rounded-lg font-semibold text-lg"
            >
              {t("buttons.googleForm")}
            </Button>
          </a>
          <Button
            className="bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold text-lg hover:bg-primary-600 transition duration-300"
            onClick={() => redirect("/en/questionnaire")}
          >
            {t("buttons.start")}
          </Button>
        </div>
      </div>
    </div>
  );
}
