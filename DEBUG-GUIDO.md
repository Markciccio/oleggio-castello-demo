# Debug Guido · 30 settembre 2026

Prove eseguite in Edge tramite Playwright con fotocamera simulata; nessuna prova su smartphone fisico.

| Scenario | Prima | Dopo |
|---|---:|---:|
| Ripresa ferma | 0 px spostamento | 0 px spostamento |
| Movimento lento (errore massimo) | 4,74 px | 4,58 px |
| Occlusione del riferimento (errore massimo su scena ferma) | 105,49 px | 0 px, Guido nascosto durante la perdita |

Il tracker accettava porzioni poco riconoscibili e cercava corrispondenze su tutto il fotogramma. Ora richiede contrasto sufficiente e tre conferme per riagganciare; senza stima spaziale limita la ricerca al punto precedente. Una parete uniforme viene rifiutata.

La modalità Guido AR con cartello usa direttamente la posa dell'immagine riconosciuta da MindAR, con Guido figlio dell'entità del riferimento. Nella ripresa simulata con prospettiva e posizione variabili: 29 cambi di posa su 30 campioni, personaggio AR visibile, sovrapposizione 2D nascosta, nessun errore della pagina. Screenshot: work/marker-ar-debug.png. Risultati grezzi: work/debug-anchor-before.json, work/debug-anchor-final.json e work/debug-marker-result.json.

Il cartello deve rimanere visibile. Un riferimento d'immagine non ricostruisce la stanza né crea un'ancora permanente fuori campo.
