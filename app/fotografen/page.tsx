"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, ArrowRight } from "lucide-react"
import Header from "@/components/header"

// TOP 10 GROOTSTE STEDEN VAN NEDERLAND - SEO FOCUS
const cities = [
  { city: "Amsterdam", province: "Noord-Holland", photographer_count: 38 },
  { city: "Rotterdam", province: "Zuid-Holland", photographer_count: 29 },
  { city: "Den Haag", province: "Zuid-Holland", photographer_count: 30 },
  { city: "Utrecht", province: "Utrecht", photographer_count: 36 },
  { city: "Eindhoven", province: "Noord-Brabant", photographer_count: 30 },
  { city: "Tilburg", province: "Noord-Brabant", photographer_count: 34 },
  { city: "Groningen", province: "Groningen", photographer_count: 37 },
  { city: "Almere", province: "Flevoland", photographer_count: 26 },
  { city: "Breda", province: "Noord-Brabant", photographer_count: 34 },
  { city: "Nijmegen", province: "Gelderland", photographer_count: 31 }
].sort((a, b) => b.photographer_count - a.photographer_count) // Sorteer op aantal fotografen

export default function FotografenPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCities, setFilteredCities] = useState(cities)

  const totalPhotographers = cities.reduce((sum, city) => sum + city.photographer_count, 0)

  useMemo(() => {
    if (!searchTerm) {
      setFilteredCities(cities)
    } else {
      const filtered = cities.filter(city =>
        city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.province.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCities(filtered)
    }
  }, [searchTerm])

  const getCityUrl = (cityName: string) => {
    return cityName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace('den haag', 'den-haag')
      .replace('s-hertogenbosch', 'den-bosch')
      .replace('oosterhout', 'oosterhout-nb')
      .replace('wijk bij duurstede', 'wijk-bij-duurstede')
  }

  return (
    <div className="min-h-screen pt-20">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
          Lokale <span className="text-[#0077B5]">Fotografen</span> in Nederland
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Vind geverifieerde fotografen in de 10 grootste steden van Nederland - alleen echte websites en werkende links
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5 text-[#0077B5]" />
            <span>{totalPhotographers} fotografen</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 text-[#0077B5]" />
            <span>{cities.length} steden</span>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Zoek stad of provincie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* AI Alternative CTA */}
        <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-lg p-6 mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-3">
            Of probeer onze AI fotoshoot - €29
          </h3>
          <p className="text-white/90 mb-4">
            Geen gedoe met afspraken maken - krijg professionele LinkedIn foto's in 10 minuten
          </p>
          <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold">
            <Link href="/">
              Start nu je AI headshot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Top 10 Steden Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCities.map((city) => {
            const cityUrl = getCityUrl(city.city)
            return (
              <Card key={city.city} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/fotografen/${cityUrl}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{city.city}</h3>
                      <Badge variant="secondary" className="bg-[#0077B5]/10 text-[#0077B5]">
                        {city.photographer_count} fotografen
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{city.province}</p>
                    <div className="flex items-center text-[#0077B5] font-medium">
                      <span>Bekijk fotografen</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Geen steden gevonden voor "{searchTerm}"
            </p>
          </div>
        )}
      </section>


      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Klaar voor je perfecte AI headshot?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Geen gedoe met fotoshoots - krijg professionele LinkedIn foto's in minuten
          </p>
          <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
            <Link href="/">
              Start nu je AI headshot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}