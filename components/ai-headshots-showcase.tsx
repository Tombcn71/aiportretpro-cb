"use client"

import Image from "next/image"

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
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Van selfies naar professionele portretten
          </h2>
          <p className="text-xl text-gray-600">
            Zie hoe onze AI gewone foto's transformeert naar professionele headshots
          </p>
        </div>

        <div className="lg:grid-cols-2 gap-20 max-w-6xl mx-auto grid">
          {profiles.map((profile, profileIndex) => (
            <div key={profileIndex} className="space-y-2">
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

              {/* Curved Arrow */}
              <div className="flex justify-center ">
                <Image
                  src="/images/curved-arrow.png"
                  alt="Transformation arrow"
                  width={80}
                  height={140}
                  className="object-contain"
                />
              </div>

              {/* Large professional photos */}
              <div className="grid grid-cols-2 gap-6">
                {profile.afterImages.map((image, index) => (
                  <div key={index} className="relative group">
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
                    <div className="absolute bottom-3 right-3 bg-[#0077B5] text-white text-xs px-2 py-1 rounded-full font-medium">
                      AI GENERATED
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
