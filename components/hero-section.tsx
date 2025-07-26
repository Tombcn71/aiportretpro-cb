import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="container mx-auto px-2 py-8 relative z-10">
        <div className="flex flex-col items-center space-y-6 max-w-7xl mx-auto">
          {/* Centered Content */}
          <div className="text-center space-y-4 max-w-4xl px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000] leading-tight">
              Onze AI fotoshoot <span className="text-[#0077B5]">die uw professionele uitstraling versterkt</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#666666] leading-relaxed max-w-2xl mx-auto">
              Binnen 15 minuten krijgt u 40 studio-kwaliteit portretfoto's. Perfect voor LinkedIn, CV's en zakelijke
              profielen.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-[#0077B5] hover:bg-[#004182] text-white font-semibold rounded-lg shadow-lg"
              >
                Aan de slag - €29,99
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Before/After Photos - Closer Together, Bigger with Box Shadow */}
          <div className="w-full flex items-center justify-center px-1">
            <div className="flex items-center gap-1 sm:gap-2 w-full max-w-lg">
              {/* Before Photo */}
              <div className="text-center space-y-2 flex-1">
                <div className="bg-[#E74C3C]/10 text-[#E74C3C] px-2 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
                  VOOR
                </div>
                <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-xl sm:rounded-2xl relative shadow-2xl border-2 sm:border-4 border-white">
                  <Image src="/images/before-casual.jpg" alt="Voor: Amateur foto" fill className="object-cover" />
                </div>
                <p className="text-xs sm:text-sm text-[#666666]">Smartphone foto</p>
              </div>

              {/* Arrow - Smaller */}
              <div className="bg-[#0077B5] text-white p-1.5 sm:p-2 rounded-full animate-pulse shadow-lg flex-shrink-0">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </div>

              {/* After Photo */}
              <div className="text-center space-y-2 flex-1">
                <div className="bg-[#057642]/10 text-[#057642] px-2 py-1 rounded-full text-xs sm:text-sm font-medium inline-block">
                  NA
                </div>
                <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-xl sm:rounded-2xl relative shadow-2xl border-2 sm:border-4 border-white">
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
