"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Users, Heart, Shield, Brain, Zap, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"
import Header from "@/components/header"

const myths = [
  {
    myth: "AI gaat mijn baan overnemen",
    reality: "AI automatiseert taken, creëert nieuwe mogelijkheden",
    explanation: "AI neemt repetitieve taken over zodat jij je kunt focussen op strategie, creativiteit en menselijke interactie."
  },
  {
    myth: "AI is te complex om te begrijpen",
    reality: "Moderne AI is gebruiksvriendelijk en intuïtief",
    explanation: "Je hoeft geen programmeur te zijn. AI-tools zijn ontworpen om zo simpel mogelijk te gebruiken."
  },
  {
    myth: "AI-resultaten zijn fake en onbetrouwbaar",
    reality: "AI levert consistente, hoogwaardige resultaten",
    explanation: "Moderne AI wordt getraind op miljarden voorbeelden en levert vaak betere consistentie dan menselijke variatie."
  },
  {
    myth: "AI heeft geen ziel of persoonlijkheid",
    reality: "AI kan jouw unieke kenmerken versterken",
    explanation: "AI analyseert jouw specifieke eigenschappen en zorgt ervoor dat je authentieke persoonlijkheid behouden blijft."
  }
]

const benefits = [
  {
    icon: Zap,
    title: "Snelheid",
    description: "Wat uren duurt, doet AI in minuten",
    examples: ["15 minuten voor 40 foto's", "Instant resultaten", "Geen wachttijden"]
  },
  {
    icon: Shield,
    title: "Consistentie",
    description: "Altijd hoge kwaliteit, geen slechte dagen",
    examples: ["Perfecte belichting elke keer", "Geen tremende handen", "Constante scherpte"]
  },
  {
    icon: Heart,
    title: "Toegankelijkheid",
    description: "Voor iedereen beschikbaar, altijd",
    examples: ["24/7 beschikbaar", "Vanaf je eigen huis", "Geen reistijd"]
  },
  {
    icon: Brain,
    title: "Personalisatie",
    description: "AI leert jouw unieke kenmerken",
    examples: ["Aangepast aan jouw gezicht", "Behoudt je persoonlijkheid", "Multiple stijlen mogelijk"]
  }
]

const realWorldStories = [
  {
    name: "Sarah, Marketing Manager",
    situation: "Nieuwe baan, verouderde LinkedIn foto",
    solution: "AI Portret Pro in 15 minuten",
    result: "40% meer profielweergaven binnen een week",
    quote: "Ik was sceptisch over AI, maar het resultaat was beter dan verwacht. Mijn collega's vroegen waar ik die mooie foto's had laten maken!"
  },
  {
    name: "Mark, Freelance Consultant",
    situation: "Regelmatig nieuwe foto's nodig voor verschillende klanten",
    solution: "AI voor variatie, traditioneel voor specials",
    result: "80% kostenreductie op fotografie",
    quote: "AI gaf me de flexibiliteit die ik nodig had. Voor belangrijke pitches gebruik ik nog steeds een fotograaf, maar voor LinkedIn en website is AI perfect."
  },
  {
    name: "Lisa, Startende Ondernemer",
    situation: "Strak budget, veel content nodig",
    solution: "Complete rebranding met AI foto's",
    result: "Professionele uitstraling zonder grote investering",
    quote: "Als starter kon ik geen €500 per fotoshoot uitgeven. AI gaf me direct een professionele uitstraling die mijn businesscredibiliteit enorm verhoogde."
  }
]

