import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Tilburg | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Tilburg? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Tilburg professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Tilburg, profielfoto LinkedIn Tilburg, fotograaf LinkedIn Tilburg, zakelijk portret Tilburg, LinkedIn fotoshoot Tilburg, professionele foto Tilburg, headshot fotograaf Tilburg",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Tilburg | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Tilburg professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-tilburg",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-tilburg",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TilburgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}