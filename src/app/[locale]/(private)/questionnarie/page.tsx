"use client";
import QuestionnarieContainer from "../../../../containers/questionnarie/questionnarie";
import { Suspense } from "react";
export default function ProjectPage() {
  return (
    <Suspense>
      <QuestionnarieContainer />
    </Suspense>
  );
}
