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
    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 md:hidden py-4 px-4">
      <Button
        asChild
        size="lg"
         className="bg-orange-500 hover:bg-orange-400 text-white w-full max-w-sm mx-auto py-8 text-base md:text-lg"
      >
        <Link href="/pricing">
          Start jouw fotoshoot nu - 29€
          <ArrowRight className="ml-2 h-7 w-7" />
        </Link>
      </Button>
    </div>
  )
}
