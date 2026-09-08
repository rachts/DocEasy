import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ffmpegPath = '/opt/homebrew/bin/ffmpeg'
const publicDir = path.join(process.cwd(), 'public')
const appDir = path.join(process.cwd(), 'app')

// Clean SVG icon for DocEasy in warm industrial styling
const svgContent = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#0C0A09"/>
  <rect x="24" y="24" width="464" height="464" rx="96" fill="none" stroke="#292524" stroke-width="16"/>
  <g transform="translate(106, 86) scale(0.6)">
    <path d="M 120 40 C 95 40 75 60 75 85 L 75 425 C 75 450 95 470 120 470 L 380 470 C 405 470 425 450 425 425 L 425 170 L 295 40 L 120 40 Z" fill="#FAFAF9" />
    <path d="M 295 40 L 295 140 C 295 158 308 170 326 170 L 425 170 Z" fill="#D6D3D1" />
    <line x1="140" y1="260" x2="360" y2="260" stroke="#0C0A09" stroke-width="28" stroke-linecap="round" />
    <line x1="140" y1="330" x2="360" y2="330" stroke="#0C0A09" stroke-width="28" stroke-linecap="round" />
    <line x1="140" y1="400" x2="260" y2="400" stroke="#0C0A09" stroke-width="28" stroke-linecap="round" />
  </g>
</svg>`

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8')
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent, 'utf8')
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent, 'utf8')

// Render 512x512 PNG via Chrome
const tempHtml = path.join(process.cwd(), 'scratch-icon.html')
fs.writeFileSync(tempHtml, `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:transparent;overflow:hidden;">
  ${svgContent}
</body>
</html>`, 'utf8')

const masterPng = path.join(publicDir, 'icon-512.png')
console.log('Rendering master 512x512 icon...')
execSync(`"${chromePath}" --headless=new --screenshot="${masterPng}" --window-size=512,512 --default-background-color=00000000 "file://${tempHtml}" 2>/dev/null`)
fs.unlinkSync(tempHtml)

// Generate apple-touch-icon (180x180)
console.log('Generating apple-touch-icon.png...')
const appleTouchPng = path.join(publicDir, 'apple-touch-icon.png')
execSync(`"${ffmpegPath}" -y -i "${masterPng}" -vf "scale=180:180" "${appleTouchPng}"`)
fs.copyFileSync(appleTouchPng, path.join(appDir, 'apple-icon.png'))

// Generate icon-192.png
console.log('Generating icon-192.png...')
const icon192Png = path.join(publicDir, 'icon-192.png')
execSync(`"${ffmpegPath}" -y -i "${masterPng}" -vf "scale=192:192" "${icon192Png}"`)

// Generate favicon-32x32.png and favicon-16x16.png
const favicon32 = path.join(publicDir, 'favicon-32x32.png')
const favicon16 = path.join(publicDir, 'favicon-16x16.png')
execSync(`"${ffmpegPath}" -y -i "${masterPng}" -vf "scale=32:32" "${favicon32}"`)
execSync(`"${ffmpegPath}" -y -i "${masterPng}" -vf "scale=16:16" "${favicon16}"`)

// Generate favicon.ico (multi-resolution or 32x32)
console.log('Generating favicon.ico...')
const faviconIco = path.join(publicDir, 'favicon.ico')
execSync(`"${ffmpegPath}" -y -i "${favicon32}" "${faviconIco}"`)
fs.copyFileSync(faviconIco, path.join(appDir, 'favicon.ico'))

// Generate site.webmanifest
const manifestContent = JSON.stringify({
  name: "DocEasy",
  short_name: "DocEasy",
  description: "Client-First Document & Image Toolkit",
  start_url: "/",
  display: "standalone",
  background_color: "#0C0A09",
  theme_color: "#0C0A09",
  icons: [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "/icon.svg",
      sizes: "any",
      type: "image/svg+xml"
    }
  ]
}, null, 2)

fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), manifestContent, 'utf8')
fs.writeFileSync(path.join(publicDir, 'manifest.json'), manifestContent, 'utf8')

console.log('All favicon and icon assets generated successfully!')
