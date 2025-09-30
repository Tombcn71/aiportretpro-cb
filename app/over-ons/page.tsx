import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera, Heart, Lightbulb } from "lucide-react"
import Header from "@/components/header"

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Hoi, ik ben <span className="text-blue-600">Tom van Reijn</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Developer, startup-veteraan en AI-enthusiast met een missie: 
                    <strong className="text-gray-900"> professionele fotografie voor iedereen bereikbaar maken.</strong>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ervaring in de startup scene</h3>
                      <p className="text-gray-600">
                        Door mijn jarenlange ervaring in de startup-wereld weet ik hoe belangrijk een sterke 
                        professionele uitstraling is voor ondernemers en professionals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Lightbulb className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-technologie pionier</h3>
                      <p className="text-gray-600">
                        Als developer en AI-enthusiast combineer ik de nieuwste technologie met fotografische expertise 
                        om ongelooflijke resultaten te bereiken.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Passie voor toegankelijkheid</h3>
                      <p className="text-gray-600">
                        Iedereen verdient een professionele foto, ongeacht budget of locatie. 
                        Daarom maakte ik AI Portret Pro - kwaliteit voor iedereen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className="relative flex justify-center">
                <div className="relative w-48 h-48 lg:w-56 lg:h-56">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full transform rotate-6"></div>
                  <div className="relative bg-white p-3 rounded-full shadow-2xl">
                    <Image
                      src="/images/me.jpg"
                      alt="Tom van Reijn - Oprichter van AI Portret Pro"
                      width={224}
                      height={224}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Mijn Missie
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 md:p-12 rounded-3xl">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                "Traditionele fotoshoots zijn duur, tijdrovend en vaak intimiderend. 
                Met AI Portret Pro democratiseer ik professionele fotografie."
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Door mijn achtergrond in de startup-wereld en passie voor AI-technologie, 
                kan ik nu iedereen helpen om binnen 15 minuten professionele foto's te krijgen 
                die perfect zijn voor LinkedIn, CV's, websites en meer.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">10.000+</div>
                <div className="text-gray-600">Tevreden klanten</div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-purple-600 mb-2">6x</div>
                <div className="text-gray-600">Goedkoper dan traditioneel</div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">15 min</div>
                <div className="text-gray-600">Van upload tot resultaat</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Klaar om jouw professionele foto's te maken?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Sluit je aan bij duizenden tevreden klanten en ervaar zelf hoe makkelijk het is!
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Begin nu voor €29
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
