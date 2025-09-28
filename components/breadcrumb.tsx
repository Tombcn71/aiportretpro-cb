"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `https://aiportretpro.com${item.href}` })
    }))
  }

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
      
      {/* Visual Breadcrumb - Footer Style */}
      <nav className="bg-gray-50 border-t border-gray-200 mt-8" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Navigatie</p>
            <ol className="flex items-center justify-center space-x-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="flex items-center text-gray-500 hover:text-[#0077B5] transition-colors"
                  aria-label="Homepage"
                >
                  <Home className="h-4 w-4" />
                  <span className="ml-1">Home</span>
                </Link>
              </li>
              
              {items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  {item.href && index < items.length - 1 ? (
                    <Link 
                      href={item.href}
                      className="text-gray-500 hover:text-[#0077B5] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-700 font-medium" aria-current="page">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>
    </>
  )
}
