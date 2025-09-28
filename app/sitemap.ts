import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aiportretpro.com'
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
    }
  ]

  // LinkedIn stad pagina's - HOGE PRIORITEIT voor SEO
  const cityPages = cities.map(city => ({
    url: `${baseUrl}/linkedin-foto-laten-maken-${city}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.95, // Zeer hoge prioriteit voor lokale SEO
  }))

  return [...mainPages, ...cityPages]
}
