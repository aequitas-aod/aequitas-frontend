"use client";

import QuestionnaireContainer from "@/containers/questionnaire";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ProjectPage() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <QuestionnaireContainer />
    </QueryClientProvider>
  );
}
