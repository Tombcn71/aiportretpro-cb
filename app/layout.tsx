import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import dynamic from "next/dynamic"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import FacebookPixel from "@/components/facebook-pixel"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

const CrispWithNoSSR = dynamic(() => import("../components/crisp"))

export const metadata: Metadata = {
  title: "Professionele zakelijke foto's laten maken? - AI Portret Pro €29",
  description:
    "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  keywords: "zakelijke foto's laten maken, professionele foto online, business headshots, corporate fotografie, LinkedIn foto, CV foto, website profielfoto, AI fotografie Nederland",
  openGraph: {
    title: "Professionele zakelijke foto's laten maken? - AI Portret Pro €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
    url: "https://aiportretpro.nl",
    siteName: "AI Portret Pro",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professionele zakelijke foto's laten maken? - AI Portret Pro €29",
    description: "Probeer onze online AI fotoshoot: 40 professionele foto's in 15 min. 6x goedkoper dan een traditionele fotograaf!",
  },
  alternates: {
    canonical: "https://aiportretpro.nl",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Performance & SEO Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        
        {/* Performance Budget */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0077B5" />
        
        {/* Critical CSS - Above the fold styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body{margin:0;font-family:Inter,sans-serif;line-height:1.6}
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            h1{font-size:1.25rem;font-weight:700;line-height:1.2;margin:0 0 1.5rem}
            @media(min-width:768px){h1{font-size:2.25rem}}
            .text-\\[\\#0077B5\\]{color:#0077B5}
            .bg-\\[\\#FF8C00\\]{background-color:#FF8C00}
            .hover\\:bg-\\[\\#FFA500\\]:hover{background-color:#FFA500}
            .carousel-container{width:100%;overflow:hidden;position:relative}
            .carousel-track{display:flex;width:fit-content;animation:carousel 140s linear infinite}
            .carousel-item{flex-shrink:0;margin:0 0.5rem}
            @keyframes carousel{0%{transform:translateX(calc(-100%/2))}100%{transform:translateX(0)}}
            .pt-20{padding-top:5rem}
            .text-center{text-align:center}
            .mb-6{margin-bottom:1.5rem}
            .px-4{padding-left:1rem;padding-right:1rem}
            .py-6{padding-top:1.5rem;padding-bottom:1.5rem}
            .font-bold{font-weight:700}
            .text-lg{font-size:1.125rem}
            .text-gray-500{color:#6b7280}
            .italic{font-style:italic}
            .font-light{font-weight:300}
            .tracking-tight{letter-spacing:-0.025em}
            .leading-tight{line-height:1.25}
            .block{display:block}
            .inline-grid{display:inline-grid}
            .grid-cols-\\[auto_1fr\\]{grid-template-columns:auto 1fr}
            .gap-x-2{column-gap:0.5rem}
            .items-start{align-items:flex-start}
            .text-start{text-align:start}
            .justify-center{justify-content:center}
          `
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <Suspense fallback={null}>
              <CrispWithNoSSR />
              {children}
              <Toaster />
              <FacebookPixel />
              <Analytics />
            </Suspense>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
