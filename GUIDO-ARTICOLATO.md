# Guido articolato, versione 2

La miniatura originale della home resta invariata. Nei racconti, nel gioco scuola e nella fotocamera Guido usa ora un personaggio articolato in canvas: busto e piedi fermi, testa e braccia indipendenti, mani intercambiabili. Dodici gesti interpolati, saluto con oscillazione del polso, battito delle palpebre e apertura della bocca in risposta al livello della voce Giuseppe. Non si tratta di sincronizzazione fonetica. Rispetta la preferenza di movimento ridotto.

Il misuratore audio viene condiviso tra racconti e fotocamera, con un unico collegamento all'uscita audio. Il tracking esterno della fotocamera resta invariato.

## Asset e metodo

Generazione immagini integrata, usando come riferimenti il Guido approvato a sei pose e guido-cantastorie.png. Due atlanti trasparenti 1536×1024: guido-rig-parti-v2-clean.png e guido-rig-mani-v2-clean.png. Il renderer usa rettangoli sorgente indicati in guido-rig-bounds.json; non sono stati ritoccati i pixel con script. I precedenti atlanti restano conservati localmente in assets.

Istruzioni di generazione: mantenere identità del volto, ricci scuri e grigi, cappotto scuro con fodera bordeaux, foulard e libro. Atlante regolare 3×2 con parti isolate: busto senza testa/braccia, testa, manica destra, avambraccio destro, manica sinistra, avambraccio sinistro. Secondo atlante 3×2 di mani isolate: palmo aperto, indice alzato, mano rilassata, per ciascun lato. Polso sotto, dita sopra; nessun testo o decorazione; sfondo trasparente. Passaggio aggiuntivo di pulizia dello sfondo con lo stesso generatore, preservando geometria e dettagli.

La griglia a sei pose precedente resta disponibile come ripiego se gli atlanti non si caricano. La nuova figura non inclina il busto e mantiene i piedi sulla stessa linea.

## Verifica locale

Controllati tutti i dodici gesti e sette gesti durante la riproduzione reale; variazione della bocca misurata sul segnale audio, chiusura a voce ferma, nessun errore JavaScript. Verificati racconto su telefono 390×844 senza overflow, passaggio al gioco, audio condiviso nella fotocamera simulata e preferenza movimento ridotto. La fotocamera reale sul telefono resta da verificare sul dispositivo.
