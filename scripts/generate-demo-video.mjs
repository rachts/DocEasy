import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const tmpDir = path.join(process.cwd(), 'scratch-demo-frames')
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true })
}

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const ffmpegPath = '/opt/homebrew/bin/ffmpeg'

// Define 6 states for a smooth 6-second video loop (30fps)
const states = [
  {
    name: '01_idle',
    title: 'Drop PDF here or browse local files',
    sub: 'Process instantly in browser memory • Client-first processing',
    badge: 'AES-GCM Local Memory',
    status: 'idle',
    networkTraffic: '0 requests • 0 B transferred',
    durationSec: 1.5,
  },
  {
    name: '02_file_selected',
    fileName: 'annual_financial_report_2024.pdf',
    fileSize: '2.4 MB',
    level: 'Recommended (~80% target)',
    status: 'ready',
    networkTraffic: '0 requests • 0 B transferred',
    durationSec: 1.5,
  },
  {
    name: '03_processing_wasm',
    fileName: 'annual_financial_report_2024.pdf',
    progress: 45,
    statusText: 'Executing WebAssembly compression in isolated browser thread...',
    status: 'processing',
    networkTraffic: '0 requests • 0 B transferred',
    durationSec: 1.5,
  },
  {
    name: '04_complete',
    fileName: 'annual_financial_report_2024_compressed.pdf',
    originalSize: '2.4 MB',
    compressedSize: '482 KB',
    reduction: '80%',
    status: 'complete',
    networkTraffic: '0 requests • 0 B transferred',
    durationSec: 2.5,
  }
]

