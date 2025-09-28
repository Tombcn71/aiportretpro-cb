"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Users, CheckCircle, X, Eye, TrendingUp, Target, Lightbulb } from "lucide-react"
import Header from "@/components/header"

const linkedinStats = [
  { stat: "14x meer", description: "profielweergaven met professionele foto" },
  { stat: "36x meer", description: "kans op berichten van recruiters" },
  { stat: "21x meer", description: "kans op connectie verzoeken" },
  { stat: "9x meer", description: "kans op gepubliceerd te worden" }
]

const dosAndDonts = {
  dos: [
    "Gebruik een recente foto (maximaal 2 jaar oud)",
    "Kijk direct in de camera voor oogcontact",
    "Glimlach natuurlijk en vriendelijk",
    "Draag professionele kleding passend bij je sector",
    "Zorg voor goede belichting (daglicht is ideaal)",
    "Gebruik een neutrale, rustige achtergrond",
    "Zorg dat je hoofd 60% van de foto inneemt"
  ],
  donts: [
    "Gebruik geen groepsfoto's of party foto's",
    "Vermijd te donkere of overbelichte foto's",
    "Geen zonnebril of petten die je gezicht bedekken",
    "Vermijd afleidende achtergronden",
    "Gebruik geen verouderde foto's van 5+ jaar geleden",
    "Geen filters of heavy bewerking",
    "Vermijd extreme close-ups of te ver weg"
  ]
}

