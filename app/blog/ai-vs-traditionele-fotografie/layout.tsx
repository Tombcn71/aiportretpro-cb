import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI fotografie vs traditionele fotografie: De eerlijke vergelijking | AI Portret Pro',
  description: 'Diepgaande vergelijking tussen AI-fotografie en traditionele fotoshoots. Kosten, tijd, kwaliteit en toepassingen objectief vergeleken. Wanneer kies je welke optie?',
  keywords: 'AI fotografie vs traditioneel, kunstmatige intelligentie fotografie, AI headshots, digitale fotografie vergelijking, AI vs menselijke fotograaf',
  openGraph: {
    title: 'AI fotografie vs traditionele fotografie: De eerlijke vergelijking',
    description: 'Objectieve vergelijking tussen AI-fotografie en traditionele fotoshoots. Ontdek de voor- en nadelen van beide opties.',
    type: 'article',
    publishedTime: '2025-09-23',
    authors: ['AI Portret Pro'],
    tags: ['AI fotografie', 'traditionele fotografie', 'vergelijking', 'technologie'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI fotografie vs traditionele fotografie: De eerlijke vergelijking',
    description: 'Objectieve vergelijking tussen AI-fotografie en traditionele fotoshoots.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/blog/ai-vs-traditionele-fotografie'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
