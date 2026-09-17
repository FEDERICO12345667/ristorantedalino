# Ristorante Da Lino — sito web

Sito statico (HTML/CSS/JS puro, nessun framework, nessuna dipendenza npm in produzione) per il Ristorante Da Lino, Fara Vicentino (VI).

**🟢 Online**: [https://ristorantedalino.it](https://ristorantedalino.it) — HTTPS attivo, `www.ristorantedalino.it` reindirizza automaticamente al dominio principale.

Questo file è il punto di partenza per qualsiasi modifica futura: descrive struttura, design system, contenuti, deploy e tutto il lavoro fatto finora.

---

## Struttura del progetto

```
da-lino/
├── index.html              pagina principale (tutte le sezioni)
├── 404.html                pagina errore, stesso stile del sito
├── privacy.html            informativa privacy (GDPR, Google Maps incluso, titolare)
├── CNAME                   dominio personalizzato per GitHub Pages (ristorantedalino.it)
├── robots.txt              per i crawler
├── sitemap.xml             mappa del sito (2 URL: home + privacy)
├── llms.txt                descrizione sintetica per crawler LLM
├── css/style.css           tutti gli stili (281 righe)
├── js/script.js            tutta la logica JS (58 righe)
├── images/                 foto del ristorante (vedi images/README.md)
└── README.md               questo file
```

Backup completo pre-audit tecnico: `../da-lino-backup-20260909-234259/` (cartella sorella, fuori da `da-lino/`).

## Come vederlo in locale

```bash
npx serve da-lino
```

oppure doppio click su `index.html` (funziona anche da file, ma alcune cose come le mappe/font potrebbero comportarsi diversamente rispetto a un vero server).

---

## Design system

Tutto definito in `:root` all'inizio di `css/style.css`:

| Variabile | Valore | Uso |
|---|---|---|
| `--black` | `#100e0b` | sfondo principale (scuro) |
| `--panel` | `#18150f` | sfondo pannelli (menù, box) |
| `--ivory` | `#f4efe2` | testo chiaro principale |
| `--ivory-dim` | `rgba(244,239,226,0.68)` | testo secondario su sfondo scuro |
| `--ink` / `--ink-dim` | `#181410` / dim | testo su sfondo chiaro (sezione Storia) |
| `--gold` / `--gold-light` | `#b6924f` / `#d8bc82` | accenti, bottoni, titoli |

**Font**: Cormorant Garamond (titoli, corsivo per accenti) + Jost (corpo testo, bottoni, label). Caricati da Google Fonts con `preconnect`.

**Componenti riutilizzabili** (classi da riusare per qualsiasi nuova sezione, non inventarne di nuove):
- `.btn` — bottone con bordo oro, riempimento oro all'hover
- `.eyebrow` — etichetta piccola maiuscola oro sopra i titoli
- `.rule` / `.rule.center` — lineetta oro decorativa
- `.section-head` / `.section-head.center` — intestazione di sezione (eyebrow + h2 + rule + paragrafo)
- `.wrap` — contenitore centrato max 1120px
- `.reveal` — animazione fade-in-up allo scroll (gestita da IntersectionObserver in script.js)
- `.toggle-btn` + `.toggle-panel` — pattern a tab riusato sia nel Menù (Il Menù/Le Pizze) sia in Spazi (Terrazza/Sale/Pizzeria); vedi sotto
- `.special-block` — griglia foto+testo a 2 colonne (stesso ritmo di `.story-block`/`.space-panel`), usata in Specialità

---

## Contenuti del sito (index.html)

1. **Hero** — nome, tagline, sfondo foto (`images/hero-bg.jpg`), due CTA (Chiama / Il Menù)
2. **#storia** — narrativa a blocchi alternati foto/testo (5 blocchi, dal 1955 a oggi), foto reali della famiglia. Solo il **primo blocco** (1955) è visibile di default; subito dopo c'è il bottone **"Scopri tutta la storia"**, che lo sostituisce con il resto dei blocchi (1966–oggi) e mostra in fondo **"Mostra meno"** per richiudere (torna su con scroll automatico). Vedi sotto per il funzionamento.
3. **#menu** — toggle **Il Menù / Le Pizze**:
   - Il Menù: Antipasto, Primi Piatti, Secondi Piatti, Contorni (prezzi reali)
     - Secondi: include **Polenta e baccalà** (18 €); rimossi "Roast-beef all'inglese" e "Tonnato"
     - Contorni: una sola voce, **"Contorni di stagione misti"** (3,50-4 €), al posto dell'elenco dei singoli contorni
   - Le Pizze: 39 pizze A–Z con ingredienti, prezzo, allergeni
4. **#terrazza** (nav dice "Spazi") — toggle **Terrazza / Sale / Pizzeria**, griglia di foto reali + testo descrittivo (Terrazza e Pizzeria: 3 foto ciascuna; Sale: 4 foto)
5. **#specialita** — blocco foto+testo a 2 colonne: **Spiedo** (foto reale `images/spiedo.jpg`, testo "su prenotazione", nessun prezzo, bottone "Prenota" con `tel:`)
6. **#contatti** — indirizzo, telefono, orari settimana completa (Lun–Dom, Mercoledì chiuso), mappa Google **a consenso** (vedi sotto)

### Come funziona il pattern toggle (menù e spazi)
In `js/script.js`, un unico handler generico gestisce entrambi i gruppi: ogni `.toggle-btn` ha `data-target="panel-xxx"`; al click, nasconde/mostra i `.toggle-panel` dentro la stessa `<section>` (scoping tramite `btn.closest('section')`, così i due gruppi non si influenzano a vicenda) e sincronizza `aria-selected`. Per aggiungere un nuovo pannello a un gruppo esistente: aggiungere un bottone con `role="tab"` + `aria-controls` + un pannello con `role="tabpanel"` + `id` corrispondente — il JS è già generico e non va toccato.

### Come funziona "Scopri tutta la storia" / "Mostra meno"
Due bottoni distinti (non un toggle unico): `#story-toggle-btn` (dentro `#story-toggle-open`, subito dopo il primo blocco) e `#story-toggle-close-btn` (in fondo a `#story-more`, il contenitore `hidden` con i blocchi 2–5). Al click su "Scopri": si nasconde `#story-toggle-open` e si mostra `#story-more`. Al click su "Mostra meno": si richiude `#story-more`, si rimostra `#story-toggle-open` e si fa scroll automatico (`scrollIntoView`) fino al bottone di apertura. Logica in `js/script.js`.

### Mappa Google — caricamento a consenso (click-to-load)
La mappa **non si carica automaticamente**. Mostra un box con spiegazione + bottone "Carica la mappa"; solo al click, `script.js` crea l'`<iframe>` reale (stesso `src`/filtro grafico di prima). Motivo: trasparenza GDPR, spiegato in dettaglio in `privacy.html`. Se si cambia l'indirizzo del ristorante, aggiornare `data-map-src` sul div `#map-embed` in `index.html`.

---

## Lavoro fatto in questa sessione (production audit)

Il sito era già completo (contenuti, foto, design); in questa sessione è stato fatto un **audit tecnico di produzione** — nessun redesign, solo correzioni tecniche, verificate una per una nel browser prima/dopo per garantire zero impatto visivo.

### SEO
- `<meta name="description">`, `<link rel="canonical">`, Open Graph completo, Twitter Card
- **JSON-LD `Restaurant`** in `index.html` con dati reali (indirizzo, telefono, orari, immagine, `sameAs` → Facebook). Nessun dato inventato (niente rating/recensioni/prezzi fittizi)
- Favicon SVG minimale (monogramma "L" oro su nero, **non** un logo ufficiale — solo un'icona tecnica per la tab del browser)
- `robots.txt`, `sitemap.xml`, `llms.txt`
- Corretta gerarchia titoli: `h4→h3` per i gruppi del menù (fix con `line-height`/`letter-spacing` espliciti per restare pixel-identico all'originale, verificato via computed style)
- Aggiunto `<main>` semantico

### Accessibilità
- Focus state (stesso stile oro di `.btn`) esteso a link di navigazione, logo, menu mobile
- Pattern ARIA tabs completo sui due gruppi toggle (`role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`)
- `type="button"` sul bottone menu mobile

### Performance
- `loading="lazy"` su tutte le immagini below-the-fold (16 attualmente, dopo le modifiche successive; verificato via network log che si scaricano solo quando serve)
- Rimossi 2 blocchi CSS morti (`.btn-dark`, `.placeholder-label`, residui di versioni precedenti)
- *Nota*: era stata provata una variante mobile dello sfondo hero per risparmiare banda, ma si è scoperto che il browser scarica comunque entrambe le immagini con quel metodo (CSS background + media query) — **annullata**, si è tornati a un solo `hero-bg.jpg` (426 KB, già ottimizzato da 5+ MB originali)

### Legal
- `privacy.html` — informativa completa: titolare, natura del sito (nessuna raccolta dati propria), clausola dettagliata GDPR su Google Maps (Google Ireland Limited: quali dati, base giuridica, trasferimento extra-UE, link alle policy ufficiali), aggiornata per riflettere il caricamento a consenso della mappa
- `404.html` — pagina errore nello stesso stile del sito

### File nuovi creati oggi
`robots.txt`, `sitemap.xml`, `llms.txt`, `404.html`, `privacy.html`, `images/favicon.svg`

---

## Modifiche successive all'audit (contenuti e nuove sezioni)

Dopo l'audit tecnico, sono state fatte modifiche di contenuto ed è stata aggiunta una nuova sezione, su richiesta diretta:

- **Menù — Secondi Piatti**: rimossi "Roast-beef all'inglese" e "Tonnato", aggiunta **Polenta e baccalà** (18 €)
- **Menù — Contorni**: sostituito l'elenco dei singoli contorni con un'unica voce, **"Contorni di stagione misti"** (3,50-4 €)
- **#storia più corta**: aggiunto un pattern espandi/richiudi (bottoni **"Scopri tutta la storia"** / **"Mostra meno"**) per mostrare di default solo il primo blocco (1955) e tenere la pagina più corta, mantenendo tutto il resto del contenuto raggiungibile con un click (vedi sezione dedicata sopra)
- **Nuova sezione #specialita**: "Spiedo", inserita tra Spazi e Contatti (con link in nav). Contiene:
  - **Spiedo**: foto reale (`images/spiedo.jpg`, ricavata da una foto fornita e ottimizzata a 1200×540), testo "disponibile solo su prenotazione" (**nessun prezzo**, su indicazione esplicita), bottone "Prenota" (`tel:+390445873241`)
  - Prima versione: intitolata "Spiedo e menù del giorno", conteneva anche un blocco **Menù fisso** (Lun–Ven a pranzo, 15 €). Passata prima da foto a piena larghezza + blocco separato (giudicata troppo "staccata" dal resto della pagina, con una riga vuota poco curata) a un blocco unico a 2 colonne (foto + testo) con "Menù fisso" integrato come riga compatta. **Il Menù fisso è stato poi rimosso del tutto** su richiesta: ora la sezione contiene solo lo Spiedo, titolo h2 semplificato in "Spiedo" (rimosso anche l'h3 "Spiedo" interno, ridondante col titolo di sezione). CSS morto rimosso: `.special-fixed`, `.special-price`, `.special-text h3`

### Spazi — Pizzeria e Terrazza: rimossa una foto ciascuna
Rimosse `spazi-pizzeria-3.jpg` dal pannello Pizzeria e `spazi-terrazza-4.jpg` dal pannello Terrazza (ora 3 foto invece di 4 in entrambi; i file immagine restano in `images/` ma non sono più referenziati). Con 3 foto nella griglia 2 colonne restava uno spazio vuoto in basso a destra: aggiunta una regola CSS generica (`.space-photo-group .space-photo:last-child:nth-child(3){grid-column:1/-1;}`) che fa occupare tutta la larghezza all'ultima foto solo quando le foto in un pannello sono esattamente 3 — si applica automaticamente a qualsiasi pannello con 3 foto (già verificata su entrambi), non tocca il pannello Sale che ne ha 4.

### Fix bug mobile — menù (`css/style.css`)
Due problemi di layout visibili solo su schermi stretti (sotto 720px), corretti senza toccare l'aspetto su desktop:
- **Nomi lunghi tagliati fuori schermo**: `.menu-item .name` aveva `white-space:nowrap` fisso, pensato per allineare il nome alla lineetta puntinata. Su mobile, un nome lungo senza prezzo (es. "Tagliere di affettati misti e formaggio con sottaceti") non aveva nulla contro cui restringersi e usciva dallo schermo. Ora, solo sotto i 720px, il nome può andare a capo su più righe (`white-space:normal`) e la lineetta puntinata (`.leader`) si nasconde (`display:none`) perché non avrebbe più senso visivo con il testo su più righe.
- **Prezzo spezzato tra numero e simbolo** (es. "12" e "€" su due righe separate, voce "Mezze lune ai porcini con burro e salvia"): `.menu-item .price` non impediva l'andare a capo dentro il prezzo stesso. Aggiunto `white-space:nowrap` (stavolta globale, non solo mobile) + `flex-shrink:0` così "12 €" resta sempre insieme.

### Storia — testo rivisto (12/09–14/09)
Il cliente ha fornito una versione rivista del testo della sezione "La Storia", con correzioni e un riordino cronologico:
- "Ostaria da Turateo" → **"Ostaria da Turatea"**; "Leva di Montecchio Precalcino" → **"Levà di Montecchio Precalcino"**
- Il paragrafo del ritorno a San Pietro in Gu è stato **spostato prima** dell'opportunità della Trattoria Valdastico (che ha più senso narrativo) e la data corretta da **1972 a 1962**
- "locale grande" → "locale capiente"; "vende la trattoria della stazione" → "vende la trattoria a Levà"

### Contatti — aggiunto numero di cellulare
In `#contatti`, nuova riga **"Cellulare: 366 4147665"** subito dopo "Telefono" (i pulsanti "Chiama", collegati al fisso, non sono stati toccati).

---

## Deploy, hosting e dominio

### Stato attuale (online)
- **Sito**: [https://ristorantedalino.it](https://ristorantedalino.it) — hosting **GitHub Pages**, HTTPS attivo (certificato automatico GitHub), `www` reindirizza (301) al dominio principale
- **Codice sorgente**: repository GitHub [FEDERICO12345667/ristorantedalino](https://github.com/FEDERICO12345667/ristorantedalino), branch `main`
- **Deploy automatico**: ogni `git push` su `main` pubblica la nuova versione in automatico (nessun passaggio manuale)
- **DNS**: gestito da **Aruba** (nameserver Aruba di default — `dns.technorail.com`, `dns2.technorail.com`, `dns3.arubadns.net`, `dns4.arubadns.cz`), con questi record aggiunti nel pannello "Gestione DNS":
  - 4 record **A**, host `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (IP ufficiali GitHub Pages)
  - 1 record **CNAME**, host `www` → `federico12345667.github.io`
  - 1 record **TXT**, host `@` → `google-site-verification=...` (verifica proprietà Google Search Console)
- File **`CNAME`** nella root del repo (contenuto: `ristorantedalino.it`) dice a GitHub Pages quale dominio servire

### Perché non è su Cloudflare (tentativo precedente, abbandonato)
Prima tentativo: Cloudflare Workers (con deploy automatico da GitHub) + cambio nameserver del dominio verso Cloudflare. Il sito su Cloudflare funzionava perfettamente (era raggiungibile su un indirizzo `.workers.dev`), ma il dominio `.it` non si è mai attivato:
- Il registro **.it (Nic.it)** ha rifiutato la richiesta di cambio nameserver inoltrata da Aruba, con errore ufficiale (verificato con lo strumento `dns-check.nic.it`): i nameserver assegnati da Cloudflare (`ignat.ns.cloudflare.com`, `olivia.ns.cloudflare.com`) rispondevano **`REFUSED`** alle query SOA/NS/MX — cioè si rifiutavano di rispondere come autorevoli per la zona
- Causa: la zona Cloudflare restava in stato `pending` (mai attivata) perché — secondo Cloudflare stessa — i propri nameserver **non servono una zona come autorevole finché il registro non ha già completato la delega verso di loro**. Ma il registro, per completare la delega, testa prima che i nuovi nameserver rispondano correttamente: un vero e proprio cane che si morde la coda, non risolvibile senza intervento di Cloudflare (mai ottenuto, nemmeno dopo aver fornito le prove tecniche dell'errore)
- I nameserver sono stati **ripristinati su quelli di Aruba** (rollback) dopo il rifiuto del registro
- **Scelta finale**: passare a GitHub Pages, che non richiede alcun cambio di delega/nameserver — bastano i record A/CNAME diretti sul pannello DNS di Aruba (già elencati sopra), aggirando completamente il problema
- URL Cloudflare Worker (non più in uso come sito principale, lasciato attivo come backup): `ristorantedalino.faravicentino.workers.dev`

### Google Search Console
Proprietà `ristorantedalino.it` verificata tramite record TXT su Aruba; indicizzazione della home richiesta manualmente (strumento "Controllo URL" → "Richiedi indicizzazione") per sostituire più in fretta il vecchio risultato di ricerca (che mostrava ancora la pagina di parcheggio Aruba, indicizzata prima che il sito fosse online).

---

## Cosa resta da fare

**Fatto (non più bloccante):**
1. ~~Registrare il dominio~~ → `ristorantedalino.it` registrato su Aruba e online
2. ~~Scegliere hosting e pubblicare~~ → GitHub Pages, HTTPS attivo
3. ~~Far rivedere `privacy.html`~~ → titolare e ragione sociale aggiunti; **resta comunque da far confermare il testo a un professionista legale** prima di considerarlo definitivo al 100%
4. ~~Inviare il sito a Google Search Console~~ → proprietà verificata, indicizzazione richiesta

**Da fare:**
5. Configurare `404.html` come pagina di errore personalizzata (GitHub Pages la usa automaticamente se si chiama `404.html` nella root — da verificare che sia effettivamente servita su un URL inesistente)
6. Controllare a distanza di qualche giorno che il risultato su Google mostri titolo/descrizione corretti (non più "Senza titolo")

**Facoltativo:**
7. Instagram/altri social da aggiungere al JSON-LD (`sameAs`) se in futuro apriranno un profilo — al momento c'è solo Facebook
8. Un vero logo, se mai verrà creato, può sostituire il favicon monogramma
9. Cookie Policy/Termini e condizioni: non necessari ora (nessun form, nessun e-commerce/prenotazioni) — da valutare solo se si aggiungono queste funzionalità in futuro

---

## Dati reali usati nel sito (per riferimento rapido)

- **Indirizzo**: Via Sant'Antonio 3, 36030 Fara Vicentino (VI)
- **Telefono**: 0445873241
- **Cellulare**: 366 4147665
- **Orari**: Lun 09–15/17–00 · Mar 09–15 · Mer chiuso · Gio–Sab 09–15/17–00 · Dom 09–15/18–00
- **Facebook**: https://www.facebook.com/p/Ristorante-pizzeria-Da-Lino-100041686732372/
- **Dominio**: [ristorantedalino.it](https://ristorantedalino.it) — online
- **Titolare / ragione sociale** (in `privacy.html`): Mariagrazia Turatello, Trattoria Pizzeria Da Lino di Turatello Mariagrazia & C. SNC
- **Spiedo**: su prenotazione, nessun prezzo pubblicato
