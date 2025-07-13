"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, X, ChevronDown, ChevronUp, Star, Upload, Zap, Download } from "lucide-react"
import { Header } from "@/components/header"

const testimonials = [
  {
    name: "Sarah M.",
    role: "Marketing Manager",
    content:
      "Ongelooflijk! Mijn LinkedIn profiel ziet er nu zo professioneel uit. Kreeg direct meer connectieverzoeken!",
    rating: 5,
    image: "/images/woman1.jpg",
  },
  {
    name: "David K.",
    role: "Software Developer",
    content: "Perfect voor mijn job applications. De kwaliteit is beter dan verwacht en super snel geleverd.",
    rating: 5,
    image: "/images/man2.jpg",
  },
  {
    name: "Lisa R.",
    role: "HR Director",
    content: "Gebruiken dit nu voor ons hele team. Consistente, professionele look voor iedereen!",
    rating: 5,
    image: "/images/woman3.jpg",
  },
  {
    name: "Michael T.",
    role: "Consultant",
    content: "Bespaard me honderden euro's aan een professionele fotoshoot. Resultaat is fantastisch!",
    rating: 5,
    image: "/images/man4.jpg",
  },
  {
    name: "Emma V.",
    role: "Sales Manager",
    content: "Mijn collega's vroegen waar ik deze mooie foto's had laten maken. Ze geloofden niet dat het AI was!",
    rating: 5,
    image: "/images/woman2.jpg",
  },
  {
    name: "Tom B.",
    role: "Entrepreneur",
    content: "Game changer voor mijn personal branding. Professioneel, snel en betaalbaar!",
    rating: 5,
    image: "/images/man3.jpg",
  },
]

const carouselPhotos = [
  {
    id: 1,
    photo: "/images/man1.jpg",
    name: "Professional Man Portrait",
  },
  {
    id: 2,
    photo: "/images/woman1.jpg",
    name: "Professional Woman Portrait",
  },
  {
    id: 3,
    photo: "/images/man2.jpg",
    name: "Professional Man Portrait",
  },
  {
    id: 4,
    photo: "/images/woman2.jpg",
    name: "Professional Woman Portrait",
  },
  {
    id: 5,
    photo: "/images/man3.jpg",
    name: "Professional Man Portrait",
  },
  {
    id: 6,
    photo: "/images/woman3.jpg",
    name: "Professional Woman Portrait",
  },
  {
    id: 7,
    photo: "/images/man4.jpg",
    name: "Professional Man Portrait",
  },
  {
    id: 8,
    photo: "/images/woman4.jpg",
    name: "Professional Woman Portrait",
  },
  {
    id: 9,
    photo: "/images/man5.jpg",
    name: "Professional Man Portrait",
  },
  {
    id: 10,
    photo: "/images/man6.jpg",
    name: "Professional Man Portrait",
  },
]

