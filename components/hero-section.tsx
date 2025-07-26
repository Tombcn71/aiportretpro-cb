"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="container mx-auto px-1 py-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-6xl mx-auto">
          {/* Text Content */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight">
             Onze AI fotoshoot t<span className="text-[#0077B5]">die uw professionele uitstraling versterk/span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#666666] leading-relaxed max-w-2xl mx-auto">
             Binnen 15 minuten krijgt u 40 studio-kwaliteit portretfoto's. Perfect voor LinkedIn, CV's en zakelijke profielen.


            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-[#0077B5] hover:bg-[#004182] text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6"
              >
                Start Nu - €9,99
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Before/After Photos */}
          <div className="w-full max-w-lg mx-auto px-2">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {/* Before Photo */}
              <div className="text-center space-y-2 flex-1">
                <div className="bg-[#E74C3C] text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
                  VOOR
                </div>
                <div className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] h-48 sm:h-52 md:h-60 lg:h-72 mx-auto overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-gray-200 shadow-2xl">
                  <Image
                    src="/images/before-casual.jpg"
                    alt="Voor: Amateur foto"
                    width={280}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm text-[#666666]">Smartphone foto</p>
              </div>

              {/* Arrow */}
              <div className="bg-[#0077B5] text-white p-1.5 sm:p-2 rounded-full animate-pulse">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </div>

              {/* After Photo */}
              <div className="text-center space-y-2 flex-1">
                <div className="bg-[#057642] text-white px-2 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
                  NA
                </div>
                <div className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] h-48 sm:h-52 md:h-60 lg:h-72 mx-auto overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#0077B5] shadow-2xl">
                  <Image
                    src="/images/after-professional.jpg"
                    alt="Na: Professionele AI headshot"
                    width={280}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm text-[#0077B5] font-medium">LinkedIn ready!</p>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#666666]">
            <Shield className="w-4 h-4" />
            <span>Veilig betalen • Nederlandse kwaliteit • GDPR compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
