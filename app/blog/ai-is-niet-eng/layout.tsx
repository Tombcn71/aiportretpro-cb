import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI is niet eng: Waarom kunstmatige intelligentie je vriend is | AI Portret Pro',
  description: 'Ontkracht mythes over AI en ontdek waarom kunstmatige intelligentie je professionele doelen versterkt. Echte succesverhalen en praktische tips om AI te omarmen.',
  keywords: 'AI mythes ontkracht, kunstmatige intelligentie voordelen, AI fotografie veilig, AI technologie uitleg, waarom AI niet eng is',
  openGraph: {
    title: 'AI is niet eng: Waarom kunstmatige intelligentie je vriend is',
    description: 'Ontkracht mythes over AI en ontdek hoe kunstmatige intelligentie je professionele kansen vergroot in plaats van verkleint.',
    type: 'article',
    publishedTime: '2025-09-23',
    authors: ['AI Portret Pro'],
    tags: ['AI mythes', 'kunstmatige intelligentie', 'technologie', 'educatie'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI is niet eng: Waarom kunstmatige intelligentie je vriend is',
    description: 'Ontkracht mythes over AI en ontdek de echte voordelen van kunstmatige intelligentie.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/blog/ai-is-niet-eng'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
