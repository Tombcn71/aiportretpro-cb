import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Almere | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Almere? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Almere professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Almere, profielfoto LinkedIn Almere, fotograaf LinkedIn Almere, zakelijk portret Almere, LinkedIn fotoshoot Almere, professionele foto Almere, headshot fotograaf Almere",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Almere | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Almere professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-almere",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-almere",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AlmereLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}