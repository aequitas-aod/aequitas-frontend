"use client"
import { DataMitigationPage } from "@/app/features/data-mitigation/page";
import { DatasetChoicePage } from "@/app/features/dataset-choice/page";
import { DatasetViewPage } from "@/app/features/dataset-view/page";
import { DependenciesPage } from "@/app/features/dependencies/page";
import { DetectionPage } from "@/app/features/detection/page";
import { FeatureViewPage } from "@/app/features/feature-view/page";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();

  return (
    <div>
      {params.project === "dataset-choice" && <DatasetChoicePage />}
      {params.project === "dataset-view" && <DatasetViewPage />}
      {params.project === "feature-view" && <FeatureViewPage />}
      {params.project === "dependencies" && <DependenciesPage />}
      {params.project === "detection" && <DetectionPage />}
      {params.project === "data-mitigation" && <DataMitigationPage />}
    </div>
  );
}
