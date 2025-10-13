"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, X, ChevronDown, ChevronUp, Shield, Check, LinkedinIcon } from "lucide-react"
import Header from "@/components/header"
import { Facebook, Instagram } from "lucide-react"
import AIHeadshotsShowcase from "@/components/ai-headshots-showcase"
import HowItWorks from "@/components/how-it-works"

// Gallery photos: New 16 professional photos in man-woman alternating order
const galleryPhotos = [
  "/images/professional-man-1.jpg", // Position 1 - Man
  "/images/professional-woman-1.jpg", // Position 2 - Woman
  "/images/professional-man-2.jpg", // Position 3 - Man
  "/images/professional-woman-2.jpg", // Position 4 - Woman
  "/images/professional-man-3.jpg", // Position 5 - Man
  "/images/professional-woman-1.jpg", // Position 6 - Woman
  "/images/professional-man-4.jpg", // Position 7 - Man
  "/images/professional-woman-4.jpg", // Position 8 - Woman
  "/images/professional-man-5.jpg", // Position 9 - Man
  "/images/professional-woman-5.jpg", // Position 10 - Woman
  "/images/professional-man-6.jpg", // Position 11 - Man
  "/images/professional-woman-6.jpg", // Position 12 - Woman
  "/images/professional-man-7.jpg", // Position 13 - Man
  "/images/professional-woman-7.jpg", // Position 14 - Woman
  "/images/professional-man-8.jpg", // Position 15 - Man
  "/images/professional-woman-8.jpg", // Position 16 - Woman
]

const companies = [
  { name: "Microsoft", logo: "/placeholder.svg?height=40&width=120&text=Microsoft" },
  { name: "Google", logo: "/placeholder.svg?height=40&width=120&text=Google" },
  { name: "Apple", logo: "/placeholder.svg?height=40&width=120&text=Apple" },
  { name: "Amazon", logo: "/placeholder.svg?height=40&width=120&text=Amazon" },
  { name: "Meta", logo: "/placeholder.svg?height=40&width=120&text=Meta" },
  { name: "Netflix", logo: "/placeholder.svg?height=40&width=120&text=Netflix" },
  { name: "Tesla", logo: "/placeholder.svg?height=40&width=120&text=Tesla" },
  { name: "Spotify", logo: "/placeholder.svg?height=40&width=120&text=Spotify" },
]

// LinkedIn-specific FAQ data with SEO keywords
const faqData = [
  {
    question: "Waarom is een LinkedIn profielfoto zo belangrijk voor mijn carrière?",
    answer:
      "Je LinkedIn profielfoto is vaak het eerste wat potentiële werkgevers, recruiters en zakelijke contacten van je zien. Onderzoek toont aan dat profielen met professionele LinkedIn foto's 14x meer profielweergaves krijgen en 36% meer berichten ontvangen. Een krachtige LinkedIn profielfoto verhoogt je zichtbaarheid, vertrouwen en professionele uitstraling aanzienlijk.",
  },
  {
    question: "Wat maakt een perfecte LinkedIn profielfoto?",
    answer:
      "De perfecte LinkedIn profielfoto is professioneel, helder en vertrouwenwekkend. Key elementen zijn: gezicht vult 60% van de foto, professionele kleding, neutrale achtergrond, natuurlijke glimlach, en goede belichting. Onze AI genereert automatisch LinkedIn-geoptimaliseerde foto's die voldoen aan alle LinkedIn richtlijnen en best practices.",
  },
  
  {
    question: "Hoeveel LinkedIn foto's krijg ik en hoe snel zijn ze klaar?",
    answer:
      "Je ontvangt 40 verschillende professionele LinkedIn profielfoto variaties binnen 15 minuten. Alle foto's zijn geoptimaliseerd voor LinkedIn's specificaties (minimaal 400x400 pixels) en perfect bruikbaar voor je LinkedIn profiel, website, email handtekening en andere professionele doeleinden.",
  },
  {
    question: "Zijn de AI-gegenereerde LinkedIn foto's even professioneel als studio foto's?",
    answer:
      "Absoluut! Onze AI is gespecialiseerd in het creëren van studio-kwaliteit LinkedIn profielfoto's. Ze zijn onherkenbaar van traditionele fotograaf foto's maar dan 6 x goedkoper en binnen 15 minuten klaar. Perfect voor professionals die snel een professionele LinkedIn foto nodig hebben zonder de hoge kosten van een fotostudio.",
  },
  {
    question: "Voldoen de foto's aan alle LinkedIn richtlijnen en specificaties?",
    answer:
      "Ja, alle LinkedIn foto's voldoen volledig aan LinkedIn's community richtlijnen en technische specificaties. Ze zijn professioneel, passend gekleed, en geoptimaliseerd voor maximale impact op het LinkedIn platform. Je kunt ze direct uploaden als LinkedIn profielfoto zonder zorgen over policy violations.",
  },
  {
    question: "Kan ik de LinkedIn foto's ook gebruiken voor andere professionele doeleinden?",
    answer:
      "Zeker! Hoewel geoptimaliseerd voor LinkedIn, zijn alle foto's perfect bruikbaar voor je zakelijke website, email handtekening, corporate presentaties, persberichten, en andere professionele toepassingen. Je hebt volledige commerciële rechten op alle foto's.",
  },
  {
    question: "Hoe verhoogt een professionele LinkedIn foto mijn carrièrekansen?",
    answer:
      "Een sterke LinkedIn profielfoto verhoogt significant je zichtbaarheid bij recruiters en potentiële werkgevers. Studies tonen aan dat professionals met professionele LinkedIn foto's meer wordt benaderd voor jobs, hebben hogere klik-through rates op hun profiel, en worden gezien als betrouwbaarder en competenter. Het is een investering in je professionele brand.",
  }
]



