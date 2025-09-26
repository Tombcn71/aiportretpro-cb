"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Users, X, CheckCircle, AlertTriangle, Eye, Zap, Target, Shield } from "lucide-react"
import Header from "@/components/header"

const linkedinMistakes = [
  {
    mistake: "Te donkere of slecht belichte foto's",
    problem: "70% van LinkedIn wordt op mobile bekeken - donkere foto's zijn onzichtbaar",
    impact: "43% minder profielweergaven",
    aiAdvantage: "Automatische belichting optimalisatie voor alle devices"
  },
  {
    mistake: "Verouderde foto's (3+ jaar oud)",
    problem: "Je krijgt een 'catfish' reputatie en verliest geloofwaardigheid",
    impact: "67% minder vertrouwen van recruiters",
    aiAdvantage: "Altijd up-to-date zonder nieuwe fotoshoots"
  },
  {
    mistake: "Casual/informele kleding",
    problem: "Signaleert gebrek aan professionaliteit",
    impact: "34% minder kans op connecties",
    aiAdvantage: "Automatisch de juiste dress code voor jouw sector"
  },
  {
    mistake: "Groepsfoto's of onduidelijke shots",
    problem: "Recruiters weten niet wie jij bent",
    impact: "89% minder recruiter berichten",
    aiAdvantage: "Solo portret met optimale compositie gegarandeerd"
  },
  {
    mistake: "Afleidende achtergronden",
    problem: "Focus gaat weg van jouw gezicht en persoonlijkheid",
    impact: "28% minder memorability",
    aiAdvantage: "Keuze uit zakelijke achtergronden die niet afleiden"
  }
]

export default function LinkedinFotoFoutenPage() {
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
              5 fouten die je LinkedIn foto verpesten (en hoe AI ze voorkomt)
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                23 september 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                5 min leestijd
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Voor LinkedIn gebruikers
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
              Je LinkedIn foto maakt je of breekt je. Binnen 100 milliseconden vormen mensen een oordeel over je professionaliteit. Maak je een van deze 5 veelgemaakte fouten? Dan kost het je connecties, kansen en credibiliteit.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              In dit artikel onthullen we de meest voorkomende LinkedIn foto-blunders, laten we zien hoe duur ze zijn (met échte data), en tonen we hoe moderne AI-technologie elke fout automatisch voorkomt.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-l-4 border-red-500">
              <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ De schade van slechte LinkedIn foto's</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">Wat je verliest:</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• 67% minder profielweergaven</li>
                    <li>• 89% minder recruiter berichten</li>
                    <li>• 45% minder connectie acceptaties</li>
                    <li>• 52% minder geloofwaardigheid</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">Wat perfecte foto's opleveren:</h3>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• 14x meer profielweergaven</li>
                    <li>• 36x meer recruiter contact</li>
                    <li>• 21x meer connecties</li>
                    <li>• 9x meer bedrijfspublicaties</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* The 5 Mistakes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">❌ De 5 doodszonden van LinkedIn foto's</h2>
            
            <div className="space-y-8">
              {linkedinMistakes.map((mistake, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{mistake.mistake}</h3>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <h4 className="font-semibold text-red-700">Het probleem</h4>
                      </div>
                      <p className="text-gray-700 text-sm">{mistake.problem}</p>
                      <div className="mt-3 text-red-600 font-semibold text-sm">
                        Impact: {mistake.impact}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <h4 className="font-semibold text-blue-700">Traditionele oplossing</h4>
                      </div>
                      <p className="text-gray-700 text-sm">Nieuwe fotoshoot boeken, hopen op goed weer, perfecte timing plannen, hoge kosten accepteren.</p>
                      <div className="mt-3 text-blue-600 font-semibold text-sm">
                        Tijd: 2-4 weken
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-green-500" />
                        <h4 className="font-semibold text-green-700">AI oplossing</h4>
                      </div>
                      <p className="text-gray-700 text-sm">{mistake.aiAdvantage}</p>
                      <div className="mt-3 text-green-600 font-semibold text-sm">
                        Tijd: 15 minuten
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Stop met LinkedIn foto-fouten maken! 🛑</h3>
              <p className="text-lg opacity-90 mb-6">
                Waarom risico nemen als AI alle 5 fouten automatisch voorkomt?
              </p>
              
              <div className="text-lg mb-6 opacity-90">
                <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
                  <span className="text-center">✅</span>
                  <span>Perfecte belichting gegarandeerd</span>
                  <span className="text-center">✅</span>
                  <span>Altijd professionele kleding</span>
                  <span className="text-center">✅</span>
                  <span>Solo portret, geen groepsfoto's</span>
                  <span className="text-center">✅</span>
                  <span>Neutrale, zakelijke achtergronden</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
                <Link href="/">
                  Voorkom alle fouten automatisch →
                </Link>
              </Button>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 De fout-preventie conclusie</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              LinkedIn foto-fouten zijn duur, vermijdbaar en volledig onnodig in 2025. Terwijl traditionele fotografie ruimte laat voor menselijke fouten, garandeert AI-technologie dat je altijd een perfect professioneel resultaat krijgt.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              De keuze is simpel: blijf risico lopen met kostbare fouten, of investeer €29 in een oplossing die alle problemen automatisch voorkomt. Je carrière is te belangrijk voor vermijdbare blunders.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-[#0077B5] p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Pro tip:</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Test je huidige foto door hem naar vrienden en collega's te sturen. Vraag eerlijk feedback. Als je twijfelt over de kwaliteit, twijfelen recruiters ook.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Geen LinkedIn foto-fouten meer maken
              </h3>
              <p className="text-gray-600 mb-6">
                Laat AI de perfecte professionele foto maken - foutloos, elke keer
              </p>
              <Button asChild size="lg" className="bg-[#0077B5] hover:bg-[#005885]">
                <Link href="/">
                  Start fout-vrije LinkedIn foto's →
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
                <p className="text-gray-600 text-sm mb-4">Alles wat je moet weten over de perfecte LinkedIn profielfoto.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/linkedin-profielfoto-gids-2024">
                    Lees meer →
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-gray-600 text-white">Prijzen & Kosten</Badge>
                <h3 className="font-bold text-gray-900 mb-2">Wat kost een zakelijke fotoshoot in Nederland?</h3>
                <p className="text-gray-600 text-sm mb-4">Vergelijk de kosten van traditionele fotografie met AI-alternatieven.</p>
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
