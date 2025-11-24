import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is verplicht" }, { status: 400 })
    }

    // Check if user exists
    const users = await sql`
      SELECT id, email FROM users WHERE email = ${email}
    `

    // Voor veiligheid: geef altijd dezelfde response, ook als user niet bestaat
    // Dit voorkomt dat aanvallers kunnen detecteren welke emails bestaan
    if (users.length === 0) {
      // Wacht even om timing attacks te voorkomen
      await new Promise(resolve => setTimeout(resolve, 1000))
      return NextResponse.json({ 
        message: "Als het email adres bestaat, is er een reset link verzonden." 
      })
    }

    const user = users[0]

    // Genereer een veilige random token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Token is 1 uur geldig
    const expiresAt = new Date(Date.now() + 3600000) // 1 uur in milliseconden

    // Sla token op in database
    await sql`
      UPDATE users 
      SET reset_token = ${resetToken}, 
          reset_token_expires = ${expiresAt},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `

    // Verstuur reset email
    try {
      await sendPasswordResetEmail(email, resetToken)
    } catch (emailError) {
      console.error("Error sending reset email:", emailError)
      return NextResponse.json({ 
        error: "Er is een fout opgetreden bij het verzenden van de email. Probeer het later opnieuw." 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Als het email adres bestaat, is er een reset link verzonden." 
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ 
      error: "Er is een fout opgetreden. Probeer het later opnieuw." 
    }, { status: 500 })
  }
}


