"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState(false)

  if (!isVisible) return null

  const copyDiscountCode = async () => {
    try {
      await navigator.clipboard.writeText("LAUNCH")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="bg-[#0077B5] text-white py-3 px-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-center text-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-base font-medium">
            🚀 Profiteer van 20% launch korting! Vul de code{" "}
            <span className="font-bold bg-white text-[#0077B5] px-2 py-1 rounded mx-1">LAUNCH</span>
            in bij afrekenen 🎉
          </span>
          <button
            onClick={copyDiscountCode}
            className="flex items-center gap-1 bg-white text-[#0077B5] px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Gekopieerd!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Kopieer Code</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
