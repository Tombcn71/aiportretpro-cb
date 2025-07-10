// Environment variable validation
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
}

const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars.join(", "))
  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }
}

export const env = requiredEnvVars
