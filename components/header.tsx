"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

const Header = () => {
  const { data: session } = useSession()

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My App
        </Link>
        <nav>
          {session ? (
            <>
              <span className="mr-4">Welcome, {session.user?.name}</span>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
