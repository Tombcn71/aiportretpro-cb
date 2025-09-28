"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, X, ChevronDown, ChevronUp, Shield, Check } from "lucide-react"
import Header from "@/components/header"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import AIHeadshotsShowcase from "@/components/ai-headshots-showcase"
import HowItWorks from "@/components/how-it-works"
import SchemaMarkup from "@/components/schema-markup"
import CityNavigation from "@/components/city-navigation"
import FAQSchema from "@/components/faq-schema"

// Gallery photos: New 16 professional photos in man-woman alternating order
const galleryPhotos = [
  "/images/professional-man-1.jpg", // Position 1 - Man
  "/images/professional-woman-1.jpg", // Position 2 - Woman
  "/images/professional-man-2.jpg", // Position 3 - Man
  "/images/professional-woman-2.jpg", // Position 4 - Woman
  "/images/professional-man-3.jpg", // Position 5 - Man
  "/images/professional-woman-3.jpg", // Position 6 - Woman
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

const faqData = [
  {
    question: "Hoe werkt deze app precies?",
    answer:
      "Onze app gebruikt slimme computerprogramma's (we noemen dat Artificiële Intelligentie of AI) om jouw gewone foto's om te toveren in professionele portretfoto's. Je uploadt een paar van je eigen foto's. De AI leert van deze foto's hoe jij eruitziet. Daarna kan het nieuwe foto's van jou maken in allerlei stijlen, alsof je bij een professionele fotograaf bent geweest.",
  },
  
  {
    question: "Is het veilig om mijn foto's te uploaden? Wat gebeurt ermee?",
    answer:
      "Ja, veiligheid is onze top prioriteit! Je foto's worden alleen gebruikt om de AI te trainen zodat deze de beste portretfoto's van jou kan maken. Zodra jouw portretfoto's klaar zijn en jij ze hebt gedownload, worden de getrainde modellen binnen 30 dagen van onze servers verwijderd, de originele foto's slaan we nooit op. We delen je foto's nooit met derden.",
  },
  {
    question: "Hoeveel foto's moet ik uploaden voor het beste resultaat?",
    answer:
      "Om de AI zo goed mogelijk te laten leren hoe jij eruitziet, raden we aan om minimaal 6 foto's te uploaden. Upload foto's met goede belichting, gemaakt op verschillende dagen met verschillende kleding en verschillende achtergronden. Een mix van close-ups en mid-range shots werkt het beste. Zorg ervoor dat je gezicht duidelijk zichtbaar is.",
  },
  
  
  {
    question: "Hoe lang duurt het voordat mijn portretfoto's klaar zijn?",
    answer:
      "De AI training en het genereren van je professionele portretfoto's duurt ongeveer 15 minuten. Ze verschijnen automatisch in je dashboard. De tijd kan soms iets variëren afhankelijk van hoe druk het is.",
  },
  {
    question: "Wat voor kleding draag ik tijdens de fotoshoot?",
    answer: "Je draagt tijdens de fotoshoot professionele outfits zoals; blazers, pakken, overhemden en blouses.",
  },
  {
    question: "Wat voor achtergrond hebben mijn foto's?",
    answer:
      "We gebruiken professionele achtergronden zoals een grijze studio back-drop en achtergronden van kantoren en trendy werkplekken",
  },
  {
    question: "Heb ik het recht om de foto's overal te gebruiken?",
    answer: "Ja, je hebt alle commerciële en persoonlijke rechten op jouw foto's.",
  },
  {
    question: "Zijn mijn betalingsgegevens veilig?",
    answer:
      "Ja, wij gebruiken Stripe als betaalplatform, stripe faciliteert ideal en credit card betalingen, wij zelf slaan nooit betalingsgegevens op.",
  },
  {
    question: "Hoe kan ik contact met jullie opnemen?",
    answer:
      "Stuur ons een bericht via de live chat of het contactformulier, indien niet direct, zullen wij contact met je opnemen via het e-mailadres dat je hebt opgegeven via de chat. Je kunt ook via de contact knop onder de faq contact opnemen. Ons team spreekt Nederlands.",
  },
  {
    question: "Kan ik een terugbetaling krijgen als ik niet tevreden ben?",
    answer:
      "Net als bij traditionele fotoshoots zijn niet alle foto's goed. Wij laten je alle resultaten zien zodat je zelf de goede uit kan kiezen. Wij beloven dat je aankoop van AI Portret Pro 100% risicoloos is want als je niet minstens 1 bruikbare portretfoto in je bestelling vindt, je 100% van je betaling terugkrijgt. Voorwaarde is wel dat je geen enkele foto gedownload hebt. Om dit proces in gang te zetten stuur ons een bericht via het contact formulier.",
  },
]

export default function HomePage() {
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
      <SchemaMarkup type="home" />
      <FAQSchema faqs={faqData} />
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 text-center">
        <h1 className="tracking-tight text-xl md:text-4xl font-bold mb-6 leading-tight">
          <span className="block">Professionele zakelijke fotoshoot nodig?</span>
          <span className="text-[#0077B5] block">Dit kan nu online zonder fotograaf</span>
        </h1>
        <p className="text-gray-500 text-lg mb-6 font-light italic">Even wat foto's uploaden, dat is alles.</p>

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
          <Link href="/login?source=homepage">
            Start jouw fotoshoot nu - € 29 <ArrowRight className="ml-2 h-6 md:h-7 w-6 md:w-7" />
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
                        alt={`AI portret voorbeeld ${index + 1}`}
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
                        alt={`AI portret voorbeeld ${index + 1}`}
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
      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-12 md:py-16 bg-gray-50">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4">Veelgestelde Vragen</h2>
        <p className="text-lg text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Hier beantwoorden we de meest voorkomende vragen over onze app, zodat je precies weet hoe het werkt!
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
              Professionele Zakelijke Foto's Laten Maken Online - De Slimme Keuze voor Professionals
            </h2>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                Wil je <strong>professionele zakelijke foto's laten maken</strong> zonder de hoge kosten van een traditionele fotograaf? 
                Met onze revolutionaire AI-technologie krijg je <strong>40 professionele foto's in slechts 15 minuten</strong> voor 
                slechts €29. Perfect voor LinkedIn, CV, website, visitekaartjes en alle zakelijke doeleinden.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Waarom Kiezen voor AI Portretfotografie?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>6x goedkoper</strong> dan traditionele fotoshoots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Geen afspraak nodig</strong> - start direct vanuit huis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>40 verschillende poses</strong> en achtergronden</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>Professionele kwaliteit</strong> gegarandeerd</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span><strong>14-dagen geld terug garantie</strong></span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect Voor Elk Doel</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">📸</span>
                      <span><strong>LinkedIn profielfoto's</strong> die opvallen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">💼</span>
                      <span><strong>CV en sollicitatie foto's</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">🌐</span>
                      <span><strong>Website en bedrijfsprofiel</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">📧</span>
                      <span><strong>E-mail handtekening</strong> en visitekaartjes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">📱</span>
                      <span><strong>Social media profielen</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              <p>
                Of je nu een <strong>zakelijke foto nodig hebt</strong> voor je startup, een <strong>headshot voor je corporate functie</strong>, 
                of <strong>professionele foto's voor je bedrijfsprofiel</strong> - onze AI fotografie service biedt de perfecte oplossing. 
                Geen gedoe met studio afspraken, dure fotograaf tarieven, of lange wachttijden.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hoe Werkt Het?</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Upload 6-12 foto's</strong> van jezelf (verschillende hoeken en kleding)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                    <span><strong>AI analyseert je gezicht</strong> en leert je unieke kenmerken</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                    <span><strong>15 minuten wachten</strong> terwijl de magie gebeurt</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                    <span><strong>Download 40 professionele foto's</strong> in hoge resolutie</span>
                  </div>
                </div>
              </div>

              <p>
                Onze <strong>AI portretfotografie</strong> gebruikt de nieuwste technologie om foto's te creëren die 
                onmogelijk te onderscheiden zijn van echte studio foto's. Met professionele belichting, 
                zakelijke achtergronden en perfect gepositioneerde shots, krijg je het beste van beide werelden: 
                <strong>professionele kwaliteit tegen een fractie van de kosten</strong>.
              </p>

              <p>
                Sluit je aan bij duizenden tevreden professionals die al hun <strong>zakelijke foto's lieten maken</strong> 
                met onze service. Van startende ondernemers tot C-level executives - iedereen kan profiteren van 
                een krachtige, professionele uitstraling die de juiste indruk maakt.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg my-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Populaire Zoektermen & Services</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Fotografie Services</h4>
                    <ul className="space-y-1">
                      <li>• Profielfoto laten maken</li>
                      <li>• Zakelijke portretfoto</li>
                      <li>• Corporate headshots</li>
                      <li>• Business foto's online</li>
                      <li>• CV foto professioneel</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Platform Specifiek</h4>
                    <ul className="space-y-1">
                      <li>• LinkedIn profielfoto maken</li>
                      <li>• Instagram business profiel</li>
                      <li>• Website about page foto</li>
                      <li>• Social media headshot</li>
                      <li>• Online dating profielfoto</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Technologie</h4>
                    <ul className="space-y-1">
                      <li>• AI fotografie Nederland</li>
                      <li>• Kunstmatige intelligentie foto</li>
                      <li>• Online fotoshoot thuis</li>
                      <li>• Virtuele fotostudio</li>
                      <li>• Automatische achtergrond</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p>
                <strong>Waarom AI Portret Pro de beste keuze is voor jouw zakelijke foto's:</strong> 
                We combineren geavanceerde AI-technologie met jarenlange ervaring in professionele fotografie. 
                Onze algoritmes zijn getraind op duizenden zakelijke portretten, waardoor we de perfecte balans 
                vinden tussen natuurlijkheid en professionaliteit. Of je nu werkt in tech, finance, marketing, 
                consulting, of welke sector dan ook - wij zorgen ervoor dat je de juiste indruk maakt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 hidden md:block">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Klaar voor je professionele portretfoto's?
          </h2>
          <p className="text-xl text-gray-600 mb-8">Laat zien wie je bent met een krachtige, professionele foto</p>
          {isClient && (
            <Link href="/login?source=homepage">
              <Button size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white px-8 py-4 text-lg">
                Start jouw fotoshoot nu - € 29 <ArrowRight className="ml-2 h-5 w-5" />
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
              alt="Vergroot portret"
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
                  alt="AI Portret Pro logo - LinkedIn foto laten maken"
                  width={30}
                  height={30}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold text-white">AI Portret Pro</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Professionele AI zakelijke portretten in minuten.
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
                <Link href="/linkedin-foto-laten-maken" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  LinkedIn Foto's
                </Link>
                <Link href="/fotografen" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Lokale Fotografen
                </Link>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Blog & Gidsen
                </Link>
              </div>
            </div>

            {/* LinkedIn per stad */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">LinkedIn Foto per Stad</h4>
              <div className="flex flex-col space-y-2">
                <Link href="/linkedin-foto-laten-maken-amsterdam" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Amsterdam
                </Link>
                <Link href="/linkedin-foto-laten-maken-rotterdam" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Rotterdam
                </Link>
                <Link href="/linkedin-foto-laten-maken-den-haag" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Den Haag
                </Link>
                <Link href="/linkedin-foto-laten-maken-utrecht" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Utrecht
                </Link>
                <Link href="/linkedin-foto-laten-maken-eindhoven" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Eindhoven
                </Link>
                <Link href="/linkedin-foto-laten-maken-tilburg" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Tilburg
                </Link>
                <Link href="/linkedin-foto-laten-maken-groningen" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Groningen
                </Link>
                <Link href="/linkedin-foto-laten-maken-almere" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Almere
                </Link>
                <Link href="/linkedin-foto-laten-maken-breda" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Breda
                </Link>
                <Link href="/linkedin-foto-laten-maken-nijmegen" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  Nijmegen
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
                  <Linkedin size={20} />
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

      {/* City Navigation - Footer */}
      <CityNavigation variant="footer" />

      {/* Floating CTA Button - Mobile Only */}
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 z-[2147483647] md:hidden">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <p className="text-center text-md font-bold text-gray-800 mb-4 mt-4">
              Doe direct jouw professionele fotoshoot online, makkelijk vanuit thuis zonder gedoe, voor slechts €29,-
            </p>
            <Button
              asChild
              size="lg"
              className="w-full bg-[#FF8C00] hover:bg-[#FFA500] text-white px-6 py-8 text-base font-semibold"
            >
              <Link href="/login?source=homepage">
                Start jouw fotoshoot nu - € 29 <ArrowRight className="ml-2 h-6 md:h-7 w-6 md:w-7" />
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
