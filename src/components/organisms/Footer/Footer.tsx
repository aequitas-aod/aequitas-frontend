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
    const oldId: string = await loadOrGenerateProjectId();
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

  const getReport = async () => {
    const project = await loadOrGenerateProjectId();
    const url: string = `${BACKEND_URL}/projects/${project}/report`;
    console.log(`GET URL: ${url}`);
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "report.pdf"); // Optional: custom filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
    }
  };
  return (
    <footer className="w-full bg-gray-800 text-white text-center py-2 px-12">
      <AequitasLogoImage maxW="sm" hFull={false} />
      <ApiUrlInfo />
      <Button onClick={onResetQuestionnaire}>Reset all</Button>
      <Button onClick={getReport} style={{ marginLeft: "10px" }}>
        Create Report
      </Button>
    </footer>
  );
};
