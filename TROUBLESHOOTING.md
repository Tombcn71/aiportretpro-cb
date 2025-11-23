# 🔧 Troubleshooting Guide - AI Portret Pro

## Voor Support: Hoe te Debuggen

### 1. Check User Status
Als een klant problemen heeft, vraag om hun email en check:

```bash
# In browser console (als ingelogd):
fetch('/api/debug/user-status')
  .then(r => r.json())
  .then(console.log)
```

Dit toont:
- ✅ User ID en email
- 💳 Credits balance
- 🛒 Purchase history
- 📸 Projects met status

### 2. Check Specifiek Project
Als een project niet werkt, check met project ID:

```bash
# In browser console:
fetch('/api/debug/check-project/[PROJECT_ID]')
  .then(r => r.json())
  .then(console.log)
```

Dit toont:
- 📊 Project status (training/processing/completed/failed)
- 🎨 Astria tune_id (moet aanwezig zijn!)
- 📸 Aantal foto's
- 🔔 Webhook logs
- 🌐 Astria API status

### 3. Veelvoorkomende Problemen

#### ❌ "Gebruiker blijft op login scherm na registratie"
**Oorzaak**: Auto-login na signup werkte niet  
**Fix**: ✅ OPGELOST in commit `bffcc93`  
**Test**: Registreer nieuw account → moet direct inloggen

#### ❌ "Foto's worden niet gegenereerd"
**Mogelijke oorzaken**:

1. **Session verlopen**
   - Check: Logs tonen "NO SESSION FOUND"
   - Fix: User moet opnieuw inloggen
   - Preventie: Session timeout verhogen in `lib/auth.ts`

2. **User niet gevonden in database**
   - Check: Logs tonen "USER NOT FOUND"
   - Fix: User moet opnieuw registreren
   - Debug: Check `/api/debug/user-status`

3. **Astria API failure**
   - Check: Logs tonen "ASTRIA GENERATION FAILED"
   - Check: Project heeft geen `tune_id` in database
   - Fix: Check Astria API key in env vars
   - Debug: Check `/api/debug/check-project/[ID]`

4. **Missing tune_id**
   - Check: `SELECT tune_id FROM projects WHERE id = X` → NULL
   - Oorzaak: Astria API call faalde maar project werd wel aangemaakt
   - Fix: ✅ OPGELOST - tune_id wordt nu correct opgeslagen

#### ❌ "Blauwe balk springt op, dan error"
**Oorzaak**: Astria API call faalt tijdens project creation  
**Check**: 
```sql
SELECT id, status, tune_id, prediction_id, created_at 
FROM projects 
WHERE user_id = [USER_ID] 
ORDER BY created_at DESC;
```

Als `tune_id` NULL is → Astria API faalde  
Als `status` = 'failed' → Check Vercel logs voor details

**Fix**: Check Astria API key, webhook URL, en account credits

### 4. Vercel Logs Checken

Ga naar Vercel dashboard → Logs en zoek naar:

```
[TIMESTAMP] 🚀 Creating new project with Astria...
[TIMESTAMP] 🔐 Session check: {...}
[TIMESTAMP] 📦 Project data received: {...}
[TIMESTAMP] ✅ Found user: ...
[TIMESTAMP] 📝 Creating project in database...
[TIMESTAMP] ✅ Created project: ...
[TIMESTAMP] 🎨 Starting Astria generation...
[TIMESTAMP] ✅ Astria generation started successfully: {...}
```

Als je ziet:
- ❌ "NO SESSION FOUND" → Session probleem
- ❌ "USER NOT FOUND" → Database sync probleem
- ❌ "ASTRIA GENERATION FAILED" → Astria API probleem

### 5. Database Queries voor Support

```sql
-- Check user en credits
SELECT u.id, u.email, c.credits, u.created_at
FROM users u
LEFT JOIN credits c ON u.id = c.user_id
WHERE u.email = 'customer@email.com';

-- Check purchases
SELECT id, status, amount, created_at
FROM purchases
WHERE user_id = [USER_ID]
ORDER BY created_at DESC;

-- Check projects
SELECT id, name, status, tune_id, 
       CASE 
         WHEN generated_photos IS NOT NULL THEN jsonb_array_length(generated_photos::jsonb)
         ELSE 0
       END as photo_count,
       created_at, updated_at
FROM projects
WHERE user_id = [USER_ID]
ORDER BY created_at DESC;

-- Check failed projects
SELECT id, name, status, tune_id, created_at
FROM projects
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

### 6. Manual Fix voor Stuck Projects

Als een project stuck is in "training" maar Astria heeft de foto's al:

```bash
# POST to manual fetch endpoint
curl -X POST https://aiportretpro.nl/api/astria/manual-fetch \
  -H "Content-Type: application/json" \
  -d '{"projectId": [PROJECT_ID]}'
```

Dit haalt de foto's handmatig op van Astria.

### 7. Preventieve Monitoring

Check dagelijks:
1. Aantal failed projects: `SELECT COUNT(*) FROM projects WHERE status = 'failed'`
2. Projects zonder tune_id: `SELECT COUNT(*) FROM projects WHERE tune_id IS NULL AND status != 'pending'`
3. Users zonder credits na betaling: Check Stripe webhooks

## Error Codes

| Code | Betekenis | Actie |
|------|-----------|-------|
| `SESSION_EXPIRED` | User sessie verlopen | User moet opnieuw inloggen |
| `USER_NOT_FOUND` | User niet in database | Check database sync |
| `ASTRIA_GENERATION_FAILED` | Astria API call faalde | Check API key en logs |

## Contact voor Bugs

Als je een nieuw type fout vindt:
1. Check Vercel logs voor timestamps
2. Check database voor user/project state
3. Document het probleem met screenshots
4. Maak GitHub issue met alle details

