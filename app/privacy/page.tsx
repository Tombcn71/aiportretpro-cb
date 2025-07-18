import { Header } from "@/components/header"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacybeleid</h1>
          <p className="text-gray-600 mb-8">Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">1. Inleiding</h2>
              <p className="text-gray-700 leading-relaxed">
                AI Portret Pro ("wij", "ons", "onze") respecteert uw privacy en is toegewijd aan het beschermen van uw
                persoonlijke gegevens. Dit privacybeleid legt uit hoe wij uw persoonlijke informatie verzamelen,
                gebruiken en beschermen wanneer u onze AI-portretservice gebruikt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">2. Gegevens die wij verzamelen</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Persoonlijke informatie:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Naam en e-mailadres (via Google OAuth)</li>
                    <li>Profielfoto (via Google account)</li>
                    <li>Betalingsinformatie (verwerkt door Stripe)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Geüploade content:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Trainingsfoto's die u uploadt voor AI-verwerking</li>
                    <li>Gegenereerde portretfoto's</li>
                    <li>Projectinformatie en instellingen</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">3. Hoe wij uw gegevens gebruiken</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Het leveren van onze AI-portretservice</li>
                <li>Het verwerken van betalingen via Stripe</li>
                <li>Het versturen van service-gerelateerde communicatie</li>
                <li>Het verbeteren van onze service en gebruikerservaring</li>
                <li>Het naleven van wettelijke verplichtingen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">4. Gegevensbewaring</h2>
              <div className="bg-blue-50 border-l-4 border-[#0077B5] p-4 rounded">
                <p className="text-gray-700">
                  <strong>Belangrijke informatie over gegevensbewaring:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Trainingsfoto's worden NIET opgeslagen op onze servers</li>
                  <li>Gegenereerde resultaten worden automatisch na 30 dagen verwijderd</li>
                  <li>Accountgegevens worden bewaard zolang uw account actief is</li>
                  <li>Betalingsgegevens worden verwerkt door Stripe en niet door ons opgeslagen</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">5. Delen van gegevens</h2>
              <p className="text-gray-700 mb-4">Wij delen uw persoonlijke gegevens alleen in de volgende gevallen:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  <strong>Service providers:</strong> Astria AI voor foto-verwerking, Stripe voor betalingen
                </li>
                <li>
                  <strong>Wettelijke vereisten:</strong> Wanneer dit wettelijk verplicht is
                </li>
                <li>
                  <strong>Bedrijfsoverdracht:</strong> Bij fusie, overname of verkoop van activa
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">6. Uw rechten</h2>
              <p className="text-gray-700 mb-4">Onder de AVG heeft u de volgende rechten:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Recht op toegang tot uw persoonlijke gegevens</li>
                <li>Recht op rectificatie van onjuiste gegevens</li>
                <li>Recht op verwijdering ("recht om vergeten te worden")</li>
                <li>Recht op beperking van verwerking</li>
                <li>Recht op gegevensoverdraagbaarheid</li>
                <li>Recht van bezwaar tegen verwerking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">7. Beveiliging</h2>
              <p className="text-gray-700">
                Wij implementeren passende technische en organisatorische maatregelen om uw persoonlijke gegevens te
                beschermen tegen ongeautoriseerde toegang, wijziging, openbaarmaking of vernietiging. Dit omvat
                encryptie, veilige servers en regelmatige beveiligingsaudits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">8. Cookies</h2>
              <p className="text-gray-700">
                Onze website gebruikt essentiële cookies voor authenticatie en functionaliteit. Wij gebruiken geen
                tracking cookies voor advertentiedoeleinden. Door onze service te gebruiken, stemt u in met het gebruik
                van deze essentiële cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">9. Wijzigingen in dit beleid</h2>
              <p className="text-gray-700">
                Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. Belangrijke wijzigingen zullen we u meedelen
                via e-mail of een prominente kennisgeving op onze website. Wij raden u aan dit beleid regelmatig te
                controleren.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">10. Contact</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  Voor vragen over dit privacybeleid of uw persoonlijke gegevens kunt u contact met ons opnemen via:
                </p>
                <ul className="text-gray-700 space-y-1">
                  <li>
                    <strong>Live chat:</strong> Beschikbaar op onze website
                  </li>
                  <li>
                    <strong>E-mail:</strong> Via de contactpagina op onze website
                  </li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">
                  Ons team spreekt Nederlands en zal binnen 48 uur reageren op uw verzoek.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
