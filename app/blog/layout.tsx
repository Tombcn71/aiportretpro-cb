import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog & Fotografie Gidsen | AI Portret Pro',
  description: 'Ontdek alles over zakelijke fotografie, LinkedIn foto\'s, AI-technologie en professionele beeldvorming. Praktische tips en gidsen voor professionals in Nederland.',
  keywords: 'fotografie blog, zakelijke fotografie tips, LinkedIn foto gids, AI fotografie, professionele foto tips Nederland',
  openGraph: {
    title: 'Blog & Fotografie Gidsen | AI Portret Pro',
    description: 'Praktische fotografie tips, LinkedIn gidsen en AI-technologie uitleg voor professionals in Nederland.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Fotografie Gidsen | AI Portret Pro',
    description: 'Praktische fotografie tips en gidsen voor professionals.',
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
