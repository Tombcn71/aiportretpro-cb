import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Eindhoven | AI Fotoshoot €29 | 40 Professionele Foto's",
  description: "LinkedIn foto laten maken Eindhoven? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Eindhovense professionals ✓ Binnen 15 minuten klaar",
  keywords: "LinkedIn foto laten maken Eindhoven, profielfoto LinkedIn Eindhoven, fotograaf LinkedIn Eindhoven, zakelijk portret Eindhoven, LinkedIn fotoshoot Eindhoven, professionele foto Eindhoven, headshot fotograaf Eindhoven, AI fotografie Eindhoven",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Eindhoven | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Eindhovense professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-eindhoven",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Eindhoven | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Eindhovense professionals",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-eindhoven",
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
