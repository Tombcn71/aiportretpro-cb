import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, Shield } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center space-y-8 max-w-7xl mx-auto">
          {/* Centered Content */}
          <div className="text-center space-y-6 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000] leading-tight">
              Onze AI fotoshoot <span className="text-[#0077B5]">die uw professionele uitstraling versterkt</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#666666] leading-relaxed max-w-2xl mx-auto">
              Binnen 15 minuten krijgt u 40 studio-kwaliteit portretfoto's. Makkelijk vanaf uw telefoon of laptop.
              Perfect voor LinkedIn, CV's en zakelijke profielen.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-[#0077B5] hover:bg-[#004182] text-white font-semibold rounded-lg shadow-lg"
              >
                Aan de slag - €29,99
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-[#666666]">
              <Shield className="w-4 h-4 text-[#057642]" />
              <span>Veilig betalen • Nederlandse kwaliteit • GDPR compliant</span>
            </div>
          </div>

          {/* Before/After Photos - Mobile Optimized */}
          <div className="w-full flex items-center justify-center">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Before Photo */}
              <div className="text-center space-y-2">
                <div className="bg-[#E74C3C]/10 text-[#E74C3C] px-2 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
                  VOOR
                </div>
                <div className="w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-60 lg:w-56 lg:h-72 overflow-hidden rounded-xl sm:rounded-2xl relative shadow-xl border-2 sm:border-4 border-white">
                  <Image src="/images/before-casual.jpg" alt="Voor: Amateur foto" fill className="object-cover" />
                </div>
                <p className="text-xs sm:text-sm text-[#666666]">Smartphone foto</p>
              </div>

              {/* Arrow */}
              <div className="bg-[#0077B5] text-white p-2 sm:p-3 rounded-full animate-pulse shadow-lg">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>

              {/* After Photo */}
              <div className="text-center space-y-2">
                <div className="bg-[#057642]/10 text-[#057642] px-2 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
                  NA
                </div>
                <div className="w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-60 lg:w-56 lg:h-72 overflow-hidden rounded-xl sm:rounded-2xl relative shadow-xl border-2 sm:border-4 border-white">
                  <Image
                    src="/images/after-professional.jpg"
                    alt="Na: Professionele AI headshot"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs sm:text-sm text-[#0077B5] font-medium">LinkedIn ready!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
