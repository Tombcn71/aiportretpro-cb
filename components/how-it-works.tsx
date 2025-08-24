"use client"

import { TbCameraSelfie, TbDownload } from "react-icons/tb"
import { Bot } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Hoe het werkt</h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          In 3 eenvoudige stappen naar professionele portretfoto's
        </p>

        {/* Mobile: Compact numbered list */}
        <div className="md:hidden space-y-4 max-w-lg mx-auto px-4">
          <div className="flex items-start gap-4 text-left">
            <div className="w-6 h-6 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Upload een paar selfies</h3>
              <p className="text-gray-600 text-sm">Kijk naar de camera met verschillende kleding verschillende achtergrond.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-left">
            <div className="w-6 h-6 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Onze AI gaat aan het werk</h3>
              <p className="text-gray-600 text-sm">De AI analyseert je foto's en start de training. Duur 15 min</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 text-left">
            <div className="w-6 h-6 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Download je foto's</h3>
              <p className="text-gray-600 text-sm">Foto's klaar voor gebruik op LinkedIn, Social Media, CV, Website en Print</p>
            </div>
          </div>
        </div>

        {/* Desktop: Original with icons */}
        <div className="hidden md:flex flex-row justify-center items-start gap-16 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <TbCameraSelfie className="w-12 h-12 text-[#0077B5]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload een paar selfies</h3>
            <p className="text-gray-600 text-sm">
              Kijk naar de camera met verschillende kleding verschillende achtergrond.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <Bot className="w-12 h-12 text-[#0077B5]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Onze AI gaat aan het werk</h3>
            <p className="text-gray-600 text-sm">De AI analyseert je foto's en start de training. Duur 15 min</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <TbDownload className="w-12 h-12 text-[#0077B5]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Download je foto's</h3>
            <p className="text-gray-600 text-sm">
              Foto's klaar voor gebruik op LinkedIn, Social Media, CV, Website en Print
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
