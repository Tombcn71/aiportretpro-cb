export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Privacybeleid</h1>
            <p className="text-gray-600">Hoe wij uw persoonlijke gegevens verzamelen, gebruiken en beschermen</p>
          </div>

          <div className="space-y-8">
            <section className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Samenvatting</h2>
              <p className="text-gray-700">
                Bij AI Portrait Pro respecteren wij uw privacy. Wij verzamelen alleen de gegevens die nodig zijn om onze
                AI-portretservice te leveren en beschermen deze met de hoogste beveiligingsstandaarden.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                Welke gegevens verzamelen wij?
              </h2>

              <div className="ml-11 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Accountinformatie</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• E-mailadres voor inloggen</li>
                    <li>• Naam (optioneel)</li>
                    <li>• Profielinstellingen</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Foto's en content</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Door u geüploade foto's</li>
                    <li>• Gegenereerde AI-portretten</li>
                    <li>• Projectinstellingen</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Technische gegevens</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• IP-adres en locatie</li>
                    <li>• Browser en apparaatinfo</li>
                    <li>• Gebruiksstatistieken</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                Hoe gebruiken wij uw gegevens?
              </h2>

              <div className="ml-11 grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Service levering</h3>
                  <p className="text-green-800 text-sm">AI-portretten genereren en uw account beheren</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Communicatie</h3>
                  <p className="text-blue-800 text-sm">Updates over uw projecten en service-informatie</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-medium text-purple-900 mb-2">Verbetering</h3>
                  <p className="text-purple-800 text-sm">Onze AI-technologie en gebruikerservaring optimaliseren</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-medium text-orange-900 mb-2">Beveiliging</h3>
                  <p className="text-orange-800 text-sm">Fraude voorkomen en uw account beschermen</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                Delen wij uw gegevens?
              </h2>

              <div className="ml-11">
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500 mb-4">
                  <p className="text-red-800 font-medium">Wij verkopen uw gegevens NOOIT aan derden.</p>
                </div>

                <p className="text-gray-700 mb-4">Wij delen alleen gegevens met:</p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-gray-900">Serviceproviders:</span>
                      <span className="text-gray-700"> Astria AI (AI-verwerking), Stripe (betalingen)</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium text-gray-900">Wettelijke vereisten:</span>
                      <span className="text-gray-700"> Alleen wanneer wettelijk verplicht</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">4</span>
                </div>
                Hoe beschermen wij uw gegevens?
              </h2>

              <div className="ml-11 grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">🔒</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Encryptie</h3>
                  <p className="text-gray-600 text-sm">SSL/TLS versleuteling</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">🛡️</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Toegangscontrole</h3>
                  <p className="text-gray-600 text-sm">Beperkte toegang</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">🔍</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Monitoring</h3>
                  <p className="text-gray-600 text-sm">24/7 bewaking</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">5</span>
                </div>
                Uw rechten
              </h2>

              <div className="ml-11 grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Inzage in uw gegevens</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Correctie van gegevens</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Verwijdering van gegevens</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Overdracht van gegevens</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Bezwaar tegen verwerking</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Beperking van verwerking</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">6</span>
                </div>
                Bewaartermijnen
              </h2>

              <div className="ml-11">
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gegevenstype
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bewaartermijn
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Geüploade foto's</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">30 dagen</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gegenereerde portretten</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">1 jaar</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Accountgegevens</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Tot verwijdering</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Betalingsgegevens</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">7 jaar (wettelijk)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact & Vragen</h2>
              <p className="text-gray-700 mb-4">
                Heeft u vragen over dit privacybeleid of wilt u uw rechten uitoefenen?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">📧</span>
                  <span className="text-gray-700">privacy@aiportraitpro.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">📍</span>
                  <span className="text-gray-700">[Uw bedrijfsadres]</span>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Laatst bijgewerkt:{" "}
                  {new Date().toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>AI Portrait Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
