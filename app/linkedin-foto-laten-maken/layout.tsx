import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken | AI Fotoshoot €29 | 40 Professionele Foto's in 15 Min",
  description: "LinkedIn foto laten maken? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor professionals ✓ Binnen 15 minuten klaar",
  keywords: "LinkedIn profielfoto, LinkedIn foto, professionele profielfoto, LinkedIn headshot, AI profielfoto, LinkedIn zichtbaarheid, recruiters LinkedIn, zakelijke portretfoto",
  openGraph: {
    title: "LinkedIn Foto Laten Maken | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor professionals ✓ Binnen 15 minuten klaar",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken",
    siteName: "AI Portret Pro",
    images: [
      {
        url: "https://aiportretpro.nl/images/professional-woman-1.jpg",
        width: 1200,
        height: 630,
        alt: "Professionele LinkedIn profielfoto voorbeelden"
      }
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor professionals",
    images: ["https://aiportretpro.nl/images/professional-woman-1.jpg"],
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken",
  },
}

export default function LinkedInProfielFotoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
