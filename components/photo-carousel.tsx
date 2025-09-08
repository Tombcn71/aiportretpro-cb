"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const photos = [
  { src: "/images/professional-man-1.jpg", alt: "Professional headshot 1" },
  { src: "/images/professional-woman-1.jpg", alt: "Professional headshot 2" },
  { src: "/images/professional-man-2.jpg", alt: "Professional headshot 3" },
  { src: "/images/professional-woman-2.jpg", alt: "Professional headshot 4" },
  { src: "/images/professional-man-3.jpg", alt: "Professional headshot 5" },
  { src: "/images/professional-woman-3.jpg", alt: "Professional headshot 6" },
  { src: "/images/professional-man-4.jpg", alt: "Professional headshot 7" },
  { src: "/images/professional-woman-4.jpg", alt: "Professional headshot 8" },
]

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Much slower auto-advance
    const interval = setInterval(
      () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
      },
      isMobile ? 6000 : 5000, // 6 seconds on mobile, 5 seconds on desktop
    )

    return () => clearInterval(interval)
  }, [isMobile])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professionele resultaten</h2>
          <p className="text-xl text-gray-600">Bekijk voorbeelden van onze AI-gegenereerde headshots</p>
        </div>

        <div className="relative">
          <div className="flex justify-center">
            <div className="relative w-96 h-[18.67rem] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={photos[currentIndex].src || "/placeholder.svg"}
                alt={photos[currentIndex].alt}
                fill
                className="object-contain bg-gray-50 transition-opacity duration-700"
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
