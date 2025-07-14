"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-[#0077B5]">
              AI Portrait Pro
            </Link>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-[#0077B5]">
            AI Portrait Pro
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                className="border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white"
              >
                Uitloggen
              </Button>
            ) : (
              <Button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="bg-[#0077B5] hover:bg-[#005885] text-white"
              >
                Inloggen
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