export default function LinkedinProfielfotoGidsPage() {
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
              LinkedIn & Professional
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              LinkedIn profielfoto: Complete gids voor professionals [2024]
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                23 september 2024
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                6 min leestijd
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Voor alle professionals
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
              Je LinkedIn profielfoto is vaak de eerste indruk die je maakt op potentiële werkgevers, klanten en zakenpartners. Een professionele foto kan het verschil maken tussen een succesvolle connectie en een gemiste kans.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              In deze complete gids leer je alles wat je moet weten over LinkedIn profielfoto's: van de belangrijkste do's en don'ts tot de impact op je carrière en moderne alternatieven zoals AI-fotografie.
            </p>
          </div>

          {/* LinkedIn Stats */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Waarom je LinkedIn foto zo belangrijk is</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              LinkedIn's eigen onderzoek toont aan dat profielen met een professionele foto dramatisch beter presteren:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {linkedinStats.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-[#0077B5] to-[#005885] rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold mb-2">{item.stat}</div>
                  <div className="text-sm opacity-90">{item.description}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border-l-4 border-[#0077B5] p-6 rounded-r-lg">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>💡 Pro tip:</strong> Profielen met foto's krijgen 21x meer profielweergaven en 36x meer berichten. Geen foto hebben betekent letterlijk onzichtbaar zijn op LinkedIn.
              </p>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✅❌ LinkedIn foto do's en don'ts</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Do's */}
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Wat je WEL moet doen
                </h3>
                <div className="space-y-3">
                  {dosAndDonts.dos.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don'ts */}
              <div>
                <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Wat je NIET moet doen
                </h3>
                <div className="space-y-3">
                  {dosAndDonts.donts.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <X className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Technische vereisten LinkedIn foto</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">📐 Afmetingen & Formaat</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• <strong>Aanbevolen:</strong> 400x400 pixels</li>
                    <li>• <strong>Minimum:</strong> 200x200 pixels</li>
                    <li>• <strong>Maximum:</strong> 20MB bestandsgrootte</li>
                    <li>• <strong>Formaten:</strong> JPG, PNG, GIF</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">🎯 Compositie Tips</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Hoofd neemt 60% van de foto in</li>
                    <li>• Van borst naar boven zichtbaar</li>
                    <li>• Oogcontact met de camera</li>
                    <li>• Neutrale of bedrijfsrelevante achtergrond</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Industry-Specific Tips */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏢 Sector-specifieke tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">💼 Corporate/Finance</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Pak of blazer</li>
                  <li>• Donkere kleuren</li>
                  <li>• Formele uitstraling</li>
                  <li>• Neutrale achtergrond</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">🎨 Creatief/Marketing</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Meer kleur toegestaan</li>
                  <li>• Persoonlijkheid tonen</li>
                  <li>• Creatieve achtergrond OK</li>
                  <li>• Casual-smart dress code</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">💻 Tech/Startup</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Smart casual kleding</li>
                  <li>• Moderne uitstraling</li>
                  <li>• Kan informeler</li>
                  <li>• Innovatief gevoel</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Traditional vs AI Photography */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📸 Traditionele fotograaf vs AI-fotografie</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Er zijn verschillende manieren om aan je perfecte LinkedIn foto te komen. Hier vergelijken we de opties:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">🏛️ Traditionele Fotograaf</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Persoonlijke service</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Creatieve input</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Fysieke directing</span>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">
                  <p><strong>Kosten:</strong> €150-500+</p>
                  <p><strong>Tijd:</strong> Afspraak + sessie + wachten</p>
                  <p><strong>Resultaat:</strong> 1-5 foto's</p>
                </div>
              </div>
              
              <div className="border-2 border-[#0077B5] rounded-lg p-6 bg-blue-50">
                <h3 className="font-semibold text-gray-900 mb-4">🤖 AI-Fotografie</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Consistente kwaliteit</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Geen reistijd</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Meerdere stijlen</span>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">
                  <p><strong>Kosten:</strong> €29-59</p>
                  <p><strong>Tijd:</strong> 15 minuten</p>
                  <p><strong>Resultaat:</strong> 40-200 foto's</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ 5 quick wins voor je LinkedIn foto</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#0077B5] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Update je foto elk jaar</h3>
                    <p className="text-gray-700 text-sm">Zorg dat je foto actueel blijft en je huidige uitstraling weergeeft.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#0077B5] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Test verschillende foto's</h3>
                    <p className="text-gray-700 text-sm">A/B test je profielfoto door de impact op profielweergaven te meten.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#0077B5] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Zorg voor consistentie</h3>
                    <p className="text-gray-700 text-sm">Gebruik dezelfde foto op alle professionele platforms.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#0077B5] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Optimaliseer voor mobile</h3>
                    <p className="text-gray-700 text-sm">70% van LinkedIn wordt op mobile bekeken - zorg dat je foto ook klein goed zichtbaar is.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#0077B5] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Monitor je resultaten</h3>
                    <p className="text-gray-700 text-sm">Houd bij hoe vaak je profiel wordt bekeken na het updaten van je foto.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI CTA */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Klaar voor je perfecte LinkedIn foto?</h3>
                <p className="text-lg opacity-90 mb-6">
                  Geen gedoe met fotoshoots - krijg 40 professionele variaties in 15 minuten
                </p>
                
                <div className="text-lg mb-6 opacity-90">
                  <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
                    <span className="text-center">✅</span>
                    <span>Meerdere professionele stijlen</span>
                    <span className="text-center">✅</span>
                    <span>Perfect voor LinkedIn geoptimaliseerd</span>
                    <span className="text-center">✅</span>
                    <span>A/B test verschillende looks</span>
                  </div>
                </div>
                
                <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
                  <Link href="/">
                    Creëer je LinkedIn foto →
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Conclusie</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Je LinkedIn profielfoto is een van de belangrijkste investeringen in je professionele carrière. Met 14x meer profielweergaven en 36x meer recruiter berichten kan een goede foto letterlijk je carrière veranderen.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Of je nu kiest voor een traditionele fotograaf of moderne AI-fotografie, het belangrijkste is dat je foto professioneel, actueel en passend bij je sector is. In 2024 zijn er meer opties dan ooit om snel en betaalbaar aan een perfecte LinkedIn foto te komen.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-[#0077B5] p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Laatste tip:</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Update je LinkedIn foto minimaal één keer per jaar, en altijd na grote carrière wijzigingen. Je foto is je digitale handdruk - maak hem onvergetelijk.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Upgrade je LinkedIn profiel vandaag nog
              </h3>
              <p className="text-gray-600 mb-6">
                Krijg 40 professionele LinkedIn foto's in verschillende stijlen
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
                <h3 className="font-bold text-gray-900 mb-2">5 fouten die je LinkedIn foto verpesten (en hoe AI ze voorkomt)</h3>
                <p className="text-gray-600 text-sm mb-4">Deze veelgemaakte fouten maken je LinkedIn foto minder professioneel.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/linkedin-foto-fouten-ai-voorkomt">
                    Lees meer →
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-[#0077B5] text-white">Prijzen & Kosten</Badge>
                <h3 className="font-bold text-gray-900 mb-2">Wat kost een zakelijke fotoshoot in Nederland?</h3>
                <p className="text-gray-600 text-sm mb-4">Complete prijsgids gebaseerd op onderzoek van 387 Nederlandse fotografen.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/wat-kost-zakelijke-fotoshoot-nederland">
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
