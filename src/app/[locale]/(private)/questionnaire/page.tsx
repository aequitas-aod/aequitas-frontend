"use client";
import QuestionnaireContainer from "@/containers/questionnarie";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sidebarItems } from "../../../../../mocks/sidebar";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";

export default function ProjectPage() {
  const menuItems = sidebarItems;
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Sidebar menuItems={menuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuestionnaireContainer />
      </div>
    </QueryClientProvider>
  );
}
