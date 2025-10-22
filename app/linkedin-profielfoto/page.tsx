"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LinkedInProfielFotoRedirect() {
  const router = useRouter()

  useEffect(() => {
    // 301 redirect to the main LinkedIn page
    router.replace("/linkedin-foto-laten-maken")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}

