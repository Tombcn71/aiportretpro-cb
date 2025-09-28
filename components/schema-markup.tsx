"use client"

interface SchemaMarkupProps {
  type: 'home' | 'city' | 'service'
  city?: string
  url?: string
}

export default function SchemaMarkup({ type, city, url }: SchemaMarkupProps) {
  const getSchemaData = () => {
    const baseUrl = 'https://aiportretpro.com'
    
    if (type === 'home') {
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "AI Portret Pro",
        "description": "LinkedIn foto laten maken online met AI. 6x goedkoper dan een fotograaf, 40 professionele foto's in 15 minuten.",
        "url": baseUrl,
        "telephone": "+31-20-123-4567",
        "email": "info@aiportretpro.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL",
          "addressRegion": "Nederland"
        },
        "areaServed": [
          "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven", 
          "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen"
        ],
        "serviceType": "Fotografie Service",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "LinkedIn Fotografie Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "LinkedIn Foto Pakket",
                "description": "40 professionele LinkedIn foto's gemaakt met AI"
              },
              "price": "29",
              "priceCurrency": "EUR"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "156"
        },
        "sameAs": [
          "https://www.linkedin.com/company/aiportretpro",
          "https://www.facebook.com/aiportretpro"
        ]
      }
    }
    
    if (type === 'city' && city) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `LinkedIn Foto Laten Maken ${city}`,
        "description": `Professionele LinkedIn foto's laten maken in ${city}. AI fotoshoot service, 40 foto's in 15 minuten voor €29.`,
        "provider": {
          "@type": "LocalBusiness",
          "name": "AI Portret Pro",
          "areaServed": city
        },
        "serviceType": "Fotografie Service",
        "serviceArea": {
          "@type": "City",
          "name": city,
          "containedInPlace": {
            "@type": "Country",
            "name": "Nederland"
          }
        },
        "offers": {
          "@type": "Offer",
          "price": "29",
          "priceCurrency": "EUR",
          "description": "40 professionele LinkedIn foto's",
          "availability": "https://schema.org/InStock"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": `LinkedIn Fotografie ${city}`,
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "LinkedIn Profielfoto Service",
                "description": `Professionele LinkedIn foto's voor professionals in ${city}`
              }
            }
          ]
        }
      }
    }
    
    return {}
  }

  const schemaData = getSchemaData()

  if (Object.keys(schemaData).length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 2)
      }}
    />
  )
}
