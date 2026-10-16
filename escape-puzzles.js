window.GUIDO_PUZZLES = [
  {
    "id": "1",
    "title": "La soglia della cartolina",
    "kind": "photo",
    "answer": "ARTE",
    "slot": 21,
    "letter": "A",
    "extract": "Dalla soluzione prendi la lettera in posizione 1, contando da 1. Conserva questa lettera nel sigillo 22.",
    "extractIndex": 1,
    "prompt": "La soglia è nascosta sul bordo della vecchia cartolina. Cerca la parola che annuncia l’ingresso nel paese. I quattro denti della chiave dicono in quale ordine usarne le lettere.",
    "artifact": {
      "image": "mappa/assets/01-chiesetta.png",
      "caption": "Cartolina fornita per la chiesina. La chiave sottostante è un elemento del gioco.",
      "code": "VII · IV · III · I"
    },
    "rule": "Ricava una nuova parola di quattro lettere. Scrivila nella serratura.",
    "hints": [
      "La parola da usare è stampata nella parte alta, dopo il nome del paese.",
      "La parola è ENTRATA. I numeri romani indicano posizioni, non uno spostamento alfabetico.",
      "VII=7, IV=4, III=3, I=1. Prendi quelle lettere di ENTRATA, in quell’ordine."
    ]
  },
  {
    "id": "2A",
    "title": "Lo scontrino fuori ordine",
    "kind": "ledger",
    "answer": "PROVVISTA",
    "slot": 11,
    "letter": "V",
    "extract": "Dalla soluzione prendi la lettera in posizione 4, contando da 1. Conserva questa lettera nel sigillo 12.",
    "extractIndex": 4,
    "prompt": "Guido ha mescolato le righe di un promemoria. I numeri a sinistra non sono quantità: ripristinano una sequenza. Una volta ricostruita, il margine delle righe rivela la parola.",
    "artifact": {
      "rows": [
        "03  ·  O  ·  voce del registro",
        "05  ·  V  ·  voce del registro",
        "02  ·  R  ·  voce del registro",
        "04  ·  V  ·  voce del registro",
        "07  ·  S  ·  voce del registro",
        "01  ·  P  ·  voce del registro",
        "08  ·  T  ·  voce del registro",
        "06  ·  I  ·  voce del registro",
        "09  ·  A  ·  voce del registro"
      ]
    },
    "rule": "Riordina le righe dal numero più piccolo al più grande, poi leggi le iniziali nel margine.",
    "hints": [
      "La chiave è l’ordine numerico delle righe, non quello in cui sono visualizzate.",
      "Ogni riga fornisce una sola lettera: quella isolata nel margine.",
      "La soluzione ha 9 lettere e inizia con P."
    ]
  },
  {
    "id": "2B",
    "title": "Il sigillo spostato",
    "kind": "caesar",
    "answer": "EMBLEMA",
    "slot": 26,
    "letter": "L",
    "extract": "Dalla soluzione prendi la lettera in posizione 4, contando da 1. Conserva questa lettera nel sigillo 27.",
    "extractIndex": 4,
    "prompt": "Il taccuino mostra due alfabeti che sono scivolati uno rispetto all’altro. Il segno sulla ruota indica lo scarto. La Z torna alla A.",
    "artifact": {
      "code": "LTISLTH",
      "key": "RUOTA +7  ·  ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    },
    "rule": "La scritta è stata spostata in avanti. Riporta ogni lettera indietro dello scarto indicato e inserisci il nome decifrato.",
    "hints": [
      "Non riordinare le lettere: cambiano le singole lettere, non le loro posizioni.",
      "Torna indietro di 7 posti nell’alfabeto di 26 lettere.",
      "Il primo segno L diventa E."
    ]
  },
  {
    "id": "3",
    "title": "La serratura a coordinate",
    "kind": "polybius",
    "answer": "SALISCENDI",
    "slot": 22,
    "letter": "D",
    "extract": "Dalla soluzione prendi la lettera in posizione 9, contando da 1. Conserva questa lettera nel sigillo 23.",
    "extractIndex": 9,
    "prompt": "Questa serratura legge due numeri alla volta. La prima cifra sceglie il corridoio orizzontale, la seconda il cassetto all’interno del corridoio.",
    "artifact": {
      "grid": [
        [
          "A",
          "B",
          "C",
          "D",
          "E"
        ],
        [
          "F",
          "G",
          "H",
          "I",
          "K"
        ],
        [
          "L",
          "M",
          "N",
          "O",
          "P"
        ],
        [
          "Q",
          "R",
          "S",
          "T",
          "U"
        ],
        [
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ]
      ],
      "code": "43 · 11 · 31 · 24 · 43 · 13 · 15 · 33 · 14 · 24"
    },
    "rule": "Nella griglia si conta da 1: prima la riga, poi la colonna. Ogni coppia dà una lettera.",
    "hints": [
      "Le coppie non sono numeri da sommare. Sono coordinate.",
      "Righe dall’alto verso il basso; colonne da sinistra verso destra.",
      "La prima coppia 43 indica la lettera S."
    ]
  },
  {
    "id": "3A",
    "title": "I due nastri del fornaio",
    "kind": "rail",
    "answer": "BRACE",
    "slot": 28,
    "letter": "A",
    "extract": "Dalla soluzione prendi la lettera in posizione 3, contando da 1. Conserva questa lettera nel sigillo 29.",
    "extractIndex": 3,
    "prompt": "Due strisce appartenevano alla stessa riga del taccuino. Una custodisce le posizioni dispari, l’altra quelle pari. Sovrapporle le rende illeggibili: bisogna farle parlare a turno.",
    "artifact": {
      "rows": [
        "NASTRO A  BAE",
        "NASTRO B  RC"
      ],
      "key": "A comincia. Nessun nastro parla due volte di seguito."
    },
    "rule": "Intreccia una lettera di A e una di B, fino a esaurire i nastri. Se resta una lettera, appartiene ad A.",
    "hints": [
      "Non leggere tutta la prima riga e poi tutta la seconda.",
      "Prendi A1, B1, A2, B2, A3, B3…",
      "Le prime due lettere sono BR."
    ]
  },
  {
    "id": "4",
    "title": "Il cortile delle due epoche",
    "kind": "photo-date",
    "answer": "8640",
    "slot": 6,
    "letter": "R",
    "extract": "Somma le quattro cifre del codice. Trasforma il risultato in una lettera usando A=1, B=2, …, Z=26.",
    "extractIndex": 0,
    "prompt": "Il cortile conserva una misura che attraversa le due epoche. Nella foto antica guarda l’ala a sinistra del cortile: conta gli archi grandi affiancati della loggia al piano superiore. Ritrova la stessa successione nella foto attuale.",
    "artifact": {
      "images": [
        "municipio-1973-crop.jpg",
        "municipio-oggi.jpg"
      ],
      "code": "1973 → [ − ? | − ? | − ? | − ? ]",
      "caption": "Foto usate nel confronto della webapp. Le date e il cifrario hanno funzioni diverse."
    },
    "rule": "Il numero trovato è lo scarto della serratura: sottrailo a ogni cifra di 1973, separatamente. Se vai sotto zero, riparti da 9. Inserisci le quattro nuove cifre.",
    "hints": [
      "Conta soltanto la fila di archi del piano superiore sul lato sinistro della foto storica, non tutti gli archi del cortile.",
      "Gli archi da usare sono 3: la chiave è quindi uno scarto di tre.",
      "1−3 torna a 8; 9−3 dà 6. Applica lo stesso scarto anche alle due cifre rimaste."
    ]
  },
  {
    "id": "5",
    "title": "La bilancia della dispensa",
    "kind": "pairs",
    "answer": "MACINA",
    "slot": 2,
    "letter": "M",
    "extract": "Dalla soluzione prendi la lettera in posizione 1, contando da 1. Conserva questa lettera nel sigillo 03.",
    "extractIndex": 1,
    "prompt": "La bilancia di Guido conserva solo ciò che rimane dopo aver tolto la tara. Ogni coppia rappresenta un peso lordo e ciò che va sottratto. Il peso rimasto non si misura in grammi.",
    "artifact": {
      "rows": [
        "26 − 13",
        "14 − 13",
        "7 − 4",
        "21 − 12",
        "20 − 6",
        "8 − 7"
      ],
      "key": "A=1 · B=2 · … · Z=26"
    },
    "rule": "Sottrai il secondo numero dal primo in ogni riga. Converti i risultati in lettere, nell’ordine del registro.",
    "hints": [
      "Prima fai le sottrazioni, poi usa l’alfabeto.",
      "Ogni riga produce una lettera, non una cifra del codice.",
      "La prima sottrazione dà 13, cioè M."
    ]
  },
  {
    "id": "6",
    "title": "L’ultimo registro",
    "kind": "vigenere",
    "answer": "CALAMAIO",
    "slot": 0,
    "letter": "L",
    "extract": "Dalla soluzione prendi la lettera in posizione 3, contando da 1. Conserva questa lettera nel sigillo 01.",
    "extractIndex": 3,
    "prompt": "La chiave si ripete, ma il suo passo cambia a ogni lettera. A non muove nulla, B arretra di uno, C di due. Quando finisce, la chiave ricomincia.",
    "artifact": {
      "code": "TUZTMRCC",
      "key": "CHIAVE: RUOTA  ·  A=0, B=1, …, Z=25"
    },
    "rule": "Scrivi mentalmente la chiave ripetuta sotto il codice. Per ogni posizione arretra della quantità indicata dalla lettera della chiave. L’alfabeto è circolare.",
    "hints": [
      "La prima lettera della chiave agisce solo sul primo segno del codice.",
      "Usa i valori 0–25, non 1–26. La A corrisponde a zero.",
      "Il codice comincia con T e la soluzione con C."
    ]
  },
  {
    "id": "7A",
    "title": "Il passaggio degli archi",
    "kind": "route",
    "answer": "CHIAVE",
    "slot": 14,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 6, contando da 1. Conserva questa lettera nel sigillo 15.",
    "extractIndex": 6,
    "prompt": "Il sentiero è una traccia digitale del taccuino, non un’indicazione stradale. Parti dalla casella in alto a sinistra. Ogni freccia avanza di una sola casella; anche la partenza lascia un segno.",
    "artifact": {
      "grid": [
        [
          "C",
          "H",
          "E",
          "U",
          "W"
        ],
        [
          "Q",
          "I",
          "A",
          "Q",
          "S"
        ],
        [
          "E",
          "L",
          "V",
          "E",
          "P"
        ],
        [
          "L",
          "L",
          "J",
          "U",
          "I"
        ],
        [
          "O",
          "Y",
          "H",
          "E",
          "J"
        ]
      ],
      "code": "PARTENZA ★  ·  → ↓ → ↓ →"
    },
    "rule": "Leggi la casella di partenza, poi ogni casella raggiunta. Unisci le lettere attraversate.",
    "hints": [
      "Non devi trovare la parola a vista nella griglia: segui l’ordine delle frecce.",
      "La prima lettera è quella in alto a sinistra.",
      "Le prime due lettere del percorso sono CH."
    ]
  },
  {
    "id": "7B",
    "title": "Il coro disordinato",
    "kind": "columns",
    "answer": "ARMONIA",
    "slot": 4,
    "letter": "M",
    "extract": "Dalla soluzione prendi la lettera in posizione 3, contando da 1. Conserva questa lettera nel sigillo 05.",
    "extractIndex": 3,
    "prompt": "Tre cassetti hanno perso il loro posto. I numeri romani sono ancora leggibili. Il messaggio si ricostruisce leggendo una riga per volta, da sinistra a destra.",
    "artifact": {
      "rows": [
        "III  MIX",
        "I    AOA",
        "II   RNX"
      ],
      "key": "Le X finali sono distanziatori: eliminale."
    },
    "rule": "Rimetti i cassetti nell’ordine I, II, III. Poi leggi la prima lettera di ciascuno, quindi la seconda e così via.",
    "hints": [
      "Ogni cassetto è una colonna, non una parola.",
      "Dopo I1, II1 e III1 vengono I2, II2 e III2.",
      "Le prime tre lettere sono ARM."
    ]
  },
  {
    "id": "8",
    "title": "Le impronte in fila",
    "kind": "logic",
    "answer": "SELVA",
    "slot": 30,
    "letter": "S",
    "extract": "Dalla soluzione prendi la lettera in posizione 1, contando da 1. Conserva questa lettera nel sigillo 31.",
    "extractIndex": 1,
    "prompt": "I cartigli devono essere messi in fila. Le cifre distinguono cartigli con la stessa lettera e non indicano il posto. Tutti i vincoli devono essere veri contemporaneamente.",
    "artifact": {
      "code": "A75  S84  L55  V30  E88",
      "rows": [
        "A75 chiude la fila.",
        "S84 apre la fila.",
        "S84 sta immediatamente prima di E88.",
        "L55 sta immediatamente prima di V30.",
        "E88 sta immediatamente prima di L55.",
        "V30 sta immediatamente prima di A75."
      ]
    },
    "rule": "Ricostruisci la fila dei cartigli. Alla fine elimina tutte le cifre e leggi soltanto le lettere.",
    "hints": [
      "I numeri sono etichette: non usarli per ordinare.",
      "Inizia dal cartiglio che apre la fila e cerca chi deve seguirlo.",
      "La fila comincia con SE."
    ]
  },
  {
    "id": "8B",
    "title": "Il guado digitale",
    "kind": "route",
    "answer": "SPONDA",
    "slot": 18,
    "letter": "S",
    "extract": "Dalla soluzione prendi la lettera in posizione 1, contando da 1. Conserva questa lettera nel sigillo 19.",
    "extractIndex": 1,
    "prompt": "Il sentiero è una traccia digitale del taccuino, non un’indicazione stradale. Parti dalla casella in alto a sinistra. Ogni freccia avanza di una sola casella; anche la partenza lascia un segno.",
    "artifact": {
      "grid": [
        [
          "S",
          "P",
          "K",
          "E",
          "V"
        ],
        [
          "P",
          "O",
          "N",
          "P",
          "W"
        ],
        [
          "I",
          "E",
          "D",
          "A",
          "G"
        ],
        [
          "U",
          "L",
          "O",
          "T",
          "D"
        ],
        [
          "F",
          "Q",
          "X",
          "F",
          "C"
        ]
      ],
      "code": "PARTENZA ★  ·  → ↓ → ↓ →"
    },
    "rule": "Leggi la casella di partenza, poi ogni casella raggiunta. Unisci le lettere attraversate.",
    "hints": [
      "Non devi trovare la parola a vista nella griglia: segui l’ordine delle frecce.",
      "La prima lettera è quella in alto a sinistra.",
      "Le prime due lettere del percorso sono SP."
    ]
  },
  {
    "id": "9",
    "title": "I pesi della serratura",
    "kind": "pairs",
    "answer": "FERRO",
    "slot": 12,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 2, contando da 1. Conserva questa lettera nel sigillo 13.",
    "extractIndex": 2,
    "prompt": "La bilancia di Guido conserva solo ciò che rimane dopo aver tolto la tara. Ogni coppia rappresenta un peso lordo e ciò che va sottratto. Il peso rimasto non si misura in grammi.",
    "artifact": {
      "rows": [
        "10 − 4",
        "16 − 11",
        "34 − 16",
        "23 − 5",
        "27 − 12"
      ],
      "key": "A=1 · B=2 · … · Z=26"
    },
    "rule": "Sottrai il secondo numero dal primo in ogni riga. Converti i risultati in lettere, nell’ordine del registro.",
    "hints": [
      "Prima fai le sottrazioni, poi usa l’alfabeto.",
      "Ogni riga produce una lettera, non una cifra del codice.",
      "La prima sottrazione dà 6, cioè F."
    ]
  },
  {
    "id": "10",
    "title": "Una goccia sì, una no",
    "kind": "sieve",
    "answer": "RIVA",
    "slot": 9,
    "letter": "V",
    "extract": "Dalla soluzione prendi la lettera in posizione 3, contando da 1. Conserva questa lettera nel sigillo 10.",
    "extractIndex": 3,
    "prompt": "Il flusso attraversa una grata a denti alterni. Il primo segno passa, il secondo si ferma. Poi il ritmo ricomincia. Le lettere scartate sono solo rumore del taccuino.",
    "artifact": {
      "code": "RQIZVZAQ",
      "key": "PASSA · FERMA · PASSA · FERMA…"
    },
    "rule": "Conserva i segni nelle posizioni dispari. Unisci ciò che passa attraverso la grata.",
    "hints": [
      "Non cercare una chiave alfabetica. La grata seleziona le posizioni.",
      "Tieni 1, 3, 5, 7… e scarta 2, 4, 6, 8…",
      "I primi due segni conservati sono RI."
    ]
  },
  {
    "id": "11",
    "title": "Gli appuntamenti della villa",
    "kind": "ledger",
    "answer": "TACCUINO",
    "slot": 7,
    "letter": "I",
    "extract": "Dalla soluzione prendi la lettera in posizione 6, contando da 1. Conserva questa lettera nel sigillo 08.",
    "extractIndex": 6,
    "prompt": "Guido ha mescolato le righe di un promemoria. I numeri a sinistra non sono quantità: ripristinano una sequenza. Una volta ricostruita, il margine delle righe rivela la parola.",
    "artifact": {
      "rows": [
        "05  ·  U  ·  voce del registro",
        "01  ·  T  ·  voce del registro",
        "04  ·  C  ·  voce del registro",
        "03  ·  C  ·  voce del registro",
        "08  ·  O  ·  voce del registro",
        "02  ·  A  ·  voce del registro",
        "06  ·  I  ·  voce del registro",
        "07  ·  N  ·  voce del registro"
      ]
    },
    "rule": "Riordina le righe dal numero più piccolo al più grande, poi leggi le iniziali nel margine.",
    "hints": [
      "La chiave è l’ordine numerico delle righe, non quello in cui sono visualizzate.",
      "Ogni riga fornisce una sola lettera: quella isolata nel margine.",
      "La soluzione ha 8 lettere e inizia con T."
    ]
  },
  {
    "id": "12",
    "title": "Le vie si incrociano",
    "kind": "vigenere",
    "answer": "INCROCIO",
    "slot": 5,
    "letter": "O",
    "extract": "Dalla soluzione prendi la lettera in posizione 5, contando da 1. Conserva questa lettera nel sigillo 06.",
    "extractIndex": 5,
    "prompt": "La chiave si ripete, ma il suo passo cambia a ogni lettera. A non muove nulla, B arretra di uno, C di due. Quando finisce, la chiave ricomincia.",
    "artifact": {
      "code": "ZHQKOTCC",
      "key": "CHIAVE: RUOTA  ·  A=0, B=1, …, Z=25"
    },
    "rule": "Scrivi mentalmente la chiave ripetuta sotto il codice. Per ogni posizione arretra della quantità indicata dalla lettera della chiave. L’alfabeto è circolare.",
    "hints": [
      "La prima lettera della chiave agisce solo sul primo segno del codice.",
      "Usa i valori 0–25, non 1–26. La A corrisponde a zero.",
      "Il codice comincia con Z e la soluzione con I."
    ]
  },
  {
    "id": "12B",
    "title": "Il peso che manca",
    "kind": "pairs",
    "answer": "TARA",
    "slot": 1,
    "letter": "A",
    "extract": "Dalla soluzione prendi la lettera in posizione 2, contando da 1. Conserva questa lettera nel sigillo 02.",
    "extractIndex": 2,
    "prompt": "La bilancia di Guido conserva solo ciò che rimane dopo aver tolto la tara. Ogni coppia rappresenta un peso lordo e ciò che va sottratto. Il peso rimasto non si misura in grammi.",
    "artifact": {
      "rows": [
        "31 − 11",
        "9 − 8",
        "25 − 7",
        "10 − 9"
      ],
      "key": "A=1 · B=2 · … · Z=26"
    },
    "rule": "Sottrai il secondo numero dal primo in ogni riga. Converti i risultati in lettere, nell’ordine del registro.",
    "hints": [
      "Prima fai le sottrazioni, poi usa l’alfabeto.",
      "Ogni riga produce una lettera, non una cifra del codice.",
      "La prima sottrazione dà 20, cioè T."
    ]
  },
  {
    "id": "13",
    "title": "Il nome sotto le foglie",
    "kind": "caesar",
    "answer": "GIARDINO",
    "slot": 13,
    "letter": "N",
    "extract": "Dalla soluzione prendi la lettera in posizione 7, contando da 1. Conserva questa lettera nel sigillo 14.",
    "extractIndex": 7,
    "prompt": "Il taccuino mostra due alfabeti che sono scivolati uno rispetto all’altro. Il segno sulla ruota indica lo scarto. La Z torna alla A.",
    "artifact": {
      "code": "NPHYKPUV",
      "key": "RUOTA +7  ·  ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    },
    "rule": "La scritta è stata spostata in avanti. Riporta ogni lettera indietro dello scarto indicato e inserisci il nome decifrato.",
    "hints": [
      "Non riordinare le lettere: cambiano le singole lettere, non le loro posizioni.",
      "Torna indietro di 7 posti nell’alfabeto di 26 lettere.",
      "Il primo segno N diventa G."
    ]
  },
  {
    "id": "14",
    "title": "Il sentiero sul taccuino",
    "kind": "route",
    "answer": "SENTIERO",
    "slot": 23,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 2, contando da 1. Conserva questa lettera nel sigillo 24.",
    "extractIndex": 2,
    "prompt": "Il sentiero è una traccia digitale del taccuino, non un’indicazione stradale. Parti dalla casella in alto a sinistra. Ogni freccia avanza di una sola casella; anche la partenza lascia un segno.",
    "artifact": {
      "grid": [
        [
          "S",
          "E",
          "L",
          "N",
          "C"
        ],
        [
          "E",
          "N",
          "T",
          "K",
          "D"
        ],
        [
          "G",
          "J",
          "I",
          "E",
          "P"
        ],
        [
          "W",
          "W",
          "P",
          "R",
          "O"
        ],
        [
          "A",
          "E",
          "K",
          "O",
          "M"
        ]
      ],
      "code": "PARTENZA ★  ·  → ↓ → ↓ → ↓ →"
    },
    "rule": "Leggi la casella di partenza, poi ogni casella raggiunta. Unisci le lettere attraversate.",
    "hints": [
      "Non devi trovare la parola a vista nella griglia: segui l’ordine delle frecce.",
      "La prima lettera è quella in alto a sinistra.",
      "Le prime due lettere del percorso sono SE."
    ]
  },
  {
    "id": "15",
    "title": "La ricetta a due corsie",
    "kind": "rail",
    "answer": "LIEVITO",
    "slot": 19,
    "letter": "T",
    "extract": "Dalla soluzione prendi la lettera in posizione 6, contando da 1. Conserva questa lettera nel sigillo 20.",
    "extractIndex": 6,
    "prompt": "Due strisce appartenevano alla stessa riga del taccuino. Una custodisce le posizioni dispari, l’altra quelle pari. Sovrapporle le rende illeggibili: bisogna farle parlare a turno.",
    "artifact": {
      "rows": [
        "NASTRO A  LEIO",
        "NASTRO B  IVT"
      ],
      "key": "A comincia. Nessun nastro parla due volte di seguito."
    },
    "rule": "Intreccia una lettera di A e una di B, fino a esaurire i nastri. Se resta una lettera, appartiene ad A.",
    "hints": [
      "Non leggere tutta la prima riga e poi tutta la seconda.",
      "Prendi A1, B1, A2, B2, A3, B3…",
      "Le prime due lettere sono LI."
    ]
  },
  {
    "id": "16",
    "title": "I cassetti della cascina",
    "kind": "columns",
    "answer": "FIENILE",
    "slot": 16,
    "letter": "L",
    "extract": "Dalla soluzione prendi la lettera in posizione 6, contando da 1. Conserva questa lettera nel sigillo 17.",
    "extractIndex": 6,
    "prompt": "Tre cassetti hanno perso il loro posto. I numeri romani sono ancora leggibili. Il messaggio si ricostruisce leggendo una riga per volta, da sinistra a destra.",
    "artifact": {
      "rows": [
        "III  ELX",
        "I    FNE",
        "II   IIX"
      ],
      "key": "Le X finali sono distanziatori: eliminale."
    },
    "rule": "Rimetti i cassetti nell’ordine I, II, III. Poi leggi la prima lettera di ciascuno, quindi la seconda e così via.",
    "hints": [
      "Ogni cassetto è una colonna, non una parola.",
      "Dopo I1, II1 e III1 vengono I2, II2 e III2.",
      "Le prime tre lettere sono FIE."
    ]
  },
  {
    "id": "17",
    "title": "La fila dei confini",
    "kind": "logic",
    "answer": "CONFINE",
    "slot": 3,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 7, contando da 1. Conserva questa lettera nel sigillo 04.",
    "extractIndex": 7,
    "prompt": "I cartigli devono essere messi in fila. Le cifre distinguono cartigli con la stessa lettera e non indicano il posto. Tutti i vincoli devono essere veri contemporaneamente.",
    "artifact": {
      "code": "C81  F90  O51  E96  N56  I20  N97",
      "rows": [
        "I20 sta immediatamente prima di N56.",
        "E96 chiude la fila.",
        "N97 sta immediatamente prima di F90.",
        "C81 sta immediatamente prima di O51.",
        "O51 sta immediatamente prima di N97.",
        "N56 sta immediatamente prima di E96.",
        "F90 sta immediatamente prima di I20.",
        "C81 apre la fila."
      ]
    },
    "rule": "Ricostruisci la fila dei cartigli. Alla fine elimina tutte le cifre e leggi soltanto le lettere.",
    "hints": [
      "I numeri sono etichette: non usarli per ordinare.",
      "Inizia dal cartiglio che apre la fila e cerca chi deve seguirlo.",
      "La fila comincia con CO."
    ]
  },
  {
    "id": "18",
    "title": "La tessera segreta",
    "kind": "vigenere",
    "answer": "TESSERA",
    "slot": 31,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 2, contando da 1. Conserva questa lettera nel sigillo 32.",
    "extractIndex": 2,
    "prompt": "La chiave si ripete, ma il suo passo cambia a ogni lettera. A non muove nulla, B arretra di uno, C di due. Quando finisce, la chiave ricomincia.",
    "artifact": {
      "code": "OMSNMRV",
      "key": "CHIAVE: VIA  ·  A=0, B=1, …, Z=25"
    },
    "rule": "Scrivi mentalmente la chiave ripetuta sotto il codice. Per ogni posizione arretra della quantità indicata dalla lettera della chiave. L’alfabeto è circolare.",
    "hints": [
      "La prima lettera della chiave agisce solo sul primo segno del codice.",
      "Usa i valori 0–25, non 1–26. La A corrisponde a zero.",
      "Il codice comincia con O e la soluzione con T."
    ]
  },
  {
    "id": "19",
    "title": "La ruota delle lettere",
    "kind": "caesar",
    "answer": "PEDALE",
    "slot": 27,
    "letter": "P",
    "extract": "Dalla soluzione prendi la lettera in posizione 1, contando da 1. Conserva questa lettera nel sigillo 28.",
    "extractIndex": 1,
    "prompt": "Il taccuino mostra due alfabeti che sono scivolati uno rispetto all’altro. Il segno sulla ruota indica lo scarto. La Z torna alla A.",
    "artifact": {
      "code": "WLKHSL",
      "key": "RUOTA +7  ·  ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    },
    "rule": "La scritta è stata spostata in avanti. Riporta ogni lettera indietro dello scarto indicato e inserisci il nome decifrato.",
    "hints": [
      "Non riordinare le lettere: cambiano le singole lettere, non le loro posizioni.",
      "Torna indietro di 7 posti nell’alfabeto di 26 lettere.",
      "Il primo segno W diventa P."
    ]
  },
  {
    "id": "20",
    "title": "La pesata del gioielliere",
    "kind": "pairs",
    "answer": "SIGILLO",
    "slot": 15,
    "letter": "L",
    "extract": "Dalla soluzione prendi la lettera in posizione 5, contando da 1. Conserva questa lettera nel sigillo 16.",
    "extractIndex": 5,
    "prompt": "La bilancia di Guido conserva solo ciò che rimane dopo aver tolto la tara. Ogni coppia rappresenta un peso lordo e ciò che va sottratto. Il peso rimasto non si misura in grammi.",
    "artifact": {
      "rows": [
        "33 − 14",
        "16 − 7",
        "14 − 7",
        "20 − 11",
        "23 − 11",
        "26 − 14",
        "23 − 8"
      ],
      "key": "A=1 · B=2 · … · Z=26"
    },
    "rule": "Sottrai il secondo numero dal primo in ogni riga. Converti i risultati in lettere, nell’ordine del registro.",
    "hints": [
      "Prima fai le sottrazioni, poi usa l’alfabeto.",
      "Ogni riga produce una lettera, non una cifra del codice.",
      "La prima sottrazione dà 19, cioè S."
    ]
  },
  {
    "id": "21",
    "title": "Le due sponde del bivio",
    "kind": "rail",
    "answer": "PASSAGGIO",
    "slot": 10,
    "letter": "I",
    "extract": "Dalla soluzione prendi la lettera in posizione 8, contando da 1. Conserva questa lettera nel sigillo 11.",
    "extractIndex": 8,
    "prompt": "Due strisce appartenevano alla stessa riga del taccuino. Una custodisce le posizioni dispari, l’altra quelle pari. Sovrapporle le rende illeggibili: bisogna farle parlare a turno.",
    "artifact": {
      "rows": [
        "NASTRO A  PSAGO",
        "NASTRO B  ASGI"
      ],
      "key": "A comincia. Nessun nastro parla due volte di seguito."
    },
    "rule": "Intreccia una lettera di A e una di B, fino a esaurire i nastri. Se resta una lettera, appartiene ad A.",
    "hints": [
      "Non leggere tutta la prima riga e poi tutta la seconda.",
      "Prendi A1, B1, A2, B2, A3, B3…",
      "Le prime due lettere sono PA."
    ]
  },
  {
    "id": "22",
    "title": "Il corteo da ricomporre",
    "kind": "columns",
    "answer": "CORTEO",
    "slot": 20,
    "letter": "R",
    "extract": "Dalla soluzione prendi la lettera in posizione 3, contando da 1. Conserva questa lettera nel sigillo 21.",
    "extractIndex": 3,
    "prompt": "Tre cassetti hanno perso il loro posto. I numeri romani sono ancora leggibili. Il messaggio si ricostruisce leggendo una riga per volta, da sinistra a destra.",
    "artifact": {
      "rows": [
        "III  RO",
        "I    CT",
        "II   OE"
      ],
      "key": "Le X finali sono distanziatori: eliminale."
    },
    "rule": "Rimetti i cassetti nell’ordine I, II, III. Poi leggi la prima lettera di ciascuno, quindi la seconda e così via.",
    "hints": [
      "Ogni cassetto è una colonna, non una parola.",
      "Dopo I1, II1 e III1 vengono I2, II2 e III2.",
      "Le prime tre lettere sono COR."
    ]
  },
  {
    "id": "22A",
    "title": "La fonte intermittente",
    "kind": "sieve",
    "answer": "SORGENTE",
    "slot": 25,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 5, contando da 1. Conserva questa lettera nel sigillo 26.",
    "extractIndex": 5,
    "prompt": "Il flusso attraversa una grata a denti alterni. Il primo segno passa, il secondo si ferma. Poi il ritmo ricomincia. Le lettere scartate sono solo rumore del taccuino.",
    "artifact": {
      "code": "SZOKRKGZEXNXTQEZ",
      "key": "PASSA · FERMA · PASSA · FERMA…"
    },
    "rule": "Conserva i segni nelle posizioni dispari. Unisci ciò che passa attraverso la grata.",
    "hints": [
      "Non cercare una chiave alfabetica. La grata seleziona le posizioni.",
      "Tieni 1, 3, 5, 7… e scarta 2, 4, 6, 8…",
      "I primi due segni conservati sono SO."
    ]
  },
  {
    "id": "23",
    "title": "La legge delle molle",
    "kind": "sequence",
    "answer": "MOLLE",
    "slot": 17,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 5, contando da 1. Conserva questa lettera nel sigillo 18.",
    "extractIndex": 5,
    "prompt": "Ogni molla avanza sempre dello stesso passo. Completa l’ultimo scatto di ciascuna riga. I risultati non vanno sommati tra loro: formano un messaggio.",
    "artifact": {
      "rows": [
        "7 · 9 · 11 · ?",
        "9 · 11 · 13 · ?",
        "6 · 8 · 10 · ?",
        "6 · 8 · 10 · ?",
        "-1 · 1 · 3 · ?"
      ],
      "key": "A=1 · B=2 · … · Z=26"
    },
    "rule": "Ricava il termine mancante in ciascuna progressione e trasformalo nella lettera corrispondente.",
    "hints": [
      "Confronta due termini consecutivi della stessa riga.",
      "Il passo è sempre +2.",
      "Il primo valore mancante è 13."
    ]
  },
  {
    "id": "24",
    "title": "Le scatole dei giochi",
    "kind": "logic",
    "answer": "DADO",
    "slot": 8,
    "letter": "A",
    "extract": "Dalla soluzione prendi la lettera in posizione 2, contando da 1. Conserva questa lettera nel sigillo 09.",
    "extractIndex": 2,
    "prompt": "I cartigli devono essere messi in fila. Le cifre distinguono cartigli con la stessa lettera e non indicano il posto. Tutti i vincoli devono essere veri contemporaneamente.",
    "artifact": {
      "code": "D27  A14  D21  O77",
      "rows": [
        "O77 chiude la fila.",
        "D21 sta immediatamente prima di A14.",
        "D27 sta immediatamente prima di O77.",
        "D21 apre la fila.",
        "A14 sta immediatamente prima di D27."
      ]
    },
    "rule": "Ricostruisci la fila dei cartigli. Alla fine elimina tutte le cifre e leggi soltanto le lettere.",
    "hints": [
      "I numeri sono etichette: non usarli per ordinare.",
      "Inizia dal cartiglio che apre la fila e cerca chi deve seguirlo.",
      "La fila comincia con DA."
    ]
  },
  {
    "id": "24B",
    "title": "Il registro a doppia entrata",
    "kind": "polybius",
    "answer": "NUMERATORE",
    "slot": 29,
    "letter": "E",
    "extract": "Dalla soluzione prendi la lettera in posizione 4, contando da 1. Conserva questa lettera nel sigillo 30.",
    "extractIndex": 4,
    "prompt": "Questa serratura legge due numeri alla volta. La prima cifra sceglie il corridoio orizzontale, la seconda il cassetto all’interno del corridoio.",
    "artifact": {
      "grid": [
        [
          "A",
          "B",
          "C",
          "D",
          "E"
        ],
        [
          "F",
          "G",
          "H",
          "I",
          "K"
        ],
        [
          "L",
          "M",
          "N",
          "O",
          "P"
        ],
        [
          "Q",
          "R",
          "S",
          "T",
          "U"
        ],
        [
          "V",
          "W",
          "X",
          "Y",
          "Z"
        ]
      ],
      "code": "33 · 45 · 32 · 15 · 42 · 11 · 44 · 34 · 42 · 15"
    },
    "rule": "Nella griglia si conta da 1: prima la riga, poi la colonna. Ogni coppia dà una lettera.",
    "hints": [
      "Le coppie non sono numeri da sommare. Sono coordinate.",
      "Righe dall’alto verso il basso; colonne da sinistra verso destra.",
      "La prima coppia 33 indica la lettera N."
    ]
  },
  {
    "id": "25",
    "title": "Il cognome nei cassetti",
    "kind": "columns",
    "answer": "EREDITA",
    "slot": 24,
    "letter": "D",
    "extract": "Dalla soluzione prendi la lettera in posizione 4, contando da 1. Conserva questa lettera nel sigillo 25.",
    "extractIndex": 4,
    "prompt": "Tre cassetti hanno perso il loro posto. I numeri romani sono ancora leggibili. Il messaggio si ricostruisce leggendo una riga per volta, da sinistra a destra.",
    "artifact": {
      "rows": [
        "III  ETX",
        "I    EDA",
        "II   RIX"
      ],
      "key": "Le X finali sono distanziatori: eliminale."
    },
    "rule": "Rimetti i cassetti nell’ordine I, II, III. Poi leggi la prima lettera di ciascuno, quindi la seconda e così via.",
    "hints": [
      "Ogni cassetto è una colonna, non una parola.",
      "Dopo I1, II1 e III1 vengono I2, II2 e III2.",
      "Le prime tre lettere sono ERE."
    ]
  }
];