const galleryPhotos = [
  "/images/man1.jpg",
  "/images/woman1.jpg",
  "/images/man2.jpg",
  "/images/woman2.jpg",
  "/images/man3.jpg",
  "/images/woman3.jpg",
  "/images/man4.jpg",
  "/images/woman4.jpg",
  "/images/man5.jpg",
  "/images/man6.jpg",
  "/images/man1.jpg",
  "/images/woman1.jpg",
  "/images/man2.jpg",
  "/images/woman2.jpg",
  "/images/man3.jpg",
  "/images/woman3.jpg",
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
    question: "Hoe lang duurt het om mijn portretten te ontvangen?",
    answer:
      "Je professionele portretten zijn meestal binnen 15-25 minuten klaar. Je ontvangt een e-mail zodra ze beschikbaar zijn in je dashboard.",
  },
  {
    question: "Hoeveel foto's krijg ik voor €29?",
    answer:
      "Je ontvangt 40 professionele portretten in hoge kwaliteit, perfect voor LinkedIn, CV's en andere professionele doeleinden.",
  },
  {
    question: "Welke foto's moet ik uploaden voor het beste resultaat?",
    answer:
      "Upload minimaal 4 foto's van jezelf met goede belichting. Een mix van close-ups en mid-range shots werkt het beste. Zorg ervoor dat je gezicht duidelijk zichtbaar is.",
  },
  {
    question: "Kan ik de achtergrond en kleding aanpassen?",
    answer:
      "Ja! Onze AI genereert automatisch verschillende professionele achtergronden en kledingstijlen die perfect zijn voor zakelijke portretten.",
  },
  {
    question: "Is mijn data veilig?",
    answer:
      "Absoluut. We nemen privacy zeer serieus. Je foto's worden veilig verwerkt en na 30 dagen automatisch verwijderd van onze servers.",
  },
  {
    question: "Kan ik een terugbetaling krijgen als ik niet tevreden ben?",
    answer:
      "Ja, we bieden een 100% geld-terug-garantie binnen 7 dagen als je niet volledig tevreden bent met je portretten.",
  },
  {
    question: "Werkt dit ook voor teams en bedrijven?",
    answer:
      "Ja! We hebben speciale pakketten voor teams en bedrijven. Neem contact met ons op voor aangepaste oplossingen en volume kortingen.",
  },
  {
    question: "In welke formaten krijg ik mijn portretten?",
    answer:
      "Alle portretten worden geleverd in hoge resolutie (HD) en zijn perfect geschikt voor online gebruik, print en professionele toepassingen.",
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
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Professionele <span className="text-[#0077B5]">portretfotos</span>
          <br />
          in enkele minuten voor 29€
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transformeer jouw selfies in professionele portretfotos met onze AI-technologie. Geen fotoshoot of fotograaf
          nodig – bespaar tijd, geld.
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

      {/* Photo Carousel */}
      <section className="w-full overflow-hidden mb-16 md:mb-24 bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="relative">
          <div className="flex animate-scroll">
            {carouselPhotos.concat(carouselPhotos).map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex-shrink-0 mx-1 md:mx-2">
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
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hoe werkt het?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              In 3 eenvoudige stappen naar professionele headshots
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
                Verschillende achtergronden met verschillende kleding. geen hoeden of zonnebrillen.
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
                Download je 40+ professionele portretfoto's en gebruik ze direct voor LinkedIn, CV en meer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Waarom kiezen voor AI Portrait Pro?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 text-[#0077B5] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Supersnel</h3>
                <p className="text-gray-600">Resultaten binnen 15 minuten. Makkelijk vanuit thuis, geen reistijd geen studio..</p>
              </CardContent>
            </Card>

            <Card className="border-[#0077B5]/20 hover:border-[#0077B5]/40 transition-colors">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-[#0077B5] mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Betaalbaar</h3>
                <p className="text-gray-600">
                  €29 voor AI portretfoto's. Bespaar tot wel 100 euro op een traditionele fotoshoot.
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

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Wat onze klanten zeggen</h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6">
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Card key={index} className="flex-shrink-0 w-80 border-[#0077B5]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Klaar voor je professionele headshots?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join duizenden professionals die al hun LinkedIn profiel hebben geüpgraded
          </p>
          <Link href="/pricing">
            <Button size="lg" className="bg-[#0077B5] hover:bg-[#005885] text-white px-8 py-4 text-lg">
              Start nu voor €29 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
          AI portretten portfolio
        </h2>
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
      <section className="container mx-auto px-4 py-12 md:py-16 bg-gray-50">
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

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-12 md:py-16 text-center">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
          Vertrouwd door meer dan <span className="text-[#0077B5]">1.000.000</span> professionals en{" "}
          <span className="text-[#0077B5]">teams</span>. 25.000.000+ zakelijke portretten gegenereerd tot nu toe.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-8 items-center mt-8 md:mt-12 opacity-60">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                width={120}
                height={40}
                className="max-w-full h-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0077B5] to-[#004182] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Klaar om je professionele zakelijke portretten te maken?
          </h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 opacity-90">
            Sluit je aan bij miljoenen professionals die onze AI technologie vertrouwen
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="bg-white text-[#0077B5] hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
          >
            <Link href="/pricing">
              Begin Nu <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0077B5] to-[#004182] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-lg md:text-xl font-bold">AI Portrait Pro</span>
              </div>
              <p className="text-gray-400 text-sm md:text-base">Professionele AI zakelijke portretten in minuten</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="hover:text-white transition-colors">
                    Voorbeelden
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Bedrijf</h3>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Over Ons
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm md:text-base">Ondersteuning</h3>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Helpcentrum
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    Veelgestelde Vragen
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Opnemen
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2025 AI Portret Pro. Alle rechten voorbehouden.</p>
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
        
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 10s linear infinite;
          }
        }
      `}</style>
    </div>
  )
}
