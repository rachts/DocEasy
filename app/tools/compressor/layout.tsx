import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compress PDF & Image Online Free",
  description: "Reduce file sizes of your PDFs and images without losing quality. Fast, private, and 100% free tool for online compression.",
  keywords: ["compress PDF online", "shrink image size", "online file compressor", "reduce PDF size", "free PDF compression"],
}

export default function CompressorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
