import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { sql } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && user.email) {
          // Check if user exists
          const existingUser = await sql`
            SELECT id FROM users WHERE email = ${user.email}
          `

          if (existingUser.length === 0) {
            // Create new user
            await sql`
              INSERT INTO users (email, name, image, created_at, updated_at)
              VALUES (${user.email}, ${user.name || ""}, ${user.image || ""}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `
          } else {
            // Update existing user
            await sql`
              UPDATE users 
              SET name = ${user.name || ""}, image = ${user.image || ""}, updated_at = CURRENT_TIMESTAMP
              WHERE email = ${user.email}
            `
          }
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
      // Otherwise, redirect to pricing page
      return `${baseUrl}/pricing`
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const user = await sql`
            SELECT id, email, name, image FROM users WHERE email = ${session.user.email}
          `
          if (user.length > 0) {
            session.user.id = user[0].id.toString()
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
