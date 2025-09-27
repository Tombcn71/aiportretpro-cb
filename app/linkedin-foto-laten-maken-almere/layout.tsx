import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Almere - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Almere? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Almere fotografen.',
  keywords: 'LinkedIn foto Almere, professionele foto Almere, zakelijke fotoshoot Almere, LinkedIn fotograaf Almere, profielfoto Almere online',
  openGraph: {
    title: 'LinkedIn foto laten maken Almere - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Almere professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Almere.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Almere - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Almere professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-almere'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}