import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wat kost een zakelijke fotoshoot in Nederland? [Complete Prijsgids 2025] | AI Portret Pro',
  description: 'Ontdek de werkelijke kosten van zakelijke fotoshoots in de 10 grootste Nederlandse steden. Onderzoek van 387 fotografen met gemiddelde prijs €175. Vergelijk met AI-alternatieven.',
  keywords: 'zakelijke fotoshoot kosten, fotograaf prijzen Nederland, LinkedIn foto prijs, bedrijfsfotografie tarieven, professionele headshots Nederland',
  openGraph: {
    title: 'Wat kost een zakelijke fotoshoot in Nederland? [Complete Prijsgids 2025]',
    description: 'Onderzoek van 387 Nederlandse fotografen toont gemiddelde kosten van €175 voor zakelijke fotoshoots. Vergelijk prijzen per stad en ontdek AI-alternatieven.',
    type: 'article',
    publishedTime: '2025-09-23',
    authors: ['AI Portret Pro'],
    tags: ['zakelijke fotografie', 'prijzen', 'Nederland', 'fotoshoot kosten'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wat kost een zakelijke fotoshoot in Nederland? [Complete Prijsgids 2025]',
    description: 'Onderzoek van 387 Nederlandse fotografen toont gemiddelde kosten van €175 voor zakelijke fotoshoots.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/blog/wat-kost-zakelijke-fotoshoot-nederland'
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
