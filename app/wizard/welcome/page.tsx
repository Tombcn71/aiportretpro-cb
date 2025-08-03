"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      console.log("❌ No session, redirecting to login")
      router.push("/login?flow=wizard")
      return
    }

    // Create wizard session and redirect to project name
    const wizardSessionId = `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("wizardSessionId", wizardSessionId)

    console.log("✅ Wizard session created:", wizardSessionId)
    router.push("/wizard/project-name")
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
    </div>
  )
}
