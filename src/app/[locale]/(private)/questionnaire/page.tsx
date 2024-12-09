"use client";
import QuestionnaireContainer from "@/containers/questionnarie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { useStore } from "@/store/store";

export default function ProjectPage() {
  const { menuItems } = useStore();
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuestionnaireContainer />
      </div>
    </QueryClientProvider>
  );
}