export default function AIIsNietEngPage() {
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
            <Badge className="mb-4 bg-green-600 text-white">
              AI & Technologie
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              AI is niet eng: Waarom kunstmatige intelligentie je vriend is
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                23 september 2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                6 min leestijd
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Voor AI-sceptici & nieuwsgierigen
              </div>
            </div>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
              "AI gaat onze banen overnemen!" "Robots worden te slim!" "Alles wordt fake!" Klinken deze zorgen bekend? Je bent niet de enige. Maar wat als ik je vertel dat AI je beste professionele vriend kan zijn?
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              In dit artikel ontkrachten we de grootste mythes over AI, delen we echte succesverhalen van professionals die AI omarmd hebben, en laten we zien waarom kunstmatige intelligentie juist jouw kansen vergroot in plaats van verkleint.
            </p>
          </div>

          {/* Myth Busting Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 Mythes ontkracht: De waarheid over AI</h2>
            
            <div className="space-y-6">
              {myths.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-green-50 rounded-lg p-6 border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="font-semibold text-red-700">MYTHE:</h3>
                      </div>
                      <p className="text-gray-700 italic">"{item.myth}"</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-green-700">REALITEIT:</h3>
                      </div>
                      <p className="text-gray-700 font-medium">{item.reality}</p>
                      <p className="text-gray-600 text-sm">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Waarom AI je beste werkbuddy is</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0077B5] text-white rounded-full flex items-center justify-center">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {benefit.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700 text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Human vs AI Partnership */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🤝 AI vervangt je niet - het versterkt je</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
              <p className="text-gray-700 leading-relaxed mb-6">
                De grootste misvatting over AI is dat het mensen vervangt. In werkelijkheid werkt AI het beste als een digitale assistent die jou meer tijd en mogelijkheden geeft voor wat echt belangrijk is.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-[#0077B5] mb-4">Wat AI doet (saai spul):</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#0077B5]" />
                      <span className="text-gray-700 text-sm">Repetitieve taken automatiseren</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#0077B5]" />
                      <span className="text-gray-700 text-sm">Technische kwaliteit garanderen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#0077B5]" />
                      <span className="text-gray-700 text-sm">Tijdrovende bewerkingen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#0077B5]" />
                      <span className="text-gray-700 text-sm">Consistente resultaten leveren</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-600 mb-4">Wat jij doet (leuk spul):</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">Strategische beslissingen maken</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">Creatieve richting bepalen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">Menselijke connecties maken</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">Je persoonlijkheid laten zien</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900">Het resultaat:</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Jij behoudt volledige controle over je professionele imago, terwijl AI de technische uitvoering perfect verzorgt. Het beste van beide werelden!
                </p>
              </div>
            </div>
          </div>

          {/* Real World Stories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Echte verhalen van AI-omarmers</h2>
            
            <div className="space-y-6">
              {realWorldStories.map((story, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{story.name}</h3>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700">Situatie:</div>
                          <div className="text-gray-600">{story.situation}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Oplossing:</div>
                          <div className="text-gray-600">{story.solution}</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Resultaat:</div>
                          <div className="text-green-600 font-medium">{story.result}</div>
                        </div>
                      </div>
                      
                      <blockquote className="italic text-gray-700 border-l-3 border-green-400 pl-4">
                        "{story.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Tips */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Hoe begin je vriendschap met AI?</h2>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-gray-700 leading-relaxed mb-6">
                Klaar om AI een kans te geven? Start klein en bouw vertrouwen op:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Start met iets simpels</h3>
                    <p className="text-gray-700 text-sm">Begin met een LinkedIn profielfoto - laag risico, hoog impact resultaat.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Vergelijk met je huidige aanpak</h3>
                    <p className="text-gray-700 text-sm">Test AI naast je gewone methode, zodat je het verschil zelf ervaart.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Accepteer dat het anders is</h3>
                    <p className="text-gray-700 text-sm">AI werkt anders dan menselijke processen - en dat is prima!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gebruik AI strategisch</h3>
                    <p className="text-gray-700 text-sm">Laat AI de repetitieve taken doen, zodat jij je kunt focussen op strategie en creativiteit.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Deel je ervaring</h3>
                    <p className="text-gray-700 text-sm">Help anderen hun angst te overwinnen door jouw positieve AI-ervaring te delen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔮 De toekomst is vriendelijk</h2>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                Kijk eens 5 jaar vooruit: professionals die AI omarmd hebben, zijn efficiënter, creatiever en succesvoller. Niet omdat AI hun werk overnam, maar omdat AI hen de tools gaf om beter te worden in wat ze doen.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                De keuze is simpel: word je vriend met AI nu, of worsteld later met achterstand. AI wacht niet op je goedkeuring - het evolueert elke dag.
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Waarom we van AI houden:
                </h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Het oordeelt niet over je fotogeniciteit</li>
                  <li>• Het heeft nooit een slechte dag</li>
                  <li>• Het geeft je méér opties, niet minder</li>
                  <li>• Het maakt professionele kwaliteit toegankelijk voor iedereen</li>
                  <li>• Het respecteert je tijd en budget</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Klaar voor je eerste AI-vriendschap? 🤖❤️</h3>
              <p className="text-lg opacity-90 mb-6">
                Test AI Portret Pro zonder risico - ervaar zelf waarom duizenden professionals AI omarmd hebben
              </p>
              
              <div className="text-lg mb-6 opacity-90">
                <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
                  <span className="text-center">✅</span>
                  <span>Geen technische kennis nodig</span>
                  <span className="text-center">✅</span>
                  <span>Resultaat in 15 minuten</span>
                  <span className="text-center">✅</span>
                  <span>Jouw persoonlijkheid behouden</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
                <Link href="/">
                  Maak vrienden met AI →
                </Link>
              </Button>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 De vriendelijke conclusie</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              AI is niet eng - het is praktisch, behulpzaam en vriendelijk. Het neemt niet je creativiteit weg, het geeft je juist meer tijd om creatief te zijn. Het vervangt je niet, het versterkt je.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              Duizenden professionals hebben de sprong al gewaagd en ontdekt dat AI hun beste digitale assistent is. Sluit je bij hen aan, of blijf achter met verouderde methoden en onnodige stress.
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h3 className="font-semibold text-gray-900 mb-2">💚 Een laatste gedachte:</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                De beste AI-tools voelen niet als "kunstmatige intelligentie" - ze voelen gewoon als een betere manier om dingen te doen. Probeer het één keer, en je begrijpt waarom iedereen zo enthousiast is.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="border-t border-gray-200 pt-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Overwin je AI-angst vandaag nog
              </h3>
              <p className="text-gray-600 mb-6">
                Een kleine stap voor jou, een grote stap voor je professionele carrière
              </p>
              <Button asChild size="lg" className="bg-[#0077B5] hover:bg-[#005885]">
                <Link href="/">
                  Begin je AI-reis →
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
                <Badge className="mb-3 bg-purple-600 text-white">AI & Technologie</Badge>
                <h3 className="font-bold text-gray-900 mb-2">AI fotografie vs traditionele fotografie: De eerlijke vergelijking</h3>
                <p className="text-gray-600 text-sm mb-4">Een objectieve vergelijking tussen AI en traditionele fotografie.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/ai-vs-traditionele-fotografie">
                    Lees meer →
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <Badge className="mb-3 bg-[#0077B5] text-white">LinkedIn & Professional</Badge>
                <h3 className="font-bold text-gray-900 mb-2">5 fouten die je LinkedIn foto verpesten</h3>
                <p className="text-gray-600 text-sm mb-4">Vermijd deze veelgemaakte fouten bij je professionele foto's.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/blog/linkedin-foto-fouten-ai-voorkomt">
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
