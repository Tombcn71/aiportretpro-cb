import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Rotterdam | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Rotterdam? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Rotterdam professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Rotterdam, profielfoto LinkedIn Rotterdam, fotograaf LinkedIn Rotterdam, zakelijk portret Rotterdam, LinkedIn fotoshoot Rotterdam, professionele foto Rotterdam, headshot fotograaf Rotterdam",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Rotterdam | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Rotterdam professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-rotterdam",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-rotterdam",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RotterdamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}