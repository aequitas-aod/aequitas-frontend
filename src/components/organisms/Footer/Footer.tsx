"use client";
import { AequitasLogoImage } from "@/components/contents/images";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/config/constants";
import axios from "axios";
import { redirect } from "next/navigation";
import { loadOrGenerateProjectId, resetProjectId } from "@/storage/session";

const ApiUrlInfo = () => {
  return (
    <span>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL || "not set"}</span>
  );
};

export const Footer = () => {
  const onResetQuestionnaire = async () => {
    const oldId: string = loadOrGenerateProjectId();
    const res = await axios.delete(
      `${BACKEND_URL}/projects/${oldId}/questionnaire`
    );
    resetProjectId();
    try {
      await axios.delete(`${BACKEND_URL}/projects/${oldId}`);
    } catch (error) {
      console.error("Project deletion failed", error);
    }
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
