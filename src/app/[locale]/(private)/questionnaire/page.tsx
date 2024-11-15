"use client";
import QuestionnaireContainer from "@/containers/questionnarie/questionnarie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ProjectPage() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <QuestionnaireContainer />
    </QueryClientProvider>
  );
}
