"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "Er is een configuratiefout opgetreden. Probeer het later opnieuw."
      case "AccessDenied":
        return "Toegang geweigerd. Je hebt geen toestemming om in te loggen."
      case "Verification":
        return "Verificatie mislukt. Probeer het opnieuw."
      default:
        return "Er is een onbekende fout opgetreden tijdens het inloggen."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Inloggen mislukt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">{getErrorMessage(error)}</p>
          <div className="space-y-2">
            <Button asChild className="w-full linkedin-primary">
              <Link href="/auth/signin">Opnieuw proberen</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/">Terug naar home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
