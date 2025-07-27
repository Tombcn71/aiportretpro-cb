"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Van selfies naar professionele portretten
          </h2>
          <p className="text-xl text-gray-600">
            Zie hoe onze AI gewone foto's transformeert naar professionele headshots
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 max-w-6xl mx-auto">
          {profiles.map((profile, profileIndex) => (
            <div key={profileIndex} className="space-y-8">
              {/* Before Photos */}
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-3">
                  {profile.beforeImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`casual photo ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <Image
                  src="/images/arrow.png"
                  alt="transformation arrow"
                  width={60}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* After Photos */}
              <div className="grid grid-cols-2 gap-6">
                {profile.afterImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`professional headshot ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute bottom-2 right-2 bg-[#0077B5] hover:bg-[#0077B5] text-white text-xs">
                        AI GENERATED
                      </Badge>
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
