import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lokale Fotografen in Nederland - 10 Grootste Steden | AI Portret Pro',
  description: 'Vind geverifieerde fotografen in de 10 grootste steden van Nederland. Alleen echte websites en werkende links voor zakelijke fotografie en LinkedIn foto\'s.',
  keywords: 'lokale fotografen Nederland, zakelijke fotografen, LinkedIn fotograaf, professionele fotoshoot, bedrijfsfotograaf Nederland',
  openGraph: {
    title: 'Lokale Fotografen in Nederland - 10 Grootste Steden',
    description: 'Geverifieerde fotografen in Amsterdam, Rotterdam, Den Haag, Utrecht en 6 andere grote Nederlandse steden.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lokale Fotografen in Nederland - 10 Grootste Steden',
    description: 'Vind geverifieerde fotografen in de grootste Nederlandse steden.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/fotografen'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
