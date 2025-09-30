import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Almere? | Kan nu online!",
  description: "Professionele foto's, 6x goedkoper dan een fotograaf. 40 foto's in 15 min, ideaal voor LinkedIn, website en print. Begin nu!",
  keywords: "LinkedIn foto laten maken Almere, profielfoto LinkedIn Almere, fotograaf LinkedIn Almere, zakelijk portret Almere, LinkedIn fotoshoot Almere, professionele foto Almere, headshot fotograaf Almere, AI fotografie Almere",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Almere | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Almere professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-almere",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Almere | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Almere professionals",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-almere",
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

export default function AlmereLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
