"use client"

import Link from "next/link"
import { MapPin } from "lucide-react"

interface CityNavigationProps {
  currentCity?: string
  showTitle?: boolean
  variant?: 'header' | 'footer' | 'sidebar'
}

export default function CityNavigation({ currentCity, showTitle = true, variant = 'sidebar' }: CityNavigationProps) {
  const cities = [
    { name: 'Amsterdam', slug: 'amsterdam', province: 'Noord-Holland' },
    { name: 'Rotterdam', slug: 'rotterdam', province: 'Zuid-Holland' },
    { name: 'Den Haag', slug: 'den-haag', province: 'Zuid-Holland' },
    { name: 'Utrecht', slug: 'utrecht', province: 'Utrecht' },
    { name: 'Eindhoven', slug: 'eindhoven', province: 'Noord-Brabant' },
    { name: 'Groningen', slug: 'groningen', province: 'Groningen' },
    { name: 'Tilburg', slug: 'tilburg', province: 'Noord-Brabant' },
    { name: 'Almere', slug: 'almere', province: 'Flevoland' },
    { name: 'Breda', slug: 'breda', province: 'Noord-Brabant' },
    { name: 'Nijmegen', slug: 'nijmegen', province: 'Gelderland' }
  ]

  if (variant === 'header') {
    return (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-4 text-sm">
            <MapPin className="h-4 w-4 text-[#0077B5]" />
            <span className="text-gray-600">LinkedIn foto laten maken in:</span>
            <div className="flex gap-2 flex-wrap">
              {cities.slice(0, 5).map(city => (
                <Link
                  key={city.slug}
                  href={`/linkedin-foto-laten-maken-${city.slug}`}
                  className={`text-[#0077B5] hover:text-[#004182] hover:underline ${
                    currentCity === city.name ? 'font-semibold' : ''
                  }`}
                >
                  {city.name}
                </Link>
              ))}
              <span className="text-gray-400">+</span>
              <Link href="/linkedin-profielfoto" className="text-[#0077B5] hover:text-[#004182] hover:underline">
                Alle steden
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h3 className="text-base font-medium text-gray-800 mb-3 flex items-center gap-2 justify-center">
            <MapPin className="h-4 w-4 text-[#0077B5]" />
            LinkedIn Foto Service beschikbaar in deze steden
          </h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {cities.map(city => (
              <Link
                key={city.slug}
                href={`/linkedin-foto-laten-maken-${city.slug}`}
                className="text-sm text-gray-600 hover:text-[#0077B5] hover:underline transition-colors px-2 py-1"
              >
                {city.name}
              </Link>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link 
              href="/linkedin-profielfoto" 
              className="text-[#0077B5] hover:text-[#004182] hover:underline text-xs"
            >
              Alle locaties bekijken
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Default sidebar variant
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#0077B5]" />
          Andere Steden
        </h3>
      )}
      <div className="space-y-2">
        {cities.filter(city => city.name !== currentCity).slice(0, 6).map(city => (
          <Link
            key={city.slug}
            href={`/linkedin-foto-laten-maken-${city.slug}`}
            className="block p-2 rounded-md hover:bg-gray-50 text-sm text-gray-700 hover:text-[#0077B5] transition-colors"
          >
            LinkedIn foto laten maken {city.name}
          </Link>
        ))}
        <Link 
          href="/linkedin-profielfoto" 
          className="block p-2 rounded-md text-sm text-[#0077B5] hover:text-[#004182] hover:underline"
        >
          Alle steden bekijken →
        </Link>
      </div>
    </div>
  )
}
