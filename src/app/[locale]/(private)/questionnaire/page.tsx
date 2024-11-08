"use client";
import QuestionnaireContainer from "@/containers/questionnarie/questionnarie";
import { Suspense } from "react";
export default function ProjectPage() {
  return (
    <Suspense>
      <QuestionnaireContainer />
    </Suspense>
  );
}
