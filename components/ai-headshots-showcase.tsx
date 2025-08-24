"use client"

import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"

const profiles = [
  {
    beforeImages: [
      "/images/casual-woman-1.jpg",
      "/images/casual-woman-2.jpg",
      "/images/casual-woman-3.jpg",
      "/images/casual-woman-4.jpg",
    ],
    afterImages: [
      "/images/professional-woman-1.jpg",
      "/images/professional-woman-2.jpg",
      "/images/professional-woman-3.jpg",
      "/images/professional-woman-4.jpg",
    ],
  },
  {
    beforeImages: [
      "/images/new-casual-man-1.jpg",
      "/images/new-casual-man-2.jpg",
      "/images/new-casual-man-3.jpg",
      "/images/new-casual-man-4.jpg",
    ],
    afterImages: [
      "/images/professional-man-1.jpg",
      "/images/professional-man-2.jpg",
      "/images/professional-man-3.jpg",
      "/images/professional-man-4.jpg",
    ],
  },
]

export default function AIHeadshotsShowcase() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const openLightbox = (imageSrc: string) => {
    setLightboxImage(imageSrc)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
Voorbeelden          </h2>
          <p className="text-xl text-gray-600">Upload een paar foto's
Na 15 minuten AI training ontvang je 40 professioneleportretfoto's  </p>
        </div>

        <div className="lg:grid-cols-2 gap-20 max-w-6xl mx-auto grid">
          {profiles.map((profile, profileIndex) => (
            <div key={profileIndex} className={`space-y-2 ${profileIndex === 1 ? 'hidden lg:block' : ''}`}>
              {/* Small photos row */}
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-3">
                  {profile.beforeImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Casual photo ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover shadow-md border-2 border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/*  Curved Arrow */}
              <div className="flex justify-center pb-4">
                <Image
                  src="/images/curved-arrow.png"
                  alt="Transformation arrow"
                  width={80}
                  height={120}
                  className="object-contain"
                />
              </div>

              {/* Large professional photos */}
              <div className="grid grid-cols-2 gap-6">
                {profile.afterImages.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer" onClick={() => openLightbox(image)}>
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Professional headshot ${index + 1}`}
                        width={400}
                        height={533}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* AI Generated badge */}
                    
                    {/* Hover overlay for large photos */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">Klik om te vergroten</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Sluiten"
            >
              <X size={32} />
            </button>
            <Image
              src={lightboxImage || "/placeholder.svg"}
              alt="Vergrote foto"
              width={800}
              height={1000}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  )
}
