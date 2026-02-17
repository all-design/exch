# MENJAČNICA - FINALNA VERZIJA
# ==============================
# SEO/AEO/GEO Optimizovano + Različite boje za valute
# ==============================

## FAJLOVI KOJE MOŽETE MENJATI:

### 1. config.json - Svi podaci sajta
   - Osnovni podaci (naziv, slogan, licenca)
   - Logo (slika ILI tekst)
   - Kontakt podaci
   - Radno vreme
   - Kursevi (marže, valute)
   - SEO meta tagovi
   - Open Graph i Twitter kartice
   - GEO lokacija
   - Recenzije
   - Usluge
   - FAQ pitanja za AEO

### 2. favicon.ico - Ikona sajta
   - Zamijenite sa vašom ikonom
   - Preporučena veličina: 48x48 ili 32x32 piksela

### 3. logo.png - Logo slika (ako koristite sliku)
   - U config.json postavite: "tip": "slika"
   - Ako logo.png ne postoji, prikazaće se tekst

### 4. og-image.png - Slika za deljenje na društvenim mrežama
   - Preporučena veličina: 1200x630 piksela

---

## 🎨 BOJE ZA VALUTE (automatski):

Svaka valuta ima SVOJU BOJU:

| Valuta | Boja          | Opis              |
|--------|---------------|-------------------|
| EUR    | 🔵 Plava      | Evro              |
| USD    | 🟢 Zelena     | Američki dolar    |
| CHF    | 🔴 Crvena     | Švajcarski franak |
| GBP    | 🟣 Ljubičasta | Britanska funta   |
| AUD    | 🟡 Žuta       | Australski dolar  |
| CAD    | 🟠 Narandžasta| Kanadski dolar    |
| SEK    | 🔵 Cian       | Švedska kruna     |
| NOK    | 🔵 Indigo     | Norveška kruna    |
| DKK    | 💗 Roz        | Danska kruna      |
| HUF    | 🟤 Amber      | Mađarska forinta  |
| TRY    | 🌹 Rose       | Turska lira       |
| RUB    | 🔵 Sky        | Ruska rublja      |
| BAM    | 💚 Emerald    | Konvertibilna marka|

---

## KAKO PROMENITI LOGO:

### Opcija A: Logo kao SLIKA
1. Postavite vaš logo.png u isti folder kao index.html
2. U config.json postavite:
   "logo": {
     "tip": "slika",
     "slikaUrl": "/logo.png",
     "tekst": "PANTER"
   }

### Opcija B: Logo kao TEKST
1. U config.json postavite:
   "logo": {
     "tip": "tekst",
     "slikaUrl": "/logo.png",
     "tekst": "VAŠ TEKST"
   }

---

## 🔍 SEO/AEO/GEO OPTIMIZACIJA UKLJUČENA:

✅ SEO - Meta tagovi, title, description, keywords, canonical URL
✅ AEO - FAQ Schema.org za Google Assistant, Siri, ChatGPT
✅ GEO - Geo lokacija, area served, Google Maps
✅ Open Graph - Slike i opisi za Facebook, WhatsApp, LinkedIn
✅ Twitter Cards - Optimalni prikaz na Twitter/X
✅ Schema.org - LocalBusiness, CurrencyExchange, FAQPage, Review

---

## 📂 STRUKTURA FAJLOVA:

```
demo/
├── index.html          # Glavna stranica
├── config.json         # ← IZMENJUJTE OVAJ FAJL!
├── favicon.ico         # ← VAŠA IKONA
├── logo.png            # ← VAŠ LOGO (opciono)
├── og-image.png        # ← SLIKA ZA DRUŠTVENE MREŽE
├── robots.txt          # Instrukcije za pretraživače
├── site.webmanifest    # PWA manifest
├── README.txt          # Ovo uputstvo
└── _next/              # CSS i JS fajlovi (ne menjati)
```

---

## NAPOMENA:
- Nakon izmene config.json, samo osvežite stranicu
- Nema potrebe za rebuild-om sajta!
- Boje valuta se automatski dodeljuju

---

© 2025 Menjačnica Panter. Sva prava zadržana.
