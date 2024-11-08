"use client";
import { DataMitigationPage } from "@/features/data-mitigation/page";
import { DatasetChoicePage } from "@/features/dataset-choice/page";
import { DatasetViewPage } from "@/features/dataset-view/page";
import { DependenciesPage } from "@/features/dependencies/page";
import { DetectionPage } from "@/features/detection/page";
import { FeatureViewPage } from "@/features/feature-view/page";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function QuestionnaireContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuestion = searchParams.get("question") || "1";
  const [question, setQuestion] = useState(initialQuestion);

  useEffect(() => {
    const currentQuestion = searchParams.get("question") || "1";
    setQuestion(currentQuestion);
  }, [searchParams]);

  const onNext = () => {
    const nextQuestion = parseInt(question) + 1;
    router.push(`questionnaire?question=${nextQuestion}`);
  };

  return (
    <div className="flex flex-col h-full">
      {question === "1" && <DatasetChoicePage onNext={onNext} />}
      {question === "2" && <DatasetViewPage onNext={onNext} />}
      {question === "3" && <FeatureViewPage onNext={onNext} />}
      {question === "4" && <DependenciesPage onNext={onNext} />}
      {question === "5" && <DetectionPage onNext={onNext} />}
      {question === "6" && <DataMitigationPage onNext={onNext} />}
    </div>
  );
}
