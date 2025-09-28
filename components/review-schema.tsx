"use client"

interface ReviewSchemaProps {
  businessName?: string
  city?: string
}

export default function ReviewSchema({ businessName = "AI Portret Pro", city }: ReviewSchemaProps) {
  const reviews = [
    {
      author: "Jennifer van der Berg",
      rating: 5,
      reviewBody: "Geweldige LinkedIn foto's! Veel professioneler dan mijn oude foto. Het proces was super eenvoudig en de resultaten zijn echt fantastisch.",
      datePublished: "2024-09-15"
    },
    {
      author: "Mark Hendriks", 
      rating: 5,
      reviewBody: "6x goedkoper dan een fotograaf en de kwaliteit is verbluffend. Binnen 15 minuten had ik 40 professionele foto's. Aanrader!",
      datePublished: "2024-09-20"
    },
    {
      author: "Sophie Jansen",
      rating: 5, 
      reviewBody: "Perfect voor mijn LinkedIn profiel. De AI heeft echt begrepen hoe ik er professioneel uit wil zien. Heel tevreden met het resultaat!",
      datePublished: "2024-09-25"
    },
    {
      author: "David de Vries",
      rating: 4,
      reviewBody: "Goede service en snelle levering. De foto's zijn professioneel en perfect voor zakelijk gebruik. Zeker een aanrader.",
      datePublished: "2024-09-28"
    }
  ]

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": city ? `${businessName} ${city}` : businessName,
    "description": city 
      ? `LinkedIn foto laten maken in ${city} met AI. Professionele fotoshoot service.`
      : "LinkedIn foto laten maken online met AI. Professionele fotoshoot service.",
    "url": city 
      ? `https://aiportretpro.com/linkedin-foto-laten-maken-${city.toLowerCase().replace(' ', '-')}`
      : "https://aiportretpro.com",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished
    })),
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NL",
      ...(city && { "addressLocality": city })
    },
    "serviceArea": city ? {
      "@type": "City",
      "name": city
    } : {
      "@type": "Country", 
      "name": "Nederland"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(businessSchema, null, 2)
      }}
    />
  )
}
