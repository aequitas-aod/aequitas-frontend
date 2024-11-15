"use client";
import { DataMitigationPage } from "@/features/data-mitigation/page";
import { DetectionPage } from "@/features/detection/page";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DatasetChoicePage } from "../dataset-choice";
import { FeaturesViewPage } from "../features-view";
import { DependenciesPage } from "../dependencies";
import { DatasetViewPage } from "../dataset-view";

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
      {question === "1" && <DatasetChoicePage onNext={onNext} questionId={1} />}
      {question === "2" && <DatasetViewPage onNext={onNext} questionId={2} />}
      {question === "3" && <FeaturesViewPage onNext={onNext} questionId={2} />}
      {question === "4" && <DependenciesPage onNext={onNext} questionId={3} />}

      {question === "5" && <DetectionPage onNext={onNext} />}
      {question === "6" && <DataMitigationPage onNext={onNext} />}
    </div>
  );
}
