"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Welkom!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Je betaling is succesvol verwerkt. Laten we beginnen met het maken van je professionele headshots!
          </p>
          <Link href="/wizard/project-name">
            <Button className="w-full linkedin-primary">Start wizard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
