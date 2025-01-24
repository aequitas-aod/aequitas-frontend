export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const PROJECT_CODE = "p-1";

/* Constants */
export const GOOGLE_FORM_LINK = process.env.NEXT_PUBLIC_GOOGLE_FORM_LINK || "";
export const FEEDBACK_LINK = "https://google.com";
export const TRUNCATE_TEXT = 20;
export const INFINITY_VALUE = "infinity";

/* Dataset Selection View */
export const CUSTOM_DATASET_KEY = "CustomDataset";
export const DEFAULT_CUSTOM_DATASET_NAME = "Custom-1";

/* Feature View */
export const TARGET_COLUMN = "target";
export const SENSITIVE_COLUMN = "sensitive";

export const DISTRIBUTION_COLUMN = "distribution";
export const FEATURE_COLUMN = "feature";

/* Data Mitigation */
export const NO_DATA_MITIGATION_KEY = "NoDataMitigation";
export const NO_OUTCOME_MITIGATION_KEY = "NoOutcomeMitigation";

/* Questionnaire */
export const QUESTIONNAIRE_KEYS = {
  DATASET_SELECTION: "DatasetSelection",
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

  END_TEST: "Done",
};
