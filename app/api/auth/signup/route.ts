import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, source } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email en wachtwoord zijn verplicht" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Wachtwoord moet minimaal 6 karakters lang zijn" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Er bestaat al een account met dit email adres" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create new user with password_hash
    // Extract name from email (before @) as default
    const defaultName = email.split('@')[0]
    
    const newUser = await sql`
      INSERT INTO users (email, name, image, password_hash, created_at, updated_at)
      VALUES (${email}, ${defaultName}, '', ${passwordHash}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, name, created_at
    `

    if (newUser.length === 0) {
      return NextResponse.json({ error: "Fout bij het aanmaken van account" }, { status: 500 })
    }

    // Determine redirect URL based on source
    const redirectUrl = source === "homepage" ? "/pricing" : "/dashboard"

    return NextResponse.json({ 
      message: "Account succesvol aangemaakt",
      user: {
        id: newUser[0].id,
        email: newUser[0].email
      },
      redirectUrl
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Interne server fout" }, { status: 500 })
  }
} 