## Background e descrizione API

Nella nostra modellazione originale, il flusso delle view è visto come un questionario.
Ogni volta che un utente comincia un nuovo workflow (aka seleziona un dataset), questo avviene, lato backend, nel contesto di un nuovo _progetto_.
Progetti e questionari sono in corrispondenza 1-a-1.
Potete pensare ad un progetto come ad un contenitore di tutte le risposte fornite sin ora dall'utente
(aka tutte informazioni formite tramite le view),
più in key-value store con in cui il client può accumulare dati forniti dall'utente in corso d'opera.

Ogni view mostrata dal frontend corrisponde (esplicitamente o implicitamente) ad una _domanda_ che il sistema pone all'utente.
Ogni input fornito dall'utente nella schermata, corrisponde ad una _risposta_ rilevante per il backend.
Ad ogni risposta, fa seguito un'altra domanda, e così via.

Le operazioni rilevanti lato API sono:

1. Lettura di una domanda:

   ```
   GET /projects/{project-name}/questionnaire/{nth}
   ```

   dove **{nth}** è l'indice della domanda nel questionario, aka l'indice della schermata (1-based)

2. Fornire risposta ad una domanda:

   ```
   PUT /projects/{project-name}/questionnaire/{nth}
   ```

   il corpo della HTTP request contiene le informazioni rilevanti da mandare al server (comunemente: ID delle risposte e eventuali altri dati).

> Nota: non è possibile accedere all'N-esima domanda se non sono state fornite le risposte alle domande 1, 2, ..., N-1

3. Memorizzazione di informazioni di contesto:

   ```
   PUT /projects/{project-name}/context?key=KEY_NAME_HERE
   ```

   Il corpo della HTTP request contiene dati arbitrari da memorizzare nel progetto corrente alla voce KEY_NAME_HERE

4. Recupero di informazioni di contesto:

   ```
   GET /projects/{project-name}/context?key=KEY_NAME_HERE
   ```

   Il corpo della HTTP response contiene dati arbitrari precedentemente memorizzati nel progetto corrente alla voce KEY_NAME_HERE

## Esemplificazione del flusso

### Caricamento iniziale

Al caricamento iniziale del frontend, il backend deve fornire tutte le domande necessarie come array di oggetti JSON.

- `GET /projects/{project-name}/questionnaires`

  - risposta possibile

    ```json
    [
      {
        "step": 1,
        "id": {
          "code": "p-1-DatasetSelection"
        },
        "label": "Dataset Choice",
        "longDescription": "Choose a dataset or load your own."
      },
      {
        "step": 2,
        "id": {
          "code": "p-2-DataView"
        },
        "label": "Data View",
        "longDescription": "This view shows the data in the dataset."
      },
      {
        "step": 3,
        "id": {
          "code": "p-3-FeatureView"
        },
        "label": "Feature View",
        "longDescription": "Select target and sensitive features."
      }
    ]
    ```

### Dataset Choice View

Al caricamento della view:

- `GET /projects/{project-name}/questionnaire/1`

  - risposta possibile:

    ```json
    {
      "id": {
        "code": "p-1-DatasetSelection" // id della view lato backend...
      }, // ... "DatasetSelection" si potrebbe usare forse come ID della view lato frontend
      "text": "Choose a dataset or load your own.", // titolo della pagina
      "description": "Select a dataset from the list below or load your own.", // descrizione della pagina
      "type": "single", // metadato che indica che alla fine verrà selezionato un solo elemento
      "answers": [
        // informazioni relative alle risposte ammissibile
        {
          "id": {
            "code": "p-1-AdultDataset" // ID della risposta lato backend...
          }, // ... si potrebbe usare forse come ID del campo del frontend che permette di selezionare questo dataset
          "text": "Adult Census Income Dataset", // nome "intelleggibile" con cui mostrare il nome del dataset all'utente
          "description": "This dataset contains information about adults and their income.", // descrizione del dataset
          "select": true // metadato che indica che questa risposta è selezionabile
        },
        {
          "id": {
            "code": "p-1-BankDataset"
          },
          "text": "Bank Marketing Dataset",
          "description": "This dataset contains information about adults and their income.", // descrizione del dataset
          "select": false // metadato che indica che questa risposta è selezionabile
        },
        // altre risposte pre-confezionate qui
        {
          "id": {
            "code": "p-1-Custom" // questo corrisponde alla selezione di un dataset fornito dall'utente
          }, // (vedi sotto)
          "text": "Create a custom dataset",
          "description": "This dataset contains information about adults and their income.", // descrizione del dataset
          "select": false // metadato che indica che questa risposta è selezionabile
        }
      ]
    }
    ```

Se l'utente preme il pulsante "Create" e carica un nuovo dataset,
il frontend deve fare un PUT di una informazione di contesto:

- `PUT /projects/{project-name}/context?key=custom-dataset-1`

  - il corpo della richiesta HTTP contiene il dataset caricato dall'utente

    ```json
    {
        "data": "DATA ENCODED SOMEHOW",
        "size": 12345,
        "columns": ["col1", "col2", ...],
        "rows": 1234,
        "created-at": "2021-01-01T00:00:00Z",
        // metadati arbitrari corrispondenti ai campi del frontend
    }
    ```

