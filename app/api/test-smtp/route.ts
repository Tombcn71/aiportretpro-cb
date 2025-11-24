import { NextResponse } from "next/server"
import { testEmailConfiguration } from "@/lib/email"

export async function GET() {
  try {
    console.log('🧪 Testing SMTP configuration...')
    
    // Test de SMTP configuratie
    const result = await testEmailConfiguration()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      config: {
        host: process.env.SMTP_HOST || '❌ NOT SET',
        port: process.env.SMTP_PORT || '❌ NOT SET',
        user: process.env.SMTP_USER || '❌ NOT SET',
        passwordSet: process.env.SMTP_PASSWORD ? '✅ SET' : '❌ NOT SET',
        emailFrom: process.env.EMAIL_FROM || '❌ NOT SET',
      }
    })
  } catch (error: any) {
    console.error('Test SMTP error:', error)
    return NextResponse.json({
      success: false,
      message: 'SMTP test failed',
      error: error.message,
      config: {
        host: process.env.SMTP_HOST || '❌ NOT SET',
        port: process.env.SMTP_PORT || '❌ NOT SET',
        user: process.env.SMTP_USER || '❌ NOT SET',
        passwordSet: process.env.SMTP_PASSWORD ? '✅ SET' : '❌ NOT SET',
        emailFrom: process.env.EMAIL_FROM || '❌ NOT SET',
      }
    }, { status: 500 })
  }
}

