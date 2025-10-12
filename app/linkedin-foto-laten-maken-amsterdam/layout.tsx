import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Amsterdam? | AI Portret Pro €29",
  description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  keywords: "LinkedIn foto laten maken Amsterdam, profielfoto LinkedIn Amsterdam, fotograaf LinkedIn Amsterdam, zakelijk portret Amsterdam, LinkedIn fotoshoot Amsterdam, professionele foto Amsterdam, headshot fotograaf Amsterdam, AI fotografie Amsterdam",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Amsterdam | AI Fotoshoot €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
    url: "https://aiportretpro.nl/linkedin-foto-laten-maken-amsterdam",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Amsterdam? | AI Portret Pro €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/linkedin-foto-laten-maken-amsterdam",
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

export default function AmsterdamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
