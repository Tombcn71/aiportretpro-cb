"use client"

import { TbCameraSelfie, TbDownload } from "react-icons/tb"
import { LuBot } from "react-icons/lu"

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <TbCameraSelfie className="w-10 h-10 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold text-gray-900">Upload een paar selfies</h3>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <LuBot className="w-10 h-10 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold text-gray-900">Onze AI gaat aan het werk</h3>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <TbDownload className="w-10 h-10 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold text-gray-900">Download je foto's</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
