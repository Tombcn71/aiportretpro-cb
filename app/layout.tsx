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
  title: "LinkedIn Foto Laten Maken Online | AI Fotoshoot €29 | 40 Professionele Foto's",
  description:
    "LinkedIn foto laten maken online? 6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor CV, website & social media ✓ 14-dagen geld terug garantie",
  keywords: "LinkedIn foto laten maken, profielfoto LinkedIn, online fotoshoot, professionele foto AI, LinkedIn profielfoto Nederland, zakelijke foto's online, headshot fotografie",
  openGraph: {
    title: "LinkedIn Foto Laten Maken Online | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min ✓ Perfect voor CV, website & social media",
    url: "https://aiportretpro.com",
    siteName: "AI Portret Pro",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Foto Laten Maken Online | AI Fotoshoot €29",
    description: "6x goedkoper dan fotograaf ✓ 40 professionele LinkedIn foto's in 15 min",
  },
  alternates: {
    canonical: "https://aiportretpro.com",
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
