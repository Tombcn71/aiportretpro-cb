"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { Logo } from "./logo"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-700 hover:text-[#0077B5] transition-colors">
              Prijzen
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#0077B5] transition-colors">
              Contact
            </Link>

            {session ? (
              <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
                Uitloggen
              </Button>
            ) : (
              <Link href="/login">
                <Button className="bg-[#0077B5] hover:bg-[#004182] text-white">Inloggen</Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/pricing"
                className="block px-3 py-2 text-gray-700 hover:text-[#0077B5] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prijzen
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-[#0077B5] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {session ? (
                <div className="px-3 py-2 space-y-2">
                  <Button
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      setMobileMenuOpen(false)
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Uitloggen
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <Link href="/login">
                    <Button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
                    >
                      Inloggen
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
