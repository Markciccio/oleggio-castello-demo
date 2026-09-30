# Oleggio Castello — demo del municipio

Una tappa dimostrativa completa: apertura da QR, incontro con Guido, confronto fotografico 1973/oggi, racconto, enigma e indizio salvato sul dispositivo. Il riferimento storico è una fotografia di una pagina fornita per la proposta; la didascalia riporta l'anno 1973. L'allineamento dei due punti di vista è regolabile.

Il sito include una vista comparativa che funziona anche senza fotocamera. Il pulsante nella tappa apre `demo-ar-municipio.html`. La modalità principale «Guido nella sala» avvia subito la camera, sceglie automaticamente un dettaglio vicino al centro e mostra Guido in quel punto. «Fissa di nuovo» sceglie un nuovo dettaglio; si può anche toccare un punto nella ripresa. Il racconto usa `guido-narration.mp3`, con sintesi vocale del browser come riserva. Il pulsante separato «Confronto AR della facciata» usa MindAR: quando riconosce il cortile, sovrappone la fotografia del 1973. Per aggiungere tappe si espande l'oggetto `STATIONS` in `index.html`; ogni QR può indicare una tappa tramite `?tappa=ID`.

`room-anchor.js` segue una piccola porzione dell'immagine e, quando disponibili, usa i sensori di orientamento per aiutare la stabilità e indicare la direzione quando il dettaglio esce dall'inquadratura. È un effetto visivo dimostrativo: non identifica oggetti, non crea un'ancora 3D permanente e può perdere il punto su superfici uniformi o con movimenti rapidi.

Questa è una prova per la proposta al Comune, da calibrare sul posto. Guido è un personaggio illustrato su piano 2D.

Stabilità: Guido non dondola durante l’ascolto. La posizione viene aggiornata da un unico filtro che ignora piccole vibrazioni; i sensori aiutano la ricerca del dettaglio senza spostare separatamente il personaggio. La porzione di immagine iniziale resta il riferimento durante il tracking.
