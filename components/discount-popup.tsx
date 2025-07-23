"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Copy, Check } from "lucide-react"

interface DiscountPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function DiscountPopup({ isOpen, onClose }: DiscountPopupProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const headshots = [
    "/images/carousel10.jpg",
    "/images/new-woman3.jpg",
    "/images/new-man4.jpg",
    "/images/carousel2.jpg",
    "/images/new-man2.jpg",
    "/images/new-woman2.jpg",
    "/images/carousel4.jpg",
    "/images/new-man3.jpg",
    "/images/new-woman4.jpg",
  ]

  const copyDiscountCode = async () => {
    try {
      await navigator.clipboard.writeText("LAUNCH")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Headshots Mosaic */}
          <div className="md:w-1/2 bg-[#F3F2EF] p-6">
            <div className="grid grid-cols-3 gap-2 h-full">
              {headshots.map((photo, index) => (
                <div key={index} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Professional headshot ${index + 1}`}
                    width={200}
                    height={267}
                    className="w-full h-full object-cover brightness-110 contrast-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Discount Content */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-block bg-[#0077B5] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🎉 Tijdelijke Aanbieding
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                10% Korting op je
                <br />
                <span className="text-[#0077B5]">AI Portretten</span>
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Start vandaag nog met professionele portretfoto's en bespaar 10% op je bestelling.
              </p>

              {/* Discount Code */}
              <div className="bg-[#F3F2EF] rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Gebruik kortingscode:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-[#0077B5] tracking-wider">LAUNCH</span>
                  <button
                    onClick={copyDiscountCode}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Gekopieerd!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Kopieer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                size="lg"
                className="bg-[#0077B5] hover:bg-[#005885] text-white px-8 py-4 text-lg w-full mb-4"
              >
                <Link href="/pricing" onClick={onClose}>
                  Claim je 10% Korting
                </Link>
              </Button>

              {/* Small Print */}
              <p className="text-xs text-gray-500">
                * Geldig voor nieuwe klanten. Niet combineerbaar met andere aanbiedingen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
