import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Over Ons - Tom van Reijn | AI Portret Pro",
  description: "Ontmoet Tom van Reijn, developer en AI-enthusiast achter AI Portret Pro. Met ervaring in de startup-wereld maakt hij professionele fotografie voor iedereen bereikbaar.",
  keywords: "Tom van Reijn, AI Portret Pro oprichter, startup ervaring, AI fotografie, developer, professionele foto's, over ons",
  openGraph: {
    title: "Over Ons - Tom van Reijn | AI Portret Pro",
    description: "Ontmoet Tom van Reijn, developer en AI-enthusiast achter AI Portret Pro. Met ervaring in de startup-wereld maakt hij professionele fotografie voor iedereen bereikbaar.",
    url: "https://aiportretpro.nl/over-ons",
    siteName: "AI Portret Pro",
    images: [
      {
        url: "https://aiportretpro.nl/images/me.jpg",
        width: 1200,
        height: 630,
        alt: "Tom van Reijn - Oprichter van AI Portret Pro"
      }
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Over Ons - Tom van Reijn | AI Portret Pro",
    description: "Ontmoet Tom van Reijn, developer en AI-enthusiast achter AI Portret Pro. Met ervaring in de startup-wereld maakt hij professionele fotografie voor iedereen bereikbaar.",
    images: ["https://aiportretpro.nl/images/me.jpg"],
  },
  alternates: {
    canonical: "https://aiportretpro.nl/over-ons",
  },
}

export default function OverOnsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
