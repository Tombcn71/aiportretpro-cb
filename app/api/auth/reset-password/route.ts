import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Validate input
    if (!token || !password) {
      return NextResponse.json({ 
        error: "Token en wachtwoord zijn verplicht" 
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        error: "Wachtwoord moet minimaal 6 karakters lang zijn" 
      }, { status: 400 })
    }

    // Zoek user met dit token
    const users = await sql`
      SELECT id, email, reset_token, reset_token_expires 
      FROM users 
      WHERE reset_token = ${token}
    `

    if (users.length === 0) {
      return NextResponse.json({ 
        error: "Ongeldige of verlopen reset link" 
      }, { status: 400 })
    }

    const user = users[0]

    // Controleer of token niet verlopen is
    if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
      // Verwijder verlopen token
      await sql`
        UPDATE users 
        SET reset_token = NULL, 
            reset_token_expires = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${user.id}
      `
      
      return NextResponse.json({ 
        error: "Deze reset link is verlopen. Vraag een nieuwe aan." 
      }, { status: 400 })
    }

    // Hash het nieuwe wachtwoord
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Update wachtwoord en verwijder reset token
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash},
          reset_token = NULL,
          reset_token_expires = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `

    return NextResponse.json({ 
      message: "Wachtwoord succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord." 
    })

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ 
      error: "Er is een fout opgetreden. Probeer het later opnieuw." 
    }, { status: 500 })
  }
}


