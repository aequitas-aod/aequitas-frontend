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

-   `GET /projects/{project-code}/questionnaire/1`

    -   risposta:

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

-   `GET /projects/{project-code}/context?key=datasets`

    Per ottenere le informazioni sui datasets disponibili.

    -   risposta:

    ```json
    [
        {
            "name": "Adult Census Income Dataset",
            "size": 4.8, // MB
            "rows": 48842,
            "columns": 15,
            "description": "This is a custom dataset uploaded by the user.",
            "created-at": "2024-11-12T10:00:09.611719"
        }
    ]
    ```

Successivamente

1.  ... se l'utente ha selezionato un dataset pre-confezionato:

    -   `PUT /projects/{project-code}/questionnaire/1`

        -   il body della request deve contenere l'ID della risposta selezionata
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

    -   `PUT /projects/{project-code}/questionnaire/1`

        -   in realtà non è diverso dal caso precedente:

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

    -   L'utente preme il pulsante "Create" e carica un nuovo dataset, il frontend deve fare un PUT di una informazione di contesto:

    -   `PUT /projects/{project-code}/context?key=dataset__custom-1`

        -   il corpo della richiesta HTTP contiene il dataset caricato dall'utente in **formato CSV**:

Tutte le richieste HTTP in entrambi i punti 1. e 2. vengono eseguiti al premere del pulsante "Continue".

A questo punto si passa alla Data View.

### Data View

La "Data View" visualizza semplicemente il contenuto del dataset.

-   `GET /projects/{project-code}/questionnaire/2`

    -   risposta:

        ```json
        {
            "id": {
                "code": "DatasetConfirmation",
                "project_code": "p-1"
            },
            "text": "Are you sure to proceed with this dataset?",
            "type": "single",
            "answers": [
                {
                    "id": {
                        "code": "yes",
                        "question_code": "DatasetConfirmation",
                        "project_code": "p-1"
                    },
                    "text": "Yes",
                    "description": null,
                    "selected": false
                },
                {
                    "id": {
                        "code": "no",
                        "question_code": "DatasetConfirmation",
                        "project_code": "p-1"
                    },
                    "text": "No",
                    "description": null,
                    "selected": false
                }
            ]
        }
        ```

Recupero dei dati:

-   `GET /projects/{project-code}/context?key=dataset__{ID_DEL_DATASET}` dove `{ID_DEL_DATASET}` in questo caso è `custom-1`

    -   risposta in formato **CSV**, ad esempio:
        ```csv
        age,workclass,fnlwgt,education,education-num,marital-status,occupation,relationship,race,sex,capitalgain,capitalloss,hoursperweek,native-country,class
        2,State-gov,77516.0,Bachelors,13,Never-married,Adm-clerical,Not-in-family,White,Male,1,0,2,United-States,<=50K
        3,Self-emp-not-inc,83311.0,Bachelors,13,Married-civ-spouse,Exec-managerial,Husband,White,Male,0,0,0,United-States,<=50K
        2,Private,215646.0,HS-grad,9,Divorced,Handlers-cleaners,Not-in-family,White,Male,0,0,2,United-States,<=50K
        3,Private,234721.0,11th,7,Married-civ-spouse,Handlers-cleaners,Husband,Black,Male,0,0,2,United-States,<=50K
        1,Private,338409.0,Bachelors,13,Married-civ-spouse,Prof-specialty,Wife,Black,Female,0,0,2,Cuba,<=50K
        ```

    Tuttavia, il backend potrebbe aver bisogno di tempo per calcolare le statistiche, quindi questa interazione dovrebbe essere asincrona, nel senso che non si deve bloccare l'interfaccia utente in attesa della risposta.

-   L'utente prosegue confermando il dataset.

    `PUT /projects/{project-code}/questionnaire/2`

    -   body:

        ```json
        {
            "answer_ids": [
                {
                    "code": "yes",
                    "question_code": "DatasetConfirmation",
                    "project_code": "p-1"
                }
            ]
        }
        ```

### Features View

Quando la pagina è caricata:

