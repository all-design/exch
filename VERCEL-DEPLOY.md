# 🚀 VERCEL DEPLOYMENT - KORAK PO KORAK

## 📦 Šta trebaš imati:
- GitHub nalog (besplatan)
- Vercel nalog (besplatan - možeš se registrovati sa GitHub-om)

---

## 1️⃣ PREUZMI PROJEKAT

### Opcija A: Download ZIP
1. Kompletan projekat je spreman u folderu `/home/z/my-project`
2. Download-uj ga kao ZIP

### Opcija B: Kopiraj fajlove
Svi potrebni fajlovi su u projektu.

---

## 2️⃣ KREIRAJ GITHUB REPOZITORIJUM

1. Idi na https://github.com/new
2. Ime: `menjacnica-panter`
3. Klikni "Create repository"
4. Upload-uj sve fajlove iz projekta

```bash
# Ako koristiš git lokalno:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TVOJ-USER/menjacnica-panter.git
git push -u origin main
```

---

## 3️⃣ DEPLOY NA VERCEL

### Metod 1: Preko Vercel website (NAJLAKŠE)

1. Idi na https://vercel.com
2. Klikni "Sign Up" → Izaberi "Continue with GitHub"
3. Nakon registracije, klikni "Add New..." → "Project"
4. Izaberi svoj GitHub repo `menjacnica-panter`
5. Klikni "Deploy"
6. Sačekaj ~2 minuta
7. **GOTOVO!** 🎉

Dobićeš URL kao: `https://menjacnica-panter.vercel.app`

### Metod 2: Preko CLI-a

```bash
# Instaliraj Vercel CLI
npm i -g vercel

# U folderu projekta pokreni
vercel

# Prati uputstva (izaberi "Link to existing project" ili "Create new")
# Na kraju za production:
vercel --prod
```

---

## 4️⃣ POVEŽI DOMEN (opciono)

Ako imaš domen sa Spaceship.com:

### U Vercel panelu:
1. Settings → Domains
2. Unesi domen: `menjacnica-panter.rs`
3. Kopiraj DNS podatke

### U Spaceship DNS:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 5️⃣ AŽURIRANJE SAJTA

Svaki put kada uradiš `git push` na GitHub:
- Vercel automatski deploy-uje novu verziju
- Sajt se ažurira za ~1 minut

```bash
git add .
git commit -m "Ažuriranje"
git push
```

---

## 🎯 BRZI DEPLOY (bez GitHub-a)

Ako ne želiš GitHub, možeš direktno:

```bash
# U folderu projekta
npm i -g vercel
vercel

# Loguj se (izaći će prozor u browseru)
# Izaberi ime projekta
# Klikni Deploy
# Gotovo!
```

---

## 📱 REZULTAT

Nakon deploy-a imaš:
- ✅ Sajt na `https://menjacnica-panter.vercel.app`
- ✅ Besplatan HTTPS (SSL)
- ✅ Globalni CDN (brzo učitavanje)
- ✅ Auto-deploy na svaki push
- ✅ Admin panel na `/admin`
- ✅ Live kursna lista
- ✅ Gold tracker widget

---

## 💰 CENA

- Vercel: **BESPLATNO** za ovaj tip sajta
- Domen (opciono): ~$12-20/god na Spaceship

**UKUPNO: $0 - $20 godišnje** 🎉
