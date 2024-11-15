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
   GET /projects/{project-code}/questionnaire/{nth}
   ```

   dove **{nth}** è l'indice della domanda nel questionario, aka l'indice della schermata (1-based)

2. Fornire risposta ad una domanda:

   ```
   PUT /projects/{project-code}/questionnaire/{nth}
   ```

   il corpo della HTTP request contiene le informazioni rilevanti da mandare al server (comunemente: ID delle risposte e eventuali altri dati).

> Nota: non è possibile accedere all'N-esima domanda se non sono state fornite le risposte alle domande 1, 2, ..., N-1

3. Memorizzazione di informazioni di contesto:

   ```
   PUT /projects/{project-code}/context?key=KEY_NAME_HERE
   ```

   Il corpo della HTTP request contiene dati arbitrari da memorizzare nel progetto corrente alla voce KEY_NAME_HERE

4. Recupero di informazioni di contesto:

   ```
   GET /projects/{project-code}/context?key=KEY_NAME_HERE
   ```

   Il corpo della HTTP response contiene dati arbitrari precedentemente memorizzati nel progetto corrente alla voce KEY_NAME_HERE

## Esemplificazione del flusso

### Dataset Selection View

Al caricamento della view:

- `GET /projects/{project-code}/questionnaire/1`

  - risposta:

    ```json
    {
      "id": {
        "code": "DatasetSelection",
        "project_code": "p-1"
      }, // ... "DatasetSelection" si potrebbe usare forse come ID della view lato frontend
      "text": "Choose a dataset or load your own.", // titolo della pagina
      "type": "single", // metadato che indica che alla fine verrà selezionato un solo elemento
      "answers": [
        // informazioni relative alle risposte ammissibile
        {
          "id": {
            "code": "AdultDataset",
            "question_code": "DatasetSelection",
            "project_code": "p-1"
          },
          // gli id delle risposte sono composti da tre codici... in questo caso, "code "si potrebbe usare forse come ID del campo del frontend che permette di selezionare questo dataset
          "text": "Adult Census Income Dataset",
          // nome "intelleggibile" con cui mostrare il nome del dataset all'utente
          "description": null,
          "selected": false
        },
        // altre risposte pre-confezionate qui
        {
          // questo corrisponde alla selezione di un dataset fornito dall'utente
          "id": {
            "code": "Custom",
            "question_code": "DatasetSelection",
            "project_code": "p-1"
          },
          "text": "Custom",
          "description": "Load your own dataset.",
          "selected": false
        }
      ]
    }
    ```

<mark>
Gli id con code Custom vanno esclusi dalla lista di dataset mostrati nel front-end
Si deve ancora aggiungere le informazioni di contesto con size, description, rows, created-at
</mark>

Successivamente

1.  ... se l'utente ha selezionato un dataset pre-confezionato:

    - `PUT /projects/{project-code}/questionnaire/1`

      - il body della request deve contenere l'ID della risposta selezionata
        (tra quelli forniti nella risposta alla GET sopra):

        ```json
        {
          "answer_ids": [
            {
              "code": "AdultDataset",
              "question_code": "DatasetSelection",
              "project_code": "p-1"
            }
          ]
        }
        ```

2.  ... se l'utente ha caricato un dataset custom:

    - `PUT /projects/{project-code}/questionnaire/1`

      - in realtà non è diverso dal caso precedente:

        ```json
        {
          "answer_ids": [
            {
              "code": "Custom",
              "question_code": "DatasetSelection",
              "project_code": "p-1"
            }
          ]
        }
        ```

    - L'utente preme il pulsante "Create" e carica un nuovo dataset, il frontend deve fare un PUT di una informazione di contesto:

    - `PUT /projects/{project-code}/context?key=dataset__custom-1`

      - il corpo della richiesta HTTP contiene il dataset caricato dall'utente

<mark>RIMOSSA SEZIONE DI DATI CHE INVECE VERRANNO CALCOLATI DAL BACKEND</mark>

Tutte le richieste HTTP in entrambi i punti 1. e 2. vengono eseguiti al premere del pulsante "Continue".

A questo punto si passa alla Data View.

### Data View

La "Data View" visualizza semplicemente il contenuto del dataset.

Recupero dei dati:

- `GET /projects/{project-code}/context?key=dataset__{ID_DEL_DATASET}` dove `{ID_DEL_DATASET}` in questo caso è `custom-1`
  - risposta in formato **CSV**, ad esempio:

<mark>Verrà fornito un nuovo dataset corretto</mark>

        ```csv
        sex,age,workclass,fnlwgt,education,education-num,marital-status,occupation,relationship,race,capitalgain,capitalloss,hoursperweek,native-country,class
        1.0,1.3405643351084173,0.9611518123772529,17517.220482475575,1.11160017349171,5.272907692406985,0.6579724682889373,2.4476781959366147,1.403345424967505,0.43417388084565317,0.263145407760534,0.3739967565157661,1.4874752320278937,1.068008871517426,1.0
        1.0,1.3405643351084173,0.9611518123772529,17517.220482475575,1.11160017349171,5.272907692406985,0.6579724682889373,2.4476781959366147,1.403345424967505,0.43417388084565317,0.263145407760534,0.3739967565157661,1.4874752320278937,1.068008871517426,1.0
        1.0,1.9733014370518274,0.45753835610605453,208904.86142343242,4.776736471156541,11.885070373838898,1.0886574583632154,5.523328396543898,2.841204093649109,0.2501686574103876,0.0918465383138652,-0.026507590439510124,2.1758916960636703,1.2748796340831579,1.0
        1.0,1.9733014370518274,0.45753835610605453,208904.86142343242,4.776736471156541,11.885070373838898,1.0886574583632154,5.523328396543898,2.841204093649109,0.2501686574103876,0.0918465383138652,-0.026507590439510124,2.1758916960636703,1.2748796340831579,1.0
        0.0,1.9733014370518274,0.45753835610605453,208904.86142343242,4.776736471156541,11.885070373838898,1.0886574583632154,5.523328396543898,2.841204093649109,0.2501686574103876,0.0918465383138652,-0.026507590439510124,2.1758916960636703,1.2748796340831579,1.0
        ```

Tuttavia, il backend potrebbe aver bisogno di tempo per calcolare le statistiche, quindi questa interazione dovrebbe essere asincrona, nel senso che non si deve bloccare l'interfaccia utente in attesa della risposta.

### Features View

Quando la pagina è caricata:

- `GET /projects/{project-code}/context?key=stats__custom-1`

  - risposta info sul dataset in formato **CSV**:

  ```csv
  feature,missing_values,min,max,mean,std,1st_percentile,2nd_percentile,3rd_percentile,type,values,distribution,output,sensitive
  age,0,0.0,4.0,1.7695369510415284,1.266784781771372,1.0,2.0,3.0,integer,"[0, 1, 2, 3, 4]","{'0.0 - 0.4': 8441, '0.4 - 0.8': 0, '0.8 - 1.2': 12074, '1.2 - 1.6': 0, '1.6 - 2.0': 0, '2.0 - 2.4': 11472, '2.4 - 2.8': 0, '2.8 - 3.2': 7936, '3.2 - 3.6': 0, '3.6 - 4.0': 5299}",False,False
  workclass,0,,,,,,,,categorical,"['Federal-gov', 'Local-gov', 'Private', 'Self-emp-inc', 'Self-emp-not-inc', 'State-gov', 'Without-pay']","{'Private': 33307, 'Self-emp-not-inc': 3796, 'Local-gov': 3100, 'State-gov': 1946, 'Self-emp-inc': 1646, 'Federal-gov': 1406, 'Without-pay': 21, 'Never-worked': 0}",False,False
  fnlwgt,0,13492.0,1490400.0,189734.7343107337,105639.19513422118,117388.25,178316.0,237926.0,float,,"{'13492.0 - 161182.8': 18701, '161182.8 - 308873.6': 20916, '308873.6 - 456564.4': 4803, '456564.4 - 604255.2': 604, '604255.2 - 751946.0': 140, '751946.0 - 899636.8': 32, '899636.8 - 1047327.6': 12, '1047327.6 - 1195018.4': 7, '1195018.4 - 1342709.2': 3, '1342709.2 - 1490400.0': 4}",False,False
  education,0,,,,,,,,categorical,"['10th', '11th', '12th', '1st-4th', '5th-6th', '7th-8th', '9th', 'Assoc-acdm', 'Assoc-voc', 'Bachelors', 'Doctorate', 'HS-grad', 'Masters', 'Preschool', 'Prof-school', 'Some-college']","{'HS-grad': 14783, 'Some-college': 9899, 'Bachelors': 7570, 'Masters': 2514, 'Assoc-voc': 1959, '11th': 1619, 'Assoc-acdm': 1507, '10th': 1223, '7th-8th': 823, 'Others': 3325}",False,False
  education-num,0,1.0,16.0,10.118460041572686,2.5528811950758743,9.0,10.0,13.0,integer,"[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]","{'1.0 - 2.5': 294, '2.5 - 4.0': 449, '4.0 - 5.5': 1499, '5.5 - 7.0': 1223, '7.0 - 8.5': 2196, '8.5 - 10.0': 14783, '10.0 - 11.5': 11858, '11.5 - 13.0': 1507, '13.0 - 14.5': 10084, '14.5 - 16.0': 1329}",False,False
  marital-status,0,,,,,,,,categorical,"['Divorced', 'Married-AF-spouse', 'Married-civ-spouse', 'Married-spouse-absent', 'Never-married', 'Separated', 'Widowed']","{'Married-civ-spouse': 21055, 'Never-married': 14598, 'Divorced': 6297, 'Separated': 1411, 'Widowed': 1277, 'Married-spouse-absent': 552, 'Married-AF-spouse': 32}",False,False
  occupation,0,,,,,,,,categorical,"['Adm-clerical', 'Armed-Forces', 'Craft-repair', 'Exec-managerial', 'Farming-fishing', 'Handlers-cleaners', 'Machine-op-inspct', 'Other-service', 'Priv-house-serv', 'Prof-specialty', 'Protective-serv', 'Sales', 'Tech-support', 'Transport-moving']","{'Craft-repair': 6020, 'Prof-specialty': 6008, 'Exec-managerial': 5984, 'Adm-clerical': 5540, 'Sales': 5408, 'Other-service': 4808, 'Machine-op-inspct': 2970, 'Transport-moving': 2316, 'Handlers-cleaners': 2046, 'Others': 4122}",False,False
  relationship,0,,,,,,,,categorical,"['Husband', 'Not-in-family', 'Other-relative', 'Own-child', 'Unmarried', 'Wife']","{'Husband': 18666, 'Not-in-family': 11702, 'Own-child': 6626, 'Unmarried': 4788, 'Wife': 2091, 'Other-relative': 1349}",False,False
  race,0,,,,,,,,categorical,"['Amer-Indian-Eskimo', 'Asian-Pac-Islander', 'Black', 'Other', 'White']","{'White': 38903, 'Black': 4228, 'Asian-Pac-Islander': 1303, 'Amer-Indian-Eskimo': 435, 'Other': 353}",False,True
  sex,0,,,,,,,,binary,"['Female', 'Male']","{'Male': 30527, 'Female': 14695}",False,True
  capitalgain,0,0.0,4.0,0.20505506169563487,0.7561768730118918,0.0,0.0,0.0,integer,"[0, 1, 2, 3, 4]","{'0.0 - 0.4': 41432, '0.4 - 0.8': 0, '0.8 - 1.2': 981, '1.2 - 1.6': 0, '1.6 - 2.0': 0, '2.0 - 2.4': 1221, '2.4 - 2.8': 0, '2.8 - 3.2': 502, '3.2 - 3.6': 0, '3.6 - 4.0': 1086}",False,False
  capitalloss,0,0.0,4.0,0.1165583123258591,0.5605390667662566,0.0,0.0,0.0,integer,"[0, 1, 2, 3, 4]","{'0.0 - 0.4': 43082, '0.4 - 0.8': 0, '0.8 - 1.2': 360, '1.2 - 1.6': 0, '1.6 - 2.0': 0, '2.0 - 2.4': 723, '2.4 - 2.8': 0, '2.8 - 3.2': 763, '3.2 - 3.6': 0, '3.6 - 4.0': 294}",False,False
  hoursperweek,0,0.0,4.0,1.98805890938039,0.8752176175356808,2.0,2.0,2.0,integer,"[0, 1, 2, 3, 4]","{'0.0 - 0.4': 3602, '0.4 - 0.8': 0, '0.8 - 1.2': 5198, '1.2 - 1.6': 0, '1.6 - 2.0': 0, '2.0 - 2.4': 26149, '2.4 - 2.8': 0, '2.8 - 3.2': 8684, '3.2 - 3.6': 0, '3.6 - 4.0': 1589}",False,False
  native-country,0,,,,,,,,categorical,"['Cambodia', 'Canada', 'China', 'Columbia', 'Cuba', 'Dominican-Republic', 'Ecuador', 'El-Salvador', 'England', 'France', 'Germany', 'Greece', 'Guatemala', 'Haiti', 'Holand-Netherlands', 'Honduras', 'Hong', 'Hungary', 'India', 'Iran', 'Ireland', 'Italy', 'Jamaica', 'Japan', 'Laos', 'Mexico', 'Nicaragua', 'Outlying-US(Guam-USVI-etc)', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto-Rico', 'Scotland', 'South', 'Taiwan', 'Thailand', 'Trinadad&Tobago', 'United-States', 'Vietnam', 'Yugoslavia']","{'United-States': 41292, 'Mexico': 903, 'Philippines': 283, 'Germany': 193, 'Puerto-Rico': 175, 'Canada': 163, 'El-Salvador': 147, 'India': 147, 'Cuba': 133, 'Others': 1786}",False,False
  class,0,,,,,,,,binary,"['<=50K', '>50K']","{'<=50K': 34014, '>50K': 11208}",True,False
  ```

<mark>Si è proposta la seguente modifica al campo distribution:

```
"{'keys': ['0.0 - 0.4', '0.4 - 0.8', '0.8 - 1.2',... ], 'values': [8441, 0, 12074,... ]}"
```

In codice seguente si sono corretti i code
</mark>

- `GET /projects/{project-code}/questionnaire/2`

  - risposta:

    ```json
    {
      "id": {
        "code": "FeatureView",
        "project_code": "p-1"
      },
      "text": "Select target and sensitive features.",
      "type": "multiple",
      "answers": [
        {
          "id": {
            "code": "age-sensitive" // da usare come ID della checkbox
          },
          "description": null,
          "selected": false
        },
        {
          "id": {
            "code": "age-output"
          },
          "description": null,
          "selected": false
        }
        // altri per le altre caratteristiche, 2 per ogni caratteristica
      ]
    }
    ```

Una volta selezionate le caratteristiche sensibili e di output, al clic sul pulsante "Continue":

- `PUT /projects/{project-code}/questionnaire/2`

  - possibile body:

<mark>Corretta la struttura con code</mark>

```json
{
  "answer_ids": [
    {
      "code": "sex-sensitive"
    },
    {
      "code": "race-sensitive"
    },
    {
      "code": "class-output"
    }
  ]
}
```

        Vengono inviati solo gli ID delle checkbox selezionate nel POST.

### Dependencies View:

- `GET /projects/{project-code}/questionnaire/3`

  - risposta:

  ```json
  {
    "id": {
      "code": "Proxies",
      "project_code": "p-1"
    },
    "text": "Specify the proxies for the sensitive features.",
    "type": "multiple",
    "answers": [
      {
        "id": {
          "code": "Proxies-features-selected",
          "question_code": "Proxies",
          "project_code": "p-1"
        },
        "text": "",
        "description": null,
        "selected": false
      }
    ],
    "created_at": "2024-11-12T10:00:09.611719"
  }
  ```

- `GET /projects/{project-code}/context?key=correlation_matrix__custom-1`

  - risposta:

  ```json
  "{correlation matrix in formato vettoriale}"


  // ad esempio '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" stroke="black" stroke-width="3" fill="lightblue" /></svg>'
  ```

- `GET /projects/{project-code}/context?key=dependency_graph__custom-1`

  - risposta:

  ```json
  "{dependency graph in formato vettoriale}"


  // analogo a sopra
  ```

- `GET /projects/{project-code}/context?key=suggested_proxies__custom-1` per pre-selezionare i proxy

  - risposta:

  ```json
  {
    "sex": {
      "age": {
        "correlation": 0.09,
        "suggested_proxy": "false"
      },
      "workclass": {
        "correlation": -0.01,
        "suggested_proxy": "false"
      },
      "fnlwgt": {
        "correlation": 0.03,
        "suggested_proxy": "false"
      },
      "education": {
        "correlation": 0.03,
        "suggested_proxy": "false"
      },
      "education-num": {
        "correlation": 0.01,
        "suggested_proxy": "false"
      },
      "marital-status": {
        "correlation": -0.38,
        "suggested_proxy": "false"
      },
      "occupation": {
        "correlation": -0.04,
        "suggested_proxy": "false"
      },
      "relationship": {
        "correlation": -0.17,
        "suggested_proxy": "false"
      },
      "race": {
        "correlation": -0.11,
        "suggested_proxy": "false"
      },
      "capitalgain": {
        "correlation": 0.07,
        "suggested_proxy": "false"
      },
      "capitalloss": {
        "correlation": 0.05,
        "suggested_proxy": "false"
      },
      "hoursperweek": {
        "correlation": 0.24,
        "suggested_proxy": "false"
      },
      "native-country": {
        "correlation": 0.01,
        "suggested_proxy": "false"
      },
      "class": {
        "correlation": -0.21,
        "suggested_proxy": "false"
      }
    }
  }
  ```

- l'utente seleziona di fatto le features proxy (tramite le checkbox), dopodichè cliccando su "Continue":

  1.  si riempie il contesto con le features selezionate come proxy

      `PUT /projects/{project-code}/context?key=proxies__custom-1`

      - body:

      ```json
      {
        "sex": {
          "age": {
            "correlation": 0.09,
            "proxy": "false"
          },
          "workclass": {
            "correlation": -0.01,
            "proxy": "false"
          },
          "fnlwgt": {
            "correlation": 0.03,
            "proxy": "false"
          },
          "education": {
            "correlation": 0.03,
            "proxy": "false"
          },
          "education-num": {
            "correlation": 0.01,
            "proxy": "false"
          },
          "marital-status": {
            "correlation": -0.38,
            "proxy": "false"
          },
          "occupation": {
            "correlation": -0.04,
            "proxy": "false"
          },
          "relationship": {
            "correlation": -0.17,
            "proxy": "false"
          },
          "race": {
            "correlation": -0.11,
            "proxy": "false"
          },
          "capitalgain": {
            "correlation": 0.07,
            "proxy": "false"
          },
          "capitalloss": {
            "correlation": 0.05,
            "proxy": "false"
          },
          "hoursperweek": {
            "correlation": 0.24,
            "proxy": "false"
          },
          "native-country": {
            "correlation": 0.01,
            "proxy": "false"
          },
          "class": {
            "correlation": -0.21,
            "proxy": "false"
          }
        }
      }
      ```

  2.  si prosegue dando (l'unica, in questo caso) risposta alla domanda del questionario

      `PUT /projects/{project-code}/questionnaire/3`

      - body, sempre così (è l'unica risposta possibile)

      ```json
      {
        "answer_ids": [
          {
            "code": "Proxies-features-selected",
            "question_code": "Proxies",
            "project_code": "p-1"
          }
        ]
      }
      ```

  3.  si passa alla Detection View

### Detection View

- `GET /projects/{project-code}/questionnaire/4`

  - risposta:

  ```json
  {
    "id": {
      "code": "Detection",
      "project_code": "p-1"
    },
    "text": "Select the fairness metrics and the features to check.",
    "type": "multiple", // risposta multipla, quindi checkbox
    "answers": [
      {
        "id": {
          "code": "AverageOdds",
          "question_code": "Detection",
          "project_code": "p-1"
        },
        "text": "Average Absolute Odds", // valore da visualizzare a fianco della checkbox
        "description": "The Average Absolute Odds Difference (AAOD) is a metric used ...", // descrizione da mostrare eventualmente tramite hover
        "selected": false
      },
      {
        "id": {
          "code": "DisparateImpact",
          "question_code": "Detection",
          "project_code": "p-1"
        },
        "text": "Disparate Impact",
        "description": "Disparate Impact (DI) examines ...",
        "selected": false
      },
      {
        "id": {
          "code": "EqualOpportunity",
          "question_code": "Detection",
          "project_code": "p-1"
        },
        "text": "Equal Opportunity",
        "description": "The Equal Opportunity Difference (EOD) measures ...",
        "selected": false
      },
      {
        "id": {
          "code": "StatisticalParityDifference",
          "question_code": "Detection",
          "project_code": "p-1"
        },
        "text": "Statistical Parity Difference",
        "description": "Statistical Parity Difference (SPD) measures the difference between ...",
        "selected": false
      }
    ],
    "created_at": "2024-11-12T10:00:09.611719"
  }
  ```

- `GET /projects/{project-code}/context?key=metrics__custom-1` per popolare la schermata corrente con i grafici (istogrammi)

  - risposta:

  ```json
  {
    "disparate_impact": [
      {
        "when": {
          "sex": "Male",
          "class": "<=50K"
        },
        "value": 1.2893016978933767
      },
      {
        "when": {
          "sex": "Male",
          "class": ">50K"
        },
        "value": "NaN"
      },
      {
        "when": {
          "sex": "Female",
          "class": "<=50K"
        },
        "value": 0.7756136532154777
      },
      {
        "when": {
          "sex": "Female",
          "class": ">50K"
        },
        "value": "NaN"
      },
      {
        "when": {
          "race": "White",
          "class": "<=50K"
        },
        "value": 1.1409371125434804
      },
      {
        "when": {
          "race": "White",
          "class": ">50K"
        },
        "value": "NaN"
      },
      {
        "when": {
          "race": "Black",
          "class": "<=50K"
        },
        "value": 0.846539032915113
      },
      {
        "when": {
          "race": "Black",
          "class": ">50K"
        },
        "value": "NaN"
      },
      {
        "when": {
          "race": "Asian-Pac-Islander",
          "class": "<=50K"
        },
        "value": 1.0507770948592194
      },
      {
        "when": {
          "race": "Asian-Pac-Islander",
          "class": ">50K"
        },
        "value": "NaN"
      },
      {
        "when": {
          "race": "Amer-Indian-Eskimo",
          "class": "<=50K"
        },
        "value": 0.8551191170493214
      },
      {
        "when": {
          "race": "Amer-Indian-Eskimo",
          "class": ">50K"
        },
        "value": "NaN"
      },
      {
        "when": {
          "race": "Other",
          "class": "<=50K"
        },
        "value": 0.8609636479992405
      },
      {
        "when": {
          "race": "Other",
          "class": ">50K"
        },
        "value": "NaN"
      }
    ],
    "statistical_parity_difference": [
      {
        "when": {
          "sex": "Male",
          "class": "<=50K"
        },
        "value": 0.1989014326788151
      },
      {
        "when": {
          "sex": "Male",
          "class": ">50K"
        },
        "value": 0.0
      },
      {
        "when": {
          "sex": "Female",
          "class": "<=50K"
        },
        "value": -0.1989014326788151
      },
      {
        "when": {
          "sex": "Female",
          "class": ">50K"
        },
        "value": 0.0
      },
      {
        "when": {
          "race": "White",
          "class": "<=50K"
        },
        "value": 0.10395937026830093
      },
      {
        "when": {
          "race": "White",
          "class": ">50K"
        },
        "value": 0.0
      },
      {
        "when": {
          "race": "Black",
          "class": "<=50K"
        },
        "value": -0.1340787162752064
      },
      {
        "when": {
          "race": "Black",
          "class": ">50K"
        },
        "value": 0.0
      },
      {
        "when": {
          "race": "Asian-Pac-Islander",
          "class": "<=50K"
        },
        "value": 0.0363973957010828
      },
      {
        "when": {
          "race": "Asian-Pac-Islander",
          "class": ">50K"
        },
        "value": 0.0
      },
      {
        "when": {
          "race": "Amer-Indian-Eskimo",
          "class": "<=50K"
        },
        "value": -0.12722872939576835
      },
      {
        "when": {
          "race": "Amer-Indian-Eskimo",
          "class": ">50K"
        },
        "value": 0.0
      },
      {
        "when": {
          "race": "Other",
          "class": "<=50K"
        },
        "value": -0.12131217115080428
      },
      {
        "when": {
          "race": "Other",
          "class": ">50K"
        },
        "value": 0.0
      }
    ]
  }
  ```

- l'utente seleziona le metriche e le features da considerare, dopodichè cliccando su "Continue":

  1.  `PUT /projects/{project-code}/context?key=detected__custom-1`

      - body: dizionario a più livelli che identifica quale metrica, e assegnamento delle feature andare a considerare "da mitigare"

      ```json
      {
        "disparate_impact": [
          {
            "sex": "Male",
            "class": ">50K"
          },
          {
            "sex": "Female",
            "class": ">50K"
          }
        ],
        "statistical_parity_difference": [
          {
            "sex": "Male",
            "class": ">50K"
          },
          {
            "sex": "Female",
            "class": ">50K"
          }
        ]
      }
      ```

  2.  si seleziona la risposta alla domanda del questionario

      `PUT /projects/{project-code}/questionnaire/4`

      - il body della request deve contenere gli ID delle risposte selezionate (in questo caso, le metriche prese in considerazione), per esempio:

      ```json
      {
        "answer_ids": [
          {
            "code": "StatisticalParityDifference",
            "question_code": "Detection",
            "project_code": "p-1"
          },
          {
            "code": "DisparateImpact",
            "question_code": "Detection",
            "project_code": "p-1"
          }
        ]
      }
      ```

  3.  si passa alla Mitigation View

### Data Mitigation View

- `GET /projects/{project-code}/questionnaire/5`

  - risposta:

  ```json
  {
    "id": {
      "code": "DataMitigation",
      "project_code": "p-1"
    },
    "text": "Which data mitigation technique do you want to apply?",
    "type": "single", // risposta singola, quindi radio buttons
    "answers": [
      {
        "id": {
          "code": "DisparateImpactRemover",
          "question_code": "DataMitigation",
          "project_code": "p-1"
        },
        "text": "Disparate Impact Remover", // valore da visualizzare a fianco del radio button
        "description": "Disparate Impact Remover is a preprocessing technique that ...", // descrizione da mostrare eventualmente tramite hover
        "selected": false
      },
      {
        "id": {
          "code": "LearningFairRepresentations",
          "question_code": "DataMitigation",
          "project_code": "p-1"
        },
        "text": "Learning Fair Representations",
        "description": "Learning Fair Representations (LFR) aim to ...",
        "selected": false
      },
      {
        "id": {
          "code": "OptimizedPreprocessing",
          "question_code": "DataMitigation",
          "project_code": "p-1"
        },
        "text": "Optimized Preprocessing",
        "description": "The Optimized Pre-Processing method applies a probabilistic transformation to ...",
        "selected": false
      },
      {
        "id": {
          "code": "Reweighing",
          "question_code": "DataMitigation",
          "project_code": "p-1"
        },
        "text": "Reweighing",
        "description": "The Reweighing method assigns different weights ...",
        "selected": false
      }
    ],
    "created_at": "2024-11-12T10:00:09.611719"
  }
  ```

- l'utente seleziona il radio button dell'algoritmo scelto:

  - `PUT /projects/{project-code}/questionnaire/5`

    - body: l'ID dell'algoritmo scelto

    ```json
    {
      "answer_ids": [
        {
          "code": "LearningFairRepresentations",
          "question_code": "DataMitigation",
          "project_code": "p-1"
        }
      ]
    }
    ```

- dopodiché appare un popup o un'altra schermata per selezionare gli iperparametri:

  `GET /projects/{project-code}/context?key=preprocessing-hyperparameters__custom-1` per popolare popup/vista con gli input di un form per la selezione degli iperparametri.

  - risposta:

  ```json
  {
    "n_prototypes": {
      "label": "Number of Prototypes",
      "description": "Size of the set of prototypes",
      "type": "integer",
      "default": 50,
      "values": [10, 200] // range di valori interi possibili (slider sul frontend)
    },
    "reconstruct_weight": {
      "label": "Reconstruct Weight",
      "description": "Weight coefficient on the reconstruct loss term",
      "type": "float",
      "default": 0.5,
      "values": [0, 1] // range di valori float possibili (slider sul frontend)
    },
    "fairness_weight": {
      "label": "Weight for Fairness loss",
      "description": "Weight coefficient on the fairness loss term",
      "type": "float",
      "default": 0.5,
      "values": [0, 1] // range di valori float possibili (slider sul frontend)
    },
    "random_state": {
      "label": "Random State",
      "description": "Seed for reproducibility",
      "type": "categorical",
      "default": 42,
      "values": [0, 1, 42, 999] // set di valori categorical (lista (?) sul frontend)
    }
  }
  ```

- selezionati gli iperparametri tramite gli input del form, cliccando su "Select and Run":

  1.  `PUT /projects/{project-code}/context?key=preprocessing__custom-1`

      - body: iperparametri scelti dall'utente

        possibili iperparametri rispettivamente per ogni algoritmo, in questo caso:

        ```json
        {
          "$algorithm": "LearnedFairRepresentations",
          "fairness_weight": 0.1,
          "n_prototypes": 10,
          "reconstruct_weight": 0.1,
          "random_state": 42
        }
        ```

  2.  La computazione potrebbe richiedere del tempo, quindi si mostra un caricamento all'utente. Successivamente, si mostra la Results View.

      Per riempire la Results View:

      - `GET /projects/{project-code}/context?key=dataset__custom-2` per recuperare il dataset modificato e i risultati con cui riempire la view (in particolare `results`).

        Per ora l'id del nuovo dataset sarà incrementale (`custom-2`, `custom-3` e cosi via in caso di altri pre-processing).

        - risposta:

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

      - `GET /projects/{project-code}/context?key=correlation_matrix__custom-2` (come in **Dependencies View**)

        - risposta:

        ```json
        "{correlation matrix in formato vettoriale}"


        // ad esempio '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" stroke="black" stroke-width="3" fill="lightblue" /></svg>'
        ```

      - `GET /projects/{project-code}/context?key=dependency_graph__custom-2` (come in **Dependencies View**)

        - risposta:

        ```json
        "{dependency graph in formato vettoriale}"


        // analogo a sopra
        ```

      - `GET /projects/{project-code}/context?key=stats__custom-2` per recuperare le statistiche del dataset modificato

        - risposta in formato **CSV**, come sopra in **Data View**

      - `GET /projects/{project-code}/context?key=metrics__custom2` per recuperare le metriche di fairness del dataset modificato
        - risposta come sopra in **Detection View**

  3.  si passa al Summary View

### Summary View

Semplice schermata in cui si chiede se si vuole fare un nuovo pre-processing o andare avanti con in-processing.

- `GET /projects/{project-code}/questionnaire/6`

  - risposta:

  ```json
  {
    "id": {
      "code": "DataMitigationSummary",
      "project_code": "p-1"
    },
    "text": "What do you want to do next?",
    "type": "single", // risposta singola, quindi radio buttons
    "answers": [
      {
        "id": {
          "code": "Done",
          "question_code": "DataMitigationSummary",
          "project_code": "p-1"
        },
        "text": "Done",
        "description": null,
        "selected": false
      },
      {
        "id": {
          "code": "MitigateDataAgain",
          "question_code": "DataMitigationSummary",
          "project_code": "p-1"
        },
        "text": "Mitigate Data Again",
        "description": null,
        "selected": false
      },
      {
        "id": {
          "code": "MitigateModel",
          "question_code": "DataMitigationSummary",
          "project_code": "p-1"
        },
        "text": "Mitigate Model",
        "description": null,
        "selected": false
      }
    ],
    "created_at": "2024-11-12T10:00:09.611719"
  }
  ```

- l'utente seleziona il radio button, dopodichè cliccando su "Continue":

  1.  `PUT /projects/{project-code}/questionnaire/6`

      - body supponendo di voler passare all'in-processing:

      ```json
      {
        "answer_ids": [
          {
            "code": "MitigateModel",
            "question_code": "DataMitigationSummary",
            "project_code": "p-1"
          }
        ]
      }
      ```

      Notare bene il branching, soprattutto per la breadcrumb:

      1. se si sceglie "MitigateDataAgain", si ritorna alla Data Mitigation View
      2. se si sceglie "MitigateModel", si passa alla Model Mitigation View
      3. se si sceglie "Done", il flusso termina

  2.  si passa alla Model Mitigation View

### Model Mitigation View

Il flusso è analogo a quello di **Data Mitigation e Summary**.

- **Summary** conterrà una risposta in più: "Mitigate Model Again".

### Outcome Mitiagation View

Il flusso è analogo a quello di **Data Mitigation e Summary**.

- **Summary** conterrà una risposta in più: "Mitigate Outcome Again".

## Tornare indietro nel flusso

Ogni volta che si vuole tornare alla schermata/domanda precedente, è necessario effettuare una richiesta DELETE

```
DELETE /projects/{project-code}/questionnaire/{nth}
```

dove **{nth}** è l'indice della domanda nel questionario che si vuole eliminare, per tornare alla domanda precedente.

> Se si vuole tornare indietro di più schermate (tramite la breadcrumb ad esempio), è necessario effettuare più DELETE, una per ogni schermata/domanda. Ad esempio, se si vuole passare dalla **Detection View** alla **Features View**, è necessario effettuare in ordine: `DELETE /projects/{project-code}/questionnaire/4` e `DELETE /projects/{project-code}/questionnaire/3`.