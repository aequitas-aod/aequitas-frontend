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
    path: `questionnaire?question=1`,
    longDescription:
      "This section allows you to choose different datasets for analysis.",
  },
  {
    step: 2,
    name: "Dataset View",
    path: `questionnaire?question=2`,
    longDescription:
      "Here you can view the details and structure of your chosen dataset.",
  },
  {
    step: 3,
    name: "Feature View",
    path: `questionnaire?question=3`,
    longDescription:
      "This section provides an overview of the features within your dataset.",
  },
  {
    step: 4,
    name: "Dependencies",
    path: `questionnaire?question=4`,
    longDescription:
      "View and manage dependencies between different components in your workflow.",
  },
  {
    step: 5,
    name: "Detection",
    path: `questionnaire?question=5`,
    longDescription:
      "This section is used to detect issues or anomalies in your data.",
  },
  {
    step: 6,
    name: "Data mitigation",
    path: `questionnaire?question=6`,
    longDescription:
      "Apply strategies to mitigate data issues and improve data quality.",
  },
  {
    /*
    step: 7,
    name: "X-Processing",
    path: `questionnaire?question=7`,
    longDescription:
      "This section is used to detect issues or anomalies in your data.",
  */
  },
];
