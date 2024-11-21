// move json types here

export type AnswerResponse = {
  id: {
    code: string; // ID della risposta lato backend
    question_code?: string; // ID della domanda lato backend
    project_code?: string; // Codice del progetto
  };
  text: string; // Nome intelleggibile del dataset
  description: string | null; // Descrizione breve del dataset
  selected: boolean; // Indica se è selezionato
  details: {
    [key: string]: string | number; // Dettagli del dataset
  };
};

export type QuestionnaireResponse = {
  id: {
    code: string; // ID della view lato backend
    project_code: string; // Codice del progetto
  };
  text: string; // Titolo della pagina
  type: string; // Metadato che indica che alla fine verrà selezionato un solo elemento
  answers: AnswerResponse[]; // Array di risposte
};

type AttributeDataResponse = {
  correlation: number;
  suggested_proxy: string;
};

export type ProxyDataResponse = Record<
  string,
  Record<string, AttributeDataResponse>
>;

export type MetricsResponse<T = {}> = Record<
  string,
  Condition<T>[] | undefined
>;

export type PreprocessingHyperparametersValue = {
  label: string;
  description: string;
  type: string;
  default: number;
  values: string[];
};

export type PreprocessingHyperparametersResponse = Record<
  string,
  PreprocessingHyperparametersValue
>;

type Condition<T> = {
  when: T; // Condizione dinamica (può avere proprietà opzionali)
  value: number | string; // valore che può essere un numero o "NaN" (stringa)
};

type AttributeDataParams = {
  correlation: number;
  proxy: string;
};

export type ProxyDataParams = Record<
  string,
  Record<string, AttributeDataParams>
>;
