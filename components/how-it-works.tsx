"use client"

import { TbCameraSelfie } from "react-icons/tb"
import { RiRobot2Line } from "react-icons/ri"
import { MdOutlineCloudDownload } from "react-icons/md"

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 md:justify-start justify-center">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <TbCameraSelfie className="w-10 h-10 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold text-gray-900">Upload een paar selfies</h3>
          </div>

          <div className="flex items-center gap-4 md:justify-start justify-center">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <RiRobot2Line className="w-10 h-10 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold text-gray-900">Onze AI gaat aan de slag</h3>
          </div>

          <div className="flex items-center gap-4 md:justify-start justify-center">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <MdOutlineCloudDownload className="w-10 h-10 text-[#0077B5]" />
            </div>
            <h3 className="font-semibold text-gray-900">Download je foto's</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
