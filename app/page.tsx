"use client"

import { useRouter } from "next/navigation"
import Button from "path-to-button-component" // Assuming you have a button component

export default function Home() {
  const router = useRouter()

  return (
    <div>
      <section className="hero">
        {/* Hero section content here */}
        <Button
          onClick={() => router.push("/wizard/welcome")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-lg"
          size="lg"
        >
          Start Nu - Maak Je AI Headshots
        </Button>
      </section>
      {/* rest of code here */}
    </div>
  )
}
