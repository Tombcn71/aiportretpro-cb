"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

// Carousel photos: Same exact order as gallery
const carouselPhotos = [
  { id: 1, photo: "/images/professional-man-1.jpg", name: "Professional Man Portrait" },
  { id: 2, photo: "/images/professional-woman-1.jpg", name: "Professional Woman Portrait" },
  { id: 3, photo: "/images/professional-man-2.jpg", name: "Professional Man Portrait" },
  { id: 4, photo: "/images/professional-woman-2.jpg", name: "Professional Woman Portrait" },
  { id: 5, photo: "/images/professional-man-3.jpg", name: "Professional Man Portrait" },
  { id: 6, photo: "/images/professional-woman-3.jpg", name: "Professional Woman Portrait" },
  { id: 7, photo: "/images/professional-man-4.jpg", name: "Professional Man Portrait" },
  { id: 8, photo: "/images/professional-woman-4.jpg", name: "Professional Woman Portrait" },
]

interface PhotoCarouselProps {
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
}

export default function PhotoCarousel({ autoPlay = true, interval = 3000, showDots = true }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === carouselPhotos.length - 1 ? 0 : prevIndex + 1))
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="w-full overflow-hidden mb-16 md:mb-24 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="relative">
        {/* Carousel Container */}
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
                      priority={index < 4}
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

        {/* Dots Indicator */}
        {showDots && (
          <div className="flex justify-center mt-6 space-x-2">
            {carouselPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-[#0077B5]" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
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
          .carousel-track {
            animation: carousel 40s linear infinite;
          }
        }
      `}</style>
    </section>
  )
}
