import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Amsterdam - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Amsterdam? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Amsterdamse fotografen.',
  keywords: 'LinkedIn foto Amsterdam, professionele foto Amsterdam, zakelijke fotoshoot Amsterdam, LinkedIn fotograaf Amsterdam, profielfoto Amsterdam online',
  openGraph: {
    title: 'LinkedIn foto laten maken Amsterdam - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Amsterdam professionals. 40 foto\'s in 15 minuten voor €29, zonder reistijd door Amsterdam.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Amsterdam - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Amsterdam professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-amsterdam'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
