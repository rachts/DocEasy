import type { Metadata } from "next"
import { LandingPage } from "@/components/landing-page"

export const metadata: Metadata = {
  title: "DocEasy | All-in-One Document & Image Toolkit",
  description: "Free, fast, and private document processing. Compress PDFs, convert images, merge files, and more without any watermarks or data tracking.",
  openGraph: {
    title: "DocEasy | All-in-One Document & Image Toolkit",
    description: "Free, fast, and private document processing. No login required.",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocEasy — Privacy-First Hybrid Document & Image Toolkit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocEasy | All-in-One Document & Image Toolkit",
    description: "Free, fast, and private document processing. No login required.",
    images: ["/og-image.png"],
  },
}

export default function Home() {
  return <LandingPage />
}
