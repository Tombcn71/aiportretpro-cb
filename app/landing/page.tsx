"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Euro, Star, ArrowRight, Upload, Zap, Download } from "lucide-react"
import { Header } from "@/components/header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-12 lg:py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm px-3 py-1">
                  🚀 Nieuw: AI Portretfoto's
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Professionele AI portretfoto's voor slechts <span className="text-blue-600">€29</span>
                </h1>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Upload 6 foto's en krijg in 15 minuten portretfoto's van studiokwaliteit. Bespaar tientallen euro's en
                  uren tijd.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/wizard/welcome">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                  >
                    Start Nu - €29
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-gray-300 w-full sm:w-auto bg-transparent"
                  >
                    Bekijk Voorbeelden
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Hero Image */}
            <div className="relative">
              <div>
                <Image
                  src="/images/transformation-hero.png"
                  alt="AI Portret Transformatie - Van casual foto's naar professionele portretfoto's"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hoe werkt het?</h2>
            <p className="text-xl text-gray-600">In 3 eenvoudige stappen naar professionele portretfoto's</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">1. Upload Foto's</h3>
                <p className="text-gray-600">Upload 6 verschillende foto's van jezelf met goede belichting</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">2. AI Training</h3>
                <p className="text-gray-600">Onze AI leert jouw gezicht en creëert professionele variaties</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <CardContent className="space-y-4">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold">3. Download</h3>
                <p className="text-gray-600">Ontvang 40 hoogwaardige portretfoto's klaar voor gebruik</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Waarom kiezen voor AI Portret Pro?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De snelste en meest betaalbare manier om professionele portretfoto's te krijgen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Supersnel</h3>
              <p className="text-gray-600">
                Upload je foto's en ontvang binnen 15 minuten 40 professionele portretfoto's
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Euro className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Betaalbaar</h3>
              <p className="text-gray-600">
                Slechts €29 voor 40 foto's. Bespaar honderden euro's vergeleken met een fotostudio
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">Studiokwaliteit</h3>
              <p className="text-gray-600">
                AI-gegenereerde foto's van professionele kwaliteit, perfect voor LinkedIn en CV
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Klaar voor jouw professionele portretfoto's?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join duizenden professionals die al gebruik maken van AI Portret Pro
          </p>
          <Link href="/wizard/welcome">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Start Nu - Slechts €29
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image src="/images/logo.png" alt="AI Portret Pro" width={32} height={32} className="mr-2" />
                <span className="text-lg font-bold">AI Portret Pro</span>
              </div>
              <p className="text-gray-400">Professionele AI portretfoto's voor iedereen</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Prijzen
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legaal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Voorwaarden
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:info@portretpro.nl" className="hover:text-white transition-colors">
                    info@portretpro.nl
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Portret Pro. Alle rechten voorbehouden.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
