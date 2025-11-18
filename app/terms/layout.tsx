import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden - AI Portret Pro',
  description: 'Lees de algemene voorwaarden voor het gebruik van AI Portret Pro. Begrijp uw rechten en verplichtingen bij gebruik van onze AI fotografie service.',
  robots: {
    index: false, // Terms pages don't need to be indexed
    follow: true,
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/terms'
  }
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

