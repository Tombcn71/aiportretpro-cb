# 📧 Email Werkt Niet - Oplossing

## Wat is het probleem?

De "wachtwoord vergeten" email functie werkt niet omdat je SMTP instellingen nog niet zijn ingesteld in je `.env.local` bestand.

## ✅ Snelle Oplossing in 3 Stappen

### Stap 1: Maak `.env.local` bestand aan

Maak een nieuw bestand aan in de hoofdmap van je project: `.env.local`

### Stap 2: Vind je Hostinger Email Gegevens

**Optie A: Gebruik je bestaande info@aiportretpro.nl**

1. Ga naar https://hpanel.hostinger.com
2. Log in met je Hostinger account
3. Ga naar **Emails** → **Email Accounts**
4. Vind `info@aiportretpro.nl`
5. Als je het wachtwoord niet weet:
   - Klik op de 3 puntjes naast het account
   - Klik **Change Password**
   - Stel een nieuw wachtwoord in en sla het op

**Optie B: Maak een nieuw account (aanbevolen)**

1. Ga naar https://hpanel.hostinger.com
2. Ga naar **Emails** → **Email Accounts**
3. Klik **Create Email Account**
4. Maak: `noreply@aiportretpro.nl`
5. Stel een sterk wachtwoord in
6. Klik **Create**

### Stap 3: Voeg toe aan `.env.local`

Open je `.env.local` bestand en voeg dit toe:

```bash
# HOSTINGER SMTP CONFIGURATIE
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aiportretpro.nl
SMTP_PASSWORD=jouw-wachtwoord-hier
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>

# NextAuth URL (voor development)
NEXTAUTH_URL=http://localhost:3000
```

**Vervang:**
- `noreply@aiportretpro.nl` → Je Hostinger email adres
- `jouw-wachtwoord-hier` → Je Hostinger email wachtwoord

### Stap 4: Herstart je Development Server

```bash
# Stop de server (Ctrl+C)
# Start opnieuw
npm run dev
```

---

## 🧪 Test of Email Werkt

### Test 1: Check SMTP Configuratie

Ga naar: `http://localhost:3000/api/test-smtp`

✅ **Succes:** Je ziet `"success": true` en alle config items zijn groen  
❌ **Fout:** Je ziet errors of rode kruisjes bij de config

### Test 2: Test Wachtwoord Vergeten

1. Ga naar `http://localhost:3000/login`
2. Klik op "Wachtwoord vergeten?"
3. Vul je email adres in
4. Check je inbox voor de reset email

---

## ❌ Veelvoorkomende Problemen

### Probleem 1: "Invalid login" of "Authentication failed"

**Oorzaak:** Verkeerd wachtwoord of gebruikersnaam

**Oplossing:**
1. Check of je email adres correct is (bijv. `noreply@aiportretpro.nl`)
2. Check of je wachtwoord correct is (geen spaties aan het begin/eind)
3. Reset je email wachtwoord in Hostinger
4. Gebruik het email wachtwoord (niet je Hostinger account wachtwoord!)

### Probleem 2: "Connection timeout" of "ETIMEDOUT"

**Oorzaak:** Verkeerde SMTP instellingen of firewall

**Oplossing:**
- Check of `SMTP_HOST=smtp.hostinger.com`
- Check of `SMTP_PORT=465`
- Check of `SMTP_SECURE=true`
- Probeer alternatieve instellingen:
  ```bash
  SMTP_PORT=587
  SMTP_SECURE=false
  ```

### Probleem 3: Environment variables niet geladen

**Oorzaak:** `.env.local` niet gevonden of server niet herstart

**Oplossing:**
1. Check of `.env.local` in de hoofdmap staat (naast `package.json`)
2. Herstart je development server:
   ```bash
   # Stop met Ctrl+C
   npm run dev
   ```

### Probleem 4: Email komt niet aan

**Oorzaak:** Email in spam of verkeerde "van" adres

**Oplossing:**
1. Check je spam folder
2. Check of `EMAIL_FROM` correct is ingesteld
3. Gebruik een verified email adres (bijv. info@ of noreply@)
4. Stuur eerst een test email naar jezelf

---

## 🔍 Debug Checklist

Voer deze checks uit in volgorde:

- [ ] `.env.local` bestand bestaat in hoofdmap
- [ ] Alle SMTP variabelen zijn ingevuld (geen placeholders)
- [ ] Email wachtwoord is correct (probeer opnieuw in te loggen via webmail)
- [ ] Development server is herstart na `.env.local` wijzigingen
- [ ] `/api/test-smtp` geeft success terug
- [ ] Firewall blokkeert geen SMTP verkeer (port 465 of 587)
- [ ] Test met simpel email adres eerst (bijv. je eigen Gmail)

---

## 💡 Alternatief: Port 587 gebruiken (TLS)

Als port 465 niet werkt, probeer dan port 587:

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@aiportretpro.nl
SMTP_PASSWORD=jouw-wachtwoord-hier
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>
```

---

## 🚀 Voor Productie (Vercel/Hostinger)

Vergeet niet dezelfde environment variables toe te voegen aan je productie omgeving:

### Vercel:
1. Ga naar je project settings
2. Ga naar **Environment Variables**
3. Voeg alle SMTP_ en EMAIL_ variabelen toe

### Hostinger:
1. Upload je project
2. Voeg environment variables toe via .env bestand

---

## 📞 Hulp Nodig?

Als je na het volgen van deze stappen nog steeds problemen hebt:

1. Check de console output in je terminal
2. Kijk naar de browser console (F12) voor errors
3. Test `/api/test-smtp` en deel de output
4. Check of je Hostinger email werkt via webmail: https://webmail.hostinger.com

---

## ✨ Success!

Als alles werkt zie je:
- ✅ `/api/test-smtp` geeft success
- ✅ Console toont groene checkmarks voor SMTP config
- ✅ "Wachtwoord vergeten" stuurt emails
- ✅ Emails komen aan binnen 1 minuut
- ✅ Reset link werkt en opent correct

