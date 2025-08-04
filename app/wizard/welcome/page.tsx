"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Camera, Clock } from "lucide-react"
import Link from "next/link"

export default function WizardWelcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-[#0077B5] rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welkom bij AI Portret Pro!</CardTitle>
          <p className="text-lg text-gray-600 mt-2">Laten we samen jouw professionele AI-portretten maken</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Camera className="w-8 h-8 text-[#0077B5] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Upload Foto's</h3>
              <p className="text-sm text-gray-600">Minimaal 6 foto's voor beste resultaat</p>
            </div>
            <div className="text-center p-4">
              <Clock className="w-8 h-8 text-[#0077B5] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">15 Minuten</h3>
              <p className="text-sm text-gray-600">AI training en generatie</p>
            </div>
            <div className="text-center p-4">
              <Sparkles className="w-8 h-8 text-[#0077B5] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">40 Portretten</h3>
              <p className="text-sm text-gray-600">Professionele AI-gegenereerde foto's</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Wat je krijgt:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 40 professionele AI-portretten</li>
              <li>• Verschillende poses en achtergronden</li>
              <li>• Hoge resolutie downloads</li>
              <li>• Commerciële gebruiksrechten</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-[#0077B5] mb-2">€29,00</p>
            <p className="text-sm text-gray-600 mb-6">Eenmalige betaling, geen abonnement</p>

            <Button asChild size="lg" className="w-full bg-[#FF8C00] hover:bg-[#FFA500] text-white">
              <Link href="/wizard/project-name">
                Start Nu <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Door verder te gaan ga je akkoord met onze{" "}
            <Link href="/terms" className="text-[#0077B5] hover:underline">
              Algemene Voorwaarden
            </Link>{" "}
            en{" "}
            <Link href="/privacy" className="text-[#0077B5] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
