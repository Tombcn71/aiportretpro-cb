"use client"

import { getProviders, signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/pricing"

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  if (!providers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0077B5]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Inloggen</CardTitle>
          <p className="text-gray-600">Log in om door te gaan met je bestelling</p>
        </CardHeader>
        <CardContent>
          {Object.values(providers).map((provider: any) => (
            <Button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl })}
              className="w-full linkedin-primary"
            >
              Inloggen met {provider.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
