# Production Deployment na Spaceship.rs

## 📋 Koraci za deployment

### 1. Napravi nalog na Spaceship.rs
- Idi na https://spaceship.rs
- Registruj se i kupi hosting plan (Node.js podrška)

### 2. Kreiraj Node.js aplikaciju
U kontrol panelu Spaceship:
- Web Sites → Add New Website
- Izaberi Node.js aplikaciju
- Node.js verzija: 18+ (preporučeno 20)

### 3. Poveži domen
- U DNS podešavanjima domena postavi A record na IP spaceship-a
- Ili koristi spaceship nameserver-e

### 4. Upload fajlova

#### Opcija A: Preko Git-a (preporučeno)
```bash
# Inicijalizuj git ako već nije
git init
git add .
git commit -m "Initial commit"

# Dodaj Spaceship remote (dobićeš iz panela)
git remote add spaceship user@spaceship.rs:/path/to/app
git push spaceship main
```

#### Opcija B: Preko FTP/SFTP
- Koristi FileZilla ili sličan klijent
- Host: dobiješ iz panela
- User/Pass: iz panela

### 5. Instalacija na serveru

SSH na server:
```bash
ssh user@vas-domen.rs

# Idi u folder aplikacije
cd /var/www/vas-domen.rs

# Instaliraj dependencies
npm install --production

# Build aplikacije
npm run build

# Restartuj aplikaciju
pm2 restart all
# ili
systemctl restart node-app
```

### 6. Environment Variables

Kreiraj `.env` fajl na serveru:
```env
NODE_ENV=production
PORT=3000
```

Ili podesi u Spaceship panelu.

---

## 📁 Fajlovi koje treba upload-ovati

```
✅ app/                  (sve komponente i stranice)
✅ public/               (slike, ikonice)
✅ data/                 (konfiguracioni fajlovi)
✅ package.json
✅ next.config.ts
✅ tsconfig.json
✅ tailwind.config.ts
✅ postcss.config.mjs
✅ .env                  (environment varijable)

❌ node_modules/         (NE - instalira se na serveru)
❌ .next/                (NE - pravi se build-om)
❌ .git/                 (opciono)
```

---

## 🔧 Spaceship Panel - Važna podešavanja

### Start Command:
```bash
npm start
```

### Build Command:
```bash
npm run build
```

### Port:
```
3000 (ili PORT environment varijabla)
```

---

## 🔄 Ažuriranje sajta

### Metod 1: Git push
```bash
git add .
git commit -m "Update"
git push spaceship main
ssh user@vas-domen.rs "cd /var/www/vas-domen.rs && npm run build && pm2 restart all"
```

### Metod 2: FTP upload
1. Upload novih fajlova
2. SSH na server
3. `npm run build && pm2 restart all`

### Metod 3: Menjanje samo konfiguracije
```bash
# FTP/SFTP - upload izmenjeni data/menjacnica-config.json
# Ne treba rebuild!
```

---

## 💡 Tips za Spaceship

1. **PM2** - Spaceship koristi PM2 za Node.js aplikacije
   ```bash
   pm2 logs          # vidi logove
   pm2 restart all   # restartuj aplikaciju
   pm2 status        # status
   ```

2. **SSL Certifikat** - Uključi u panelu (Let's Encrypt - besplatno)

3. **Backup** - Spaceship ima automatski backup

4. **Monitoring** - Proveri logove u panelu

---

## 🆘 Troubleshooting

### Greška: "Cannot find module"
```bash
npm install
```

### Greška: "Permission denied"
```bash
chmod -R 755 /var/www/vas-domen.rs
chown -R www-data:www-data /var/www/vas-domen.rs
```

### Greška: "Port already in use"
Proveri da li aplikacija već radi:
```bash
pm2 status
pm2 stop all
pm2 start all
```

---

## 📞 Spaceship Support

- Email: support@spaceship.rs
- Telefon: +381 11 1234 567
- Dokumentacija: https://spaceship.rs/docs
