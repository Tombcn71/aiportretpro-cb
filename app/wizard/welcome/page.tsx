"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Shield } from "lucide-react"
import Image from "next/image"

export default function WizardWelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const [isTraining, setIsTraining] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && !success) {
      // User is logged in and it's not a success redirect, go to project name
      router.push("/wizard/project-name")
    }
  }, [status, success, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  if (success && session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Training Started!</h2>
            <p className="text-gray-600 mb-6">
              Je AI headshots worden nu gegenereerd. Dit duurt ongeveer 15-20 minuten.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Ga naar Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left side - Hero */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Krijg je headshots in <span className="text-orange-500">minuten</span>, niet dagen
                </h1>
                <p className="text-xl text-gray-600">Professionele AI headshots in 15 minuten. Geen fotoshoot nodig.</p>
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

              {/* Review */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">
                  "Some of my family initially worried that I was wasting time and money, but after seeing the results,
                  they were amazed. I had been dreading the task of getting a great photo for my author bio in my
                  upcoming book, and now that worry is gone. Thank you!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <span className="font-medium">Adam Weygandt</span>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Aragon.ai</h2>
                  </div>

                  <div className="space-y-4">
                    <Button
                      onClick={() => signIn("google", { callbackUrl: "/wizard/project-name" })}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                    >
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
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                        Continue with Email
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
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

                    <div className="text-center space-y-2 pt-4">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Shield className="w-4 h-4 mr-2" />
                        Security built for Fortune 500 companies
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        100% Money Back Guarantee
                      </div>
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
