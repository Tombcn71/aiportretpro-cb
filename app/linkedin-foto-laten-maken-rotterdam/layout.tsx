import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Rotterdam? | Kan nu online!",
  description: "Professionele foto's, 6x goedkoper dan een fotograaf. 40 foto's in 15 min, ideaal voor LinkedIn, website en print. Begin nu!",
  keywords: "LinkedIn foto laten maken Rotterdam, profielfoto LinkedIn Rotterdam, fotograaf LinkedIn Rotterdam, zakelijk portret Rotterdam, LinkedIn fotoshoot Rotterdam, professionele foto Rotterdam, headshot fotograaf Rotterdam, AI fotografie Rotterdam",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Rotterdam | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Rotterdamse professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-rotterdam",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Rotterdam | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Rotterdamse professionals",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-rotterdam",
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

export default function RotterdamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