-   `GET /projects/{project-code}/context?key=stats__custom-1`

    -   risposta info sul dataset in formato **CSV**:

    ```csv
    feature,missing_values,min,max,mean,std,1st_percentile,2nd_percentile,3rd_percentile,type,values,distribution,target,sensitive
    age,0,0.0,4.0,1.7695369510415284,1.266784781771372,1.0,2.0,3.0,integer,"[0, 1, 2, 3, 4]","{'keys': ['0.0 - 0.4', '0.4 - 0.8', '0.8 - 1.2', '1.2 - 1.6', '1.6 - 2.0', '2.0 - 2.4', '2.4 - 2.8', '2.8 - 3.2', '3.2 - 3.6', '3.6 - 4.0'], 'values': array([ 8441,     0, 12074,     0,     0, 11472,     0,  7936,     0,
            5299])}",False,False
    workclass,0,,,,,,,,categorical,"['Federal-gov', 'Local-gov', 'Private', 'Self-emp-inc', 'Self-emp-not-inc', 'State-gov', 'Without-pay']","{'keys': ['Private', 'Self-emp-not-inc', 'Local-gov', 'State-gov', 'Self-emp-inc', 'Federal-gov', 'Without-pay', 'Never-worked'], 'values': [33307, 3796, 3100, 1946, 1646, 1406, 21, 0]}",False,False
    fnlwgt,0,13492.0,1490400.0,189734.7343107337,105639.19513422118,117388.25,178316.0,237926.0,float,,"{'keys': ['13492.0 - 161182.8', '161182.8 - 308873.6', '308873.6 - 456564.4', '456564.4 - 604255.2', '604255.2 - 751946.0', '751946.0 - 899636.8', '899636.8 - 1047327.6', '1047327.6 - 1195018.4', '1195018.4 - 1342709.2', '1342709.2 - 1490400.0'], 'values': array([18701, 20916,  4803,   604,   140,    32,    12,     7,     3,
            4])}",False,False
    education,0,,,,,,,,categorical,"['10th', '11th', '12th', '1st-4th', '5th-6th', '7th-8th', '9th', 'Assoc-acdm', 'Assoc-voc', 'Bachelors', 'Doctorate', 'HS-grad', 'Masters', 'Preschool', 'Prof-school', 'Some-college']","{'keys': ['HS-grad', 'Some-college', 'Bachelors', 'Masters', 'Assoc-voc', '11th', 'Assoc-acdm', '10th', '7th-8th', 'Others'], 'values': [14783, 9899, 7570, 2514, 1959, 1619, 1507, 1223, 823, 3325]}",False,False
    education-num,0,1.0,16.0,10.118460041572686,2.5528811950758743,9.0,10.0,13.0,integer,"[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]","{'keys': ['1.0 - 2.5', '2.5 - 4.0', '4.0 - 5.5', '5.5 - 7.0', '7.0 - 8.5', '8.5 - 10.0', '10.0 - 11.5', '11.5 - 13.0', '13.0 - 14.5', '14.5 - 16.0'], 'values': array([  294,   449,  1499,  1223,  2196, 14783, 11858,  1507, 10084,
            1329])}",False,False
    marital-status,0,,,,,,,,categorical,"['Divorced', 'Married-AF-spouse', 'Married-civ-spouse', 'Married-spouse-absent', 'Never-married', 'Separated', 'Widowed']","{'keys': ['Married-civ-spouse', 'Never-married', 'Divorced', 'Separated', 'Widowed', 'Married-spouse-absent', 'Married-AF-spouse'], 'values': [21055, 14598, 6297, 1411, 1277, 552, 32]}",False,False
    occupation,0,,,,,,,,categorical,"['Adm-clerical', 'Armed-Forces', 'Craft-repair', 'Exec-managerial', 'Farming-fishing', 'Handlers-cleaners', 'Machine-op-inspct', 'Other-service', 'Priv-house-serv', 'Prof-specialty', 'Protective-serv', 'Sales', 'Tech-support', 'Transport-moving']","{'keys': ['Craft-repair', 'Prof-specialty', 'Exec-managerial', 'Adm-clerical', 'Sales', 'Other-service', 'Machine-op-inspct', 'Transport-moving', 'Handlers-cleaners', 'Others'], 'values': [6020, 6008, 5984, 5540, 5408, 4808, 2970, 2316, 2046, 4122]}",False,False
    relationship,0,,,,,,,,categorical,"['Husband', 'Not-in-family', 'Other-relative', 'Own-child', 'Unmarried', 'Wife']","{'keys': ['Husband', 'Not-in-family', 'Own-child', 'Unmarried', 'Wife', 'Other-relative'], 'values': [18666, 11702, 6626, 4788, 2091, 1349]}",False,False
    race,0,,,,,,,,categorical,"['Amer-Indian-Eskimo', 'Asian-Pac-Islander', 'Black', 'Other', 'White']","{'keys': ['White', 'Black', 'Asian-Pac-Islander', 'Amer-Indian-Eskimo', 'Other'], 'values': [38903, 4228, 1303, 435, 353]}",False,True
    sex,0,,,,,,,,binary,"['Female', 'Male']","{'keys': ['Male', 'Female'], 'values': [30527, 14695]}",False,True
    capitalgain,0,0.0,4.0,0.20505506169563487,0.7561768730118918,0.0,0.0,0.0,integer,"[0, 1, 2, 3, 4]","{'keys': ['0.0 - 0.4', '0.4 - 0.8', '0.8 - 1.2', '1.2 - 1.6', '1.6 - 2.0', '2.0 - 2.4', '2.4 - 2.8', '2.8 - 3.2', '3.2 - 3.6', '3.6 - 4.0'], 'values': array([41432,     0,   981,     0,     0,  1221,     0,   502,     0,
            1086])}",False,False
    capitalloss,0,0.0,4.0,0.1165583123258591,0.5605390667662566,0.0,0.0,0.0,integer,"[0, 1, 2, 3, 4]","{'keys': ['0.0 - 0.4', '0.4 - 0.8', '0.8 - 1.2', '1.2 - 1.6', '1.6 - 2.0', '2.0 - 2.4', '2.4 - 2.8', '2.8 - 3.2', '3.2 - 3.6', '3.6 - 4.0'], 'values': array([43082,     0,   360,     0,     0,   723,     0,   763,     0,
            294])}",False,False
    hoursperweek,0,0.0,4.0,1.98805890938039,0.8752176175356808,2.0,2.0,2.0,integer,"[0, 1, 2, 3, 4]","{'keys': ['0.0 - 0.4', '0.4 - 0.8', '0.8 - 1.2', '1.2 - 1.6', '1.6 - 2.0', '2.0 - 2.4', '2.4 - 2.8', '2.8 - 3.2', '3.2 - 3.6', '3.6 - 4.0'], 'values': array([ 3602,     0,  5198,     0,     0, 26149,     0,  8684,     0,
            1589])}",False,False
    native-country,0,,,,,,,,categorical,"['Cambodia', 'Canada', 'China', 'Columbia', 'Cuba', 'Dominican-Republic', 'Ecuador', 'El-Salvador', 'England', 'France', 'Germany', 'Greece', 'Guatemala', 'Haiti', 'Holand-Netherlands', 'Honduras', 'Hong', 'Hungary', 'India', 'Iran', 'Ireland', 'Italy', 'Jamaica', 'Japan', 'Laos', 'Mexico', 'Nicaragua', 'Outlying-US(Guam-USVI-etc)', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto-Rico', 'Scotland', 'South', 'Taiwan', 'Thailand', 'Trinadad&Tobago', 'United-States', 'Vietnam', 'Yugoslavia']","{'keys': ['United-States', 'Mexico', 'Philippines', 'Germany', 'Puerto-Rico', 'Canada', 'El-Salvador', 'India', 'Cuba', 'Others'], 'values': [41292, 903, 283, 193, 175, 163, 147, 147, 133, 1786]}",False,False
    class,0,,,,,,,,binary,"['<=50K', '>50K']","{'keys': ['<=50K', '>50K'], 'values': [34014, 11208]}",True,False

    ```

