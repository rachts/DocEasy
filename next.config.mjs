/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Tool aliases
      { source: '/tools/compressor', destination: '/tools/compress', permanent: true },
      { source: '/tools/converter', destination: '/tools/convert', permanent: true },
      { source: '/tools/compress-image', destination: '/tools/image-compressor', permanent: true },
      { source: '/tools/image-converter', destination: '/tools/convert', permanent: true },
      { source: '/tools/pdf-converter', destination: '/tools/convert', permanent: true },
      { source: '/tools/pdf-merger', destination: '/tools/merge', permanent: true },
      { source: '/tools/pdf-summarizer', destination: '/tools/analysis', permanent: true },
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
