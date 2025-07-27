import { TbCameraSelfie, TbDownload } from "react-icons/tb"
import { LuBot } from "react-icons/lu"

export function HowItWorks() {
  const steps = [
    {
      icon: TbCameraSelfie,
      title: "Upload een paar selfies",
    },
    {
      icon: LuBot,
      title: "Onze AI gaat aan het werk",
    },
    {
      icon: TbDownload,
      title: "Download je foto's",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Hoe het werkt</h2>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="flex items-center space-x-4 md:flex-col md:space-x-0 md:space-y-4">
                <div className="flex-shrink-0 md:mx-auto">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <IconComponent className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="md:text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
