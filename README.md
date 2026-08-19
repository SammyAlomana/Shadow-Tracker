# Shadow Tracker — v2 (PWA)

App che ti dice **dove metterti per stare all'ombra nelle prossime ore**.
Tutti i calcoli solari (algoritmo NOAA) girano sul telefono: **nessun server, nessuna API a pagamento, funziona offline**.

## Contenuto
- `index.html` — l'app completa
- `manifest.webmanifest` — dati di installazione (nome, icone, avvio a schermo intero)
- `sw.js` — service worker: mette in cache l'app per l'uso offline
- `icon-192.png`, `icon-512.png` — icone

## Come provarla subito
Il service worker e la geolocalizzazione richiedono **https** oppure **localhost**.

    cd shadow-tracker
    python3 -m http.server 8000
    # apri http://localhost:8000

Per usarla dal telefono pubblicala su un hosting statico gratuito: GitHub Pages,
Netlify o Vercel (trascina la cartella). Poi apri il link dal telefono:
- **Android/Chrome**: menu ⋮ → *Installa app*
- **iPhone/Safari**: Condividi → *Aggiungi alla schermata Home*

Da lì in poi si apre a schermo intero come un'app normale, anche senza rete.

## Vista satellitare Google
1. Vai su Google Cloud Console → crea un progetto → abilita **Maps JavaScript API**.
2. Crea una chiave API e **limitala** al dominio dove pubblichi l'app (HTTP referrer).
3. Nell'app: ⚙ → incolla la chiave → Salva.

Senza chiave o senza rete l'app passa automaticamente alla **mappa schematica**
(griglia con nord in alto): ombre, orari e consigli restano identici.
Le tile Google **non** vengono messe in cache, come richiesto dai termini d'uso.

## Dagli store (passo successivo)
La stessa cartella si impacchetta con Capacitor senza riscrivere nulla:

    npm i -D @capacitor/cli && npx cap init "Shadow Tracker" com.tuonome.shadowtracker
    npx cap add android && npx cap add ios
    npx cap copy && npx cap open android

Servono un account Google Play (25$ una tantum) e Apple Developer (99$/anno).

## Come funziona il calcolo
- Posizione del sole: azimut ed elevazione con l'algoritmo NOAA, precisione ~0,1°.
- Ombra: lunghezza = altezza / tan(elevazione), proiettata nella direzione opposta al sole.
- Alberi e ombrelloni → ombra a capsula; muri ed edifici → involucro convesso della base traslata.
- Punto migliore: griglia da 1 m entro 30 m da te, campionata ogni 15 minuti nella finestra
  scelta; vince la frazione d'ombra più alta, a parità il punto più vicino.
