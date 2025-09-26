import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '5 fouten die je LinkedIn foto verpesten (en hoe AI ze voorkomt) | AI Portret Pro',
  description: 'Vermijd de 5 meest voorkomende LinkedIn foto-fouten die je connecties en carrièrekansen kosten. Ontdek hoe AI-technologie elke fout automatisch voorkomt.',
  keywords: 'LinkedIn foto fouten, professionele foto tips, LinkedIn profielfoto verbeteren, zakelijke foto blunders, LinkedIn photo mistakes',
  openGraph: {
    title: '5 fouten die je LinkedIn foto verpesten (en hoe AI ze voorkomt)',
    description: 'Vermijd kostbare LinkedIn foto-fouten die je connecties kosten. Leer hoe AI-technologie elke fout automatisch voorkomt.',
    type: 'article',
    publishedTime: '2025-09-23',
    authors: ['AI Portret Pro'],
    tags: ['LinkedIn', 'foto fouten', 'professional', 'AI preventie'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 fouten die je LinkedIn foto verpesten (en hoe AI ze voorkomt)',
    description: 'Vermijd kostbare LinkedIn foto-fouten die je connecties en carrière kosten.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/blog/linkedin-foto-fouten-ai-voorkomt'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
