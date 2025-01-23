import {
  QuestionnaireResponse,
  AnswerResponse,
  AnswerContextResponse,
} from "@/api/types";

export type CsvData = {
  [key: string]: string;
};

export type DataDistributions = {
  keys: string[];
  values: number[];
};

export type ParsedDataset = {
  [key: string]: string | boolean | string[] | DataDistributions;
};

export type Dataset = {
  [key: string]: string;
};

export type Questionnaire = Omit<QuestionnaireResponse, "answers"> & {
  answers: EnhancedAnswerResponse[] | undefined;
};

export type EnhancedAnswerResponse = AnswerResponse & {
  details: AnswerContextResponse | {}; // Dataset details (now utilized)
};

export type Graph = {
  key: string;
  featureKey: string;
  targetFeature: string;
  values: GraphValue[];
};

export type GraphValue = {
  label: string;
  data: ClassValue[];
};

export type ClassValue = {
  class: string;
  value: number;
};

export type MetricGraphs = Record<
  string,
  {
    graphs: Graph[];
  }
>;

export type DetectionData = Record<
  string,
  Record<
    string,
    {
      selected: string;
    }
  >
>;
