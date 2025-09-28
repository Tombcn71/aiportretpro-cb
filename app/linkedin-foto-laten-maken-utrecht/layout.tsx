import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Foto Laten Maken Utrecht | Professionele Fotoshoot €29 | 40 Foto's",
  description: "LinkedIn foto laten maken Utrecht? ✓ AI fotoshoot 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Utrecht professionals ✓ Gratis levering",
  keywords: "LinkedIn foto laten maken Utrecht, profielfoto LinkedIn Utrecht, fotograaf LinkedIn Utrecht, zakelijk portret Utrecht, LinkedIn fotoshoot Utrecht, professionele foto Utrecht, headshot fotograaf Utrecht",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Utrecht | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor Utrecht professionals",
    url: "https://aiportretpro.com/linkedin-foto-laten-maken-utrecht",
    type: "website",
    locale: "nl_NL",
  },
  alternates: {
    canonical: "https://aiportretpro.com/linkedin-foto-laten-maken-utrecht",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function UtrechtLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}