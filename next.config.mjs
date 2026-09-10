/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://unpkg.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://unpkg.com",
              "worker-src 'self' blob: https://unpkg.com",
              "frame-ancestors 'self'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Tool aliases & canonical routes
      { source: '/vault', destination: '/tools/vault', permanent: true },
      { source: '/tools/compressor', destination: '/tools/compress', permanent: true },
      { source: '/tools/converter', destination: '/tools/convert', permanent: true },
      { source: '/tools/compress-image', destination: '/tools/image-compressor', permanent: true },
      { source: '/tools/pdf-converter', destination: '/tools/convert', permanent: true },
      { source: '/tools/pdf-merger', destination: '/tools/merge', permanent: true },
      { source: '/tools/resume', destination: '/tools/analysis', permanent: true },
      { source: '/tools/resume-analyzer', destination: '/tools/analysis', permanent: true },
      { source: '/tools/passport', destination: '/tools/passport-photo', permanent: true },
      
      // Auth aliases
      { source: '/auth/login', destination: '/login', permanent: true },
      { source: '/auth/signup', destination: '/signup', permanent: true },
      
      // Account alias
      { source: '/account', destination: '/settings', permanent: true },
    ]
  },
}

export default nextConfig
