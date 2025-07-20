"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage("") // Clear previous messages

    const formData = new FormData(event.target as HTMLFormElement)

    // Get form values - These lines correctly retrieve the values by their 'name' attribute
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string // This line correctly gets the subject
    const messageText = formData.get("message") as string

    // Create the payload for Web3Forms - The 'subject' is included here
    const payload = {
      access_key: "02767e09-2a5b-40af-bf53-138fcc2689bd", // Consider using an environment variable for this key
      name: name,
      email: email,
      subject: subject, // The subject is explicitly part of the payload
      message: messageText,
      from_name: name, // Web3Forms specific field
      replyto: email, // Web3Forms specific field
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload), // The entire payload, including subject, is sent
      })

      const result = await response.json()

      if (result.success) {
        setMessage("Bedankt voor je bericht! We reageren binnen 24 uur.")
        ;(event.target as HTMLFormElement).reset() // Reset the form after successful submission
      } else {
        setMessage("Er is iets misgegaan. Probeer het opnieuw.")
        console.error("Web3Forms error:", result) // Log the full error from Web3Forms for debugging
      }
    } catch (error) {
      setMessage("Er is iets misgegaan. Probeer het opnieuw.")
      console.error("Submit error:", error) // Log network or other submission errors
    } finally {
      setIsSubmitting(false) // Always set submitting state back to false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-4xl font-extrabold text-gray-900">Contact</CardTitle>
            <p className="text-justify text-lg text-gray-600 mt-2">Onze support is 5 dagen per week bereikbaar en reageert binnen 24 uur, maar meestal sneller 🙂.</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Naam veld */}
              <div className="space-y-2">
                <Label htmlFor="name">Naam *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Je volledige naam"
                />
              </div>

              {/* Email veld */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="je@email.com"
                />
              </div>

              {/* Onderwerp veld - Added Label for consistency */}
              <div className="space-y-2">
                <Label htmlFor="subject">Onderwerp *</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject" // This 'name' attribute is crucial for formData.get("subject")
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Waar gaat je bericht over?"
                />
              </div>

              {/* Bericht veld */}
              <div className="space-y-2">
                <Label htmlFor="message">Bericht *</Label>
                <Textarea
                  id="message"
                  name="message" // This 'name' attribute is crucial for formData.get("message")
                  required
                  rows={6}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Typ hier je bericht..."
                />
              </div>

              {/* Submit knop */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? "Bericht wordt verzonden..." : "Verstuur bericht"}
              </Button>

              {/* Statusbericht */}
              {message && (
                <div
                  className={`text-center p-4 rounded-lg font-medium ${
                    message.includes("Bedankt")
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                  role="alert" // Improve accessibility for screen readers
                  aria-live={message.includes("Bedankt") ? "polite" : "assertive"}
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
