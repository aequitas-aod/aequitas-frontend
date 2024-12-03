"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { DatasetChoicePage } from "./dataset-choice";
import { FeaturesViewPage } from "./features-view";
import { DependenciesPage } from "./dependencies";
import { DatasetViewPage } from "./dataset-view";
import { DataMitigationPage } from "./data-mitigation";
import { DetectionPage } from "./detection";
import { DMResultsPage } from "./results-view";
import { useSidebarStore } from "@/store/sidebarStore";

export default function QuestionnaireContainer() {
  const router = useRouter();

  const { currentStep, setCurrentStep } = useSidebarStore();

  const onNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      {currentStep === 1 && (
        <DatasetChoicePage onNext={onNext} questionId={1} />
      )}
      {currentStep === 2 && <DatasetViewPage onNext={onNext} questionId={2} />}
      {currentStep === 3 && <FeaturesViewPage onNext={onNext} questionId={3} />}
      {currentStep === 4 && <DependenciesPage onNext={onNext} questionId={4} />}
      {currentStep === 5 && <DetectionPage onNext={onNext} questionId={5} />}
      {currentStep === 6 && (
        <DataMitigationPage onNext={onNext} questionId={6} />
      )}
      {currentStep === 7 && <DMResultsPage onNext={onNext} questionId={7} />}
    </>
  );
}
