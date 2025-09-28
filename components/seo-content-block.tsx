"use client"

interface SEOContentBlockProps {
  city?: string
  showLocalKeywords?: boolean
}

export default function SEOContentBlock({ city, showLocalKeywords = true }: SEOContentBlockProps) {
  const localKeywords = city ? [
    `betaalbare LinkedIn foto ${city}`,
    `goede LinkedIn foto laten maken ${city}`,
    `portretfoto CV en LinkedIn ${city}`,
    `zakelijke fotoshoot op locatie ${city}`,
    `professionele headshot ${city}`,
    `corporate fotografie ${city}`
  ] : []

  const generalKeywords = [
    "AI headshot fotografie",
    "digitale portretfoto",
    "online fotoshoot service",
    "professionele profielfoto",
    "LinkedIn foto AI",
    "business headshots Nederland"
  ]

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {city 
              ? `Waarom Kiezen voor AI Fotoshoot in ${city}?`
              : "Waarom Kiezen voor AI Fotoshoot?"
            }
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💰 Kostenvoordeel
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Een traditionele {city ? `fotograaf in ${city}` : 'fotograaf'} kost gemiddeld €200-400 
                voor een LinkedIn fotoshoot. Onze AI service levert dezelfde professionele kwaliteit 
                voor slechts €29, inclusief 40 verschillende poses en stijlen.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Snelheid & Gemak
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Geen afspraken inplannen, geen reistijd {city ? `door ${city}` : ''}, 
                geen wachten in een studio. Upload je foto's wanneer het jou uitkomt 
                en ontvang binnen 15 minuten professionele resultaten.
              </p>
            </div>
          </div>

          {showLocalKeywords && city && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Populaire Zoektermen {city}
              </h3>
              <div className="flex flex-wrap gap-2">
                {localKeywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Perfecte LinkedIn Foto's Voor Elke Professional
            </h3>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Of je nu werkt in {city ? `${city}'s zakelijke district, ` : ''}tech, finance, 
              consulting, healthcare, of welke sector dan ook - onze AI past zich aan jouw 
              professionele uitstraling aan. Van startup entrepreneur tot corporate executive, 
              we zorgen voor de perfecte LinkedIn profielfoto die past bij jouw carrière.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
