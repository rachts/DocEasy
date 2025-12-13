export type ImageFormat = "png" | "jpeg" | "webp" | "bmp"

export async function convertImageFormat(file: File, targetFormat: ImageFormat): Promise<Blob> {
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

        // For formats that don't support transparency, fill with white background
        if (targetFormat === "jpeg" || targetFormat === "bmp") {
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0)

        // Convert to blob with target format
        const mimeType = getMimeType(targetFormat)
        const quality = targetFormat === "jpeg" ? 0.92 : 1

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to convert image"))
            }
          },
          mimeType,
          quality,
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

function getMimeType(format: ImageFormat): string {
  const mimeTypes: Record<ImageFormat, string> = {
    png: "image/png",
    jpeg: "image/jpeg",
    webp: "image/webp",
    bmp: "image/bmp",
  }
  return mimeTypes[format]
}

export function getFormatExtension(format: ImageFormat): string {
  const extensions: Record<ImageFormat, string> = {
    png: "png",
    jpeg: "jpg",
    webp: "webp",
    bmp: "bmp",
  }
  return extensions[format]
}
