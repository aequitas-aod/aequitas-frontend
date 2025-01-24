"use client";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config/constants";
import { GOOGLE_FORM_LINK } from "@/config/constants";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { loadOrGenerateProjectId } from "@/config/session";

const onStart = async () => {
  const projectId = loadOrGenerateProjectId();
  const name = `Project ${projectId.slice(0, 8)}`;
  try {
    await axios.post(`${BACKEND_URL}/projects`, {
      name: name,
      code: projectId,
    });
  } catch (error) { 
    console.error("Project creation failed", error);
  }
  redirect("/en/questionnaire");
};

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
            href={GOOGLE_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" size="lg">
              {t("buttons.googleForm")}
            </Button>
          </a>
          <Button onClick={onStart}>
            {t("buttons.start")}
          </Button>
        </div>
      </div>
    </div>
  );
}
