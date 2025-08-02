"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function WizardWelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && !success) {
      // User is logged in, redirect to project name
      router.push("/wizard/project-name")
    }
  }, [status, success, router])

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
  if (success && session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Betaling Succesvol!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Je AI training is gestart! Je ontvangt een email wanneer je headshots klaar zijn (15-20 minuten).
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Ga naar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Hero */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Get your headshots in <span className="text-orange-500">minutes</span>, not days
                </h1>
                <p className="text-gray-600 text-lg">
                  Professional AI headshots in 15 minutes. No photographer needed.
                </p>
              </div>

              {/* Trust badges */}
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-2" />
                  <span>100% Money Back Guarantee</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>Google Reviews 4.8</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-green-500 mr-1" />
                  <span>TrustPilot 4.8</span>
                </div>
              </div>

              {/* Example photos grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-man-1.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-woman-1.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-man-2.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-woman-2.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-man-3.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-woman-3.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-man-4.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/professional-woman-4.jpg"
                    alt="Professional headshot"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Review */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic mb-3">
                  "I am so very pleased and astonished at how many gorgeous results were generated. These photos
                  represent my professional brand perfectly."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Sarah Johnson</span>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 text-xl font-bold">🔥</span>
                  </div>
                  <CardTitle className="text-xl">Aragon.ai</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Last used
                  </Badge>

                  <Button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

                  <div className="text-center text-sm text-gray-500">
                    New accounts are subject to our Terms and Privacy Policy.
                  </div>

                  <div className="text-center space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Security built for Fortune 500 companies</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>100% Money Back Guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
