import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Eindhoven? | AI Portret Pro €29",
  description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  keywords: "LinkedIn foto laten maken Eindhoven, profielfoto LinkedIn Eindhoven, fotograaf LinkedIn Eindhoven, zakelijk portret Eindhoven, LinkedIn fotoshoot Eindhoven, professionele foto Eindhoven, headshot fotograaf Eindhoven, AI fotografie Eindhoven",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Eindhoven | AI Fotoshoot €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-eindhoven",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Eindhoven? | AI Portret Pro €29",
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

export default function EindhovenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