function generateHtml(state) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body {
    background: #0C0A09;
    color: #FAFAF9;
    width: 1280px;
    height: 720px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px;
    overflow: hidden;
  }
  .window {
    width: 1040px;
    background: #141110;
    border: 1px solid #292524;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  }
  .window-header {
    background: #1C1917;
    border-bottom: 1px solid #292524;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dots {
    display: flex;
    gap: 6px;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #292524;
  }
  .brand {
    font-size: 13px;
    font-weight: 500;
    color: #A8A29E;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .network-badge {
    background: #0C0A09;
    border: 1px solid #292524;
    border-radius: 4px;
    padding: 4px 10px;
    font-size: 11px;
    color: #34D399;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: monospace;
  }
  .pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34D399;
  }
  .window-body {
    padding: 40px;
    min-height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .card {
    background: #1C1917;
    border: 1px solid #292524;
    border-radius: 8px;
    padding: 36px;
    text-align: center;
  }
  .upload-box {
    border: 2px dashed #292524;
    border-radius: 8px;
    padding: 48px 32px;
    background: #141110;
  }
  .btn {
    background: #FAFAF9;
    color: #0C0A09;
    font-weight: 500;
    font-size: 13px;
    padding: 10px 24px;
    border-radius: 6px;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .btn-outline {
    background: transparent;
    color: #FAFAF9;
    border: 1px solid #292524;
  }
  .stat-val {
    font-family: monospace;
    font-weight: 600;
  }
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #0C0A09;
    border-radius: 4px;
    overflow: hidden;
    margin: 20px 0 12px;
    border: 1px solid #292524;
  }
  .progress-fill {
    height: 100%;
    background: #FAFAF9;
    transition: width 0.3s ease;
  }
  .callout {
    margin-top: 24px;
    padding: 12px 16px;
    background: #0C0A09;
    border: 1px solid #292524;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #A8A29E;
  }
</style>
</head>
<body>
  <div class="window">
    <div class="window-header">
      <div class="dots">
        <div class="dot" style="background:#EF4444;"></div>
        <div class="dot" style="background:#F59E0B;"></div>
        <div class="dot" style="background:#10B981;"></div>
      </div>
      <div class="brand">
        <span>DocEasy</span>
        <span style="color:#57534E;">/</span>
        <span>PDF Compressor</span>
      </div>
      <div class="network-badge">
        <div class="pulse"></div>
        <span>Network Tab: 0 Uploads (0 KB)</span>
      </div>
    </div>

    <div class="window-body">
      ${state.status === 'idle' ? `
        <div class="upload-box">
          <div style="width:48px;height:48px;margin:0 auto 16px;background:#1C1917;border:1px solid #292524;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#A8A29E;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h2 style="font-size:22px;font-weight:500;margin-bottom:8px;">${state.title}</h2>
          <p style="color:#A8A29E;font-size:14px;margin-bottom:24px;">${state.sub}</p>
          <div style="display:inline-block;padding:6px 14px;background:#1C1917;border:1px solid #292524;border-radius:4px;font-size:12px;color:#78716C;">
            Supported: <span style="color:#FAFAF9;font-family:monospace;">PDF</span> • Max size: <span style="color:#FAFAF9;font-family:monospace;">50 MB</span>
          </div>
        </div>
      ` : state.status === 'ready' ? `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #292524;padding-bottom:16px;margin-bottom:20px;text-align:left;">
            <div>
              <div style="font-size:16px;font-weight:500;">${state.fileName}</div>
              <div style="font-size:13px;color:#78716C;font-family:monospace;margin-top:4px;">Original size: ${state.fileSize}</div>
            </div>
            <div style="padding:4px 10px;background:#141110;border:1px solid #292524;border-radius:4px;font-size:12px;color:#34D399;">
              Client Ready
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:24px;">
            <div style="text-align:left;">
              <div style="font-size:12px;color:#78716C;">Compression Profile</div>
              <div style="font-size:14px;color:#FAFAF9;font-weight:500;margin-top:2px;">${state.level}</div>
            </div>
            <button class="btn">
              <span>Compress PDF Locally</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      ` : state.status === 'processing' ? `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="font-size:15px;font-weight:500;">${state.fileName}</span>
            <span style="font-family:monospace;font-size:13px;color:#34D399;">WASM Processing (${state.progress}%)</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${state.progress}%;"></div>
          </div>
          <p style="font-size:13px;color:#A8A29E;text-align:left;margin-top:8px;">${state.statusText}</p>
        </div>
      ` : `
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;color:#34D399;margin-bottom:12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span style="font-size:14px;font-weight:500;">Compressed Locally in Browser</span>
          </div>
          <h2 style="font-size:26px;font-weight:600;margin-bottom:8px;">${state.reduction} smaller</h2>
          <div style="display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:24px;font-size:14px;color:#A8A29E;">
            <span><span class="stat-val" style="color:#78716C;text-decoration:line-through;">${state.originalSize}</span></span>
            <span style="color:#57534E;">→</span>
            <span><span class="stat-val" style="color:#FAFAF9;">${state.compressedSize}</span></span>
          </div>
          <div style="display:flex;justify-content:center;gap:12px;">
            <button class="btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download Compressed PDF</span>
            </button>
          </div>
        </div>
      `}

      <div class="callout">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:6px;height:6px;border-radius:50%;background:#34D399;"></span>
          <span><strong style="color:#FAFAF9;">Network Verification:</strong> Inspect DevTools Network tab. 0 POST requests sent.</span>
        </div>
        <span style="font-family:monospace;color:#34D399;">0 bytes uploaded</span>
      </div>
    </div>
  </div>
</body>
</html>`
}

async function main() {
  console.log('Generating frames...')
  let frameIdx = 0
  
  for (let sIdx = 0; sIdx < states.length; sIdx++) {
    const state = states[sIdx]
    const html = generateHtml(state)
    const htmlPath = path.join(tmpDir, `state_${sIdx}.html`)
    fs.writeFileSync(htmlPath, html, 'utf8')
    
    const screenshotPath = path.join(tmpDir, `state_${sIdx}.png`)
    execSync(`"${chromePath}" --headless=new --screenshot="${screenshotPath}" --window-size=1280,720 "file://${htmlPath}" 2>/dev/null`)
    console.log(`Captured state ${sIdx}: ${state.name}`)
  }

  // Create frame sequence for smooth video (total 7 seconds at 30 fps = 210 frames)
  // State 0: 45 frames (1.5s)
  // State 1: 45 frames (1.5s)
  // State 2: 45 frames (1.5s)
  // State 3: 75 frames (2.5s)
  const frameCounts = [45, 45, 45, 75]
  let currentGlobalFrame = 0
  for (let sIdx = 0; sIdx < states.length; sIdx++) {
    const srcPng = path.join(tmpDir, `state_${sIdx}.png`)
    for (let f = 0; f < frameCounts[sIdx]; f++) {
      const frameName = `frame_${String(currentGlobalFrame).padStart(4, '0')}.png`
      fs.copyFileSync(srcPng, path.join(tmpDir, frameName))
      currentGlobalFrame++
    }
  }

  console.log(`Prepared ${currentGlobalFrame} frames. Compiling MP4...`)
  const mp4Out = path.join(process.cwd(), 'public', 'demo.mp4')
  execSync(`"${ffmpegPath}" -y -framerate 30 -i "${path.join(tmpDir, 'frame_%04d.png')}" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "${mp4Out}"`)
  console.log('Generated:', mp4Out)

  console.log('Compiling GIF...')
  const gifOut = path.join(process.cwd(), 'public', 'demo.gif')
  execSync(`"${ffmpegPath}" -y -framerate 15 -i "${path.join(tmpDir, 'frame_%04d.png')}" -vf "fps=15,scale=960:-2:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${gifOut}"`)
  console.log('Generated:', gifOut)

  // Clean up frames
  const files = fs.readdirSync(tmpDir)
  for (const f of files) {
    fs.unlinkSync(path.join(tmpDir, f))
  }
  fs.rmdirSync(tmpDir)
  console.log('All done!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
