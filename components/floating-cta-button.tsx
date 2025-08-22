"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Camera } from "lucide-react"

export default function FloatingCTAButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
<div
  // Deze div creëert de witte balk onderaan en is ALTIJD zichtbaar.
  // De animatie (opacity, translate) is HIER WEGGEHAald.
  className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 z-[9999] md:hidden"
>

      <Button
        asChild
        size="lg"
        className="w-full max-w-sm mx-auto bg-[#FFA500] hover:bg-[#FF8C00] text-white py-3 text-base font-semibold shadow-lg"
      >
        <Link href="/login?source=homepage">
        <className="mr-2 h-4 w-4" />
          Start jouw fotoshoot nu - 19,99€
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
