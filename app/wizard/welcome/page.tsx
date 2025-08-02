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

    if (session && !success) {
      // User is logged in and no success param, redirect to project name
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

  // Show success/training status if user just completed payment
  if (session && success) {
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

  // Show login screen if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Get your headshots in <span className="text-orange-500">minutes</span>, not days
                </h1>
                <p className="text-xl text-gray-600">
                  Professional AI headshots ready in 15 minutes. Perfect for LinkedIn, resumes, and professional
                  profiles.
                </p>
              </div>

              {/* Photo grid */}
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
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>4.8/5 (2,000+ reviews)</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-1" />
                  <span>100% Money Back</span>
                </div>
              </div>

              {/* Social proof */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-700 italic">
                      "Some of my family initially worried that I was wasting time and money, but after seeing the
                      results, they were amazed. I had been dreading the task of getting a great photo for my author bio
                      in my upcoming book, and now that worry is gone. Thank you!"
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-2">Adam Weygandt</p>
                  </div>
                </div>
              </div>

              {/* Company logos */}
              <div>
                <p className="text-sm text-gray-500 mb-3">Trusted by teams at</p>
                <div className="flex items-center space-x-6 opacity-60">
                  <span className="text-sm font-medium">Trinity College</span>
                  <span className="text-sm font-medium">NYU</span>
                  <span className="text-sm font-medium">UC Berkeley</span>
                  <span className="text-sm font-medium">Microsoft</span>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="space-y-6">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Aragon.ai</h2>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                          Loading...
                        </div>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Type your email address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <Button
                        variant="outline"
                        className="w-full py-3 text-lg font-medium border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                      >
                        Continue with Email
                      </Button>
                    </div>
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
              </Card>
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
