"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

export function FloatingCTAButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Show after scrolling 50% of viewport height
      if (scrollY > windowHeight * 0.5 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (isDismissed) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <div className="text-center space-y-3">
          <div className="text-sm font-semibold text-gray-900">🎯 Klaar om te beginnen?</div>
          <div className="text-xs text-gray-600">Start nu gratis - betaal pas na upload</div>

          <Button
            asChild
            size="sm"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg"
          >
            <Link href="/wizard/welcome">
              Start Nu - €29
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
