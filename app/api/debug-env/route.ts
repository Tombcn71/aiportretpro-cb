import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    env_check: {
      SMTP_HOST: process.env.SMTP_HOST || "NOT SET",
      SMTP_PORT: process.env.SMTP_PORT || "NOT SET",
      SMTP_SECURE: process.env.SMTP_SECURE || "NOT SET",
      SMTP_USER: process.env.SMTP_USER || "NOT SET",
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? "SET (hidden)" : "NOT SET",
      EMAIL_FROM: process.env.EMAIL_FROM || "NOT SET",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    },
    all_env_keys: Object.keys(process.env).filter(key => 
      key.startsWith('SMTP_') || 
      key.startsWith('EMAIL_') || 
      key.startsWith('NEXTAUTH_')
    )
  })
}

