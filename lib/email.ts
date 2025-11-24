import nodemailer from 'nodemailer'

// DEBUG: Log environment variables
console.log('📧 Email config check:')
console.log('  SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET')
console.log('  SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET')
console.log('  SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET')
console.log('  SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ SET' : '❌ NOT SET')
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || '❌ NOT SET')

// SMTP transporter configuratie (werkt met Hostinger, Gmail, Outlook, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true', // true voor SSL (port 465), false voor TLS (port 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Wachtwoord reset - AIPortretPro',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0077B5; margin: 0;">AIPortretPro</h1>
              </div>
              
              <div style="background-color: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #333; margin-top: 0;">Wachtwoord reset aanvraag</h2>
                
                <p>Hallo,</p>
                
                <p>Je hebt een wachtwoord reset aangevraagd voor je AIPortretPro account. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background-color: #0077B5; 
                            color: white; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            display: inline-block;
                            font-weight: bold;">
                    Reset Wachtwoord
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Of kopieer en plak deze link in je browser:</p>
                <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
                  ${resetUrl}
                </p>
                
                <p style="color: #666; font-size: 14px; margin-top: 30px;">
                  <strong>⚠️ Deze link is 1 uur geldig.</strong>
                </p>
                
                <p style="color: #666; font-size: 14px;">
                  Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren. Je wachtwoord blijft ongewijzigd.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                <p>© ${new Date().getFullYear()} AIPortretPro. Alle rechten voorbehouden.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Wachtwoord reset aanvraag

Je hebt een wachtwoord reset aangevraagd voor je AIPortretPro account.

Klik op deze link om een nieuw wachtwoord in te stellen:
${resetUrl}

Deze link is 1 uur geldig.

Als je geen wachtwoord reset hebt aangevraagd, kun je deze email negeren. Je wachtwoord blijft ongewijzigd.

© ${new Date().getFullYear()} AIPortretPro
      `.trim(),
    })

    console.log('Password reset email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Helper functie om email configuratie te testen
export async function testEmailConfiguration() {
  try {
    await transporter.verify()
    console.log('✅ SMTP configuratie is correct')
    return { success: true, message: 'SMTP configuratie is correct' }
  } catch (error) {
    console.error('❌ SMTP configuratie fout:', error)
    return { success: false, message: 'SMTP configuratie fout', error }
  }
}

