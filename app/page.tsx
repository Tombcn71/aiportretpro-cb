"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, X, ChevronDown, ChevronUp, Upload, Zap, Download } from "lucide-react"
import Header from "@/components/header"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import PromoBanner from "@/components/promo-banner"

// Gallery photos: Exact order provided by user
const galleryPhotos = [
  "/images/carousel10.jpg", // Position 1
  "/images/carousel6.jpg", // Position 2
  "/images/new-woman3.jpg", // Position 3
  "/images/new-man4.jpg", // Position 4
  "/images/carousel2.jpg", // Position 5
  "/images/new-man2.jpg", // Position 6
  "/images/new-woman2.jpg", // Position 7
  "/images/new-man5.jpg", // Position 8
  "/images/carousel4.jpg", // Position 9
  "/images/new-man3.jpg", // Position 10
  "/images/new-woman4.jpg", // Position 11
  "/images/new-man6.jpg", // Position 12
  "/images/tina3.jpg", // Position 13
  "/images/carousel5.jpg", // Position 14
  "/images/new-woman1.jpg", // Position 15
  "/images/new-man1.jpg", // Position 16
]

// Carousel photos: Same exact order as gallery
const carouselPhotos = [  

{ id: 6, photo: "/images/new-man2.jpg", name: "Professional Man Portrait" },
  { id: 3, photo: "/images/new-woman3.jpg", name: "Professional Woman Portrait" },
  { id: 4, photo: "/images/new-man4.jpg", name: "Professional Man Portrait" },
  { id: 7, photo: "/images/new-woman2.jpg", name: "Professional Woman Portrait" },
  { id: 8, photo: "/images/new-man5.jpg", name: "Professional Man Portrait" },
  { id: 10, photo: "/images/new-man3.jpg", name: "Professional Man Portrait" },
  { id: 11, photo: "/images/new-woman4.jpg", name: "Professional Woman Portrait" },
  { id: 12, photo: "/images/new-man6.jpg", name: "Professional Man Portrait" },
  { id: 15, photo: "/images/new-woman1.jpg", name: "Professional Woman Portrait" },
  { id: 16, photo: "/images/new-man1.jpg", name: "Professional Man Portrait" },
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
    question: "Waarom AI Portret Pro?",
    answer:
      "AI Portret Pro maakt zakelijke portret-fotografie supersimpel voor iedereen, je kan dit gewoon vanaf overal met je laptop of telefoon doen. Met AI Portret Pro reduceren we de kosten en de tijd die je kwijt bent aan traditionele fotoshoots aanzienlijk.",
  },
  {
    question: "Kan dit een echte fotoshoot vervangen?",
    answer:
      "Ja, wij gebruiken FLUX AI technologie dit is de beste AI wat er bestaat en dit is niet meer van een traditionele fotoshoot te onderscheiden. Je kunt onze foto's overal gebruiken waar je traditionele foto's zou gebruiken.",
  },
  {
    question: "Welke foto's moet ik uploaden voor het beste resultaat?",
    answer:
      "Upload minimaal 6 foto's van jezelf met goede belichting.Gemaakt op verschillende dagen met verschillende kleding en verschillende achtergronden Een mix van close-ups en mid-range shots werkt het beste. Zorg ervoor dat je gezicht duidelijk zichtbaar is.",
  },

  {
    question: "Wat voor kleding draag ik tijdens de fotoshoot?",
    answer: "Je draagt tijdens de fotoshoot: blazers, pakken, overhemden en blouses.",
  },
  {
    question: "Wat voor achtergrond hebben mijn foto's?",
    answer:
      "We gebruiken professionele achtergronden zoals een grijze studio back-drop en achtergronden van kantorenen en trendy werkplekken",
  },
  {
    question: "Heb ik het recht om de foto's overal te gebruiken?",
    answer: "Ja, je hebt alle commerciële en persoonlijke rechten op jouw foto's.",
  },
  {
    question: "Is mijn data veilig?",
    answer:
      "Wij slaan geen trainingsfoto's op de server op, jouw resultaten worden na 30 dagen automatisch verwijderd. Zodat je genoeg tijd hebt om ze te downloaden.",
  },
  {
    question: "Zijn mijn betalingsgegevens veilig?",
    answer:
      "Ja, wij gebruiken Stripe als betaalplatform, stripe faciliteert ideal en credit card  betalingenen, wij zelf slaan nooit betalingsgegevens op.",
  },
  {
    question: "Hoe kan ik contact met jullie opnemen?",
    answer:
      "Stuur ons een bericht via de live chat, indien niet direct, zullen wij contact met je opnemen via het e-mailadres dat je hebt opgegeven via de chat. Je kunt ook via de contact knop onder de faq contact opnemen. Ons team spreekt Nederlands.",
  },
  {
    question: "Kan ik een terugbetaling krijgen als ik niet tevreden ben?",
    answer:
      "Net als bij  traditionele fotoshoots zijn niet alle foto's goed. Wij laten je alle resultaten zien zodat je zelf de goede uit kan kiezen. Wij beloven dat je  aankoop van AI Portret Pro 100% risicoloos is want als je niet minstens 1 bruikbare portretfoto in je bestelling vindt, je 100% van je betaling terugkrijgt. Voorwaarde is wel dat je geen enkele foto gedownload hebt. Om dit proces in gang te zetten stuur ons een bericht via het contact formulier  ",
  },
]

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  useEffect(() => {
    setIsClient(true)
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
    <div className="min-h-screen ">
      <PromoBanner />
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 text-center">
        <h1 className="tracking-tight text-2xl md:text-4xl font-bold mb-6">
          Professionele AI portretfoto's voor slechts <span className="text-[#0077B5]"> €29</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload 6 Foto's en krijg in 15 minuten portretfoto's van studiokwaliteit. Bespaar tientallen euro's en uren
          tijd.{" "}
        </p>

        <Button
          asChild
          size="lg"
          className="bg-[#0077B5] hover:bg-[#004182] text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg mb-8"
        >
          <Link href="/pricing">
            Maak nu je zakelijke portretten <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
          </Link>
        </Button>
      </section>

      {/* Photo Carousel - FIXED: Smooth continuous scrolling */}
      <section className="w-full overflow-hidden mb-16 md:mb-24 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="relative">
          <div className="carousel-container">
            <div className="carousel-track">
              {carouselPhotos.map((item, index) => (
                <div key={`carousel-${item.id}-${index}`} className="carousel-item">
                  <div className="relative">
                    <div className="w-40 h-52 md:w-64 md:h-80 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-md md:shadow-lg">
                      <Image
                        src={item.photo || "/placeholder.svg"}
                        alt={`${item.name} professioneel portret`}
                        width={256}
                        height={320}
                        className="w-full h-full object-cover brightness-110 contrast-105"
                        priority={index < 10}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate items for seamless looping */}
              {carouselPhotos.map((item, index) => (
                <div key={`carousel-dup-${item.id}-${index}`} className="carousel-item">
                  <div className="relative">
                    <div className="w-40 h-52 md:w-64 md:h-80 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 shadow-md md:shadow-lg">
                      <Image
                        src={item.photo || "/placeholder.svg"}
                        alt={`${item.name} professioneel portret`}
                        width={256}
                        height={320}
                        className="w-full h-full object-cover brightness-110 contrast-105"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hoe werkt het?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              In 3 eenvoudige stappen naar professionele portretfoto's
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="relative mb-6 mx-auto w-64 h-48">
                <Image src="/images/voorbeeld1.png" alt="Upload selfies" fill className="object-contain rounded-lg" />
              </div>
              <div className="w-12 h-12 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload 6+ goede foto's</h3>
              <p className="text-gray-600">
                Foto's met verschillende achtergronden met verschillende kleding. Gezicht naar de camera, vanaf je
                schouders of je middel. geen hoeden of zonnebrillen.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6 mx-auto w-64 h-48">
                <Image src="/images/wazig1.png" alt="AI processing" fill className="object-contain rounded-lg" />
              </div>
              <div className="w-12 h-12 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Onze AI gaat aan de slag voor je</h3>
              <p className="text-gray-600">
                Onze geavanceerde AI analyseert je foto's en creëert professionele portretfoto's
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6 mx-auto w-64 h-48">
                <Image
                  src="/images/resultaat1.png"
                  alt="Professional results"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <div className="w-12 h-12 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gefeliciteerd! Je portretfoto's zijn klaar</h3>
              <p className="text-gray-600">
                Download je 40 professionele portretfoto's en gebruik ze direct voor LinkedIn, Social Media, CV, Website
                of Print
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Waarom kiezen voor AI Portret Pro?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-[#0077B5] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Supersnel</h3>
                <p className="text-gray-600">
                  Resultaten binnen 15 minuten. Makkelijk vanuit thuis, geen reistijd geen studio..
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-[#0077B5] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Beste deal</h3>
                <p className="text-gray-600">
                  €29 voor AI portretfoto's. Bespaar tot wel 75% op een traditionele fotoshoot.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors">
              <CardContent className="p-6 text-center">
                <Download className="h-12 w-12 text-[#0077B5] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hoge kwaliteit</h3>
                <p className="text-gray-600">
                  Professionele kwaliteit die niet te onderscheiden is van traditionele fotoshoots.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Klaar voor je professionele portretfoto's?
          </h2>
          <p className="text-xl text-gray-600 mb-8">Laat zien wie je bent met een krachtige, professionele foto </p>
          <Link href="/pricing">
            <Button size="lg" className="bg-[#0077B5] hover:bg-[#005885] text-white px-8 py-4 text-lg">
              Start nu voor slechts €29 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">AI portfolio</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {galleryPhotos.map((photo, index) => (
            <div
              key={index}
              className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
              onClick={() => openLightbox(photo)}
            >
              <Image
                src={photo || "/placeholder.svg"}
                alt={`AI portret voorbeeld ${index + 1}`}
                width={300}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-110 contrast-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4 text-sm md:text-base">
                  Klik om te vergroten
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-600 mb-4 text-sm md:text-base">Klik op een foto om te vergroten</p>
          <Button asChild className="bg-[#0077B5] hover:bg-[#004182] text-white">
            <Link href="/pricing">
              Maak jouw portretten <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-12 md:py-16 bg-gray-50">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Veelgestelde Vragen</h2>
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

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Klaar voor je professionele portretfoto's?
          </h2>
          <p className="text-xl text-gray-600 mb-8">Laat zien wie je bent met een krachtige, professionele foto</p>
          <Link href="/pricing">
            <Button size="lg" className="bg-[#0077B5] hover:bg-[#005885] text-white px-8 py-4 text-lg">
              Start nu voor slechts €29 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

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
          animation: carousel 60s linear infinite;
        }

        .carousel-item {
          flex-shrink: 0;
          margin: 0 0.5rem;
        }

        @keyframes carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 2));
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
            animation: carousel 40s linear infinite;
          }
        }
      `}</style>
    </div>
  )
}
