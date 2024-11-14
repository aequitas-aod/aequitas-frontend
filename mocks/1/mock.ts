// Import del questionario dal file JSON
import questionarrie1 from "../questionnaire/1.json";

// Definizione dell'interfaccia Answers
export interface Answers {
  id: {
    code: string; // ID della risposta lato backend
  };
  text: string; // Nome intelleggibile del dataset
  description?: string; // Descrizione breve del dataset
  select: boolean; // Indica se è selezionato
  details?: Array<{ key: string; value: string }>; // Aggiunta della proprietà 'details'
}

// Definizione dell'interfaccia Questionnaire
export interface Questionnaire {
  id: {
    code: string; // ID della view lato backend
  };
  description: string; // Descrizione lunga della view
  text: string; // Titolo della pagina
  type: string; // Metadato che indica che alla fine verrà selezionato un solo elemento
  answers: Answers[]; // Array di risposte
}

// Creazione dell'oggetto dataset con il tipo corretto
export const dataset: Questionnaire = {
  ...questionarrie1,
  answers: questionarrie1.answers.map((answer) => ({
    ...answer,
    details: [
      {
        key: "Key1",
        value: "Value1",
      },
      {
        key: "Key2",
        value: "Value2",
      },
      {
        key: "Key3",
        value: "Value3",
      },
    ],
  })),
};
