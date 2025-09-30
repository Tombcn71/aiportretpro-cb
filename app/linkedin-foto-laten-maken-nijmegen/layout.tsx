import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Nijmegen? | Kan nu online!",
  description: "Professionele foto's, 6x goedkoper dan een fotograaf. 40 foto's in 15 min, ideaal voor LinkedIn, website en print. Begin nu!",
  keywords: "LinkedIn foto laten maken Nijmegen, profielfoto LinkedIn Nijmegen, fotograaf LinkedIn Nijmegen, zakelijk portret Nijmegen, LinkedIn fotoshoot Nijmegen, professionele foto Nijmegen, headshot fotograaf Nijmegen, AI fotografie Nijmegen",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Nijmegen | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Nijmeegse professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-nijmegen",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Nijmegen | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Nijmeegse professionals",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-nijmegen",
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

export default function NijmegenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
