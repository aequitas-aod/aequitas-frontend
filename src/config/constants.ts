export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL!;

/* Constants */
export const GOOGLE_FORM_LINK = process.env.NEXT_PUBLIC_GOOGLE_FORM_LINK || "";
export const FEEDBACK_LINK = "https://forms.gle/WnYCvQZWerVEQfFR8";
export const ST_GRAPH_LINK = "https://github.com/aequitas-aod/aequitas-flow";
export const TRUNCATE_TEXT = 30;
export const INFINITY_VALUE = "infinity";

/* Dataset Selection View */
export const CUSTOM_DATASET_KEY = "CustomDataset";
export const TEST_CUSTOM_DATASET_KEY = "Test-CustomDataset";

export const DEFAULT_CUSTOM_DATASET_NAME = "Custom-1";

/* Feature View */
export const TARGET_COLUMN = "target";
export const SENSITIVE_COLUMN = "sensitive";

export const DISTRIBUTION_COLUMN = "distribution";
export const FEATURE_COLUMN = "feature";

/* Mitigation */
export const NO_DATA_MITIGATION_KEY = "NoDataMitigation";
export const NO_MODEL_MITIGATION_KEY = "NoModelMitigation";
export const NO_OUTCOME_MITIGATION_KEY = "NoOutcomeMitigation";
export const IMAGE_MITIGATION_ALGORITHM =
  "StableDiffusionBasedDataAugmentation";

export const DONE_KEY = "Done";
export const TEST_KEY = "Test";

/* Proxies */
export const THRESHOLD = 50;

/* Questionnaire */
export const QUESTIONNAIRE_KEYS = {
  DATASET_TYPE_SELECTION: "DatasetTypeSelection",
  TABULAR_DATASET_SELECTION: "TabularDatasetSelection",
  IMAGE_DATASET_SELECTION: "ImageDatasetSelection",
  TABULAR_DATASET_TYPE: "TabularDatasetType",
  IMAGE_DATASET_TYPE: "ImageDatasetType",
  DATASET_VIEW: "DatasetConfirmation",
  FEATURE_VIEW: "FeaturesSelection",
  PROXIES: "Proxies",
  DETECTION: "Detection",

  DATA_MITIGATION: "DataMitigation",
  DATA_MITIGATION_SUMMARY: "DataMitigationSummary",

  MODEL_MITIGATION: "ModelMitigation",
  MODEL_MITIGATION_SUMMARY: "ModelMitigationSummary",

  OUTCOME_MITIGATION: "OutcomeMitigation",
  OUTCOME_MITIGATION_SUMMARY: "OutcomeMitigationSummary",

  TEST_SET_CHOICE: "TestSetSelection",
  POLARIZATION: "Polarization",
  TEST_SUMMARY: "TestSummary",

  QUESTIONNAIRE_END: "QuestionnaireEnd",
};
