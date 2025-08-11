"use client"

export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1>Environment Test</h1>
      <p>Check console for env vars</p>
      <script dangerouslySetInnerHTML={{
        __html: `
          console.log('Testing env vars...');
          console.log('GOOGLE_CLIENT_ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
        `
      }} />
    </div>
  )
} 