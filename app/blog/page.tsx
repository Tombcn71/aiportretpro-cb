"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Camera, MapPin, TrendingUp, Users, Euro, CheckCircle } from "lucide-react"
import Header from "@/components/header"

const blogPosts = [
  {
    id: "wat-kost-zakelijke-fotoshoot-nederland",
    title: "Wat kost een zakelijke fotoshoot in Nederland? [Complete Prijsgids 2025]",
    excerpt: "We onderzochten 387 Nederlandse fotografen in 10 steden om de werkelijke kosten van zakelijke fotoshoots te achterhalen. Ontdek wat je kunt verwachten te betalen.",
    readTime: "8 min leestijd",
    date: "23 september 2025",
    category: "Tips & Gidsen",
    featured: true
  },
  {
    id: "linkedin-profielfoto-gids-2024",
    title: "LinkedIn profielfoto: Complete gids voor professionals [2025]",
    excerpt: "Een perfecte LinkedIn foto kan je carrière een boost geven. Ontdek de do's en don'ts voor een professionele profielfoto die opvalt.",
    readTime: "6 min leestijd", 
    date: "23 september 2025",
    category: "LinkedIn & Professional"
  },
  {
    id: "ai-vs-traditionele-fotografie",
    title: "AI fotografie vs traditionele fotografie: De eerlijke vergelijking",
    excerpt: "Een diepgaande analyse van de voor- en nadelen van AI-gegenereerde foto's versus traditionele fotoshoots.",
    readTime: "9 min leestijd",
    date: "23 september 2025", 
    category: "AI & Technologie"
  },
  {
    id: "ai-is-niet-eng",
    title: "AI is niet eng: Waarom kunstmatige intelligentie je vriend is",
    excerpt: "Ontkracht mythes en ontdek hoe AI je kan helpen je professionele doelen te bereiken zonder angst.",
    readTime: "6 min leestijd",
    date: "23 september 2025",
    category: "AI & Technologie"
  },
  {
    id: "linkedin-foto-fouten-ai-voorkomt",
    title: "5 fouten die je LinkedIn foto verpesten (en hoe AI ze voorkomt)",
    excerpt: "Vermijd de meest voorkomende blunders en leer hoe AI-technologie je helpt een onberispelijke indruk te maken.",
    readTime: "5 min leestijd",
    date: "23 september 2025",
    category: "LinkedIn & Professional"
  }
]

const categories = ["Alle", "Prijzen & Kosten", "LinkedIn & Professional", "AI & Technologie", "Tips & Gidsen"]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Alle")
  
  const filteredPosts = selectedCategory === "Alle" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-[#0077B5]">Blog</span> & Fotografie Gidsen
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek alles over zakelijke fotografie, LinkedIn foto's, AI-technologie en professionele fotografie in Nederland
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-[#0077B5] hover:bg-[#005885]" 
                : "hover:bg-[#0077B5] hover:text-white"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {selectedCategory === "Alle" && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Uitgelicht</h2>
            {blogPosts
              .filter(post => post.featured)
              .map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-[#0077B5] to-[#005885] text-white">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="lg:w-2/3">
                        <Badge className="bg-white text-[#0077B5] mb-4">
                          {post.category}
                        </Badge>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                          {post.title}
                        </h3>
                        <p className="text-lg opacity-90 mb-6">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm opacity-80">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 lg:mt-0">
                        <Button asChild size="lg" className="bg-white text-[#0077B5] hover:bg-gray-100">
                          <Link href={`/blog/${post.id}`}>
                            Lees artikel →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts
            .filter(post => !post.featured || selectedCategory !== "Alle")
            .map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Badge className="mb-4 bg-[#0077B5] text-white">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <span>{post.date}</span>
                  </div>
                  <Button asChild className="w-full bg-[#0077B5] hover:bg-[#005885]">
                    <Link href={`/blog/${post.id}`}>
                      Lees meer
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#FF8C00] to-[#FFA500] rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Klaar voor je perfecte zakelijke foto?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Geen gedoe met fotoshoots - krijg 40 professionele AI headshots in 15 minuten
          </p>
          <div className="text-lg mb-6 opacity-90">
            <div className="inline-grid grid-cols-[auto_1fr] gap-x-2 items-start text-start justify-center">
              <span className="text-center">✅</span>
              <span>6x goedkoper dan een fotograaf</span>
              <span className="text-center">✅</span>
              <span>40 professionele foto's in 15 min</span>
              <span className="text-center">✅</span>
              <span>Perfect voor LinkedIn, website en print</span>
            </div>
          </div>
          <Button asChild size="lg" className="bg-white text-[#FF8C00] hover:bg-gray-100 font-semibold px-8 py-3">
            <Link href="/">
              Start nu je AI fotoshoot →
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
