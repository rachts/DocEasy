# DocEasy — 100% Client-Side WebAssembly Document Toolkit

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Core-654FF0?style=flat-square&logo=webassembly)](https://webassembly.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Web Crypto](https://img.shields.io/badge/Security-AES--GCM%20256-10B981?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Zero Server Uploads](https://img.shields.io/badge/Privacy-Zero%20Uploads-emerald?style=flat-square)](https://doceasy.app/privacy)
[![License: MIT](https://img.shields.io/badge/License-MIT-FAFAF9?style=flat-square)](LICENSE)

DocEasy is a high-performance, client-side document and image processing toolkit deployed on Vercel. Engineered with **100% local in-browser processing** via WebAssembly, HTML5 Canvas, and the Web Crypto API, DocEasy processes sensitive files directly on your device.

> **Zero server uploads. Zero cloud retention. Zero telemetry.**  
> Verify directly in your browser: open the DevTools Network tab while processing any document — zero bytes leave your machine.

---

## 🎬 Live Demo & Preview

![DocEasy Demo Workflow](public/demo.gif)

*Drop PDF → Compress locally in WebAssembly thread (up to ~80% reduction) → Download compressed output. 0 bytes uploaded to servers.*

---

## 🏛 Why Client-Side?

Document processors have traditionally sent user files to remote cloud servers for conversion, compression, and analysis. This creates enormous security vulnerabilities, latency, and compliance headaches. DocEasy executes 100% in the client:

| Traditional Cloud Toolkits | DocEasy Client-Side Architecture |
| :--- | :--- |
| **Server-Side Uploads:** Raw files sent over internet to third-party servers. | **Zero Network Egress:** Document byte buffers never leave your browser memory. |
| **Data Retention Risk:** Files stored in temporary cloud storage buckets. | **Ephemeral Session Memory:** Data resides in volatile RAM and is cleared on tab close. |
| **Compliance Liability:** Demands complex BAA, GDPR, and HIPAA vendor agreements. | **Compliance by Design:** No server-side processing means zero PII exposure. |
| **Network Bottleneck:** Upload and download speeds depend on bandwidth. | **Bare-Metal Speed:** Native WebAssembly execution executes with near-instant speed. |
| **Infrastructure Costs:** High CPU/RAM bills for server-side PDF rasterization. | **Decentralized Compute:** Execution workload distributes across client devices. |

---

## 📐 Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                            BROWSER CLIENT SANDBOX                             |
|                                                                               |
|  [ User Document ]                                                            |
|         │                                                                     |
|         ▼                                                                     |
|  [ File API / Drag & Drop ] ─── ArrayBuffer (Local Volatile Memory)          |
|                                         │                                     |
|         ┌───────────────────────────────┴───────────────────────────────┐     |
|         │                                                               │     |
|         ▼                                                               ▼     |
|  ┌───────────────┐   ┌────────────────────────┐   ┌────────────────────────┐  |
|  │ WebAssembly   │   │ HTML5 Canvas 2D        │   │ Web Crypto API         │  |
|  │ PDF Engine    │   │ Image Engine           │   │ (AES-GCM-256)          │  |
|  ├───────────────┤   ├────────────────────────┤   ├────────────────────────┤  |
|  │ • Compress    │   │ • Image Converter      │   │ • Encrypted Vault      │  |
|  │ • Merge       │   │ • Passport Photo       │   │ • Session Storage      │  |
|  │ • Extract     │   │ • Image Compressor     │   │ • Auto-Purge TTL (2h)  │  |
|  │ • Convert     │   │ • Aspect Cropper       │   │ • Ephemeral Keys       │  |
|  └───────┬───────┘   └───────────┬────────────┘   └───────────┬────────────┘  |
|          │                       │                            │               |
|          └───────────────────────┼────────────────────────────┘               |
|                                  ▼                                            |
|                       [ Local Blob / ObjectURL ]                              |
|                                  │                                            |
|                                  ▼                                            |
|                       [ Instant Client Download ]                             |
|                                                                               |
+-------------------------------------------------------------------------------+
                                  │
                                  X  (NO OUTBOUND NETWORK CALLS)
                                  │
                          [ Remote Servers ]
```

---

## 🛠 Feature Matrix (12 Verified Working Tools)

DocEasy features exactly 12 production-ready, fully client-side tools:

| # | Tool Name | Route | Status | Supported Formats | Engine |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | **PDF Compressor** | `/tools/compress` | Operational | PDF, PNG, JPG | Client WebAssembly + Stream Quantization |
| 2 | **Format Converter** | `/tools/convert` | Operational | PDF, DOCX, Markdown, Text, Images | Client Parser + Canvas Renderer |
| 3 | **PDF Merger** | `/tools/merge` | Operational | PDF, PNG, JPG, WebP | PDF-Lib + Canvas Image Rasterization |
| 4 | **PDF Maker** | `/tools/pdf-maker` | Operational | Invoice, Certificate, Resume, CV → PDF | Template Engine + Native PDFKit |
| 5 | **PDF Extractor** | `/tools/pdf-extractor` | Operational | PDF → TXT, Metadata | Browser Stream Parser |
| 6 | **PDF Summarizer** | `/tools/pdf-summarizer` | Operational | PDF, TXT → Ranked Summary | Client Sentence Frequency TF Scorer |
| 7 | **Image Compressor** | `/tools/image-compressor` | Operational | PNG, JPG, WebP | Canvas Lossy/Lossless Quantization |
| 8 | **Image Converter** | `/tools/image-converter` | Operational | PNG, JPG, WebP, AVIF | HTML5 Canvas `toBlob` Pipeline |
| 9 | **Passport Photo Editor** | `/tools/passport-photo` | Operational | PNG, JPG → Standard Passport Sizes | Canvas Preset Normalizer (US, UK, Schengen, etc.) |
| 10 | **Image Cropper** | `/tools/cropper` | Operational | PNG, JPG, WebP | Interactive Canvas Aspect Ratio Lock |
| 11 | **Resume Analyzer** | `/tools/analysis` | Operational | PDF, DOCX, TXT | Client ATS Pattern Scorer & Keyword Matcher |
| 12 | **Encrypted Vault** | `/tools/vault` | Operational | Any Document / Image | Web Crypto AES-GCM (2-hour TTL Auto-Purge) |

---

## 🔒 Security & Privacy Guarantees

- **No Remote Telemetry**: Zero analytics pixels, zero session recorders, zero document profiling.
- **Client Session Encryption**: The optional Encrypted Vault generates a 256-bit AES-GCM cryptographic key stored solely in the browser's `sessionStorage`.
- **Automatic 2-Hour TTL Purge**: Vault records automatically expire and are purged from memory after 2 hours or upon closing the session.
- **Inspectable Traffic**: Check DevTools Network tab during any operation to confirm zero network payload transfer.

---

## 🚀 Local Development

### Prerequisites
- Node.js 18.x, 20.x, or 22.x+
- npm, pnpm, or yarn

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/rachts/DocEasy.git
cd DocEasy

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
open http://localhost:3000
```

### Production Build

```bash
# Create optimized production build
npm run build

# Run production server locally
npm run start
```

---

## 🧰 Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router, React 19)
- **Runtime**: WebAssembly + Modern Browser Web APIs
- **Typography & Design**: Warm Industrial Palette (`#0C0A09`, `#141110`, `#1C1917`, `#292524`, `#FAFAF9`)
- **Icons**: Lucide React
- **Cryptography**: Web Crypto API (SubtleCrypto AES-GCM 256-bit)
- **Deployment**: Vercel Edge Network

---

## 📄 License

DocEasy is open source software licensed under the [MIT License](LICENSE).
