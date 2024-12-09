"use client";
import { useRouter } from "next/navigation";

import { DatasetChoicePage } from "./dataset-choice";
import { FeaturesViewPage } from "./features-view";
import { DependenciesPage } from "./dependencies";
import { DatasetViewPage } from "./dataset-view";
import { DataMitigationPage } from "./data-mitigation";
import { DetectionPage } from "./detection";
import { DMResultsPage } from "./results-view";
import { useStore } from "@/store/store";
import { DynamicDataMitigationPage } from "./dynamic-mitigation";

export default function QuestionnaireContainer() {
  const router = useRouter();

  const { currentStep, setCurrentStep, menuItems } = useStore();

  const onNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const selectedStep = menuItems.find((step) => step.step === currentStep);
  console.log("selectedStep", selectedStep);
  const questionkey = selectedStep?.id || "";

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
      {currentStep > 7 && (
        <>
          {selectedStep?.id === "TestSetChoice" && <>TestSetChoice</>}
          {selectedStep?.id === "Polarization" && <>Polarization</>}
          {selectedStep?.id === "TestSetChoice" && <>TestSetChoice</>}
          {selectedStep?.id?.includes("Summary") && (
            <DMResultsPage onNext={onNext} questionId={selectedStep.step} />
          )}
          {selectedStep?.id.includes("Mitigation") && (
            <DynamicDataMitigationPage
              // This dynamic page will be replaced by DataMitigationPage
              onNext={onNext}
              questionkey={questionkey} // this key will be removed in the final version
              questionId={selectedStep.step}
            />
          )}
        </>
      )}
    </>
  );
}
