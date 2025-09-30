import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Breda | AI Fotoshoot €29 | 40 Professionele Foto's",
  description: "LinkedIn foto laten maken Breda? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Bredase professionals ✓ Binnen 15 minuten klaar",
  keywords: "LinkedIn foto laten maken Breda, profielfoto LinkedIn Breda, fotograaf LinkedIn Breda, zakelijk portret Breda, LinkedIn fotoshoot Breda, professionele foto Breda, headshot fotograaf Breda, AI fotografie Breda",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Breda | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Bredase professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-breda",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Breda | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Bredase professionals",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-breda",
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

export default function BredaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
