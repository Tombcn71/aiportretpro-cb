import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Groningen | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Groningen? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Groningen professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Groningen, profielfoto LinkedIn Groningen, fotograaf LinkedIn Groningen, zakelijk portret Groningen, LinkedIn fotoshoot Groningen, professionele foto Groningen, headshot fotograaf Groningen",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Groningen | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Groningen professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-groningen",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-groningen",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function GroningenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}