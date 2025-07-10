export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacybeleid</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Inleiding</h2>
            <p>
              Welkom bij AI Portrait Pro. Wij respecteren uw privacy en zijn toegewijd aan het beschermen van uw
              persoonlijke gegevens. Dit privacybeleid legt uit hoe wij uw informatie verzamelen, gebruiken en
              beschermen wanneer u onze AI-portretservice gebruikt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Gegevens die wij verzamelen</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-2">2.1 Persoonlijke informatie</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>E-mailadres (voor accountregistratie)</li>
              <li>Naam (optioneel, voor personalisatie)</li>
              <li>Betalingsinformatie (verwerkt via Stripe)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-2 mt-4">2.2 Foto's en afbeeldingen</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Door u geüploade foto's voor AI-training</li>
              <li>Gegenereerde AI-portretten</li>
              <li>Metadata van afbeeldingen</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-2 mt-4">2.3 Technische gegevens</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP-adres</li>
              <li>Browsertype en -versie</li>
              <li>Gebruiksstatistieken</li>
              <li>Cookies en vergelijkbare technologieën</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Hoe wij uw gegevens gebruiken</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Het leveren van onze AI-portretservice</li>
              <li>Het trainen van AI-modellen voor uw specifieke portretten</li>
              <li>Het verwerken van betalingen</li>
              <li>Het versturen van service-gerelateerde communicatie</li>
              <li>Het verbeteren van onze diensten</li>
              <li>Het naleven van wettelijke verplichtingen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Gegevensdeling</h2>
            <p>Wij delen uw persoonlijke gegevens niet met derden, behalve:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Serviceproviders:</strong> Astria AI (voor AI-verwerking), Stripe (voor betalingen)
              </li>
              <li>
                <strong>Wettelijke vereisten:</strong> Wanneer vereist door de wet
              </li>
              <li>
                <strong>Bedrijfsoverdracht:</strong> Bij fusie of overname
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Gegevensbeveiliging</h2>
            <p>
              Wij implementeren passende technische en organisatorische maatregelen om uw persoonlijke gegevens te
              beschermen tegen:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Ongeautoriseerde toegang</li>
              <li>Verlies of vernietiging</li>
              <li>Misbruik of wijziging</li>
              <li>Onrechtmatige verwerking</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Bewaartermijnen</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Geüploade foto's:</strong> 30 dagen na verwerking
              </li>
              <li>
                <strong>Gegenereerde portretten:</strong> 1 jaar of tot verwijdering door gebruiker
              </li>
              <li>
                <strong>Accountgegevens:</strong> Tot accountverwijdering
              </li>
              <li>
                <strong>Betalingsgegevens:</strong> 7 jaar (wettelijke verplichting)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Uw rechten</h2>
            <p>Onder de AVG heeft u de volgende rechten:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Recht op inzage:</strong> Inzicht in uw persoonlijke gegevens
              </li>
              <li>
                <strong>Recht op rectificatie:</strong> Correctie van onjuiste gegevens
              </li>
              <li>
                <strong>Recht op verwijdering:</strong> Verwijdering van uw gegevens
              </li>
              <li>
                <strong>Recht op beperking:</strong> Beperking van verwerking
              </li>
              <li>
                <strong>Recht op overdraagbaarheid:</strong> Overdracht van uw gegevens
              </li>
              <li>
                <strong>Recht van bezwaar:</strong> Bezwaar tegen verwerking
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
            <p>Wij gebruiken cookies en vergelijkbare technologieën voor:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Essentiële sitefunctionaliteit</li>
              <li>Gebruikersvoorkeuren onthouden</li>
              <li>Analytische doeleinden</li>
              <li>Marketing en advertenties (Facebook Pixel)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Internationale overdrachten</h2>
            <p>
              Uw gegevens kunnen worden overgedragen naar en verwerkt in landen buiten de EU/EER. Wij zorgen ervoor dat
              passende waarborgen zijn getroffen om uw gegevens te beschermen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Wijzigingen in dit beleid</h2>
            <p>
              Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. Wijzigingen worden op deze pagina gepubliceerd
              met een bijgewerkte datum. Wij raden u aan dit beleid regelmatig te controleren.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact</h2>
            <p>Voor vragen over dit privacybeleid of uw persoonlijke gegevens, kunt u contact met ons opnemen via:</p>
            <div className="mt-2">
              <p>
                <strong>E-mail:</strong> privacy@aiportraitpro.com
              </p>
              <p>
                <strong>Adres:</strong> [Uw bedrijfsadres]
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Laatst bijgewerkt:{" "}
              {new Date().toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
