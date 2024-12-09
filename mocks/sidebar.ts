export interface SidebarItem {
  id: string;
  step: number;
  name: string;
  longDescription: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "DatasetSelection",
    step: 1,
    name: "Dataset Choice",
    longDescription:
      "This section allows you to choose different datasets for analysis.",
  },
  {
    id: "DatasetView",
    step: 2,
    name: "Dataset View",

    longDescription:
      "Here you can view the details and structure of your chosen dataset.",
  },
  {
    id: "FeatureView",
    step: 3,
    name: "Feature View",

    longDescription:
      "This section provides an overview of the features within your dataset.",
  },

  {
    id: "Proxies",
    step: 4,
    name: "Proxies",

    longDescription:
      "View and manage dependencies between different components in your workflow.",
  },
  {
    id: "Detection",
    step: 5,
    name: "Detection",

    longDescription:
      "This section is used to detect issues or anomalies in your data.",
  },
  {
    id: "data-mitigation",
    step: 6,
    name: "Data mitigation",

    longDescription:
      "Apply strategies to mitigate data issues and improve data quality.",
  },
  {
    id: "dm-results",
    step: 7,
    name: "DM Results",

    longDescription: "View the results of your data mitigation strategies.",
  },

  // mettiamo hidden per tutta la parte dinamica, che poi andiamo a
];
