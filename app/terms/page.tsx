export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Algemene Voorwaarden</h1>
            <p className="text-gray-600">De regels en voorwaarden voor het gebruik van AI Portret Pro</p>
          </div>

          <div className="space-y-8">
            <section className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Welkom bij AI Portret Pro</h2>
              <p className="text-gray-700">
                Door onze service te gebruiken, gaat u akkoord met deze voorwaarden. Lees ze zorgvuldig door voordat u
                begint met het creëren van uw AI-portretten.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                Wat is AI Portret Pro?
              </h2>

              <div className="ml-11">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-gray-700 mb-4">
                    AI Portret Pro is een geavanceerde service die kunstmatige intelligentie gebruikt om professionele
                    portretten te genereren uit uw foto's.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">📸</span>
                      </div>
                      <p className="text-sm text-gray-600">Upload foto's</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-purple-600 font-bold">🤖</span>
                      </div>
                      <p className="text-sm text-gray-600">AI training</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 font-bold">✨</span>
                      </div>
                      <p className="text-sm text-gray-600">Professionele portretten</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                Uw account
              </h2>

              <div className="ml-11 space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">✓ Wat u moet doen</h3>
                  <ul className="text-green-800 space-y-1 text-sm">
                    <li>• Accurate informatie verstrekken bij registratie</li>
                    <li>• Uw inloggegevens veilig houden</li>
                    <li>• Ons informeren bij verdachte activiteiten</li>
                    <li>• Verantwoordelijk zijn voor alle activiteiten onder uw account</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                Gebruik van onze service
              </h2>

              <div className="ml-11">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-medium text-green-900 mb-3 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Toegestaan gebruik
                    </h3>
                    <ul className="text-green-800 space-y-2 text-sm">
                      <li>• Eigen foto's uploaden</li>
                      <li>• Portretten voor persoonlijk gebruik</li>
                      <li>• Commercieel gebruik van resultaten</li>
                      <li>• Delen van gegenereerde portretten</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h3 className="font-medium text-red-900 mb-3 flex items-center">
                      <span className="text-red-600 mr-2">✗</span>
                      Verboden gebruik
                    </h3>
                    <ul className="text-red-800 space-y-2 text-sm">
                      <li>• Foto's van anderen zonder toestemming</li>
                      <li>• Misleidende of frauduleuze content</li>
                      <li>• Illegale of schadelijke content</li>
                      <li>• Reverse engineering van onze AI</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">4</span>
                </div>
                Credits & Betalingen
              </h2>

              <div className="ml-11">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Hoe werkt het creditsysteem?</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Onze service werkt met credits. Elke AI-portretgeneratie kost een bepaald aantal credits.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">💳</div>
                      <p className="text-xs text-gray-600 mt-1">Koop credits</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-purple-600">🎨</div>
                      <p className="text-xs text-gray-600 mt-1">Genereer portretten</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">📥</div>
                      <p className="text-xs text-gray-600 mt-1">Download resultaten</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Betalingen worden veilig verwerkt door Stripe</span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">
                      Credits zijn niet-terugbetaalbaar (tenzij wettelijk vereist)
                    </span>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Credits vervallen na 12 maanden inactiviteit</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">5</span>
                </div>
                Eigendomsrechten
              </h2>

              <div className="ml-11">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-3">Uw rechten</h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                      <li>• U behoudt eigendom van uw foto's</li>
                      <li>• Gegenereerde portretten zijn van u</li>
                      <li>• U mag portretten commercieel gebruiken</li>
                      <li>• U kunt portretten delen en verkopen</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="font-medium text-purple-900 mb-3">Onze rechten</h3>
                    <ul className="text-purple-800 space-y-2 text-sm">
                      <li>• AI-technologie blijft ons eigendom</li>
                      <li>• Merken en logo's zijn beschermd</li>
                      <li>• Platform en software zijn ons eigendom</li>
                      <li>• Reverse engineering is verboden</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">6</span>
                </div>
                Aansprakelijkheid
              </h2>

              <div className="ml-11">
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500 mb-4">
                  <h3 className="font-medium text-yellow-900 mb-2">Belangrijke disclaimer</h3>
                  <p className="text-yellow-800 text-sm">
                    AI-gegenereerde content kan onvoorspelbaar zijn. Wij garanderen geen specifieke resultaten en zijn
                    niet verantwoordelijk voor hoe u de gegenereerde portretten gebruikt.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Beperking van aansprakelijkheid</h3>
                  <p className="text-gray-700 text-sm">
                    Onze aansprakelijkheid is beperkt tot het bedrag dat u heeft betaald voor onze service in de 12
                    maanden voorafgaand aan een eventuele claim.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">7</span>
                </div>
                Wijzigingen & Beëindiging
              </h2>

              <div className="ml-11 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Wijzigingen in voorwaarden</h3>
                  <p className="text-gray-700 text-sm">
                    Wij kunnen deze voorwaarden wijzigen. Wijzigingen worden op deze pagina gepubliceerd en treden in
                    werking na publicatie.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Account beëindigen</h3>
                  <p className="text-gray-700 text-sm">
                    U kunt uw account op elk moment verwijderen. Wij kunnen accounts beëindigen bij schending van deze
                    voorwaarden.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vragen of ondersteuning?</h2>
              <p className="text-gray-700 mb-4">
                Heeft u vragen over deze voorwaarden of heeft u hulp nodig met onze service?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">📧</span>
                  <span className="text-gray-700">support@aiportretpro.com</span>
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
                <span>AI Portret Pro • Nederlands recht van toepassing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
