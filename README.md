# Incontra Guido

INCONTRA GUIDO · OLEGGIO CASTELLO

Apri: https://markciccio.github.io/oleggio-castello-demo/?v=scene-flow-3

La home ha una sola azione: Incontra Guido. Il tocco apre direttamente la fotocamera. Consenti la fotocamera e, se richiesto, il movimento del telefono. Inquadra un oggetto con dettagli visibili: la demo sceglie un punto vicino al centro e Guido inizia il racconto automaticamente.

L'aggancio segue più dettagli dello sfondo con optical flow a più risoluzioni. Un consenso robusto stima traslazione, rotazione e scala della scena. Guido può uscire dall'inquadratura. L'orientamento alpha/beta/gamma viene convertito in assi della fotocamera e usato per prevedere il movimento e stimare la direzione quando la ripresa perde i dettagli. Tornando verso il punto iniziale, la ripresa corregge la stima. Le superfici uniformi richiedono di inquadrare un altro dettaglio.

Questa è una demo visiva basata su tracking dell'immagine e orientamento. Non riconosce semanticamente una sedia, non ricostruisce la stanza in 3D e non garantisce una posizione permanente durante spostamenti complessi del telefono. Se l'orientamento è negato o assente resta l'aggancio visivo. Le altre schermate e il cartello sono stati rimossi dal percorso della demo.

Prove del 30 settembre 2026: Edge con fotocamera simulata. Camera ferma: 0 pixel di deriva. Movimento lento: errore massimo 0,84 pixel. Occlusione parziale: 0 pixel di deriva. Uscita e ritorno: verificati; provati anche rotazione con orientamento, voce automatica, chiusura dei flussi e riapertura. Nessun errore della pagina. La validazione in una sala con uno smartphone reale resta da fare.

File essenziali: index.html, guido-demo.css, guido-demo.js, room-anchor.js, guido-cantastorie.png, guido-narration.mp3. Nessuna app da installare.

Controllo del rumore dei sensori: su scena ferma, la prova con orientamento rumoroso oscillava di 7,75 px prima della correzione e 0 px dopo. I sensori predicono il movimento quando la ripresa conferma uno spostamento, o quando il riferimento esce dal campo; non muovono una scena visivamente ferma.

Risposta alle rotazioni: predizione sensori al 100%, filtro rapido durante il movimento e calibrazione della focale più veloce. Prova simulata con rotazione di 20 gradi: spostamento equivalente di Guido 19,76 gradi, errore finale al ritorno 0,07 pixel. Il rumore dei sensori su scena ferma resta a 0 pixel. Nessuna prova fisica su smartphone.
