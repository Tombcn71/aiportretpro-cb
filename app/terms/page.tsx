import { Header } from "@/components/header"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Algemene Voorwaarden</h1>
          <p className="text-gray-600 mb-8">Laatst bijgewerkt: {new Date().toLocaleDateString("nl-NL")}</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">1. Acceptatie van voorwaarden</h2>
              <p className="text-gray-700 leading-relaxed">
                Door gebruik te maken van AI Portret Pro ("de Service") gaat u akkoord met deze algemene voorwaarden.
                Als u niet akkoord gaat met deze voorwaarden, mag u de Service niet gebruiken. Deze voorwaarden zijn van
                toepassing op alle gebruikers van de Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">2. Beschrijving van de Service</h2>
              <p className="text-gray-700 mb-4">
                AI Portret Pro is een online service die gebruik maakt van FLUX AI-technologie om professionele
                portretfoto's te genereren op basis van door gebruikers geüploade trainingsfoto's.
              </p>
              <div className="bg-blue-50 border-l-4 border-[#0077B5] p-4 rounded">
                <h3 className="font-medium text-gray-900 mb-2">Wat wij bieden:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>AI-gegenereerde professionele portretfoto's</li>
                  <li>40 gegenereerde foto's per sessie</li>
                  <li>Garantie van 10-18 hoogwaardige resultaten</li>
                  <li>Commerciële en persoonlijke gebruiksrechten</li>
                  <li>30 dagen toegang tot uw resultaten</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">3. Gebruikersverplichtingen</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">U bent verplicht om:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Alleen foto's van uzelf te uploaden</li>
                    <li>Geen foto's van minderjarigen zonder toestemming te uploaden</li>
                    <li>Geen auteursrechtelijk beschermde afbeeldingen te gebruiken</li>
                    <li>Geen ongepaste, gewelddadige of illegale content te uploaden</li>
                    <li>Accurate informatie te verstrekken bij registratie</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Het is verboden om:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>De Service te gebruiken voor illegale doeleinden</li>
                    <li>Foto's van andere personen zonder toestemming te uploaden</li>
                    <li>De Service te misbruiken of te overbelasten</li>
                    <li>Onze systemen te proberen te hacken of te omzeilen</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">4. Betalingen en terugbetalingen</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Betalingsvoorwaarden:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Alle betalingen worden verwerkt via Stripe</li>
                    <li>Prijzen zijn inclusief BTW waar van toepassing</li>
                    <li>Betaling is vereist voordat de Service wordt geleverd</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Terugbetalingsbeleid:</h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-gray-700">
                      <strong>Belangrijke informatie:</strong> Vanwege de aard van onze AI-service en de directe
                      levering van digitale producten, bieden wij geen terugbetalingen aan nadat de verwerking is
                      gestart. Wij garanderen echter wel 10-18 hoogwaardige resultaten per sessie.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">
                5. Intellectueel eigendom en gebruiksrechten
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Uw rechten:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>U behoudt alle rechten op uw geüploade trainingsfoto's</li>
                    <li>U krijgt volledige commerciële en persoonlijke rechten op gegenereerde foto's</li>
                    <li>U mag de gegenereerde foto's gebruiken voor LinkedIn, websites, marketing, etc.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Onze rechten:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>AI Portret Pro behoudt eigendom van de onderliggende AI-technologie</li>
                    <li>Wij mogen de Service verbeteren op basis van algemene gebruikspatronen</li>
                    <li>Wij slaan geen trainingsfoto's op na verwerking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">6. Gegevensbescherming</h2>
              <p className="text-gray-700 mb-4">
                Uw privacy is belangrijk voor ons. Raadpleeg ons{" "}
                <a href="/privacy" className="text-[#0077B5] hover:underline">
                  Privacybeleid
                </a>{" "}
                voor gedetailleerde informatie over hoe wij uw gegevens verzamelen, gebruiken en beschermen.
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <h3 className="font-medium text-gray-900 mb-2">Belangrijke garanties:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Trainingsfoto's worden NIET opgeslagen op onze servers</li>
                  <li>Resultaten worden automatisch na 30 dagen verwijderd</li>
                  <li>Betalingsgegevens worden veilig verwerkt door Stripe</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">7. Servicebeschikbaarheid</h2>
              <p className="text-gray-700 mb-4">
                Wij streven ernaar de Service 24/7 beschikbaar te houden, maar kunnen geen 100% uptime garanderen. De
                Service kan tijdelijk niet beschikbaar zijn vanwege:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Gepland onderhoud</li>
                <li>Technische problemen</li>
                <li>Problemen bij derde partijen (Astria AI, hosting providers)</li>
                <li>Overmacht</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">8. Aansprakelijkheidsbeperking</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">
                  <strong>Belangrijke juridische informatie:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>AI Portret Pro is niet aansprakelijk voor indirecte, incidentele of gevolgschade</li>
                  <li>Onze totale aansprakelijkheid is beperkt tot het bedrag dat u heeft betaald voor de Service</li>
                  <li>Wij zijn niet verantwoordelijk voor het gebruik van gegenereerde foto's door derden</li>
                  <li>De Service wordt geleverd "zoals het is" zonder garanties</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">9. Beëindiging</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">U kunt:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Uw account op elk moment sluiten</li>
                    <li>Het gebruik van de Service op elk moment stoppen</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Wij kunnen:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Uw toegang beëindigen bij schending van deze voorwaarden</li>
                    <li>De Service wijzigen of stopzetten met redelijke kennisgeving</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">10. Wijzigingen in voorwaarden</h2>
              <p className="text-gray-700">
                Wij behouden ons het recht voor deze voorwaarden te wijzigen. Belangrijke wijzigingen zullen we u
                meedelen via e-mail of een kennisgeving op onze website. Voortgezet gebruik na wijzigingen betekent
                acceptatie van de nieuwe voorwaarden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">11. Toepasselijk recht</h2>
              <p className="text-gray-700">
                Deze voorwaarden worden beheerst door Nederlands recht. Geschillen zullen worden voorgelegd aan de
                bevoegde Nederlandse rechtbank.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0077B5] mb-4">12. Contact</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  Voor vragen over deze algemene voorwaarden kunt u contact met ons opnemen via:
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
                  Ons Nederlands team zal binnen 48 uur reageren op uw verzoek.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
