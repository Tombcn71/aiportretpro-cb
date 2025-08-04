"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react"

export default function WizardWelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Generate unique session ID for this wizard flow
    const sessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem("wizardSessionId", sessionId)
  }, [])

  const startWizard = () => {
    router.push("/wizard/project-name")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-[#0077B5] rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Welkom bij AI Headshots</CardTitle>
            <p className="text-lg text-gray-600">Maak professionele portretten in slechts 3 eenvoudige stappen</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Process Steps */}
            <div className="grid gap-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Project Details</h3>
                  <p className="text-sm text-gray-600">Geef je project een naam en kies je geslacht</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Upload Foto's</h3>
                  <p className="text-sm text-gray-600">Upload 10-20 foto's van jezelf voor de beste resultaten</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Betaal & Ontvang</h3>
                  <p className="text-sm text-gray-600">Betaal €29,99 en ontvang 40 professionele AI portretten</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Wat je krijgt:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#0077B5]" />
                  <span>Klaar in 15 minuten</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#0077B5]" />
                  <span>40 unieke portretten</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#0077B5]" />
                  <span>100% privé & veilig</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={startWizard}
              className="w-full bg-[#0077B5] hover:bg-[#004182] text-white py-4 text-lg font-semibold"
            >
              Start Nu - Maak Je Portretten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-center text-sm text-gray-500">Geen abonnement • Eenmalige betaling • Direct resultaat</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
