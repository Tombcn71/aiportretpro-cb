/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdbooth2-production.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.aiheadshots.nl',
      },
    ],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async redirects() {
    return [
      {
        source: '/linkedin-profielfoto',
        destination: '/linkedin-foto-laten-maken',
        permanent: true, // 301 redirect
      },
      {
        source: '/pricing',
        has: [
          {
            type: 'query',
            key: 'source',
          },
        ],
        destination: '/pricing',
        permanent: false, // Keep query params but don't index separately
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ]
  },
}

export default nextConfig
