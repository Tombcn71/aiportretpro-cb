"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function WizardLoginPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/wizard/welcome" })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-12">
          <Image src="/images/logo-icon.png" alt="AI Portrait Pro" width={60} height={60} className="mx-auto mb-4" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Professionele portretfoto's
          <br />
          in <span className="text-[#0077B5]">15 minuten</span>, geen gedoe
        </h1>

        {/* Google Sign In Button */}
        <div className="mt-12">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white py-4 px-6 text-lg font-medium rounded-lg flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Footer Text */}
        <p className="text-sm text-gray-500 mt-8">
          Door in te loggen ga je akkoord met onze{" "}
          <a href="/terms" className="text-[#0077B5] hover:underline">
            Algemene Voorwaarden
          </a>{" "}
          en{" "}
          <a href="/privacy" className="text-[#0077B5] hover:underline">
            Privacybeleid
          </a>
        </p>
      </div>
    </div>
  )
}
