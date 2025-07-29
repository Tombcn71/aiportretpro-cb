"use client"

import { TbCameraSelfie, TbDownload } from "react-icons/tb"
import { BotIcon } from "lucide-react"

const steps = [
  {
    icon: TbCameraSelfie,
    title: "Upload een paar selfies",
    description: "Kijk naar de camera met verschillende kleding, verschillende achtergronden.",
  },
  {
    icon: BotIcon,
    title: "Onze AI gaat aan het werk",
    description: "De AI analyseert je foto's en start de training. Duur 15 min",
  },
  {
    icon: TbDownload,
    title: "Download foto's",
    description: "Foto's klaar voor gebruik op LinkedIn, Social Media, CV, Website en Print",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hoe het werkt</h2>
          <p className="text-xl text-gray-600">In 3 eenvoudige stappen naar professionele portetfotos</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <IconComponent className="w-12 h-12 text-[#0077B5]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
