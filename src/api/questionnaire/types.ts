export type QuestionnaireParams = {
  n: number;
};

export type AnswerId = {
  code: string;
  question_code?: string;
  project_code?: string;
};

export type PutQuestionnaireParams = {
  n: number;
  answer_ids: AnswerId[];
};

export type DeleteQuestionnaireParams = {
  n: number;
};
