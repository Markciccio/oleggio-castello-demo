# Debug della scena Guido · 30 settembre 2026

Prove riproducibili: `node work/debug-scene.mjs final`. Edge, 390×844, ripresa generata con Canvas e MediaStream; non è una prova su telefono fisico. Risultati: `work/debug-scene-final.json`. Screenshot: `work/guido-scene-camera.png`.

| Scenario | Risultato |
|---|---|
| Scena ferma | 0 px di deriva |
| Pan lento di 38 px | errore massimo 0,84 px |
| Occlusione parziale del riferimento iniziale | 0 px di deriva |
| Uscita e ritorno | 13 campioni fuori campo, rientro sul punto originario |
| Rotazione con orientamento simulato | 29 campioni fuori campo; tracking visivo recuperato al ritorno |
| Parete uniforme | riferimento rifiutato, Guido resta nascosto |
| Voce | parte automaticamente dopo l'aggancio |
| Chiusura e riapertura | flusso chiuso e nuova scena inizializzata |
| Errori della pagina | nessuno |

Il tracker segue fino a 32 punti con optical flow Lucas-Kanade su tre risoluzioni e controllo avanti/indietro. La trasformazione della scena usa un consenso robusto. La posizione può muoversi oltre il viewport. L'orientamento a tre assi proietta una direzione di riferimento nella camera corrente, anche durante la perdita della ripresa. L'angolo di campo è stimato usando il movimento visivo.

Limiti: piano illustrato e tracking visivo approssimato, senza ricostruzione 3D. Parallasse, superfici prive di dettagli e movimenti rapidi possono far perdere l'aggancio. Nel test con rotazione rapida compare un ritardo transitorio: la stima non è una misura precisa della posizione nel mondo. La prova nella sala su smartphone resta da fare.
