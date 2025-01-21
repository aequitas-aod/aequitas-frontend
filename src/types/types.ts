import {
  QuestionnaireResponse,
  AnswerResponse,
  AnswerContextResponse,
} from "@/api/types";

export type CsvData = {
  [key: string]: string;
};

export type ParsedDistribution = {
  keys: string[];
  values: number[];
}

export type ParsedDataset = {
  [key: string]: string | boolean | string[] | ParsedDistribution;
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
