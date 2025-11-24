"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Er is een fout opgetreden")
      }

      setSuccess(true)
    } catch (error) {
      console.error("Forgot password error:", error)
      setError(error instanceof Error ? error.message : "Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Check je email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Als het email adres <strong>{email}</strong> bij ons bekend is, hebben we een wachtwoord reset link verzonden.
            </p>
            <p className="text-sm text-center text-gray-500">
              De link is 1 uur geldig. Check ook je spam folder als je de email niet direct ziet.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Terug naar login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
          
          <CardTitle className="text-2xl text-gray-900">
            Wachtwoord vergeten?
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Geen probleem. Vul je email adres in en we sturen je een link om je wachtwoord te resetten.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email adres
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-[#0077B5] hover:bg-[#005885] text-white py-6 text-lg font-semibold"
            >
              {loading ? "Bezig..." : "Verstuur reset link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Terug naar login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


