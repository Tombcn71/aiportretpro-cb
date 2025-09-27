import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Groningen - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Groningen? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Groningen fotografen.',
  keywords: 'LinkedIn foto Groningen, professionele foto Groningen, zakelijke fotoshoot Groningen, LinkedIn fotograaf Groningen, profielfoto Groningen online',
  openGraph: {
    title: 'LinkedIn foto laten maken Groningen - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Groningen professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Groningen.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Groningen - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Groningen professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-groningen'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}