-   `GET /projects/{project-code}/questionnaire/3`

    -   risposta:

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
                        "code": "feature1-sensitive" // da usare come ID della checkbox
                    },
                    "description": null,
                    "selected": false
                },
                {
                    "id": {
                        "code": "feature1-target"
                    },
                    "description": null,
                    "selected": false
                }
                // altri per le altre caratteristiche, 2 per ogni caratteristica
            ]
        }
        ```

Una volta selezionate le caratteristiche sensibili e di target, al clic sul pulsante "Continue":

-   `PUT /projects/{project-code}/questionnaire/3`

    -   possibile body:

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
                    "code": "class-target"
                }
            ]
        }
        ```

        Vengono inviati solo gli ID delle checkbox selezionate nel POST.

### Dependencies View:

-   `GET /projects/{project-code}/questionnaire/4`

    -   risposta:

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

-   `GET /projects/{project-code}/context?key=correlation_matrix__custom-1`

    -   risposta:

    ```json
    "{correlation matrix in formato vettoriale}"
    // ad esempio '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" stroke="black" stroke-width="3" fill="lightblue" /></svg>'
    ```

-   `GET /projects/{project-code}/context?key=dependency_graph__custom-1`

    -   risposta:

    ```json
    "{dependency graph in formato vettoriale}"
    // analogo a sopra
    ```

