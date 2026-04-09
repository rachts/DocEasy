# DocEasy

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tiwarirachit-2107s-projects/v0-docu-ease-app-build)

DocEasy is a professional-grade, cloud-integrated document and image manipulation platform. It provides a suite of powerful tools designed to simplify the way you interact with files, all accessible from an intuitive and modern web interface.

## ✨ Features

* **Industrial PDF Compression**: Significantly reduce PDF file sizes securely, directly in the browser, featuring specific High, Medium, and Low-intensity profiles.
* **PDF Manipulation Suite**: Merge, extract text, and confidently manage your multi-page documents.
* **Image Processing Engine**: Compress, convert, and crop images quickly entirely on the client-side.
* **Personal Dashboard**: A central hub to track and manage all active assets, see real-time storage metrics, and "pin" important documents for permanent storage.
* **Supabase Cloud Integration**: Integrated Row-Level Security (RLS) PostgreSQL database for tracking analytics, storing metrics, and highly-secure Supabase Storage integration for document processing persistence.
* **Robust Authentication**: Powered by Supabase Auth with standard Email registration and a seamless **Continue with Google** OAuth integration.

## 🛠 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Cloud**: [Supabase](https://supabase.com/) (Auth, Postgres, Storage)
- **Deployment**: [Vercel](https://vercel.com/)
- **Document Processing**: `pdf-lib`, `pdfjs-dist`

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

You will need Node.js and an active [Supabase](https://supabase.com) project.

### 1. Clone the repository

```bash
git clone https://github.com/rachts/doceasy.git
cd doceasy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup (SQL Editor)

Ensure your Supabase project's database is initialized with the proper schema to support the dashboard and file integrations. You will need to create a `files` table and an `events` table (Ensure you've also created a bucket named `processed` in Supabase Storage with appropriate public access if needed). Run the following code in the Supabase SQL Editor:

```sql
CREATE TABLE files (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name text NOT NULL,
    file_type text,
    file_size bigint,
    tool_used text,
    storage_path text,
    user_id uuid REFERENCES auth.users(id),
    download_url text,
    is_saved boolean DEFAULT false,
    created_at timestamp DEFAULT now()
);

CREATE TABLE events (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type text NOT NULL,
    tool_used text,
    created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Setup Policies
CREATE POLICY "Users can view own files" ON files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own files" ON files FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own files" ON files FOR UPDATE USING (auth.uid() = user_id);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👨‍💻 Created By

Designed and built by **Rachit Tiwari**.
