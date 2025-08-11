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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Mobile Layout */}
        <div className="md:hidden p-6 text-center">
          {/* Headshots Grid - Mobile */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {headshots.map((photo, index) => (
              <div key={index} className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Professional headshot ${index + 1}`}
                  width={120}
                  height={160}
                  className="w-full h-full object-cover brightness-110 contrast-105"
                />
              </div>
            ))}
          </div>

          {/* Content - Mobile */}
          <div className="inline-block bg-[#0077B5] text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
            🎉 Tijdelijke Launch Korting
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            20% Korting op je
            <br />
            <span className="text-[#0077B5]">eerste aankoop</span>
          </h2>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Start vandaag nog met professionele portretfoto's en bespaar 20%.
          </p>

          {/* Discount Code - Mobile */}
          <div className="bg-[#F3F2EF] rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 mb-2">Gebruik kortingscode op betaalpagina:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-[#0077B5] tracking-wider">LAUNCH</span>
              <button
                onClick={copyDiscountCode}
                className="flex items-center gap-1 bg-white border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">OK!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-gray-600" />
                    <span className="text-xs text-gray-600">Kopieer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="bg-[#0077B5] hover:bg-[#005885] text-white px-6 py-3 text-sm w-full mb-3"
          >
            <Link href="/login" onClick={onClose}>
             Start je gratis fotoshoot
            </Link>
          </Button>

          <p className="text-xs text-gray-500">
            * Geldig voor nieuwe klanten. Niet combineerbaar met andere aanbiedingen.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex">
          {/* Left Side - Headshots Mosaic */}
          <div className="md:w-1/2 bg-[#F3F2EF] p-6">
            <div className="grid grid-cols-3 gap-2 h-full">
              {[...headshots, ...headshots.slice(0, 3)].map((photo, index) => (
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
              <div className="inline-block bg-[#0077B5] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                🎉 Tijdelijke Launch Korting
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                20% Korting op je
                <br />
                <span className="text-[#0077B5]">Professionele portretfoto's</span>
              </h2>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Start vandaag nog en bespaar 20% op je bestelling.
              </p>

              <div className="bg-[#F3F2EF] rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Gebruik kortingscode op betaalpagina:</p>
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

              <Button
                asChild
                size="lg"
                className="bg-[#0077B5] hover:bg-[#005885] text-white px-8 py-4 text-lg w-full mb-4"
              >
                <Link href="/login" onClick={onClose}>
                 Start je gratis fotoshoot
                </Link>
              </Button>

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
