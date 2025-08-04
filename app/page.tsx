"use client"

import { useSession } from "next-auth/react"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { AIHeadshotsShowcase } from "@/components/ai-headshots-showcase"
import { FloatingCTAButton } from "@/components/floating-cta-button"
import { Header } from "@/components/header"

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <AIHeadshotsShowcase />
      <HowItWorks />
      <PricingSection />
      <FloatingCTAButton />
    </div>
  )
}
