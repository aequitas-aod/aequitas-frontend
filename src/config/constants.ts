export const TRUNCATE_TEXT = 20;

export const TARGET = "target";
export const SENSITIVE = "sensitive";

export const DISTRIBUTION = "distribution";
export const FEATURE_NAME = "feature";

export const NO_MITIGATION_KEY = "NoMitigation";
export const CUSTOM_DATASET_KEY = "Custom";

// TODO: add constants with questionnaire ids
export const BACKEND_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL!;
export const GOOGLE_FORM_LINK = process.env.NEXT_PUBLIC_GOOGLE_FORM_LINK || "";
export const PROJECT_CODE = "p-1";
export const FEEDBACK_LINK = "https://google.com";

// cpstante mappa per le chiavi del questionario
export const QUESTIONNAIRE_KEYS = {
  DATASET_SELECTION: "DatasetSelection",
  DATASET_VIEW: "DatasetView",
  FEATURE_VIEW: "FeatureView",
  PROXIES: "Proxies",
  DETECTION: "Detection",
  DATA_MITIGATION: "DataMitigation",
  //
  DATA_MITIGATION_SUMMARY: "DataMitigationSummary",
  MODEL_MITIGATION: "ModelMitigation",
  MODEL_MITIGATION_SUMMARY: "ModelMitigationSummary",
  OUTCOME_MITIGATION: "OutcomeMitigation",
  OUTCOME_MITIGATION_SUMMARY: "OutcomeMitigationSummary",
  TEST_SET_CHOICE: "TestSetChoice",
  POLARIZATION: "Polarization",
  TEST_SUMMARY: "TestSummary",
  END_TEST: "Done",
};
