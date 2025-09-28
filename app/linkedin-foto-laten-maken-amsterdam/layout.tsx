import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Amsterdam | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Amsterdam? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Amsterdamse professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Amsterdam, profielfoto LinkedIn Amsterdam, fotograaf LinkedIn Amsterdam, zakelijk portret Amsterdam, LinkedIn fotoshoot Amsterdam, professionele foto Amsterdam, headshot fotograaf Amsterdam",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Amsterdam | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Amsterdamse professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-amsterdam",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-amsterdam",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AmsterdamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}