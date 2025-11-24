# Wachtwoord Reset Functionaliteit - Setup Instructies

De "wachtwoord vergeten" functionaliteit is succesvol toegevoegd aan je applicatie! 🎉

## 📋 Wat is er toegevoegd?

### 1. Database wijzigingen
- **Script**: `scripts/add-password-reset-columns.sql`
- Voegt `reset_token` en `reset_token_expires` kolommen toe aan de users tabel

### 2. API Endpoints
- **POST** `/api/auth/forgot-password` - Genereer reset token en verstuur email
- **POST** `/api/auth/reset-password` - Verifieer token en update wachtwoord

### 3. UI Pagina's
- `/forgot-password` - Pagina om email in te voeren voor reset
- `/reset-password` - Pagina om nieuw wachtwoord in te stellen
- Login pagina heeft nu een "Wachtwoord vergeten?" link

### 4. Email functionaliteit
- **Bestand**: `lib/email.ts`
- Mooie HTML email templates in Nederlands
- Gebruikt nodemailer (al geïnstalleerd in je project)

## 🚀 Setup Stappen

### Stap 1: Database Update
Voer het SQL script uit om de benodigde kolommen toe te voegen:

```bash
# Als je direct toegang hebt tot je database:
psql $DATABASE_URL -f scripts/add-password-reset-columns.sql

# Of via een database client (TablePlus, pgAdmin, etc.):
# Open scripts/add-password-reset-columns.sql en voer de queries uit
```

### Stap 2: Resend Setup

1. **Maak een gratis Resend account:**
   - Ga naar https://resend.com/signup
   - Maak een account aan (gratis tier: 100 emails/dag, 3000/maand)

2. **Genereer een API key:**
   - Ga naar https://resend.com/api-keys
   - Klik "Create API Key"
   - Kies een naam (bijv. "AIPortretPro Production")
   - Kopieer de API key (deze zie je maar 1x!)

3. **Voeg toe aan je `.env.local`:**

```bash
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=AIPortretPro <onboarding@resend.dev>
```

#### Voor development (gebruiken van resend.dev domein)
Tijdens development kun je emails sturen vanaf `onboarding@resend.dev`:

```bash
EMAIL_FROM=AIPortretPro <onboarding@resend.dev>
```

⚠️ **Let op:** Emails vanaf `onboarding@resend.dev` worden alleen verstuurd naar het email adres dat je bij Resend hebt geregistreerd.

#### Voor production (je eigen domein)

1. **Voeg je domein toe in Resend:**
   - Ga naar https://resend.com/domains
   - Klik "Add Domain"
   - Voer `aiportretpro.nl` in

2. **Verifieer je domein:**
   - Voeg de DNS records toe die Resend geeft (SPF, DKIM, DMARC)
   - Wacht op verificatie (kan 24-48 uur duren)

3. **Update je `.env.local`:**

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=AIPortretPro <noreply@aiportretpro.nl>
```

Nu kunnen klanten emails ontvangen vanaf `noreply@aiportretpro.nl` 🎉

### Stap 3: Test de functionaliteit

1. Start je development server:
```bash
npm run dev
```

2. Ga naar http://localhost:3000/login

3. Klik op "Wachtwoord vergeten?"

4. Vul een bestaand email adres in

5. Check je inbox voor de reset email

6. Klik op de link en stel een nieuw wachtwoord in

## 🔒 Beveiligingsfeatures

De implementatie bevat verschillende beveiligingsmaatregelen:

- **Veilige tokens**: 32-byte random tokens via crypto module
- **Token expiratie**: Tokens zijn 1 uur geldig
- **Rate limiting bescherming**: Altijd dezelfde response (ook als email niet bestaat)
- **Timing attack preventie**: Artificial delay bij niet-bestaande emails
- **Bcrypt hashing**: Wachtwoorden worden veilig gehasht (12 salt rounds)
- **Token cleanup**: Verlopen tokens worden automatisch verwijderd bij gebruik

## 📧 Email Template

De reset email bevat:
- Professionele opmaak met je branding
- Duidelijke call-to-action button
- Plaintext alternatief (voor oude email clients)
- Waarschuwing over 1 uur expiratie
- Nederlands taalgebruik

## 🎨 UI/UX Features

- **Moderne UI**: Gebruikt je bestaande design system (shadcn/ui)
- **Loading states**: Duidelijke feedback tijdens API calls
- **Error handling**: Gebruiksvriendelijke foutmeldingen
- **Success states**: Bevestigingen met checkmarks
- **Responsive**: Werkt perfect op mobile en desktop
- **Nederlands**: Alle teksten in het Nederlands

## 🧪 Troubleshooting

### Email wordt niet verzonden

1. **Check environment variabelen**:
```bash
# In je terminal:
node -e "console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD)"
```

2. **Test email configuratie**:
Voeg deze route toe om je email config te testen:

```typescript
// app/api/test-email/route.ts
import { testEmailConfiguration } from "@/lib/email"

export async function GET() {
  const result = await testEmailConfiguration()
  return Response.json(result)
}
```

Bezoek: http://localhost:3000/api/test-email

3. **Check firewall/security**:
- Sommige ISPs blokkeren SMTP port 587
- Probeer port 465 met `secure: true` in de transporter config

### Token niet gevonden

- Check of het SQL script correct is uitgevoerd
- Verifieer dat de kolommen bestaan:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('reset_token', 'reset_token_expires');
```

## 🚀 Production Checklist

Voor deployment naar productie:

- [ ] Database migrations uitgevoerd
- [ ] EMAIL_* environment variabelen ingesteld in productie
- [ ] NEXTAUTH_URL ingesteld op je productie domain
- [ ] Email provider account (SendGrid/Mailgun aanbevolen voor production)
- [ ] Test de volledige flow in productie
- [ ] Monitoring ingesteld voor failed emails
- [ ] Rate limiting overwegen (om spam te voorkomen)

## 📱 User Flow

1. Gebruiker klikt "Wachtwoord vergeten?" op login pagina
2. Vult email adres in
3. Ontvangt email met reset link (geldig 1 uur)
4. Klikt op link in email
5. Komt op reset pagina met token in URL
6. Voert nieuw wachtwoord in (2x voor verificatie)
7. Wachtwoord wordt geupdate
8. Automatisch doorgestuurd naar login
9. Kan inloggen met nieuwe wachtwoord

## 💡 Toekomstige verbeteringen (optioneel)

- Rate limiting per IP (om brute force te voorkomen)
- Email verificatie bij signup
- 2-factor authenticatie
- Password strength meter
- Audit log voor wachtwoord wijzigingen
- "Recent login van nieuw apparaat" notificaties

## ❓ Vragen?

Als je vragen hebt of problemen ondervindt, check de volgende bestanden:
- `lib/email.ts` - Email configuratie en templates
- `app/api/auth/forgot-password/route.ts` - Token generatie
- `app/api/auth/reset-password/route.ts` - Wachtwoord reset logica

---

**Veel succes met je wachtwoord reset functionaliteit!** 🎉

