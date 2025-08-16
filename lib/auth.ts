import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check if user exists with password_hash
          const user = await sql`
            SELECT id, email, name, image, password_hash FROM users WHERE email = ${credentials.email}
          `

          if (user.length === 0) {
            return null
          }

          const userData = user[0]

          // If user has no password_hash, they signed up with Google
          if (!userData.password_hash) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, userData.password_hash)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: userData.id.toString(),
            email: userData.email,
            name: userData.name,
            image: userData.image,
          }

        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && user.email) {
          // Import database functions
          const { createUser } = await import("@/lib/db")
          
          // Create or update user using the createUser function
          await createUser({
            email: user.email,
            name: user.name || "",
            image: user.image || "",
          })
        }
        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, prefix it with the base url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If the url is on the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url
      // Otherwise, redirect to dashboard (default for header login)
      return `${baseUrl}/dashboard`
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const user = await sql`
            SELECT id, email, name, image FROM users WHERE email = ${session.user.email}
          `
          if (user.length > 0) {
            (session.user as any).id = user[0].id.toString()
          }
        } catch (error) {
          console.error("Session error:", error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Function to check if user has paid
export async function checkUserPayment(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM purchases 
      WHERE user_id = ${userId} 
      AND stripe_session_id IS NOT NULL 
      AND created_at > NOW() - INTERVAL '24 hours'
      LIMIT 1
    `
    return result.length > 0
  } catch (error) {
    console.error("Error checking user payment:", error)
    return false
  }
}