export default function LinkedInProfielFotoPage() {
  const [isClient, setIsClient] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
    // Return undefined (no cleanup function needed)
    return undefined
  }, [])

  useEffect(() => {
    setIsClient(true)
    // Return undefined (no cleanup function needed)
    return undefined
  }, [])

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen pt-20">
      <Header />

      {/* Hero Section - LinkedIn Optimized */}
      <section className="container mx-auto px-4 py-6 text-center">
        <h1 className="tracking-tight text-xl md:text-4xl font-bold mb-6 leading-tight">
          <span className="block">Professionele foto voor LinkedIn laten maken?</span>
          <span className="text-[#0077B5] block">Dit kan nu ook online zonder fotograaf!</span>
        </h1>
        <p className="text-gray-500 text-lg mb-6 font-light italic">Even wat foto's uploaden, dat is alles.

</p>

        <div className="text-md md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-center">
          <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
            <span className="text-center">✅</span>
            <span>6 x goedkoper dan een fotograaf</span>
            <span className="text-center">✅</span>
            <span>40 professionele foto's in 15 min</span>
            <span className="text-center">✅</span>
            <span>Perfect voor linkedin, website en print</span>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className=" bg-[#FF8C00] hover:bg-[#FFA500] text-white px-6 md:px-10 py-8 md:py-8 text-base md:text-lg mb-3 md:max-w-sm"
        >
          <Link href="/pricing">
            <LinkedinIcon className="mr-2 h-5 md:h-6 w-5 md:w-6" />
            Start je LinkedIn fotoshoot - € 29 <ArrowRight className="ml-2 h-6 md:h-7 w-6 md:w-7" />
          </Link>
        </Button>

        {/* Trust Shield */}
        <div className="flex items-center justify-center gap-2 text-[#0077B5] font-medium text-sm mb-8">
          <div className="relative">
            <Shield className="h-5 w-5 fill-current text-[#0077B5]" />
            <Check className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" strokeWidth={3} />
          </div>
          <span>14-DAGEN GELD TERUG GARANTIE</span>
        </div>
      </section>

      {/* Photo Carousel - FIXED: Smooth continuous scrolling */}
      <section className="w-full overflow-hidden mb-16 md:mb-24 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="relative">
          <div className="carousel-container">
            <div className="carousel-track">
              {galleryPhotos.map((photo, index) => (
                <div key={`carousel-${index}`} className="carousel-item">
                  <div className="relative">
                    <div className="w-52 h-[10.11rem] md:w-80 md:h-[15.56rem] rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-md md:shadow-lg">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`LinkedIn portret voorbeeld ${index + 1}`}
                        width={1152}
                        height={896}
                        className="w-full h-full object-contain bg-gray-50 brightness-110 contrast-105"
                        priority={index < 10}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate items for seamless looping */}
              {galleryPhotos.map((photo, index) => (
                <div key={`carousel-dup-${index}`} className="carousel-item">
                  <div className="relative">
                    <div className="w-52 h-[10.11rem] md:w-80 md:h-[15.56rem] rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-md md:shadow-lg">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`LinkedIn portret voorbeeld ${index + 1}`}
                        width={1152}
                        height={896}
                        className="w-full h-full object-contain bg-gray-50 brightness-110 contrast-105"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* AI Headshots Showcase - Replaces Photo Gallery */}
      <AIHeadshotsShowcase />
 {/* How It Works - New Component */}
 <HowItWorks />
      {/* AI vs Traditional Comparison */}
      <section className="py-16 bg-gradient-to-r from-[#0077B5]/5 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              AI fotografie vs. traditionele fotograaf
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Waarom je hierna niet meer naar een fotostudio hoeft te gaan
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Photography */}
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Traditionele Fotograaf</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">€180+ per sessie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Halve dag kwijt + reistijd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">5-10 foto's maximum</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Wachten op afspraak</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Stress voor de camera</span>
                  </div>
                </div>
              </div>

              {/* AI Photography */}
              <div className="bg-[#0077B5] p-8 rounded-lg text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  POPULAIR
                </div>
                <h3 className="text-2xl font-semibold mb-6">AI Portret Pro</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Slechts €29 totaal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>15 minuten resultaat</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>40 professionele variaties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Direct beschikbaar 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Gewoon thuis op je bank</span>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* Target Professionals Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Voor welke professionals is dit perfect?
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Van ambitieuze starters tot ervaren leiders - onze AI helpt elke professional 
              hun LinkedIn impact te maximaliseren
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0077B5] p-3 rounded-lg flex-shrink-0">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0077B5]">ZZP'ers & Ondernemers</h3>
                    <p className="text-gray-600 mb-3">
                      Jij bent je eigen merk. Stop met amateuristische selfies en laat zien dat je serieus bent. 
                      Onze AI creëert foto's die vertrouwen wekken bij potentiële klanten.
                    </p>
                    <div className="text-sm text-[#0077B5] font-semibold">
                      → Meer klanten via LinkedIn DM's
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0077B5] p-3 rounded-lg flex-shrink-0">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0077B5]">Sollicitanten & Carrièrestarters</h3>
                    <p className="text-gray-600 mb-3">
                      Recruiters scrollen door honderden profielen. Een sterke foto zorgt ervoor 
                      dat je opvalt en uitgenodigd wordt voor gesprekken - geen wegkijken meer.
                    </p>
                    <div className="text-sm text-[#0077B5] font-semibold">
                      → 3x meer recruiter berichten
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0077B5] p-3 rounded-lg flex-shrink-0">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0077B5]">Young Professionals</h3>
                    <p className="text-gray-600 mb-3">
                      Jouw generatie snapt de kracht van social media. Zorg dat senior professionals 
                      je willen connecten - niet wegklikken omdat je foto niet professioneel genoeg is.
                    </p>
                    <div className="text-sm text-[#0077B5] font-semibold">
                      → Sneller senior netwerk opbouwen
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0077B5] p-3 rounded-lg flex-shrink-0">
                    <span className="text-white text-xl">👑</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#0077B5]">Managers & Leidinggevenden</h3>
                    <p className="text-gray-600 mb-3">
                      Jouw leidinggevende positie verdient een foto die autoriteit uitstraalt. 
                      Geen tijd voor fotoshoots? Onze AI begrijpt executive presence.
                    </p>
                    <div className="text-sm text-[#0077B5] font-semibold">
                      → Meer thought leadership engagement
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>

      {/* City Pages Section - Internal Links for SEO */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
              LinkedIn Foto Laten Maken in Jouw Stad
            </h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Vind lokale informatie, prijzen en tips voor jouw stad. Elke stad heeft unieke LinkedIn professionals met specifieke behoeften.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link 
                href="/linkedin-foto-laten-maken-amsterdam" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏛️</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Amsterdam</h3>
                  <p className="text-sm text-gray-500 mt-1">450k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-rotterdam" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">⚓</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Rotterdam</h3>
                  <p className="text-sm text-gray-500 mt-1">300k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-den-haag" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏛️</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Den Haag</h3>
                  <p className="text-sm text-gray-500 mt-1">250k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-utrecht" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🚂</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Utrecht</h3>
                  <p className="text-sm text-gray-500 mt-1">200k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-eindhoven" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Eindhoven</h3>
                  <p className="text-sm text-gray-500 mt-1">180k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-groningen" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🌾</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Groningen</h3>
                  <p className="text-sm text-gray-500 mt-1">120k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-tilburg" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏭</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Tilburg</h3>
                  <p className="text-sm text-gray-500 mt-1">100k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-breda" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🎭</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Breda</h3>
                  <p className="text-sm text-gray-500 mt-1">95k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-nijmegen" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏰</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Nijmegen</h3>
                  <p className="text-sm text-gray-500 mt-1">90k+ professionals</p>
                </div>
              </Link>

              <Link 
                href="/linkedin-foto-laten-maken-almere" 
                className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏙️</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0077B5]">Almere</h3>
                  <p className="text-sm text-gray-500 mt-1">85k+ professionals</p>
                </div>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Elke stad heeft unieke LinkedIn professionals. Bekijk stad-specifieke prijzen, statistieken en tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - LinkedIn Optimized */}
      <section id="faq" className="container mx-auto px-4 py-12 md:py-16 bg-white">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">LinkedIn Profielfoto FAQ</h2>
        <p className="text-lg text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Alles over professionele LinkedIn foto's en hoe ze je carrière kunnen boosten!
        </p>
        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full bg-white rounded-lg p-4 md:p-6 text-left hover:shadow-md transition-shadow duration-200 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-[#0077B5] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#0077B5] flex-shrink-0" />
                  )}
                </div>
                {openFaqIndex === index && (
                  <div className="mt-4 text-gray-600 text-sm md:text-base leading-relaxed">{faq.answer}</div>
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-600 mb-4 text-sm md:text-base">Nog vragen? We helpen je graag!</p>
          <Button
            asChild
            variant="outline"
            className="border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white bg-transparent"
          >
            <Link href="/contact">Neem Contact Op</Link>
          </Button>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              LinkedIn Foto Laten Maken - Professionele Profielfoto's Online
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                Een <strong>professionele LinkedIn foto laten maken</strong> is cruciaal voor je online aanwezigheid en carrière. 
                Met onze AI-technologie krijg je <strong>40 LinkedIn-specifieke professionele foto's in slechts 15 minuten</strong> voor 
                slechts €29. Perfect geoptimaliseerd voor LinkedIn's profielfoto guidelines en professionele uitstraling.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Waarom een Professionele LinkedIn Foto Belangrijk Is</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">📈</span>
                      <span><strong>14x meer profielweergaven</strong> dan zonder foto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">🎯</span>
                      <span><strong>36% meer berichten</strong> van recruiters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">💼</span>
                      <span><strong>Betere netwerkmogelijkheden</strong> en connecties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">🚀</span>
                      <span><strong>Professionele uitstraling</strong> die vertrouwen wekt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">⭐</span>
                      <span><strong>Sta uit tussen duizenden</strong> LinkedIn profielen</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">LinkedIn Foto Guidelines & Tips</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Professionele kleding</strong> (pak, blazer, overhemd)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Neutrale achtergrond</strong> die niet afleidt</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Vriendelijke glimlach</strong> en zelfvertrouwen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Goede belichting</strong> op je gezicht</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Square format</strong> perfect voor LinkedIn</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Of je nu een <strong>LinkedIn profielfoto nodig hebt</strong> voor een nieuwe baan, een <strong>corporate LinkedIn foto</strong> voor je bedrijf, 
                of gewoon je <strong>LinkedIn profiel wilt upgraden</strong> - onze AI fotografie service biedt de perfecte oplossing. 
                Geen dure studio sessies, geen lange wachttijden, gewoon direct professionele resultaten.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hoe Werkt LinkedIn Foto Maken?</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Upload 6-12 foto's</strong> van jezelf (verschillende hoeken en kleding)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <span><strong>AI analyseert je gezicht</strong> en LinkedIn-specifieke stijl</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <span><strong>15 minuten wachten</strong> terwijl AI LinkedIn foto's genereert</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                    <span><strong>Download 40 LinkedIn foto's</strong> perfect geoptimaliseerd voor je profiel</span>
                  </div>
                </div>
              </div>

              <p>
                Onze <strong>AI LinkedIn fotografie</strong> gebruikt geavanceerde algoritmes die specifiek getraind zijn op 
                professionele LinkedIn profielfoto's. We zorgen voor de perfecte belichting, professionele achtergronden, 
                en zakelijke uitstraling die recruiters en potentiële werkgevers verwachten. 
                <strong>Het resultaat? Een LinkedIn profiel dat opvalt en vertrouwen wekt</strong>.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">LinkedIn Specifieke Zoektermen</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">LinkedIn Foto Services</h4>
                    <ul className="space-y-1">
                      <li>• LinkedIn profielfoto maken</li>
                      <li>• LinkedIn headshot fotografie</li>
                      <li>• Corporate LinkedIn foto</li>
                      <li>• LinkedIn profiel foto professional</li>
                      <li>• Business LinkedIn headshot</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Online LinkedIn Foto</h4>
                    <ul className="space-y-1">
                      <li>• LinkedIn foto online maken</li>
                      <li>• LinkedIn profielfoto thuis</li>
                      <li>• Virtuele LinkedIn fotoshoot</li>
                      <li>• LinkedIn foto AI Nederland</li>
                      <li>• Online LinkedIn portret</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">LinkedIn Optimalisatie</h4>
                    <ul className="space-y-1">
                      <li>• LinkedIn profiel verbeteren</li>
                      <li>• LinkedIn uitstraling professional</li>
                      <li>• LinkedIn netwerken foto</li>
                      <li>• LinkedIn recruiter foto</li>
                      <li>• LinkedIn business foto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                <strong>Waarom AI Portret Pro de beste keuze is voor je LinkedIn foto:</strong> 
                We begrijpen de unieke vereisten van LinkedIn profielfoto's. Onze AI is specifiek getraind op 
                duizenden succesvolle LinkedIn profielen, waardoor we de perfecte balans vinden tussen 
                professionaliteit en toegankelijkheid. Of je nu werkt in tech, finance, marketing, 
                consulting, of welke sector dan ook - wij zorgen ervoor dat je LinkedIn profiel de juiste indruk maakt.
              </p>

              <p>
                Sluit je aan bij duizenden professionals die hun <strong>LinkedIn profielfoto lieten maken</strong> 
                met onze service. Van recent afgestudeerden tot C-level executives - iedereen kan profiteren van 
                een krachtige, professionele LinkedIn foto die opvalt en vertrouwen wekt bij recruiters en 
                potentiële zakenpartners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hidden md:block">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Klaar voor je professionele LinkedIn foto?
          </h2>
          <p className="text-xl text-gray-600 mb-8">Verhoog je LinkedIn zichtbaarheid met een krachtige profielfoto</p>
          {isClient && (
            <Link href="/pricing">
              <Button size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white px-8 py-4 text-lg">
                <LinkedinIcon className="mr-2 h-5 w-5" />
                Start je LinkedIn fotoshoot - € 29 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-8 md:-top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Vergroot LinkedIn portret"
              width={800}
              height={1000}
              className="max-w-full max-h-[90vh] object-contain rounded-lg brightness-110 contrast-105"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between space-y-8 lg:space-y-0">
            {/* Logo and Company Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/logo-icon.png"
                  alt="AI Portrait Pro Logo"
                  width={30}
                  height={30}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold text-white">AI Portret Pro</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Professionele AI LinkedIn portretten in minuten.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Navigatie</h4>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/over-ons"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  Over Ons
                </Link>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Prijzen
                </Link>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Contact
                </Link>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Homepage
                </Link>
                <Link href="/fotografen" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Lokale Fotografen
                </Link>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Juridisch</h4>
              <div className="flex flex-col space-y-2">
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Terms
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Volg Ons</h4>
              <div className="flex space-x-4">
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={20} />
                </Link>
                <Link
                  href="https://www.facebook.com/profile.php?id=61578343760041"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </Link>
                <Link
                  href="https://www.instagram.com/aiportretpro.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <p className="text-gray-400 text-xs text-center">© 2025 AI Portret Pro. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button - Mobile Only */}
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 z-[2147483647] md:hidden">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <p className="text-center text-md font-bold text-gray-800 mb-4 mt-4">
              Doe direct jouw LinkedIn fotoshoot online, makkelijk vanuit thuis zonder gedoe!
            </p>
            <Button
              asChild
              size="lg"
              className="w-full bg-[#FF8C00] hover:bg-[#FFA500] text-white px-6 py-8 text-base font-semibold"
            >
              <Link href="/pricing">
                <LinkedinIcon className="mr-2 h-5 w-5" />
                LinkedIn fotoshoot - € 29 <ArrowRight className="ml-2 h-6 md:h-7 w-6 md:w-7" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <style jsx>{`
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    .animate-scroll {
      animation: scroll 15s linear infinite;
    }

    .animate-scroll:hover {
      animation-play-state: paused;
    }

    .carousel-container {
      width: 100%;
      overflow: hidden;
      position: relative;
    }

    .carousel-track {
      display: flex;
      width: fit-content;
      animation: carousel 140s linear infinite;
    }

    .carousel-item {
      flex-shrink: 0;
      margin: 0 0.5rem;
    }

    @keyframes carousel {
      0% {
        transform: translateX(calc(-100% / 2));
      }
      100% {
        transform: translateX(0);
      }
    }

    .carousel-track:hover {
      animation-play-state: paused;
    }

    @media (max-width: 768px) {
      .animate-scroll {
        animation: scroll 10s linear infinite;
      }
      .carousel-track {
        animation: carousel 140s linear infinite;
      }
    }
  `}</style>
    </div>
  )
}
