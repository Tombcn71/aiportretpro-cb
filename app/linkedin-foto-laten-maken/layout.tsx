import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AI Portret Pro | LinkedIn foto's laten maken? kan nu ook online",
  description: "Even wat foto's uploaden dat is alles. 6 x goedkoper dan een traditionele fotograaf, 40 professionele foto's in slechts 15 minuten, perfecte maat voor linkedin, website en print",
  keywords: "LinkedIn profielfoto, LinkedIn foto, professionele profielfoto, LinkedIn headshot, AI profielfoto, LinkedIn zichtbaarheid, recruiters LinkedIn, zakelijke portretfoto",
  openGraph: {
    title: "AI Portret Pro | LinkedIn foto's laten maken? kan nu ook online",
    description: "Even wat foto's uploaden dat is alles. 6 x goedkoper dan een traditionele fotograaf, 40 professionele foto's in slechts 15 minuten, perfecte maat voor linkedin, website en print",
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
    title: "LinkedIn Profielfoto | 14x Meer Zichtbaarheid",
    description: "Professionele LinkedIn foto's met AI. 40 foto's in 15 minuten voor €29.",
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
