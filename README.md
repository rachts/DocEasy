# DocEasy

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tiwarirachit-2107s-projects/v0-docu-ease-app-build)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

DocEasy is a professional-grade, cloud-integrated document and image manipulation platform. It provides a suite of powerful tools designed to simplify the way you interact with files, all accessible from an intuitive and modern web interface.

## 🌟 Project Overview

DocEasy bridges the gap between desktop-class document manipulation and seamless web accessibility. Whether you need to compress large PDFs, extract critical text, merge documents, or securely analyze resumes against industry standards, DocEasy provides a unified, beautifully designed dashboard to handle it all without compromising privacy or performance.

## ✨ Features

* **Industrial PDF Compression**: Significantly reduce PDF file sizes securely. Features intelligent routing between browser-side and server-side compression engines for payloads up to 250MB.
* **PDF Manipulation Suite**: Merge, extract text, and confidently manage your multi-page documents.
* **Document Analysis Engine**: Deep analysis tools including Resume Parsing, ATS scoring, and PDF summarization.
* **Image Processing**: Compress, convert, and crop images quickly entirely on the client-side.
* **Personal Dashboard**: A central hub to track and manage all active assets, see real-time storage metrics, and "pin" important documents for permanent storage.
* **Supabase Cloud Integration**: Integrated Row-Level Security (RLS) PostgreSQL database for tracking analytics, storing metrics, and highly-secure Supabase Storage integration for document processing persistence.
* **Robust Authentication**: Powered by Supabase Auth with standard Email registration and a seamless **Continue with Google** OAuth integration.

## 🛠 Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (Auth, Postgres, Storage)
- **Document Processing**: `pdf-lib`, `pdfjs-dist`, `Ghostscript`, `qpdf`
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm
- A Supabase account

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tiwarirachit-2107/doceasy.git
   cd doceasy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize the Database:**
   Follow the instructions in `SUPABASE_SETUP.md` to run the required SQL scripts in your Supabase dashboard. This sets up the `files`, `ai_jobs`, and `events` tables alongside their corresponding RLS policies.

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## 💻 Usage

- **Uploading Files**: Navigate to any tool via the sidebar and drag-and-drop your files.
- **Compression**: Use the Universal Compressor. Large files automatically stream to the server for processing, while smaller files are processed directly in your browser.
- **Dashboard**: Access the Vault to view your history, download previous results, or pin files.

## 🏗 Architecture

DocEasy uses a hybrid processing architecture:
1. **Client-Side (Browser)**: Lightweight tasks (image compression, basic PDF manipulation) are executed entirely in the browser using WebAssembly and Canvas APIs to ensure zero-latency processing and maximum privacy.
2. **Server-Side (Node.js API)**: Heavy workloads bypass the standard Next.js proxy via custom middleware and stream directly to disk using the Web Streams API, ensuring O(1) memory complexity during processing.
3. **Database (Supabase)**: All metadata and temporary storage links are securely managed in PostgreSQL with strictly enforced Row Level Security (RLS).

## 📂 Folder Structure

```
├── app/                  # Next.js App Router pages and API routes
├── components/           # Reusable React components (UI, Layouts)
├── lib/                  # Core logic, services, and utilities
├── public/               # Static assets
├── supabase/             # Database migrations and configurations
├── .env.example          # Environment variable template
├── next.config.mjs       # Next.js configuration
├── proxy.ts              # Custom middleware and proxy bypass
└── package.json          # Project dependencies
```

## 🌍 Deployment

DocEasy is optimized for Vercel deployment. 

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the required environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.) in the Vercel dashboard.
4. Deploy!

Ensure that your production environment has access to Ghostscript and qpdf binaries for the advanced PDF compression fallback engines to function correctly.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---
Designed and built by **Rachit Tiwari**.
