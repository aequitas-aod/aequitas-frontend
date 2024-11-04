export interface DatasetAnswer {
  id: {
    code: string; // ID della risposta lato backend
  };
  text: string; // Nome intelleggibile del dataset
  description?: string; // Descrizione breve del dataset
  size?: number; // in px
  records?: number; // Numero di record
  creationDate?: string; // Data di creazione
  isSelected?: boolean; // Indica se è selezionato
  isCustomDataset?: boolean; // Indica se è un dataset custom
}

export interface DatasetSelection {
  id: {
    code: string; // ID della view lato backend
  };
  longDescription: string; // Descrizione lunga della view
  text: string; // Titolo della pagina
  type: "single"; // Metadato che indica che alla fine verrà selezionato un solo elemento
  answers: DatasetAnswer[]; // Array di risposte
}

export const datasetSelection: DatasetSelection = {
  id: {
    code: "dataset-choice",
  },
  text: "Dataset Choice",
  longDescription: "This is a long description for the tooltip",
  type: "single",
  answers: [
    {
      id: {
        code: "dataset-1",
      },
      text: "Dataset 1",
      description: "This is a description for the answer",
      size: 100,
      records: 1000,
      creationDate: "2021-01-01",
      isSelected: true,
      isCustomDataset: false,
    },
    {
      id: {
        code: "dataset-2",
      },
      text: "Dataset 2",
      description: "This is a description for the answer",
      size: 200,
      records: 2000,
      creationDate: "2021-02-02",
      isSelected: false,
      isCustomDataset: false,
    },
    {
      id: {
        code: "dataset-3",
      },
      text: "Dataset 3",
      description: "This is a description for the answer",
      size: 300,
      records: 3000,
      creationDate: "2021-03-03",
      isSelected: true,
      isCustomDataset: false,
    },
  ],
};
