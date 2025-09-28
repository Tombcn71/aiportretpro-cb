import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Breda | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Breda? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Breda professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Breda, profielfoto LinkedIn Breda, fotograaf LinkedIn Breda, zakelijk portret Breda, LinkedIn fotoshoot Breda, professionele foto Breda, headshot fotograaf Breda",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Breda | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Breda professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-breda",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-breda",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BredaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}