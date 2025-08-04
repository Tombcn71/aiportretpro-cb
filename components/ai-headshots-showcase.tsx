"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

const showcasePhotos = [
  "/images/professional-man-1.jpg",
  "/images/professional-woman-1.jpg",
  "/images/professional-man-2.jpg",
  "/images/professional-woman-2.jpg",
  "/images/professional-man-3.jpg",
  "/images/professional-woman-3.jpg",
  "/images/professional-man-4.jpg",
  "/images/professional-woman-4.jpg",
  "/images/professional-man-5.jpg",
  "/images/professional-woman-5.jpg",
  "/images/professional-man-6.jpg",
  "/images/professional-woman-6.jpg",
  "/images/professional-man-7.jpg",
  "/images/professional-woman-7.jpg",
  "/images/professional-man-8.jpg",
  "/images/professional-woman-8.jpg",
]

export function AIHeadshotsShowcase() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI-gegenereerde professionele headshots</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bekijk voorbeelden van onze AI-gegenereerde professionele portretfoto's. Elke foto is uniek en perfect
            afgestemd op jouw persoonlijke stijl.
          </p>
        </div>

        {/* Photo Grid - Closer spacing for larger photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {showcasePhotos.map((photo, index) => (
            <div key={index} className="relative group cursor-pointer" onClick={() => openLightbox(photo)}>
              <div className="aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`AI professionele headshot voorbeeld ${index + 1}`}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover brightness-110 contrast-105"
                  loading={index < 8 ? "eager" : "lazy"}
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg md:rounded-xl flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                  Klik voor groter
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Klaar voor jouw professionele headshots?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start nu en krijg binnen 15 minuten 40 unieke, professionele AI-headshots
          </p>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold shadow-lg"
          >
            <Link href="/wizard/welcome">
              Start Nu - €29
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

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
              alt="Vergroot AI headshot"
              width={800}
              height={1000}
              className="max-w-full max-h-[90vh] object-contain rounded-lg brightness-110 contrast-105"
            />
          </div>
        </div>
      )}
    </section>
  )
}
