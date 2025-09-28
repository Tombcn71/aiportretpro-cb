import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Nijmegen | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Nijmegen? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Nijmegen professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Nijmegen, profielfoto LinkedIn Nijmegen, fotograaf LinkedIn Nijmegen, zakelijk portret Nijmegen, LinkedIn fotoshoot Nijmegen, professionele foto Nijmegen, headshot fotograaf Nijmegen",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Nijmegen | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Nijmegen professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-nijmegen",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-nijmegen",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function NijmegenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}