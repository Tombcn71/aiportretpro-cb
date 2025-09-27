import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Rotterdam - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Rotterdam? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Rotterdamse fotografen.',
  keywords: 'LinkedIn foto Rotterdam, professionele foto Rotterdam, zakelijke fotoshoot Rotterdam, LinkedIn fotograaf Rotterdam, profielfoto Rotterdam online',
  openGraph: {
    title: 'LinkedIn foto laten maken Rotterdam - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Rotterdam professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Rotterdam.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Rotterdam - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Rotterdam professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-rotterdam'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
