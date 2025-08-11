import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-6 text-center">
      <h1 className="tracking-tight text-2xl md:text-4xl font-bold mb-6">
        Professionele portretfoto's
        <br />
        <span className="text-[#0077B5]"> slim en simpel </span>geregeld
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Geen gedoe met studio's, direct 40 AI-portretten in 15 min.
        <br />
        Makkelijk vanaf je telefoon of laptop, bespaar tijd en geld.
      </p>

      <Button
        asChild
        size="lg"
        className="bg-[#FFA500] hover:bg-[#FF8C00] text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg mb-8"
      >
        <Link href="/login">
          <Camera className="mr-2 h-4 md:h-5 w-4 md:w-5" />
          Start je gratis fotoshoot <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
        </Link>
      </Button>
    </section>
  )
}
