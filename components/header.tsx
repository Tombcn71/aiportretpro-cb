"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { Logo } from "./logo"

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
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
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#0077B5] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleSignIn} className="bg-[#0077B5] hover:bg-[#004182] text-white">
                Inloggen
              </Button>
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

              {status === "loading" ? (
                <div className="px-3 py-2">
                  <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : session ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-[#0077B5] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{session.user?.name}</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full mb-2 bg-transparent">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleSignOut()
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
                  <Button
                    onClick={() => {
                      handleSignIn()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-[#0077B5] hover:bg-[#004182] text-white"
                  >
                    Inloggen
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
