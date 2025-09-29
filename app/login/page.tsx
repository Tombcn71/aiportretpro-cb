"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MailPlus } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(true) // Default to signup for CTA users
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    try {
      // Check if this is a homepage CTA login or has callbackUrl
      const isHomepageCTA = searchParams.get("source") === "homepage"
      const callbackUrl = searchParams.get("callbackUrl") || (isHomepageCTA ? "/pricing" : "/dashboard")
      
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Login error:", error)
      setError("Er is een fout opgetreden bij het inloggen met Google")
      setLoading(false)
    }
  }

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Get the source parameter to determine where user came from
      const source = searchParams.get("source") || "header"

      if (isSignUp) {
        // Handle sign up
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, source }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Registratie mislukt")
        }

        // Get the redirect URL from the signup response
        const data = await response.json()
        if (data.redirectUrl) {
          router.push(data.redirectUrl)
          return
        }
      } else {
        // Handle sign in
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError("Ongeldige email of wachtwoord")
        } else if (result?.ok) {
          // Check if this is a homepage CTA login
          const isHomepageCTA = searchParams.get("source") === "homepage"
          const callbackUrl = isHomepageCTA ? "/pricing" : "/dashboard"
          router.push(callbackUrl)
        }
      }
    } catch (error) {
      console.error("Email auth error:", error)
      setError(error instanceof Error ? error.message : "Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  // If user is already authenticated, redirect them
  useEffect(() => {
    if (status === "authenticated" && session) {
      const isHomepageCTA = searchParams.get("source") === "homepage"
      const redirectUrl = isHomepageCTA ? "/pricing" : "/dashboard"
      router.push(redirectUrl)
    }
    // Return undefined (no cleanup function needed)
    return undefined
  }, [status, session, router, searchParams])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  // Don't render if already authenticated
  if (status === "authenticated" && session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-left">
            {/* Logo with text */}
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/images/logo-icon.png"
                alt="AI Portrait Pro Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg text-gray-900">AIPortretPro</span>
            </div>
            
            {/* Main title */}
            <CardTitle className="text-xl md:text-2xl text-gray-900 mb-3 font-normal pl-0">
              Even registreren voor veilige betaling en toegang tot de app.
              <br />
              <span className="text-[#0077B5]">Binnen 2 minuten klaar!</span> 
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showEmailForm ? (
              <>
                {/* Main choice buttons */}
                <Button
                  onClick={() => setShowEmailForm(true)}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-2 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5] hover:text-white flex items-center justify-center space-x-3 py-6 text-lg font-semibold"
                >
                  <MailPlus className="h-6 w-6" />
                  <span>Ga door met email</span>
                </Button>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white flex items-center justify-center space-x-3 py-6 text-lg font-semibold"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Ga door met Google</span>
                </Button>
              </>
            ) : (
              <>
                {/* Email form */}
                <form onSubmit={handleEmailContinue} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jouw@email.com"
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">Wachtwoord</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-transparent"
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-[#0077B5] hover:bg-[#005885] text-white py-6 text-lg font-semibold"
                  >
                    {loading ? "Bezig..." : (isSignUp ? "Account aanmaken" : "Inloggen")}
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gray-600"
                    disabled={loading}
                  >
                    {isSignUp ? "Al een account? Log in" : "Geen account? Maak er een aan"}
                  </Button>
                </div>
              </>
            )}

            <div className="text-left">
              <p className="text-xs text-gray-500 mb-4">
                Nieuwe accounts vallen onder onze{" "}
                <Button variant="link" className="text-xs text-[#0077B5] p-0 h-auto font-normal underline">
                  <a href="/terms" target="_blank" rel="noopener noreferrer">
                    algemene voorwaarden
                  </a>
                </Button>
                {" "}en ons{" "}
                <Button variant="link" className="text-xs text-[#0077B5] p-0 h-auto font-normal underline">
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">
                    privacybeleid
                  </a>
                </Button>
                .
              </p>
              
              {/* Benefits with green checkmarks */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>14 dagen geld terug garantie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Nederlandse klantenservice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Foto's klaar in 15 minuten</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
