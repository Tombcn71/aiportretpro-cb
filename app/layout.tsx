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
  title: "AI Portret Pro - Professionele Portretfoto's, slim en simpel geregeld",
  description:
    "Geen gedoe met studio's, direct 40 AI portretfoto's in 15 min. Makkelijk vanaf je telefoon of laptop, bespaar tijd en geld",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
