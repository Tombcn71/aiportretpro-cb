"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, Star, ArrowRight, Zap } from "lucide-react"

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mb-4">Probeer Eerst, Betaal Later</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Eenvoudige, transparante prijzen</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start gratis, upload je foto's, en betaal alleen als je tevreden bent met het resultaat.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Trial Card */}
            <Card className="relative border-2 border-gray-200 hover:border-orange-300 transition-colors">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-gray-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Gratis Proberen</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  €0
                  <span className="text-lg font-normal text-gray-500">/start</span>
                </div>
                <p className="text-gray-600 mt-2">Begin zonder risico</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Upload tot 20 foto's</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Bekijk voorbeelden</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Geen creditcard vereist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Volledige wizard doorlopen</span>
                  </div>
                </div>

                <Button asChild className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white" size="lg">
                  <Link href="/wizard/welcome">
                    Start Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Card */}
            <Card className="relative border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-white">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-4 py-1">Meest Populair</Badge>
              </div>

              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">AI Headshots</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  €29
                  <span className="text-lg font-normal text-gray-500">/eenmalig</span>
                </div>
                <p className="text-gray-600 mt-2">Betaal pas na upload</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">40 professionele headshots</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">HD kwaliteit (1024x1024)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Klaar binnen 15 minuten</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Verschillende stijlen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Direct download</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Geld-terug-garantie</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                  size="lg"
                >
                  <Link href="/wizard/welcome">
                    Start Gratis Proberen
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust section */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.9/5 uit 2.847 reviews</span>
            </div>
            <p className="text-gray-500 text-sm">
              "Eindelijk professionele foto's zonder gedoe met een fotograaf!" - Sarah, Marketing Manager
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
