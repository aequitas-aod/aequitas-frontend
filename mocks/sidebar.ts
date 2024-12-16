export interface SidebarItem {
  id: string;
  step: number;
  name: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "DatasetSelection",
    step: 1,
    name: "Dataset Choice",
  },
  {
    id: "DatasetView",
    step: 2,
    name: "Dataset View",
  },
  {
    id: "FeatureView",
    step: 3,
    name: "Feature View",
  },

  {
    id: "Proxies",
    step: 4,
    name: "Proxies",
  },
  {
    id: "Detection",
    step: 5,
    name: "Detection",
  },
  {
    id: "DataMitigation",
    step: 6,
    name: "Data Mitigation",
  },
  {
    id: "DataMitigationSummary",
    step: 7,
    name: "DM Results",
  },

  // mettiamo hidden per tutta la parte dinamica, che poi andiamo a
];
