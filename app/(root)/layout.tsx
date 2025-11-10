import { Metadata } from "next"

export const metadata: Metadata = {
  alternates: {
    canonical: "https://aiportretpro.nl",
  },
}

export default function RootPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

