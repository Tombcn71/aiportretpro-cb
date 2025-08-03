"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Professionele AI
                <span className="text-[#0077B5] block">Headshots</span>
                in 15 minuten
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Upload je foto's en ontvang 40 professionele portretfoto's perfect voor LinkedIn, CV en social media.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login?flow=wizard">
                <Button
                  size="lg"
                  className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Nu - €19,99
                </Button>
              </Link>
              <Link href="#examples">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 bg-transparent"
                >
                  Bekijk Voorbeelden
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Klaar binnen 15 minuten</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">40 HD foto's</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Geld terug garantie</span>
              </div>
            </div>
          </div>

          {/* Right Content - Before/After */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Before */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Image
                      src="/images/before-casual.jpg"
                      alt="Voor - Casual foto"
                      width={200}
                      height={250}
                      className="rounded-lg shadow-md mx-auto"
                    />
                    <div className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      VOOR
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Casual selfie</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <Image src="/images/arrow.png" alt="Arrow" width={40} height={40} className="opacity-60" />
                </div>

                {/* After */}
                <div className="text-center">
                  <div className="relative mb-4">
                    <Image
                      src="/images/after-professional.jpg"
                      alt="Na - Professionele headshot"
                      width={200}
                      height={250}
                      className="rounded-lg shadow-md mx-auto"
                    />
                    <div className="absolute -top-2 -left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      NA
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Professionele headshot</p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-[#0077B5] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              15 min ⚡
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              40 foto's 📸
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
