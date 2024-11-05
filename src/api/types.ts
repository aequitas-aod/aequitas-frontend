// move json types here

export type Answers = {
  id: {
    code: string; // ID della risposta lato backend
  };
  text: string; // Nome intelleggibile del dataset
  description?: string; // Descrizione breve del dataset
  select: boolean; // Indica se è selezionato
};

export type QuestionnaireResponse = {
  id: {
    code: string; // ID della view lato backend
  };
  description: string; // Descrizione lunga della view
  text: string; // Titolo della pagina
  type: string; // Metadato che indica che alla fine verrà selezionato un solo elemento
  answers: Answers[]; // Array di risposte
};

export type ContextResponse = {
  // todo
  details?: Array<{ key: string; value: string }>; // Aggiunta della proprietà 'details'
};
