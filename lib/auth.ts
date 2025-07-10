import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUserByEmail, createUser } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        try {
          let dbUser = await getUserByEmail(user.email)

          if (!dbUser) {
            dbUser = await createUser({
              email: user.email,
              name: user.name || "",
              image: user.image || "",
            })
          }

          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const dbUser = await getUserByEmail(session.user.email)
          if (dbUser) {
            session.user.id = dbUser.id.toString()
          }
        } catch (error) {
          console.error("Error fetching user in session:", error)
        }
      }
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
}
