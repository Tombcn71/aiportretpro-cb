"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"

interface PhotoGalleryProps {
  title?: string
  showButton?: boolean
  buttonText?: string
  buttonHref?: string
  columns?: 2 | 3 | 4 | 5 | 6
}

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

export default function PhotoGallery({
  title = "AI portretfoto's voorbeelden",
  showButton = true,
  buttonText = "Maak jouw portretten",
  buttonHref = "/pricing",
  columns = 4,
}: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const getGridCols = () => {
    switch (columns) {
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2 md:grid-cols-3"
      case 4:
        return "grid-cols-2 md:grid-cols-4"
      case 5:
        return "grid-cols-2 md:grid-cols-5"
      case 6:
        return "grid-cols-2 md:grid-cols-6"
      default:
        return "grid-cols-2 md:grid-cols-4"
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">{title}</h2>
      <div className={`grid ${getGridCols()} gap-3 md:gap-4`}>
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

      {showButton && (
        <div className="text-center mt-6 md:mt-8">
          <p className="text-gray-600 mb-4 text-sm md:text-base">Klik op een foto om te vergroten</p>
          <Button asChild className="bg-[#0077B5] hover:bg-[#004182] text-white">
            <Link href={buttonHref}>
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

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
    </section>
  )
}
