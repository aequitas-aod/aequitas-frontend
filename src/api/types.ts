// Type to represent an answer ID
type AnswerId = {
  code: string; // Answer ID on the backend
  question_code?: string; // Question ID on the backend
  project_code?: string; // Project code
};

// Type for the answer to a questionnaire question

export type AnswerContextResponse = Record<string, string | number>;

export type AnswerResponse = {
  id: AnswerId;
  text: string; // Human-readable name of the dataset
  description: string | null; // Short description of the dataset
  selected: boolean; // Indicates if it is selected
};

// Type to represent the ID of a questionnaire
export type QuestionnaireId = {
  code: string; // Question ID on the backend
  project_code: string; // Project code
  dataset_code: string | null; // Dataset code
};

// Type for the questionnaire response
export type QuestionnaireResponse = {
  id: QuestionnaireId;
  text: string; // Title of the page
  description: string; // Description of the page
  type: string; // Type of response (metadata indicating that only one item will be selected at the end)
  answers: AnswerResponse[]; // Array of answers
  created_at: string; // Creation date
  selection_strategy: SelectionStrategy; // Selection strategy
};

// Type for the selection strategy
type SelectionStrategy = {
  type: string; // Selection type
};

// Type for correlation data and suggestions related to a proxy
export type AttributeDataResponse = {
  correlation: number;
  suggested_proxy: string;
};

// Type for proxy data, mapped to attributes
export type ProxyDataResponse = Record<
  string,
  Record<string, AttributeDataResponse>
>;

// Type for a condition (related to metrics or other conditions)
export type ConditionResponse<T> = {
  when: {
    [key: string]: string; // Condition key
    class: string; // Condition class
  };
  value: number | string; // Value that can be a number or "NaN" (as a string)
};

// Type for metrics, supporting generic conditions
export type MetricsResponse<T = {}> = Record<
  string,
  ConditionResponse<T>[] | undefined
>;

// Type for features with information on target and sensitive attributes
export type FeaturesResponse = Record<
  string,
  {
    target: boolean;
    sensitive: boolean;
  }
>;

// Type for processing parameters (used for hyperparameter values)
export type ProcessingHyperparametersValue = {
  label: string; // Parameter label
  description: string; // Parameter description
  type: string; // Parameter type (e.g., "integer", "float")
  default: number; // Default value
  values: number[]; // Possible values for the hyperparameter
};

// Type for a collection of preprocessing parameters
export type ProcessingHyperparametersResponse = Record<
  string,
  ProcessingHyperparametersValue
>;

// Type for parameters related to attribute data and proxy
type AttributeDataParams = {
  correlation: number;
  proxy: string; // Proxy associated with the attribute
};

// Type for proxy parameters mapped to attributes
export type ProxyDataParams = Record<
  string,
  Record<string, AttributeDataParams>
>;

//

type FeatureData = {
  target: boolean;
  sensitive: boolean;
  drop: boolean;
};
export type FeaturesParams = Record<string, FeatureData>;