-   `GET /projects/{project-code}/context?key=suggested_proxies__custom-1` per pre-selezionare i proxy

    -   risposta:

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

-   l'utente seleziona di fatto le features proxy (tramite le checkbox), dopodichè cliccando su "Continue":

    1.  si riempie il contesto con le features selezionate come proxy

        `PUT /projects/{project-code}/context?key=proxies__custom-1`

        -   body:

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

        `PUT /projects/{project-code}/questionnaire/4`

        -   body, sempre così (è l'unica risposta possibile)

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

-   `GET /projects/{project-code}/questionnaire/5`

        -   risposta:

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

-   Ottengo le features dal backend per popolare gli elementi figli degli accordio con le sensitive features (quelle con sensitive: true)

    `GET /projects/{project-code}/context?key=features__custom-1`

    -   risposta:

    ```json
    {
        "age": {
            "target": false,
            "sensitive": false
        },
        "workclass": {
            "target": false,
            "sensitive": false
        },
        "fnlwgt": {
            "target": false,
            "sensitive": false
        },
        "education": {
            "target": false,
            "sensitive": false
        },
        "education-num": {
            "target": false,
            "sensitive": false
        },
        "marital-status": {
            "target": false,
            "sensitive": false
        },
        "occupation": {
            "target": false,
            "sensitive": false
        },
        "relationship": {
            "target": false,
            "sensitive": false
        },
        "race": {
            "target": false,
            "sensitive": true
        },
        "sex": {
            "target": false,
            "sensitive": true
        },
        "capitalgain": {
            "target": false,
            "sensitive": false
        },
        "capitalloss": {
            "target": false,
            "sensitive": false
        },
        "hoursperweek": {
            "target": false,
            "sensitive": false
        },
        "native-country": {
            "target": false,
            "sensitive": false
        },
        "class": {
            "target": true,
            "sensitive": false
        }
    }
    ```

-   `GET /projects/{project-code}/context?key=metrics__custom-1` per popolare la schermata corrente con i grafici (istogrammi)

    -   risposta:

    ```json
    {
        "DisparateImpact": [
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
                "value": 0.79876472674682
            },
            {
                "when": {
                    "sex": "Female",
                    "class": "<=50K"
                },
                "value": 0.8756136532154777
            },
            {
                "when": {
                    "sex": "Female",
                    "class": ">50K"
                },
                "value": 0.79876472674682
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
                "value": 0.39876472674682
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
                "value": 0.99876472674682
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
                "value": 0.79876472674682
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
                "value": 1.0476472674682
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
                "value": 0.79876472674682
            }
        ],
        "StatisticalParityDifference": [
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

-   l'utente seleziona le metriche e le features da considerare, dopodichè cliccando su "Continue":

    1.  `PUT /projects/{project-code}/context?key=detected__custom-1`

        -   body: dizionario a più livelli che identifica quale metrica, e assegnamento delle feature andare a considerare "da mitigare"

        ```json
        {
            "DisparateImpact": [
                {
                    "sensitive": "sex",
                    "target": "class"
                }
            ],
            "StatisticalParityDifference": [
                {
                    "sensitive": "sex",
                    "target": "class"
                }
            ]
        }
        ```

    2.  si seleziona la risposta alla domanda del questionario

        `PUT /projects/{project-code}/questionnaire/5`

        -   il body della request deve contenere gli ID delle risposte selezionate (in questo caso, le metriche prese in considerazione), per esempio:

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

-   `GET /projects/{project-code}/questionnaire/6`

    -   risposta:

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

-   l'utente seleziona il radio button dell'algoritmo scelto:

    -   `PUT /projects/{project-code}/questionnaire/6`

        -   body: l'ID dell'algoritmo scelto

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

-   dopodiché appare un popup o un'altra schermata per selezionare gli iperparametri:

    `GET /projects/{project-code}/context?key=preprocessing-hyperparameters__custom-1` per popolare popup/vista con gli input di un form per la selezione degli iperparametri.

    -   risposta:

    ```json
    {
        "n_prototypes": {
            "label": "Number of Prototypes",
            "description": "Size of the set of prototypes",
            "type": "integer", // input type number
            "default": 50,
            "values": [10, 200] // range di valori interi possibili (slider sul frontend)
        },
        "reconstruct_weight": {
            "label": "Reconstruct Weight",
            "description": "Weight coefficient on the reconstruct loss term",
            "type": "float", // input slider
            "default": 0.5,
            "values": [0, 1]
        },
        "fairness_weight": {
            "label": "Weight for Fairness loss",
            "description": "Weight coefficient on the fairness loss term",
            "type": "float",
            "default": 0.5,
            "values": [0, 1]
        },
        "random_state": {
            "label": "Random State",
            "description": "Seed for reproducibility",
            "type": "categorical", // input select (combobox)
            "default": 42,
            "values": [0, 1, 42, 999]
        }
    }
    ```

-   selezionati gli iperparametri tramite gli input del form, cliccando su "Select and Run":

    1.  `PUT /projects/{project-code}/context?key=preprocessing__custom-1`

        -   body: iperparametri scelti dall'utente

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

        -   `GET /projects/{project-code}/context?key=dataset__custom-2` per recuperare il dataset modificato e i risultati con cui riempire la view (in particolare `results`).

            Per ora l'id del nuovo dataset sarà incrementale (`custom-2`, `custom-3` e cosi via in caso di altri pre-processing).

            -   risposta: il dataset in formato **CSV** e i risultati del pre-processing

        -   `GET /projects/{project-code}/context?key=correlation_matrix__custom-2` (come in **Dependencies View**)

            -   risposta:

            ```json
            "{correlation matrix in formato vettoriale}"
            // ad esempio '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" stroke="black" stroke-width="3" fill="lightblue" /></svg>'
            ```

        -   `GET /projects/{project-code}/context?key=dependency_graph__custom-2` (come in **Dependencies View**)

            -   risposta:

            ```json
            "{dependency graph in formato vettoriale}"
            // analogo a sopra
            ```

        -   `GET /projects/{project-code}/context?key=stats__custom-2` per recuperare le statistiche del dataset modificato

            -   risposta in formato **CSV**, come sopra in **Data View**

        -   `GET /projects/{project-code}/context?key=metrics__custom2` per recuperare le metriche di fairness del dataset modificato
            -   risposta come sopra in **Detection View**

    3.  si passa al Summary View

### Summary View

Semplice schermata in cui si chiede se si vuole fare un nuovo pre-processing o andare avanti con in-processing.

-   `GET /projects/{project-code}/questionnaire/7`

    -   risposta:

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

-   l'utente seleziona il radio button, dopodichè cliccando su "Continue":

    1.  `PUT /projects/{project-code}/questionnaire/7`

        -   body supponendo di voler passare all'in-processing:

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

-   **Summary** conterrà una risposta in più: "Mitigate Model Again".

### Outcome Mitiagation View

Il flusso è analogo a quello di **Data Mitigation e Summary**.

-   **Summary** conterrà una risposta in più: "Mitigate Outcome Again".

## Tornare indietro nel flusso

Ogni volta che si vuole tornare alla schermata/domanda precedente, è necessario effettuare una richiesta DELETE

```
DELETE /projects/{project-code}/questionnaire/{nth}
```

dove **{nth}** è l'indice della domanda nel questionario che si vuole eliminare, per tornare alla domanda precedente.

> Se si vuole tornare indietro di più schermate (tramite la breadcrumb ad esempio), è necessario effettuare più DELETE, una per ogni schermata/domanda. Ad esempio, se si vuole passare dalla **Detection View** alla **Features View**, è necessario effettuare in ordine: `DELETE /projects/{project-code}/questionnaire/5` e `DELETE /projects/{project-code}/questionnaire/4`.
