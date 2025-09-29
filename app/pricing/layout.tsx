import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prijzen - Professionele zakelijke foto's voor €29 | AI Portret Pro",
  description: "Zakelijke fotoshoot voor slechts €29. 6x goedkoper dan traditionele fotografen. 40 professionele AI portretfoto's in 15 minuten. Perfect voor LinkedIn, CV en website.",
  keywords: "zakelijke fotoshoot prijzen, professionele foto kosten, LinkedIn foto prijs, business headshot nederland, AI fotografie tarief",
  openGraph: {
    title: "Prijzen - Professionele zakelijke foto's voor €29 | AI Portret Pro",
    description: "Zakelijke fotoshoot voor slechts €29. 6x goedkoper dan traditionele fotografen. 40 professionele AI portretfoto's in 15 minuten.",
    url: "https://aiportretpro.nl/pricing",
    siteName: "AI Portret Pro",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prijzen - Professionele zakelijke foto's voor €29 | AI Portret Pro",
    description: "Zakelijke fotoshoot voor slechts €29. 6x goedkoper dan traditionele fotografen. 40 professionele AI portretfoto's in 15 minuten.",
  },
  alternates: {
    canonical: "https://aiportretpro.nl/pricing",
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

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
