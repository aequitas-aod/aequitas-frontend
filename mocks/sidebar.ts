export interface SidebarItem {
  step: number;
  name: string;
  path: string;
  longDescription: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    step: 1,
    name: "Dataset Choice",
    path: `dataset-choice`,
    longDescription:
      "This section allows you to choose different datasets for analysis.",
  },
  {
    step: 2,
    name: "Dataset View",
    path: `dataset-view`,
    longDescription:
      "Here you can view the details and structure of your chosen dataset.",
  },
  {
    step: 3,
    name: "Feature View",
    path: `feature-view`,
    longDescription:
      "This section provides an overview of the features within your dataset.",
  },
  {
    step: 4,
    name: "Dependencies",
    path: `dependencies`,
    longDescription:
      "View and manage dependencies between different components in your workflow.",
  },
  {
    step: 5,
    name: "Detection",
    path: `detection`,
    longDescription:
      "This section is used to detect issues or anomalies in your data.",
  },
  {
    step: 6,
    name: "Data mitigation",
    path: `data-mitigation`,
    longDescription:
      "Apply strategies to mitigate data issues and improve data quality.",
  },
];
