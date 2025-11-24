# ⚡ SNELLE EMAIL FIX - Doe Dit Nu!

## 🎯 Het Probleem
Je "wachtwoord vergeten" email werkt niet omdat je SMTP instellingen ontbreken.

## ✅ Oplossing (5 minuten)

### 1️⃣ Maak `.env.local` bestand

Maak een nieuw bestand in je project hoofdmap (naast `package.json`):

**Bestandsnaam:** `.env.local`

**Inhoud:**
```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@aiportretpro.nl
SMTP_PASSWORD=JE_WACHTWOORD_HIER
EMAIL_FROM=AIPortretPro <info@aiportretpro.nl>
NEXTAUTH_URL=http://localhost:3000
```

### 2️⃣ Vind Je Hostinger Email Wachtwoord

**Weet je het wachtwoord?**
- ✅ Gebruik het direct in `.env.local`

**Weet je het wachtwoord NIET?**
1. Ga naar: https://hpanel.hostinger.com
2. Klik **Emails** → **Email Accounts**
3. Vind `info@aiportretpro.nl`
4. Klik de 3 puntjes → **Change Password**
5. Zet nieuw wachtwoord → **Save**
6. Kopieer het wachtwoord naar `.env.local`

### 3️⃣ Herstart Server

```bash
# In je terminal:
# Stop met Ctrl+C
npm run dev
```

### 4️⃣ Test Het!

Ga naar: `http://localhost:3000/api/test-smtp`

**Zie je dit?**
```json
{
  "success": true,
  "message": "SMTP configuratie is correct"
}
```

🎉 **GELUKT!** Je email werkt nu!

**Zie je errors?**
- Check of wachtwoord correct is
- Check of email adres correct is (info@aiportretpro.nl)
- Probeer port 587 in plaats van 465

---

## 🔥 Alternatief: Port 587 (als 465 niet werkt)

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@aiportretpro.nl
SMTP_PASSWORD=JE_WACHTWOORD_HIER
EMAIL_FROM=AIPortretPro <info@aiportretpro.nl>
NEXTAUTH_URL=http://localhost:3000
```

---

## 📝 Checklist

- [ ] `.env.local` gemaakt in project hoofdmap
- [ ] Email wachtwoord ingevuld (geen spaties!)
- [ ] Server herstart (Ctrl+C dan `npm run dev`)
- [ ] `/api/test-smtp` checken → moet success zijn
- [ ] "Wachtwoord vergeten" testen op login pagina

---

## ❓ Nog Steeds Problemen?

Check de terminal output voor rode errors. De meest voorkomende:

**"Invalid login"** → Verkeerd wachtwoord  
**"ETIMEDOUT"** → Probeer port 587  
**"Connection refused"** → Check firewall  

Lees de volledige guide: `EMAIL_SETUP_INSTRUCTIES.md`

