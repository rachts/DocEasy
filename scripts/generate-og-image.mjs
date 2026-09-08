import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const htmlPath = path.join(process.cwd(), 'scratch-og.html')
const outPath = path.join(process.cwd(), 'public', 'og-image.png')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body {
    background: #0C0A09;
    color: #FAFAF9;
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 64px 72px;
    overflow: hidden;
    position: relative;
  }
  .grid-bg {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, #1C1917 1px, transparent 1px),
      linear-gradient(to bottom, #1C1917 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.25;
    z-index: 0;
  }
  .content {
    position: relative;
    z-index: 1;
  }
  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo-box {
    width: 44px;
    height: 44px;
    background: #1C1917;
    border: 1px solid #292524;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand-name {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #FAFAF9;
  }
  .badge {
    background: #141110;
    border: 1px solid #292524;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    color: #A8A29E;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10B981;
  }
  .headline {
    margin-top: 48px;
  }
  .headline h1 {
    font-size: 52px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #FAFAF9;
    max-width: 950px;
  }
  .headline p {
    font-size: 22px;
    color: #A8A29E;
    margin-top: 18px;
    line-height: 1.4;
    max-width: 850px;
  }
  .bottom-row {
    position: relative;
    z-index: 1;
    border-top: 1px solid #292524;
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #78716C;
  }
  .pills {
    display: flex;
    gap: 10px;
  }
  .pill {
    padding: 6px 14px;
    background: #141110;
    border: 1px solid #292524;
    border-radius: 6px;
    color: #A8A29E;
    font-size: 13px;
    font-weight: 500;
  }
  .pill strong {
    color: #FAFAF9;
    font-weight: 600;
  }
  .url {
    font-family: monospace;
    color: #FAFAF9;
    font-size: 14px;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>

  <div class="content top-row">
    <div class="brand">
      <div class="logo-box">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FAFAF9" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      </div>
      <span class="brand-name">DocEasy</span>
    </div>

    <div class="badge">
      <div class="pulse"></div>
      <span>Client-First Architecture</span>
    </div>
  </div>

  <div class="content headline">
    <h1>Document tools that respect your privacy.</h1>
    <p>Local-first processing with zero unnecessary uploads. Client operations run in browser memory, heavy tasks execute ephemerally.</p>
  </div>

  <div class="bottom-row">
    <div class="pills">
      <div class="pill"><strong>12</strong> Browser Tools</div>
      <div class="pill">Up to <strong>~80%</strong> Smaller</div>
      <div class="pill"><strong>0 Bytes</strong> Server Retention</div>
      <div class="pill"><strong>2-Hour</strong> TTL Vault</div>
    </div>
    <div class="url">doceasy.app</div>
  </div>
</body>
</html>`

fs.writeFileSync(htmlPath, html, 'utf8')
console.log('Rendering 1200x630 OG image...')
execSync(`"${chromePath}" --headless=new --screenshot="${outPath}" --window-size=1200,630 "file://${htmlPath}" 2>/dev/null`)
fs.unlinkSync(htmlPath)
console.log('OG image successfully created at:', outPath)
