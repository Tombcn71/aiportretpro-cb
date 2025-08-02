"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Check, Star, Shield, RefreshCw } from "lucide-react"
import Image from "next/image"

export default function WizardWelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const success = searchParams.get("success")

  useEffect(() => {
    if (status === "loading") return

    // Clear old wizard data when starting fresh (no success param)
    if (!success) {
      localStorage.removeItem("wizard_project_name")
      localStorage.removeItem("wizard_gender")
      localStorage.removeItem("wizard_uploaded_photos")
    }

    // Als success=true, toon training status (na Stripe redirect)
    if (success === "true") {
      return
    }

    // Als ingelogd en geen success, ga naar project-name
    if (session && !success) {
      router.push("/wizard/project-name")
    }
  }, [session, status, success, router])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/wizard/project-name",
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Show success/training status ONLY after Stripe redirect with success=true
  if (session && success === "true") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Betaling Succesvol!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-[#0077B5]" />
                  <span className="text-lg">AI training gestart...</span>
                </div>
                <p className="text-gray-600">Je headshots worden nu gegenereerd. Dit duurt ongeveer 15-20 minuten.</p>
                <p className="text-sm text-gray-500">
                  Je krijgt een email wanneer ze klaar zijn, of check je dashboard.
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard")} className="bg-[#0077B5] hover:bg-[#004182] text-white">
                Ga naar Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated OR no success parameter
  if (!session || success !== "true") {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Hero with photos */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Get your headshots in <span className="text-orange-500">minutes</span>, not days
                </h1>
              </div>

              {/* Photo grid - exactly like screenshot */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  "/images/professional-man-1.jpg",
                  "/images/professional-woman-1.jpg",
                  "/images/professional-man-2.jpg",
                  "/images/professional-woman-2.jpg",
                  "/images/professional-man-3.jpg",
                  "/images/professional-woman-3.jpg",
                  "/images/professional-man-4.jpg",
                  "/images/professional-woman-4.jpg",
                ].map((src, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Professional headshot ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Trustpilot */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
                  ))}
                </div>
                <span className="font-semibold">Trustpilot</span>
              </div>

              {/* Testimonial */}
              <div className="space-y-4">
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  Some of my family initially worried that I was wasting time and money, but after seeing the results,
                  they were amazed. I had been dreading the task of getting a great photo for my author bio in my
                  upcoming book, and now that worry is gone. Thank you!
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <span className="font-medium text-gray-900">Adam Weygandt</span>
                </div>
              </div>

              {/* Company logos */}
              <div>
                <p className="text-sm text-gray-600 mb-4">Trusted by teams at</p>
                <div className="flex items-center space-x-8 opacity-60">
                  <span className="text-sm font-medium">Trinity College</span>
                  <span className="text-sm font-medium">NEW YORK UNIVERSITY</span>
                  <span className="text-sm font-medium">UC Berkeley</span>
                  <span className="text-sm font-medium">Microsoft</span>
                  <span className="text-sm font-medium">PWC</span>
                </div>
              </div>
            </div>

            {/* Right side - Login form exactly like screenshot */}
            <div className="space-y-6">
              <div className="flex justify-end mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="font-bold text-lg">Aragon.ai</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">Last used</span>
                </div>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-medium rounded-lg"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                      Continue with Google
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-4 text-lg font-medium rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </Button>

                <Button
                  variant="outline"
                  className="w-full py-4 text-lg font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                  </svg>
                  Continue with Apple
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div className="flex">
                  <input
                    type="email"
                    placeholder="Type your email address"
                    className="flex-1 px-4 py-4 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-r-lg rounded-l-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full py-4 text-lg font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Continue with Email
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>
                  New accounts are subject to our{" "}
                  <a href="/terms" className="text-orange-500 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <div className="space-y-2 text-center text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Security built for Fortune 500 companies</span>
                </div>
                <div className="flex items-center justify-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  <span>100% Money Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
    </div>
  )
}
