import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Den Haag? | Kan nu online!",
  description: "Professionele foto's, 6x goedkoper dan een fotograaf. 40 foto's in 15 min, ideaal voor LinkedIn, website en print. Begin nu!",
  keywords: "LinkedIn foto laten maken Den Haag, profielfoto LinkedIn Den Haag, fotograaf LinkedIn Den Haag, zakelijk portret Den Haag, LinkedIn fotoshoot Den Haag, professionele foto Den Haag, headshot fotograaf Den Haag, AI fotografie Den Haag",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Den Haag | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Haagse professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-den-haag",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Den Haag | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Haagse professionals",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-den-haag",
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

export default function DenHaagLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
