import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Den Haag - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Den Haag? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Den Haag fotografen.',
  keywords: 'LinkedIn foto Den Haag, professionele foto Den Haag, zakelijke fotoshoot Den Haag, LinkedIn fotograaf Den Haag, profielfoto Den Haag online',
  openGraph: {
    title: 'LinkedIn foto laten maken Den Haag - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Den Haag professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Den Haag.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Den Haag - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Den Haag professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-den-haag'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}