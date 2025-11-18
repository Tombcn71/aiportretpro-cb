import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - AI Portret Pro | Snel Antwoord binnen 24 uur',
  description: 'Neem contact op met AI Portret Pro. Onze support is 5 dagen per week bereikbaar en reageert binnen 24 uur op je vragen over professionele AI fotografie.',
  keywords: 'contact AI Portret Pro, klantenservice, support, vragen zakelijke fotografie, LinkedIn foto hulp',
  openGraph: {
    title: 'Contact - AI Portret Pro',
    description: 'Neem contact op met AI Portret Pro. Support reageert binnen 24 uur op je vragen.',
    type: 'website',
    siteName: 'AI Portret Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - AI Portret Pro',
    description: 'Neem contact op met AI Portret Pro. Support reageert binnen 24 uur.',
  },
  alternates: {
    canonical: 'https://aiportretpro.nl/contact'
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

