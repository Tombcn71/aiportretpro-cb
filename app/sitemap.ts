import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aiportretpro.nl'
  const currentDate = new Date().toISOString()

  // Hoofdsteden voor LinkedIn pagina's
  const cities = [
    'amsterdam',
    'rotterdam', 
    'den-haag',
    'utrecht',
    'eindhoven',
    'groningen',
    'tilburg',
    'almere',
    'breda',
    'nijmegen'
  ]

  // Basis pagina's met hoge prioriteit
  const mainPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/linkedin-foto-laten-maken`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/linkedin-profielfoto`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/fotografen`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  // LinkedIn stad pagina's - HOGE PRIORITEIT voor SEO
  const cityPages = cities.map(city => ({
    url: `${baseUrl}/linkedin-foto-laten-maken-${city}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.95, // Zeer hoge prioriteit voor lokale SEO
  }))

  // Blog pagina's - ZEER BELANGRIJK voor SEO
  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/linkedin-profielfoto-gids-2025`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/ai-vs-traditionele-fotografie`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/ai-is-niet-eng`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/linkedin-foto-fouten-ai-voorkomt`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/wat-kost-zakelijke-fotoshoot-nederland`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  ]

  return [...mainPages, ...cityPages, ...blogPages]
}