Quando si deve passare alla prossima view (es. pressione di "Continua")...

1.  ... se l'utente ha selezionato un dataset pre-confezionato:

    - `PUT /projects/{project-name}/questionnaire/1`

      - il body della request deve contenere l'ID della risposta selezionata
        (tra quelli forniti nella risposta alla GET sopra):

        ```json
        { "answer_ids": ["{answer-id}"] }
        ```

2.  ... se l'utente ha caricato un dataset custom:

    - `PUT /projects/{project-name}/questionnaire/1`

      - in realtà non è diverso dal caso precedente:

        ```json
        { "answer_ids": ["p-1-Custom"] }
        ```

A questo punto si passa alla data view.

### Data View

La "Data View" visualizza semplicemente il contenuto del dataset.

Recupero dei dati:

- `GET /projects/{project-name}/context?key=stats-ID_DEL_DATASET`
  - possibile risposta: letteralmente un **file CSV**, ad esempio:
    ```csv
    sepal_length,sepal_width,petal_length,petal_width,species
    5.1,3.5,1.4,0.2,setosa
    4.9,3.0,1.4,0.2,setosa
    4.7,3.2,1.3,0.2,setosa
    ```

Tuttavia, il backend potrebbe aver bisogno di tempo per calcolare le statistiche, quindi questa interazione dovrebbe essere asincrona, nel senso che non si deve bloccare l'interfaccia utente in attesa della risposta.

### Features View

Quando la pagina è caricata:

- `GET /projects/{project-name}/questionnaire/2`

  - possibile risposta:

    ```json
    {
      "id": {
        "code": "p-1-FeatureView"
      },
      "text": "Select target and sensitive features.",
      "type": "multiple",
      "answers": [
        {
          "id": {
            "code": "feature1-sensitive" // da usare come ID della checkbox
          }
        },
        {
          "id": {
            "code": "feature1-target"
          }
        }
        // altri per le altre caratteristiche, 2 per ogni caratteristica
      ]
    }
    ```

Una volta selezionate le caratteristiche sensibili e di output, al clic sul pulsante "Next":

- `PUT /projects/{project-name}/questionnaire/2`

  - possibile body:

    ```json
    {
      "answer_ids": [
        "feature-1-sensitive",
        "feature-4-target",
        "feature-5-sensitive"
      ]
    }
    ```

    Vengono inviati solo gli ID delle checkbox selezionate nel POST.

# AGGIORNAMENTO 30 ottobre

Facendo riferimento al file 'initial-flow-example.md':

- per adesso non si gestisce né la fase di login né la scelta del progetto da parte dell'utente.
- non vi sono problemi da parte di UNIBO ad aggiungere nuove chiavi aggiuntive all'interno dei json di risposta agli endpoint:

`/projects/{project-name}/questionnaire/{nth}`

Ad esempio la descrizione del dataset nella Dataset Choice View:

`/projects/{project-name}/questionnaire/1`

```json
{
  "answers": [
    {
      "id": { "code": "p-1-AdultDataset" },

      "text": "Adult Census Income Dataset",
      "description": "This dataset contains information about adults and their income."
    }
  ]
}
```

- In fase di caricamento di un eventuale nuovo dataset, nel PUT da parte del frontend viene aggiunto il type:

  `PUT /projects/{project-name}/context?key=custom-dataset-1&type=Dataset`

  Il body conterrà direttamente il file encoded

- Verrà impedito lato client il caricamento di file differenti da CSV
- Se il dataset non viene correttamente riconosciuto lato backend verrà inviato un opportuno messaggio al frontend
- Dalla chiamata della Feature View:

  `GET /projects/{project-name}/questionnaire/3`

  non verranno prese le informazioni delle answers che invece verranno prese dalla chiamata:

  `GET /projects/{project-name}/context?key=custom&type=Features`

  che restituirà un json col seguente tracciato:

```json
[
  {
    "name": "feature1",
    "type": "int",
    "min": 0,
    "max": 100,
    "avg": 50,
    "target": false,
    "sensitive": false,
    "values": ["low", "medium", "high"],
    "histogram": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // da fare come array
  }
  //...
]
```

Per ogni feature verranno creati i checkbox sensitive e target identificati rispettivamente con i suffissi **-sensitive** e **-target** aggiunti al nome della feature

{

}

# AGGIORNAMENTO 5 novembre

Proposta per gestione labels e ordinamento colonne:

```json
{
  "columns": [
    {
      "label": "Name",
      "key": "name"
    },
    {
      "label": "Max",
      "key": "max"
    },
    {
      "label": "Min",
      "key": "min"
    },
    {
      "label": "Sensitive",
      "key": "sensitive"
    },
    {
      "label": "Output",
      "key": "target"
    }
  ],
  "rows": [
    {
      "name": "feature1",
      "type": "int",
      "min": 0,
      "max": 100,
      "avg": 50,
      "target": false,
      "sensitive": false,
      "values": ["Low", "Medium", "High"],
      "histogram": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    //...
  ]
}
```

L'implementazione senza "columns" non permette di differenziare key da label e di gestire l'ordinamento delle colonne. In caso si gestisse la label della colonna coincidente con la chiave del json, in caso di rinomina ad esempio di "sensitive", i dati già presenti a database non tornerebbero.
