"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Menu, X, User, LogOut } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
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

            {status === "loading" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0077B5]"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Uitloggen</span>
                </Button>
              </div>
            ) : (
              <Button onClick={handleSignIn} className="bg-[#0077B5] hover:bg-[#004182] text-white">
                Inloggen
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/pricing"
                className="block px-3 py-2 text-gray-700 hover:text-[#0077B5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Prijzen
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-[#0077B5] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {status === "loading" ? (
                <div className="px-3 py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0077B5]"></div>
                </div>
              ) : session ? (
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-[#0077B5] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#0077B5] transition-colors"
                  >
                    Uitloggen
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleSignIn()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 bg-[#0077B5] text-white rounded-md hover:bg-[#004182] transition-colors"
                >
                  Inloggen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
