# 🚀 DEPLOYMENT ZA dev2.cfd

## 📋 Šta trebaš uraditi na svom računaru

### KORAK 1: Preuzmi projekat

Download-uj kompletan folder projekta ili kloniraj ga.

### KORAK 2: Otvori terminal u folderu projekta

```bash
cd /putanja/do/menjacnica-panter
```

### KORAK 3: Instaliraj dependencies

```bash
npm install
```

### KORAK 4: Deploy na Vercel

```bash
# Instaliraj Vercel CLI
npm i -g vercel

# Uloguj se (otvoriće se browser)
vercel login

# Deploy
vercel --prod
```

### KORAK 5: Dodaj domen dev2.cfd

Nakon deploy-a:

1. Idi na https://vercel.com/dashboard
2. Izaberi svoj projekat
3. Settings → Domains
4. Dodaj `dev2.cfd`
5. Dodaj `www.dev2.cfd`

### KORAK 6: Podesi DNS

U DNS podešavanjima za dev2.cfd (tamo gde si kupio domen):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## ⚡ BRŽI NAČIN (jedna komanda)

Ako već imaš Vercel nalog i instaliran CLI:

```bash
npx vercel --prod
```

---

## 🌐 Predloženi naziv projekta

```
menjacnica-panter
```

Dobićeš URL:
- Privremeni: `https://menjacnica-panter.vercel.app`
- Tvoj domen: `https://dev2.cfd`

---

## ✅ Checklist

- [ ] Download projekta
- [ ] `npm install`
- [ ] `vercel login`
- [ ] `vercel --prod`
- [ ] Dodaj domen u Vercel panelu
- [ ] Podesi DNS zapise
- [ ] Sačekaj DNS propagaciju (do 48h, obično 5-10 min)

---

## 🔗 Korisni linkovi

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- DNS Provera: https://dnschecker.org

---

## 💡 Tip

Ako domen dev2.cfd nije na Spaceship-u, proveri kod drugih registrar-a
gde si ga kupio (Namecheap, GoDaddy, Cloudflare, itd.)
