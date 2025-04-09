"use client";
import { Button } from "@/components/ui/button";
import { ST_GRAPH_LINK } from "@/config/constants";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-600 text-white">
      <div className="text-center max-w-2xl p-6">
        <Image
          src="/images/aequitas-color.png"
          alt="Aequitas logo"
          width={400}
          height={400}
          className="mx-auto mb-4"
        />
        <p className="text-lg md:text-xl mb-8">{t("subtitle")}</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href={ST_GRAPH_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" size="lg">
              {t("buttons.googleForm")}
            </Button>
          </a>
          <Button onClick={() => redirect("/en/questionnaire")}>
            {t("buttons.start")}
          </Button>
        </div>
      </div>
    </div>
  );
}
