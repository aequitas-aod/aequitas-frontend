"use client";
import { DataMitigationPage } from "@/features/data-mitigation/page";
import { DatasetChoicePage } from "@/features/dataset-choice/page";
import { DatasetViewPage } from "@/features/dataset-view/page";
import { DependenciesPage } from "@/features/dependencies/page";
import { DetectionPage } from "@/features/detection/page";
import { FeatureViewPage } from "@/features/feature-view/page";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function QuestionnaireContainer() {
  const searchParams = useSearchParams();

  const [question, setQuestion] = useState(searchParams.get("question") || "1");

  const incrementQuestion = () => {
    const nextQuest = (parseInt(question, 10) + 1).toString();
    setQuestion(nextQuest);
  };

  return (
    <div>
      {question === "1" && <DatasetChoicePage onNext={incrementQuestion} />}
      {question === "2" && <DatasetViewPage />}
      {question === "3" && <FeatureViewPage />}
      {question === "4" && <DependenciesPage />}
      {question === "5" && <DetectionPage />}
      {question === "6" && <DataMitigationPage />}
    </div>
  );
}
