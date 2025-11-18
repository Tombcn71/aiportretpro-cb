import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LinkedIn profielfoto: Complete gids voor professionals [2025] | AI Portret Pro',
  description: 'Alles over de perfecte LinkedIn profielfoto: do\'s en don\'ts, technische vereisten, sector-specifieke tips. 14x meer profielweergaven met professionele foto\'s.',
  keywords: 'LinkedIn profielfoto, professionele foto LinkedIn, LinkedIn foto tips, zakelijke profielfoto, headshot LinkedIn',
  openGraph: {
    title: 'LinkedIn profielfoto: Complete gids voor professionals [2025]',
    description: 'Complete gids voor de perfecte LinkedIn profielfoto. Ontdek do\'s en don\'ts, krijg 14x meer profielweergaven met professionele foto\'s.',
    type: 'article',
    publishedTime: '2025-09-23',
    authors: ['AI Portret Pro'],
    tags: ['LinkedIn', 'profielfoto', 'professional', 'social media'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkedIn profielfoto: Complete gids voor professionals [2025]',
    description: 'Complete gids voor de perfecte LinkedIn profielfoto. Krijg 14x meer profielweergaven.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/blog/linkedin-profielfoto-gids-2025'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
