# Production Deployment na Spaceship.com

## 📋 Pregled

Spaceship.com nudi:
- Domain registration
- Shared Hosting
- VPS Hosting
- WordPress Hosting

⚠️ **VAŽNO**: Spaceship.com shared hosting NE podržava Node.js direktno!

---

## 🎯 Opcije za deployment

### Opcija 1: VPS na Spaceship.com (PREPORUČENO)

Ako kupiš VPS na Spaceship.com:

```bash
# 1. SSH na VPS
ssh root@tvoj-ip

# 2. Instaliraj Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
# ili za Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instaliraj PM2
npm install -g pm2

# 4. Kreiraj folder za aplikaciju
mkdir -p /var/www/menjacnica
cd /var/www/menjacnica

# 5. Upload fajlove (preko SCP ili Git)
git clone https://github.com/tvoj-user/menjacnica.git .

# 6. Instaliraj i build
npm install
npm run build

# 7. Pokreni sa PM2
pm2 start npm --name "menjacnica" -- start
pm2 save
pm2 startup

# 8. Instaliraj Nginx kao reverse proxy
sudo yum install nginx  # ili apt install nginx
```

### Nginx konfiguracija:
```nginx
server {
    listen 80;
    server_name tvoj-domen.com www.tvoj-domen.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### Opcija 2: Static Export + Spaceship Shared Hosting

Ako imaš običan shared hosting:

#### 1. Eksportuj kao statički sajt

Dodaj u `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
```

#### 2. Build
```bash
npm run build
```

Ovo će kreirati `out/` folder sa statičkim fajlovima.

#### 3. Upload na hosting
- FTP/SFTP upload sadržaj `out/` foldera u `public_html/`

⚠️ **OGRANIČENJA**:
- Ne radi API (kursna lista neće da se ažurira)
- Ne radi admin panel
- Zlato widget će raditi

---

### Opcija 3: HIBRIDNO REŠENJE (NAJBOLJE)

**Frontend na Spaceship + Backend drugde**

1. **Deploy frontend na Spaceship** (static export)
2. **Backend API na**:
   - Vercel (besplatno)
   - Railway.app (besplatno do $5/mesec)
   - Render.com (besplatno)

#### Konfiguracija:

```typescript
// u page.tsx - promeni API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tvoj-api.vercel.app';

// Fetch kursne liste
const response = await fetch(`${API_URL}/api/exchange-rates`);
```

---

## 🏆 PREPORUČENO REŠENJE

### Za potpuni sajt sa svim funkcionalnostima:

| Komponenta | Gde | Cena |
|------------|-----|------|
| **Domen** | Spaceship.com | ~$10-15/god |
| **Hosting** | Vercel.com | BESPLATNO |
| **Alternative** | Railway.app | Besplatno do $5 |

### Koraci:

1. **Kupi domen na Spaceship.com**
   - npr. `menjacnica-panter.rs`

2. **Deploy na Vercel** (besplatno)
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Poveži domen**
   - U Vercel panelu: Settings → Domains → Add
   - Unesi domen
   - U Spaceship DNS dodaj CNAME record ka Vercel

4. **DNS podešavanja na Spaceship:**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 📦 Brzi Deployment na Vercel

```bash
# 1. Instaliraj Vercel CLI
npm i -g vercel

# 2. U projektu pokreni
vercel

# 3. Prati uputstva
# - Izaberi "Link to existing project" ili "Create new"
# - Sajt će biti online za ~2 minuta!

# 4. Za production deploy
vercel --prod
```

---

## 🔄 Ažuriranje sajta

### Ako koristiš Vercel:
```bash
git add .
git commit -m "Update"
git push

# Vercel automatski deploy-uje!
```

### Ako koristiš VPS:
```bash
git pull
npm run build
pm2 restart menjacnica
```

---

## 💰 Uporedi cene

| Hosting | Cena | Node.js | Brzina |
|---------|------|---------|--------|
| **Vercel** | Besplatno | ✅ | ⚡⚡⚡ |
| **Railway** | Besplatno do $5 | ✅ | ⚡⚡ |
| **Spaceship VPS** | $5-20/mes | ✅ | ⚡⚡ |
| **Spaceship Shared** | $3-10/mes | ❌ | ⚡ |

---

## ✅ Preporučujem

**ZA NAJBOLJE REZULTATE:**

```
┌─────────────────────────────────────────────┐
│  DOMEN: Spaceship.com ($12/god)             │
│  HOSTING: Vercel.com (BESPLATNO)            │
│  UKUPNO: ~$12/godine                        │
└─────────────────────────────────────────────┘
```

**Prednosti:**
- ✅ Besplatno hosting
- ✅ Globalni CDN (brzo)
- ✅ Automatski HTTPS
- ✅ Auto-deploy na git push
- ✅ Sve funkcionalnosti rade (API, Admin)

---

## 📞 Support

- Spaceship.com: https://www.spaceship.com/support/
- Vercel Docs: https://vercel.com/docs
