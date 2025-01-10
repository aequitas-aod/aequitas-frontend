"use client";
import { AequitasLogoImage } from "@/components/contents/images";
import { Button } from "@/components/ui/button";
import { BACKEND_URL, PROJECT_CODE } from "@/config/constants";
import axios from "axios";
import { redirect } from "next/navigation";

const ApiUrlInfo = () => {
  return (
    <span>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || "not set"}</span>
  );
};

export const Footer = () => {
  const onResetQuestionnaire = async () => {
    const res = await axios.delete(
      `${BACKEND_URL}/projects/${PROJECT_CODE}/questionnaire`
    );
    redirect("/en");
  };
  return (
    <footer className="w-full bg-gray-800 text-white text-center py-2 px-12">
      <AequitasLogoImage maxW="sm" hFull={false} />
      <ApiUrlInfo />
      <Button onClick={onResetQuestionnaire}>Reset all</Button>
    </footer>
  );
};
