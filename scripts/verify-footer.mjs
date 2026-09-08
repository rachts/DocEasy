// Verification script for footer links & profiles
import http from 'http'

const internalRoutes = [
  '/tools/compress',
  '/tools/convert',
  '/tools/merge',
  '/tools/pdf-maker',
  '/tools/pdf-extractor',
  '/tools/image-compressor',
  '/tools/image-converter',
  '/tools/passport-photo',
  '/tools/cropper',
  '/tools/analysis',
  '/tools/pdf-summarizer',
  '/tools/vault',
  '/tools',
  '/privacy',
  '/contact',
  '/about',
  '/terms',
  '/cookies',
  '/security',
  '/status'
]

async function verify() {
  console.log('Verifying footer links against local server...')
  let passed = 0

  for (const route of internalRoutes) {
    await new Promise((resolve, reject) => {
      http.get('http://localhost:3000' + route, (res) => {
        if (res.statusCode === 200) {
          console.log(`[PASS] ${route} -> 200 OK`)
          passed++
          resolve()
        } else {
          console.error(`[FAIL] ${route} -> ${res.statusCode}`)
          reject(new Error(`Route failed: ${route}`))
        }
      }).on('error', reject)
    })
  }

  console.log(`\nVerification successful: ${passed}/${internalRoutes.length} footer routes valid.`)
}

verify().catch(err => {
  console.error(err)
  process.exit(1)
})
