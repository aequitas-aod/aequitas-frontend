"use client";

import QuestionnaireContainer from "@/containers/questionnaire";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { useAequitasStore } from "@/store/store";

export default function ProjectPage() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <QuestionnaireContainer />
    </QueryClientProvider>
  );
}
