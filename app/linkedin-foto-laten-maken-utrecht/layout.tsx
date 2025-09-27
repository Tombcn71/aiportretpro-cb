import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn foto laten maken Utrecht - Online zonder fotograaf | AI Portret Pro',
  description: 'Professionele LinkedIn foto laten maken in Utrecht? Nu online zonder fotograaf! 40 foto\'s in 15 minuten voor €29. 6x goedkoper dan Utrecht fotografen.',
  keywords: 'LinkedIn foto Utrecht, professionele foto Utrecht, zakelijke fotoshoot Utrecht, LinkedIn fotograaf Utrecht, profielfoto Utrecht online',
  openGraph: {
    title: 'LinkedIn foto laten maken Utrecht - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Utrecht professionals. 40 foto\'s in 15 minuten voor €29, geen reistijd door Utrecht.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn foto laten maken Utrecht - Online zonder fotograaf',
    description: 'Professionele LinkedIn foto\'s voor Utrecht professionals. 40 foto\'s in 15 minuten voor €29.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/linkedin-foto-laten-maken-utrecht'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}