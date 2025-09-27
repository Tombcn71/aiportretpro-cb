import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Nijmegen - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Nijmegen? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Nijmegen fotografen.',
  keywords: 'LinkedIn foto Nijmegen, professionele foto Nijmegen, zakelijke fotoshoot Nijmegen, LinkedIn fotograaf Nijmegen, profielfoto Nijmegen online',
  openGraph: {
    title: 'LinkedIn foto laten maken Nijmegen - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Nijmegen professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Nijmegen.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Nijmegen - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Nijmegen professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-nijmegen'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}