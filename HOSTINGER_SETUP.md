# Hostinger Email Setup voor Wachtwoord Reset

## 🎯 Waarom Hostinger SMTP gebruiken?

Je hebt al email bij Hostinger (info@aiportretpro.nl). Door de Hostinger SMTP te gebruiken:

✅ **Geen DNS wijzigingen** - je bestaande email blijft gewoon werken  
✅ **Geen conflicten** - geen SPF/DKIM problemen  
✅ **Professioneel** - emails komen van je eigen domein (@aiportretpro.nl)  
✅ **Gratis** - gebruik wat je al hebt  

---

## 📧 Hostinger SMTP Instellingen

Hostinger gebruikt deze SMTP servers:

### Voor SSL (aanbevolen):
```
SMTP Server: smtp.hostinger.com
Port: 465
Secure: SSL/TLS
```

### Voor TLS (alternatief):
```
SMTP Server: smtp.hostinger.com
Port: 587
Secure: STARTTLS
```

---

## ⚙️ Setup Stappen

### Stap 1: Vind je Hostinger email wachtwoord

Je hebt 2 opties:

#### Optie A: Bestaand email account gebruiken (info@aiportretpro.nl)

Als je het wachtwoord weet:
- Gebruik gewoon `info@aiportretpro.nl` en het wachtwoord

Als je het wachtwoord niet weet:
1. Log in op https://hpanel.hostinger.com
2. Ga naar **Emails** → **Email Accounts**
3. Zoek `info@aiportretpro.nl`
4. Klik op de 3 puntjes → **Change Password**
5. Zet een nieuw wachtwoord

#### Optie B: Nieuw email account maken (aanbevolen)

Maak een speciaal account voor app emails:

1. Log in op https://hpanel.hostinger.com
2. Ga naar **Emails** → **Email Accounts**
3. Klik **Create Email Account**
4. Maak: `noreply@aiportretpro.nl` (of `app@aiportretpro.nl`)
5. Stel een sterk wachtwoord in
6. Klik **Create**

✅ **Voordeel:** Je `info@` blijft schoon, en je kunt zien welke emails de app verstuurt

---

### Stap 2: Voeg toe aan `.env.local`

Open (of maak) je `.env.local` bestand en voeg dit toe:

```bash
# Hostinger SMTP Configuratie
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aiportretpro.nl
SMTP_PASSWORD=jouw_wachtwoord_hier
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>
```

**Let op:**
- Gebruik het **email wachtwoord** (niet je Hostinger account wachtwoord)
- Gebruik quotes als je wachtwoord spaties heeft: `SMTP_PASSWORD="mijn wachtwoord"`

---

### Stap 3: Installeer dependencies

```bash
npm install
```

---

### Stap 4: Database bijwerken

```bash
psql $DATABASE_URL -f scripts/add-password-reset-columns.sql
```

---

## 🧪 Test de configuratie

### Test 1: Controleer SMTP verbinding

Maak dit test bestand: `app/api/test-email/route.ts`

```typescript
import { testEmailConfiguration } from "@/lib/email"
import { NextResponse } from "next/server"

export async function GET() {
  const result = await testEmailConfiguration()
  return NextResponse.json(result)
}
```

Start je app en ga naar: http://localhost:3000/api/test-email

✅ Als het werkt zie je: `{"success": true, "message": "SMTP configuratie is correct"}`

### Test 2: Verstuur een test reset email

```bash
npm run dev
```

1. Ga naar http://localhost:3000/login
2. Klik "Wachtwoord vergeten?"
3. Vul je eigen email in
4. Check je inbox!

---

## 🔧 Troubleshooting

### "Invalid login: 535 Incorrect authentication data"

**Probleem:** Verkeerd wachtwoord

**Oplossing:**
1. Controleer of je het **email wachtwoord** gebruikt (niet Hostinger account wachtwoord)
2. Reset het wachtwoord via hPanel → Emails → Change Password
3. Check of je het juiste email adres gebruikt

### "Connection timeout" of "ETIMEDOUT"

**Probleem:** Firewall blokkeert SMTP poort

**Oplossing:**
- Probeer port 587 in plaats van 465:
```bash
SMTP_PORT=587
SMTP_SECURE=false
```

### "self signed certificate" error

**Probleem:** SSL certificaat verificatie faalt

**Oplossing:** Voeg dit toe aan je email transporter (in `lib/email.ts`):
```typescript
const transporter = nodemailer.createTransport({
  // ... andere settings
  tls: {
    rejectUnauthorized: false
  }
})
```

⚠️ Alleen voor development! Voor productie moet je dit niet gebruiken.

### Emails komen aan in spam

**Oplossing:**
1. Check of je SPF record correct is ingesteld (doe je via Hostinger)
2. Gebruik een bestaand email account dat al verified is
3. Stuur eerst een paar test emails naar jezelf

---

## 📊 Email limieten

Hostinger heeft sending limits per email account:

- **Shared Hosting:** ~100-150 emails per uur
- **Business Hosting:** ~200-300 emails per uur

Dit is meer dan genoeg voor wachtwoord resets!

Als je meer nodig hebt, overweeg dan:
- Meerdere email accounts maken (noreply1@, noreply2@)
- Upgraden naar business hosting
- Later overstappen naar SendGrid/Mailgun voor grote volumes

---

## 🎨 Email van/naar configuratie

### Development:
```bash
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>
```

### Production (zelfde):
```bash
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>
```

Je klanten zien:
- **Van:** AIPortretPro <noreply@aiportretpro.nl>
- **Onderwerp:** Wachtwoord reset - AIPortretPro

Professioneel! ✨

---

## ✅ Checklist

- [ ] Hostinger email account aangemaakt (noreply@aiportretpro.nl)
- [ ] SMTP credentials toegevoegd aan `.env.local`
- [ ] `npm install` uitgevoerd
- [ ] Database bijgewerkt met SQL script
- [ ] Test email endpoint gecheckt (werkt!)
- [ ] Wachtwoord reset getest via `/login` → "Wachtwoord vergeten?"
- [ ] Email ontvangen en wachtwoord succesvol gereset

---

## 🚀 Voor productie

Vergeet niet om in je productie environment (Vercel, etc.) ook de environment variables in te stellen:

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aiportretpro.nl
SMTP_PASSWORD=je_wachtwoord
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>
```

---

**Klaar!** 🎉 Je hebt nu een professionele wachtwoord reset functie met je eigen Hostinger email.


