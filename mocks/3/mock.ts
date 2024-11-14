export const features: Feature[] = [
  {
    name: "feature0",
    type: "int",
    min: 0,
    max: 100,
    avg: 50,
    target: false,
    sensitive: false,
    values: ["low", "medium", "high"],
    histogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // da fare come array
  },
  {
    name: "feature1",
    type: "int",
    min: 0,
    max: 100,
    avg: 50,
    target: false,
    sensitive: false,
    values: ["low", "medium", "high"],
    histogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // da fare come array
  },
  {
    name: "feature2",
    type: "int",
    min: 0,
    max: 100,
    avg: 50,
    target: true,
    sensitive: true,
    values: ["low", "medium", "high"],
    histogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // da fare come array
  },
  {
    name: "feature3",
    type: "int",
    min: 0,
    max: 100,
    avg: 50,
    target: true,
    sensitive: false,
    values: ["low", "medium", "high"],
    histogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // da fare come array
  },
  {
    name: "feature4",
    type: "int",
    min: 0,
    max: 100,
    avg: 50,
    target: true,
    sensitive: false,
    values: ["low", "medium", "high"],
    histogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // da fare come array
  },
];

export type Feature = {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
};
