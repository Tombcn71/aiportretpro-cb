import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Eindhoven | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Eindhoven? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Eindhoven professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Eindhoven, profielfoto LinkedIn Eindhoven, fotograaf LinkedIn Eindhoven, zakelijk portret Eindhoven, LinkedIn fotoshoot Eindhoven, professionele foto Eindhoven, headshot fotograaf Eindhoven",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Eindhoven | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Eindhoven professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-eindhoven",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-eindhoven",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function EindhovenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}