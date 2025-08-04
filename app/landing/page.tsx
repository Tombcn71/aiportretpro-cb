"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Star } from "lucide-react"
import HeroSection from "@/components/hero-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      {/* Additional Content Section */}
      <section className="py-16 lg:py-24 bg-[#F3F2EF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-[#0077B5] text-white hover:bg-[#004182] text-sm px-4 py-2 font-medium">
                  Professionele AI Headshots
                </Badge>

                <h2 className="text-4xl lg:text-5xl font-bold text-[#000000] leading-tight">
                  Upgrade uw professionele uitstraling in <span className="text-[#0077B5]">15 minuten</span>
                </h2>

                <p className="text-xl text-[#666666] leading-relaxed font-normal">
                  Transformeer uw casual foto's naar studio-kwaliteit headshots. Perfect voor LinkedIn, CV's en
                  zakelijke profielen. Geen fotostudio nodig.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-[#057642] flex-shrink-0" />
                  <span className="text-lg text-[#000000] font-medium">40 professionele headshots voor €29</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-[#057642] flex-shrink-0" />
                  <span className="text-lg text-[#000000] font-medium">Klaar binnen 15 minuten</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-[#057642] flex-shrink-0" />
                  <span className="text-lg text-[#000000] font-medium">Studio-kwaliteit zonder studio-kosten</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
                >
                  Start Nu - €29
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-[#666666] mt-3">⭐ Vertrouwd door 10.000+ professionals</p>
              </div>
            </div>

            {/* Right - Before/After Comparison */}
            <div className="space-y-8">
              {/* Man Comparison */}
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-[#0077B5] text-white text-center py-3">
                    <h3 className="font-semibold text-lg">Zakelijke Professional - 47 jaar</h3>
                  </div>
                  <div className="grid grid-cols-2">
                    {/* Before */}
                    <div className="relative">
                      <div className="bg-[#E74C3C] text-white text-center py-2">
                        <span className="text-sm font-medium">VOOR</span>
                      </div>
                      <div className="aspect-square relative bg-gray-100">
                        <Image src="/images/voorbeeld1.png" alt="Voor - Casual foto" fill className="object-cover" />
                      </div>
                      <div className="p-3 bg-[#F3F2EF]">
                        <p className="text-xs text-[#666666] text-center">Casual selfie</p>
                      </div>
                    </div>
                    {/* After */}
                    <div className="relative">
                      <div className="bg-[#057642] text-white text-center py-2">
                        <span className="text-sm font-medium">NA</span>
                      </div>
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src="/images/professional-man-1.jpg"
                          alt="Na - Professionele headshot"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 bg-[#F3F2EF]">
                        <p className="text-xs text-[#666666] text-center">AI Studio-kwaliteit</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Woman Comparison */}
              <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-[#0077B5] text-white text-center py-3">
                    <h3 className="font-semibold text-lg">Senior Manager - 52 jaar</h3>
                  </div>
                  <div className="grid grid-cols-2">
                    {/* Before */}
                    <div className="relative">
                      <div className="bg-[#E74C3C] text-white text-center py-2">
                        <span className="text-sm font-medium">VOOR</span>
                      </div>
                      <div className="aspect-square relative bg-gray-100">
                        <Image src="/images/wazig1.png" alt="Voor - Casual foto" fill className="object-cover" />
                      </div>
                      <div className="p-3 bg-[#F3F2EF]">
                        <p className="text-xs text-[#666666] text-center">Onscherpe foto</p>
                      </div>
                    </div>
                    {/* After */}
                    <div className="relative">
                      <div className="bg-[#057642] text-white text-center py-2">
                        <span className="text-sm font-medium">NA</span>
                      </div>
                      <div className="aspect-square relative bg-gray-100">
                        <Image
                          src="/images/professional-woman-1.jpg"
                          alt="Na - Professionele headshot"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 bg-[#F3F2EF]">
                        <p className="text-xs text-[#666666] text-center">AI Studio-kwaliteit</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicator */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="h-5 w-5 text-[#FDB022] fill-current" />
                  <Star className="h-5 w-5 text-[#FDB022] fill-current" />
                  <Star className="h-5 w-5 text-[#FDB022] fill-current" />
                  <Star className="h-5 w-5 text-[#FDB022] fill-current" />
                  <Star className="h-5 w-5 text-[#FDB022] fill-current" />
                </div>
                <p className="text-sm text-[#666666]">"Eindelijk professionele foto's zonder gedoe" - Maria, 49</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Strip */}
      <section className="bg-[#0077B5] py-8">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-2xl font-bold text-white mb-4">Klaar om uw professionele imago te versterken?</h2>
          <Button
            size="lg"
            className="bg-white text-[#0077B5] hover:bg-[#F3F2EF] px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
          >
            Start Nu - Slechts €29
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-[#B7D4EA] mt-3 text-sm">Geen abonnement • Eenmalige betaling • 40 foto's gegarandeerd</p>
        </div>
      </section>
    </div>
  )
}
