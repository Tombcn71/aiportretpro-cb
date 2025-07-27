import { TbCameraSelfie, TbDownload } from "react-icons/tb"
import { BotIcon as LuBot } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <TbCameraSelfie className="h-8 w-8 text-[#0077B5]" />,
      title: "Upload een paar selfies",
    },
    {
      icon: <LuBot className="h-8 w-8 text-[#0077B5]" />,
      title: "Onze AI gaat aan het werk",
    },
    {
      icon: <TbDownload className="h-8 w-8 text-[#0077B5]" />,
      title: "Download je foto's",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Hoe het werkt</h2>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-50">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
