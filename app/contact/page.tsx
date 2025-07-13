"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage("")

    const formData = new FormData(event.target as HTMLFormElement)

    // Get form values
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const messageText = formData.get("message") as string

    // Create the payload for Web3Forms
    const payload = {
      access_key: "02767e09-2a5b-40af-bf53-138fcc2689bd",
      name: name,
      email: email,
      subject: subject,
      message: messageText,
      from_name: name,
      replyto: email,
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        setMessage("Bedankt voor je bericht! We reageren binnen 48 uur.")
        ;(event.target as HTMLFormElement).reset()
      } else {
        setMessage("Er is iets misgegaan. Probeer het opnieuw.")
        console.error("Web3Forms error:", result)
      }
    } catch (error) {
      setMessage("Er is iets misgegaan. Probeer het opnieuw.")
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Contact</CardTitle>
            <p className="text-gray-600 mt-2">We reageren binnen 48 uur op je bericht</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Naam *
                </label>
                <Input type="text" id="name" name="name" required className="w-full" placeholder="Je volledige naam" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input type="email" id="email" name="email" required className="w-full" placeholder="je@email.com" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Onderwerp *
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full"
                  placeholder="Waar gaat je bericht over?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Bericht *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full"
                  placeholder="Typ hier je bericht..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                {isSubmitting ? "Bericht wordt verzonden..." : "Verstuur bericht"}
              </Button>

              {message && (
                <div
                  className={`text-center p-4 rounded-lg font-medium ${
                    message.includes("Bedankt")
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
