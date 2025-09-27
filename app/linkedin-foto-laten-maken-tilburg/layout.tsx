import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Tilburg - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Tilburg? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Tilburg fotografen.',
  keywords: 'LinkedIn foto Tilburg, professionele foto Tilburg, zakelijke fotoshoot Tilburg, LinkedIn fotograaf Tilburg, profielfoto Tilburg online',
  openGraph: {
    title: 'LinkedIn foto laten maken Tilburg - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Tilburg professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Tilburg.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Tilburg - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Tilburg professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-tilburg'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}