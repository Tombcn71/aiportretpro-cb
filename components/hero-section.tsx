"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Users, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              AI-Powered Professional Headshots
            </div>

            <h1 className="tracking-tight text-2xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Professionele portretfoto's
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                slim en simpel
              </span>{" "}
              geregeld
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Geen gedoe met studio's, direct 40 AI-portretten in 15 min.
              <br />
              Makkelijk vanaf je telefoon of laptop, bespaar tijd en geld.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.9/5 sterren</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span className="font-medium">10.000+ tevreden klanten</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href="/wizard/welcome">
                  Start Jouw Fotoshoot Nu - 29€
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">Vertrouwd door professionals van:</p>
              <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="text-gray-400 font-semibold">Microsoft</div>
                <div className="text-gray-400 font-semibold">Google</div>
                <div className="text-gray-400 font-semibold">Meta</div>
                <div className="text-gray-400 font-semibold">Netflix</div>
              </div>
            </div>
          </div>

          {/* Right column - Hero image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-8 shadow-2xl">
              <Image
                src="/images/transformation-hero.png"
                alt="Voor en na transformatie - van casual foto naar professionele headshot"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl shadow-lg"
                priority
              />

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">15min</div>
                  <div className="text-xs text-gray-600">Klaar</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">€29</div>
                  <div className="text-xs text-gray-600">Totaal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
