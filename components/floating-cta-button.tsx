"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function FloatingCTAButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <Button
        asChild
        size="lg"
         className="bg-orange-500 hover:bg-orange-400 text-white px-6 md:px-8 py-8 md:py-8 text-base md:text-lg mb-8"
      >
        <Link href="/pricing">
          Start jouw fotoshoot nu - 29€
          <ArrowRight className="ml-2 h-7 w-7" />
        </Link>
      </Button>
    </div>
  )
}
