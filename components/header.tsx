"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LightningLogo } from "@/components/logo"

export function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session) {
      // Redirect to dashboard after successful login
      router.push("/dashboard")
    }
  }, [status, session, router])

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* New Lightning Bolt Logo */}
        <LightningLogo size="md" />

        <div className="flex items-center space-x-4">
          {session ? (
            <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost">
              Uitloggen
            </Button>
          ) : (
            <Button onClick={() => signIn("google")} className="bg-[#0077B5] hover:bg-[#004182] text-white">
              Inloggen
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
