import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// City mapping for proper names
const cityNames: { [key: string]: string } = {
  'amsterdam': 'Amsterdam',
  'rotterdam': 'Rotterdam', 
  'den-haag': 'Den Haag',
  'utrecht': 'Utrecht',
  'eindhoven': 'Eindhoven',
  'tilburg': 'Tilburg',
  'groningen': 'Groningen',
  'almere': 'Almere',
  'breda': 'Breda',
  'nijmegen': 'Nijmegen'
}

// Photographer counts per city
const photographerCounts: { [key: string]: number } = {
  'amsterdam': 38,
  'rotterdam': 29,
  'den-haag': 30,
  'utrecht': 36,
  'eindhoven': 30,
  'tilburg': 34,
  'groningen': 37,
  'almere': 26,
  'breda': 34,
  'nijmegen': 31
}

type Props = {
  params: Promise<{ stad: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stad } = await params
  const cityName = cityNames[stad]
  const photographerCount = photographerCounts[stad]
  
  if (!cityName) {
    return {
      title: 'Stad niet gevonden | AI Portret Pro',
      description: 'De opgevraagde stad is niet beschikbaar in onze fotografen database.'
    }
  }

  return {
    title: `Fotografen in ${cityName} - ${photographerCount} Professionele Fotografen | AI Portret Pro`,
    description: `Vind ${photographerCount} geverifieerde zakelijke fotografen in ${cityName}. Specialisten in LinkedIn foto's, bedrijfsportretten en professionele fotoshoots met werkende websites.`,
    keywords: `fotografen ${cityName.toLowerCase()}, zakelijke fotograaf ${cityName.toLowerCase()}, LinkedIn fotoshoot ${cityName.toLowerCase()}, bedrijfsfotograaf ${cityName.toLowerCase()}, professionele fotoshoot ${cityName.toLowerCase()}`,
    openGraph: {
      title: `Fotografen in ${cityName} - ${photographerCount} Professionele Fotografen`,
      description: `Ontdek ${photographerCount} geverifieerde zakelijke fotografen in ${cityName} voor LinkedIn foto's en bedrijfsportretten.`,
      type: 'website',
      siteName: 'AI Portret Pro',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Fotografen in ${cityName} - ${photographerCount} Professionele Fotografen`,
      description: `${photographerCount} geverifieerde zakelijke fotografen in ${cityName}.`,
    },
    alternates: {
      canonical: `https://aiportretpro.nl/fotografen/${stad}`
    }
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
