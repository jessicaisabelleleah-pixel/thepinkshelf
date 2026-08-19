# ThePinkShelf

Sito che mostra automaticamente le offerte pubblicate nel canale Telegram
**@thepinkshelf_offerte**. Quando pubblichi un post nel canale con un link
Amazon, un bot lo intercetta e lo salva; il sito lo mostra entro 30 secondi.
Nessun login richiesto, nessun costo: tutto sui piani gratuiti di Supabase e Vercel.

---

## Come funziona (in breve)

```
Tu pubblichi nel canale Telegram
        │
        ▼
Telegram invia il messaggio al bot (webhook)
        │
        ▼
/api/telegram-webhook estrae link Amazon, titolo, prezzo, immagine
        │
        ▼
Salvataggio su Supabase (database + immagini)
        │
        ▼
Il sito li mostra automaticamente
```

Serve seguire 4 passaggi, una volta sola. Ci vogliono circa 20-30 minuti.

---

## 1. Crea il bot Telegram

1. Apri Telegram, cerca **@BotFather** e scrivi `/newbot`.
2. Dagli un nome (es. "ThePinkShelf Sync") e uno username che finisca in `bot`
   (es. `thepinkshelf_sync_bot`).
3. BotFather ti darà un **token** tipo `123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
   Tienilo da parte, ti servirà come `TELEGRAM_BOT_TOKEN`.
4. Vai nel canale **@thepinkshelf_offerte** → Amministratori → Aggiungi
   amministratore → cerca il bot appena creato e aggiungilo. Non servono
   permessi speciali, basta che sia amministratore: così riceve i post che pubblichi.

---

## 2. Crea il database su Supabase (gratuito)

1. Vai su [supabase.com](https://supabase.com) → crea un account → **New project**.
2. Una volta creato il progetto, vai su **SQL Editor** → **New query**,
   incolla tutto il contenuto del file `supabase/schema.sql` di questo
   progetto e premi **Run**. Questo crea la tabella dei prodotti e il bucket
   pubblico per le immagini.
3. Vai su **Project Settings → API** e copia questi tre valori:
   - **Project URL** → sarà `SUPABASE_URL`
   - **anon public key** → sarà `SUPABASE_ANON_KEY`
   - **service_role key** → sarà `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ questa è segreta, non va mai mostrata nel sito, solo nel backend)

---

## 3. Pubblica il sito su Vercel (gratuito)

1. Crea un repository su GitHub e carica tutti i file di questo progetto.
2. Vai su [vercel.com](https://vercel.com) → **Add New Project** → importa il repository.
3. Prima di premere "Deploy", apri **Environment Variables** e aggiungi:

   | Nome | Valore |
   |---|---|
   | `SUPABASE_URL` | quello copiato al passo 2 |
   | `SUPABASE_ANON_KEY` | quello copiato al passo 2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | quello copiato al passo 2 |
   | `TELEGRAM_BOT_TOKEN` | quello copiato al passo 1 |
   | `TELEGRAM_WEBHOOK_SECRET` | inventane una tu, una stringa lunga a caso (es. `pinkshelf-8f2k1m9x...`) |

4. Premi **Deploy**. Al termine avrai un indirizzo tipo
   `https://thepinkshelf.vercel.app`.

---

## 4. Collega Telegram al sito (un solo comando)

Ora devi dire a Telegram di mandare i post del canale al tuo sito. Apri un
terminale (va bene anche il Prompt dei comandi/PowerShell su Windows) e
lancia questo comando, sostituendo `<TELEGRAM_BOT_TOKEN>`, `<tuo-sito>` e
`<TELEGRAM_WEBHOOK_SECRET>` con i tuoi valori reali:

```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://<tuo-sito>.vercel.app/api/telegram-webhook",
    "secret_token": "<TELEGRAM_WEBHOOK_SECRET>"
  }'
```

Se risponde `{"ok":true,"result":true,...}` sei collegato.

**Prova subito:** pubblica un messaggio nel canale con una foto, una
descrizione e un link Amazon (o amzn.to). Dopo pochi secondi ricarica il
sito: l'offerta deve comparire da sola, raggruppata sotto "Oggi".

---

## Sviluppo in locale (facoltativo)

Se vuoi modificare il sito prima di pubblicarlo:

```bash
npm install
cp .env.local.example .env.local   # poi compila i valori
npm run dev
```

Il sito sarà su `http://localhost:3000`. Nota: il webhook Telegram
funziona solo su un indirizzo pubblico (Vercel), non su localhost.

---

## Cosa riconosce automaticamente il bot

Da ogni post nel canale, il bot estrae:

- **Link Amazon** (amazon.it, amazon.com, amzn.to, ecc.) — se un post non
  contiene nessun link Amazon, viene ignorato e non compare sul sito.
- **Titolo** — la prima riga di testo del messaggio.
- **Prezzo** — se scrivi un importo con il simbolo € nel testo (es. "24,99 €"),
  viene mostrato come etichetta sulla foto del prodotto.
- **Immagine** — la foto allegata al post, se presente.
- **Descrizione** — il resto del testo del messaggio.

Per risultati migliori, scrivi i post così:

```
Cuffie Bluetooth XYZ
Ottime per lo sport, autonomia 20 ore, cancellazione rumore.
29,99 €
https://amzn.to/xxxxxxx
```

(con una foto allegata al messaggio)

---

## Limiti da conoscere

- Il piano gratuito di Vercel e Supabase sono ampiamente sufficienti per
  questo tipo di sito, ma hanno limiti mensili di traffico/storage — se il
  sito cresce molto in futuro, si può passare a un piano a pagamento senza
  cambiare nulla nel codice.
- I messaggi **modificati** su Telegram dopo la pubblicazione vengono
  aggiornati anche sul sito; i messaggi **cancellati** restano invece sul
  sito (rimuoverli in automatico richiederebbe un passaggio in più, si può
  aggiungere in seguito).
- Il footer include la dicitura richiesta dal programma Amazon Affiliazione
  ("In qualità di Affiliato Amazon…") — è un obbligo del programma, non toglierla.
