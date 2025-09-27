import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Eindhoven - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Eindhoven? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Eindhoven fotografen.',
  keywords: 'LinkedIn foto Eindhoven, professionele foto Eindhoven, zakelijke fotoshoot Eindhoven, LinkedIn fotograaf Eindhoven, profielfoto Eindhoven online',
  openGraph: {
    title: 'LinkedIn foto laten maken Eindhoven - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Eindhoven professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Eindhoven.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Eindhoven - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Eindhoven professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-eindhoven'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}