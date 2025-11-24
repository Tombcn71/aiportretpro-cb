"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (!tokenFromUrl) {
      setError("Ongeldige reset link. Vraag een nieuwe reset link aan.")
    } else {
      setToken(tokenFromUrl)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen")
      return
    }

    if (password.length < 6) {
      setError("Wachtwoord moet minimaal 6 karakters lang zijn")
      return
    }

    if (!token) {
      setError("Ongeldige reset link")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Er is een fout opgetreden")
      }

      setSuccess(true)
      
      // Redirect naar login na 3 seconden
      setTimeout(() => {
        router.push("/login")
      }, 3000)

    } catch (error) {
      console.error("Reset password error:", error)
      setError(error instanceof Error ? error.message : "Er is een fout opgetreden")
    } finally {
      setLoading(false)
    }
  }

  // Als geen token, toon error
  if (!token && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Ongeldige link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              {error}
            </p>
            <Link href="/forgot-password">
              <Button className="w-full bg-[#0077B5] hover:bg-[#005885]">
                Nieuwe reset link aanvragen
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Terug naar login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Als succesvol, toon success message
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-gray-900">
              Wachtwoord gewijzigd!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Je wachtwoord is succesvol gewijzigd. Je wordt automatisch doorgestuurd naar de login pagina.
            </p>
            <Link href="/login">
              <Button className="w-full bg-[#0077B5] hover:bg-[#005885]">
                Ga naar login
              </Button>
            </Link>
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
            Nieuw wachtwoord instellen
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Kies een nieuw wachtwoord voor je account.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Nieuw wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimaal 6 karakters"
                  required
                  disabled={loading}
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Bevestig wachtwoord
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Herhaal je wachtwoord"
                  required
                  disabled={loading}
                  minLength={6}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> Gebruik een sterk wachtwoord met minimaal 6 karakters.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-[#0077B5] hover:bg-[#005885] text-white py-6 text-lg font-semibold"
            >
              {loading ? "Bezig..." : "Wachtwoord wijzigen"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login">
              <Button variant="ghost" className="text-sm text-gray-600">
                Terug naar login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


