"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, X, ChevronDown, ChevronUp, Star, Upload, Zap, Download } from "lucide-react"
import { Header } from "@/components/header"
import { Facebook, Instagram, Linkedin } from "lucide-react"

const testimonials = [
  {
    name: "Tom B .",
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
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27693112-0.jpg-XFvF2mnZk0e3vyAZBgYBJwEgW7ekzJ.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 2,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tina5.jpg-MG3wlniYHfXtxrkhHd398p59VCXPvC.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 3,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27691283-3.jpg-o42jpJEtVlDKQSo87N8ke0mV4DH659.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 4,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tina.jpg-6tENXn8j1FIFy44VGFRqGuA8AK3aZn.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 5,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27691728-7.jpg-ljkdwNkJUh080Da4xpo9yxtXScZlwU.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 6,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27693786-0.jpg-uqX9N5LaqHqB7bbbQPMG5Tspuu85d5.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 7,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27692972-0.jpg-BKMXChGLh1nKiS04jpJuR2spK2MtMS.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 8,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27694689-0.jpg-rinLGBry4JFTuGmpT0T5lEyxuG6NIC.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 9,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27695045-1.jpg-IkKxB1U9N501QKro8xuovNpN8bYyzA.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 10,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27694199-3.jpg-iUC8zde67LRjahn8npRVJhDlHdolnG.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 11,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tom4.jpg-LDoo7oxRS7FtRFyn0ViKz3w1AMx6nS.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 12,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tina2.jpg-JmLfmZqKD3gQGbxEhfp1rdIYfcQqUk.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 13,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tom2.jpg-75Ga3OHoyMkLDbihmTESJEq5UI0CPQ.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 14,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tina4.jpg-Q65UYAWURSQ7QgRv6uWmjJxn4PBWdK.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 15,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tom3.jpg-8GBrNhaQHvPP2gi0mWUbVHbccPXwk8.jpeg",
    name: "Professional Man Portrait",
  },
  {
    id: 16,
    photo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tina1.jpg-BKAe2TB3CEtkqhVaW0K6ILS3cHgEc9.jpeg",
    name: "Professional Woman Portrait",
  },
  {
    id: 17,
    photo:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f8d2a738-b0bc-4a4f-9c9c-57dbd0af6bf0.jpg-H0C5Ulu0NP6oCzNiqzv2lr06pU8eNj.jpeg",
    name: "Professional Man Portrait",
  },
]

const galleryPhotos = [
  "/images/gallery1.jpg", // Man met bril (nieuw)
  "/images/gallery2.jpg", // Vrouw in grijs pak (nieuw)
  "/images/gallery3.jpg", // Man met bril (nieuw)
  "/images/gallery4.jpg", // Vrouw donker pak (nieuw)
  "/images/gallery5.jpg", // Man donker pak
  "/images/gallery6.jpg", // Vrouw blauw shirt
  "/images/gallery7.jpg", // Man blauw shirt
  "/images/gallery8.jpg", // Vrouw donker pak
  "/images/gallery9.jpg", // Man met bril blauw shirt
  "/images/gallery10.jpg", // Vrouw donker pak blauw shirt
  "/images/gallery11.jpg", // Man wit shirt (nieuw)
  "/images/gallery12.jpg", // Vrouw blauw shirt (nieuw)
  "/images/gallery1.jpg", // Man met bril (herhaling)
  "/images/gallery2.jpg", // Vrouw in grijs pak (herhaling)
  "/images/gallery3.jpg", // Man lachend (herhaling)
  "/images/gallery4.jpg", // Vrouw wit shirt (herhaling)
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
          in 15 minuten voor 29€
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
                      priority={index < 10}
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
                Download je 40 professionele portretfoto's en gebruik ze direct voor LinkedIn, CV en meer
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Klaar voor je professionele portretfoto's?
          </h2>
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
      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between space-y-8 lg:space-y-0">
            {/* Logo and Company Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/logo.png"
                  alt="AI Portrait Pro Logo"
                  width={30}
                  height={30}
                  className="rounded-lg"
                />
                <h3 className="text-xl font-bold text-white">aiportretpro</h3>
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
            <p className="text-gray-400 text-xs text-center">© 2025 aiportretpro. Alle rechten voorbehouden.</p>
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
