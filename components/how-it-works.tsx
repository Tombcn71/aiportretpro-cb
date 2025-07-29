import { TbCameraSelfie, TbDownload } from "react-icons/tb"
import { BotIcon } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: <TbCameraSelfie className="w-12 h-12 text-[#0077B5]" />,
      title: "Upload een paar selfies",
    },
    {
      icon: <BotIcon className="w-12 h-12 text-[#0077B5]" />,
      title: "Onze AI gaat aan het werk",
    },
    {
      icon: <TbDownload className="w-12 h-12 text-[#0077B5]" />,
      title: "Download foto's",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hoe werkt het?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            In 3 eenvoudige stappen naar professionele portetfotos
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-4xl mx-auto space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 md:flex-col md:space-x-0 md:space-y-4 text-center md:text-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center">{step.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 max-w-32 md:max-w-none">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
