import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Groningen? | AI Portret Pro €29",
  description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  keywords: "LinkedIn foto laten maken Groningen, profielfoto LinkedIn Groningen, fotograaf LinkedIn Groningen, zakelijk portret Groningen, LinkedIn fotoshoot Groningen, professionele foto Groningen, headshot fotograaf Groningen, AI fotografie Groningen",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Groningen | AI Fotoshoot €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-groningen",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Groningen? | AI Portret Pro €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function GroningenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
