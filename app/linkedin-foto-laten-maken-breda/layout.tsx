import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Breda - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Breda? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Breda fotografen.',
  keywords: 'LinkedIn foto Breda, professionele foto Breda, zakelijke fotoshoot Breda, LinkedIn fotograaf Breda, profielfoto Breda online',
  openGraph: {
    title: 'LinkedIn foto laten maken Breda - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Breda professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Breda.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Breda - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Breda professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-breda'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}