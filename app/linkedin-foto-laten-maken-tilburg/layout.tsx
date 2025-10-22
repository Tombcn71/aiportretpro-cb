import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Tilburg? | AI Portret Pro €29",
  description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  keywords: "LinkedIn foto laten maken Tilburg, profielfoto LinkedIn Tilburg, fotograaf LinkedIn Tilburg, zakelijk portret Tilburg, LinkedIn fotoshoot Tilburg, professionele foto Tilburg, headshot fotograaf Tilburg, AI fotografie Tilburg",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Tilburg | AI Fotoshoot €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-tilburg",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Tilburg? | AI Portret Pro €29",
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

export default function TilburgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
