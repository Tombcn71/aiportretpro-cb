import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Den Haag | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Den Haag? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Den Haag professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Den Haag, profielfoto LinkedIn Den Haag, fotograaf LinkedIn Den Haag, zakelijk portret Den Haag, LinkedIn fotoshoot Den Haag, professionele foto Den Haag, headshot fotograaf Den Haag",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Den Haag | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Den Haag professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-den-haag",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-den-haag",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DenHaagLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}