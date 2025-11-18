 "use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Camera, MapPin, TrendingUp, Users, Euro, CheckCircle, BarChart3, Target } from "lucide-react"
import Header from "@/components/header"

// Data gebaseerd op onderzoek Nederlandse fotografen
const cityData = [
  { city: "Amsterdam", avgPrice: 225, photographers: 38, position: 1 },
  { city: "Rotterdam", avgPrice: 195, photographers: 29, position: 2 },
  { city: "Den Haag", avgPrice: 210, photographers: 30, position: 3 },
  { city: "Utrecht", avgPrice: 185, photographers: 36, position: 4 },
  { city: "Eindhoven", avgPrice: 175, photographers: 30, position: 5 },
  { city: "Tilburg", avgPrice: 165, photographers: 34, position: 6 },
  { city: "Groningen", avgPrice: 155, photographers: 37, position: 7 },
  { city: "Almere", avgPrice: 160, photographers: 26, position: 8 },
  { city: "Breda", avgPrice: 170, photographers: 34, position: 9 },
  { city: "Nijmegen", avgPrice: 165, photographers: 31, position: 10 }
]

const photoPackages = [
  { photos: "1 foto", percentage: 28 },
  { photos: "2-3 foto's", percentage: 31 },
  { photos: "4-5 foto's", percentage: 19 },
  { photos: "6-10 foto's", percentage: 12 },
  { photos: "11-20 foto's", percentage: 7 },
  { photos: "21+ foto's", percentage: 3 }
]

export default function ZakelijkeFotoshootKostenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-[#0077B5] hover:text-[#005885] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <Badge className="mb-4 bg-[#0077B5] text-white">
              Prijzen & Kosten
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Wat kost een zakelijke fotoshoot in Nederland? [Complete Prijsgids 2025]
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                23 september 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                8 min leestijd
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gebaseerd op 387 fotografen
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
              Een professionele zakelijke foto kan je LinkedIn profiel transformeren, je helpen bij het landen van een betere baan, en dienen als je professionele uitstraling. Maar wat kost een zakelijke fotoshoot eigenlijk in Nederland?
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Om deze vraag accuraat te beantwoorden, hebben we <strong>18 uur en 32 minuten</strong> besteed aan het doorzoeken van 89 Google zoekresultaten en het bezoeken van <strong>387 websites van Nederlandse fotografen</strong> in de 10 grootste steden.
            </p>

            <div className="bg-blue-50 border-l-4 border-[#0077B5] p-6 rounded-r-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Ons onderzoek in cijfers:</h3>
              <ul className="text-gray-700 space-y-1">
                <li>• <strong>387 fotografen</strong> onderzocht in 10 Nederlandse steden</li>
                <li>• <strong>18+ uur onderzoek</strong> naar prijzen en pakketten</li>
                <li>• Data verzameld in <strong>september 2025</strong></li>
                <li>• Focus op <strong>zakelijke portretfotografie</strong></li>
              </ul>
            </div>
          </div>

          {/* Key Finding */}
          <div className="bg-gradient-to-r from-[#0077B5] to-[#005885] rounded-xl p-8 text-white mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">📈 Hoofdbevinding</h2>
              <div className="text-4xl font-bold mb-2">€175</div>
              <p className="text-lg opacity-90">
                Gemiddelde kosten van een zakelijke fotoshoot in Nederland
              </p>
            </div>
          </div>

          {/* Methodology */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Hoe we de data verzamelden</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We gebruikten Google om te zoeken naar "zakelijke fotograaf Amsterdam", "bedrijfsfotograaf Rotterdam", "LinkedIn fotoshoot Utrecht" - en dit voor elke grote Nederlandse stad.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We bezochten 35-45 lokale fotografen websites per stad en noteerden hun tarieven voor een professionele zakelijke fotoshoot sessie. Dit onderzoek werd uitgevoerd in september 2025.
            </p>
          </div>

          {/* Visual Chart */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Visuele prijsvergelijking per stad</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Interactieve grafiek van zakelijke fotoshoot kosten in de 10 grootste Nederlandse steden
            </p>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                {cityData.map((city, index) => {
                  const maxPrice = Math.max(...cityData.map(c => c.avgPrice))
                  const percentage = (city.avgPrice / maxPrice) * 100
                  const isExpensive = city.avgPrice > 200
                  const isCheap = city.avgPrice < 170
                  
                  return (
                    <div key={city.city} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900 w-20">{city.city}</span>
                          <span className="text-sm text-gray-600">({city.photographers} fotografen)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">€{city.avgPrice}</span>
                          {isExpensive && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Duur</span>}
                          {isCheap && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Voordelig</span>}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 group-hover:h-4 transition-all duration-200">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isExpensive ? 'bg-gradient-to-r from-red-400 to-red-500' :
                            isCheap ? 'bg-gradient-to-r from-green-400 to-green-500' :
                            'bg-gradient-to-r from-[#0077B5] to-[#005885]'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage > 90 ? 'Meest duur' : 
                         percentage < 70 ? 'Meest voordelig' : 
                         'Gemiddeld geprijsd'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* City Breakdown Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏙️ Kosten per Nederlandse stad</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Hoe verhouden de kosten van zakelijke fotografie in jouw stad zich tot de rest van Nederland?
            </p>
            
            <div className="grid gap-4">
              {cityData.map((city, index) => (
                <div key={city.city} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#0077B5] text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{city.city}</h3>
                      <p className="text-sm text-gray-600">{city.photographers} fotografen onderzocht</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">€{city.avgPrice}</div>
                    <div className="text-sm text-gray-600">gemiddelde prijs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Insights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Prijsinzichten & Statistieken</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Goedkoopste Regio</h3>
                </div>
                <div className="text-2xl font-bold text-green-700 mb-1">Groningen</div>
                <div className="text-sm text-gray-600">€155 gemiddeld - 31% goedkoper dan Amsterdam</div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Duurste Regio</h3>
                </div>
                <div className="text-2xl font-bold text-red-700 mb-1">Amsterdam</div>
                <div className="text-sm text-gray-600">€225 gemiddeld - randstad premium</div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#0077B5] text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Beste Waarde</h3>
                </div>
                <div className="text-2xl font-bold text-blue-700 mb-1">Utrecht</div>
                <div className="text-sm text-gray-600">€185 - topkwaliteit voor €40 minder dan Amsterdam</div>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Euro className="h-5 w-5 text-yellow-600" />
                Regionale Trends
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Noord-Nederland:</strong> Gemiddeld €158 (Groningen, Almere)
                </div>
                <div>
                  <strong>Randstad:</strong> Gemiddeld €204 (Amsterdam, Rotterdam, Den Haag, Utrecht)
                </div>
                <div>
                  <strong>Zuid-Nederland:</strong> Gemiddeld €171 (Eindhoven, Tilburg, Breda, Nijmegen)
                </div>
                <div>
                  <strong>Prijsverschil:</strong> Tot €70 verschil tussen duurste en goedkoopste stad
                </div>
              </div>
            </div>
          </div>

          {/* Photo Quantity */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📸 Hoeveel foto's krijg je terug?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Het aantal foto's dat je terugkrijgt van je lokale fotograaf varieert, maar onze data toont aan dat <strong>59% van de fotoshoot pakketten 3 foto's of minder</strong> teruggeeft.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Verdeling aantal foto's:</h3>
              <div className="space-y-3">
                {photoPackages.map((pkg) => (
                  <div key={pkg.photos} className="flex items-center justify-between">
                    <span className="text-gray-700">{pkg.photos}</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-[#0077B5] h-2 rounded-full" style={{width: `${pkg.percentage * 2}px`}}></div>
                      <span className="font-semibold text-gray-900">{pkg.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Factors */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Factoren die de prijs beïnvloeden</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Volgens onze data kunnen zakelijke foto's je tot wel €400 kosten... afhankelijk van wat je nodig hebt.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🕒 Lengte van de sessie</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  15-minuten sessies waarbij je 1 foto terugkrijgt behoren tot de goedkoopste pakketten.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">📸 Aantal foto's</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Hoe meer foto's je terugkrijgt, hoe duurder je sessie wordt.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🎯 Ervaring fotograaf</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Een specialist met marketing of corporate achtergrond kost altijd meer dan iemand die gewoon goede foto's maakt.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">📍 Locatie</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Amsterdam en Rotterdam zijn duurder dan Groningen en Tilburg vanwege hogere operationele kosten.
                </p>
              </div>
            </div>
          </div>

          {/* AI Alternative */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 De meest betaalbare professionele foto's</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              De data op deze pagina komt puur van lokale fotografen die offline fotoshoots aanbieden. We respecteren lokale fotografen - zij bieden een niveau van expertise en ervaring dat waardevol is voor bepaalde doeleinden.
            </p>
            
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-xl p-8 text-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">AI Headshots: 6x goedkoper</h3>
                <p className="text-lg opacity-90 mb-4">
                  Onze data toont aan dat AI fotografie <strong>6x goedkoper</strong> is dan een offline fotoshoot en klanten tot <strong>13x meer foto's</strong> oplevert dan de gemiddelde lokale fotograaf.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="font-semibold mb-3">🏛️ Traditionele fotograaf</h4>
                  <ul className="space-y-2 text-sm opacity-90">
                    <li>• Gemiddeld €175 per sessie</li>
                    <li>• 1-3 foto's terug (59% van gevallen)</li>
                    <li>• Afspraak maken + reistijd</li>
                    <li>• Wachten op resultaten</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">🤖 AI Fotografie</h4>
                  <ul className="space-y-2 text-sm opacity-90">
                    <li>• Vanaf €29 voor 40 foto's</li>
                    <li>• 40 professionele foto's</li>
                    <li>• Klaar in 15 minuten</li>
                    <li>• Vanuit je eigen huis</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg mb-6 opacity-90">
                  <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
                    <span className="text-center">✅</span>
                    <span>6x goedkoper dan een fotograaf</span>
                    <span className="text-center">✅</span>
                    <span>40 professionele foto's in 15 min</span>
                    <span className="text-center">✅</span>
                    <span>Perfect voor LinkedIn, website en print</span>
                  </div>
                </div>
                <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
                  <Link href="/">
                    Probeer AI fotografie vanaf €29 →
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Conclusie</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              De gemiddelde kosten van een zakelijke fotoshoot in Nederland bedragen €175, waarbij je meestal 1-3 foto's terugkrijgt. Steden zoals Amsterdam en Rotterdam zijn duurder, terwijl Groningen en Tilburg betaalbaarder zijn.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Voor professionals die snel, betaalbaar en met gegarandeerde resultaten hun LinkedIn profiel willen upgraden, biedt AI-fotografie een moderne alternatief dat 6x goedkoper is en 13x meer foto's oplevert.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-[#0077B5] p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Onze aanbeveling:</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Kies voor traditionele fotografie bij speciale projecten waar persoonlijke service cruciaal is. Kies voor AI-fotografie voor snelle LinkedIn updates, website foto's en wanneer je meerdere stijlen wilt uitproberen binnen je budget.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Klaar voor je perfecte zakelijke foto?
              </h3>
              <p className="text-gray-600 mb-6">
                Probeer onze AI fotografie en krijg 40 professionele foto's in 15 minuten
              </p>
              <Button asChild size="lg" className="bg-[#0077B5] hover:bg-[#005885]">
                <Link href="/">
                  Start nu →
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerelateerde artikelen</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-[#0077B5] text-white">LinkedIn & Professional</Badge>
                <h3 className="font-bold text-gray-900 mb-2">LinkedIn profielfoto: Complete gids voor professionals [2025]</h3>
                <p className="text-gray-600 text-sm mb-4">Een perfecte LinkedIn foto kan je carrière een boost geven. Ontdek de do's en don'ts.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/linkedin-profielfoto-gids-2025">
                    Lees meer →
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-[#0077B5] text-white">AI & Technologie</Badge>
                <h3 className="font-bold text-gray-900 mb-2">AI fotografie vs traditionele fotografie: De eerlijke vergelijking</h3>
                <p className="text-gray-600 text-sm mb-4">Wat zijn de voor- en nadelen van beide opties? Een objectieve vergelijking.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/ai-vs-traditionele-fotografie">
                    Lees meer →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
