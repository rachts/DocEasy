export async function compressImageWithQuality(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        // Set canvas dimensions to image dimensions
        canvas.width = img.width
        canvas.height = img.height

        // Draw image on canvas
        ctx.drawImage(img, 0, 0)

        // Convert to blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to compress image"))
            }
          },
          file.type,
          quality / 100,
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

export async function compressImageToSize(file: File, maxSizeKB: number): Promise<Blob> {
  let quality = 90
  let compressed = await compressImageWithQuality(file, quality)

  // Iteratively reduce quality until size is under target
  while (compressed.size > maxSizeKB * 1024 && quality > 10) {
    quality -= 10
    compressed = await compressImageWithQuality(file, quality)
  }

  return compressed
}

export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100)
}
