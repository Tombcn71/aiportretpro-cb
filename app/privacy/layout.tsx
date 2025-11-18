import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacybeleid - AI Portret Pro',
  description: 'Lees ons privacybeleid over hoe AI Portret Pro uw persoonlijke gegevens verzamelt, gebruikt en beschermt bij gebruik van onze AI fotografie service.',
  robots: {
    index: false, // Privacy pages don't need to be indexed
    follow: true,
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/privacy'
  }
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

