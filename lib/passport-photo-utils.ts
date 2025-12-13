export interface PassportPhotoOptions {
  width: number
  height: number
  backgroundColor?: string
  brightness?: number
  contrast?: number
}

export const PASSPORT_SIZES = {
  "US Passport": { width: 600, height: 600, unit: "2x2 inches" },
  "India Passport": { width: 600, height: 600, unit: "2x2 inches" },
  "UK Passport": { width: 413, height: 531, unit: "35x45 mm" },
  "EU Passport": { width: 413, height: 531, unit: "35x45 mm" },
  "China Passport": { width: 390, height: 567, unit: "33x48 mm" },
  Custom: { width: 600, height: 600, unit: "Custom" },
}

export async function processPassportPhoto(file: File, options: PassportPhotoOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = options.width
        canvas.height = options.height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Fill background color if specified
        if (options.backgroundColor) {
          ctx.fillStyle = options.backgroundColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Calculate scaling to fit the image
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (canvas.width - scaledWidth) / 2
        const y = (canvas.height - scaledHeight) / 2

        // Apply brightness and contrast adjustments
        if (options.brightness !== undefined || options.contrast !== undefined) {
          ctx.filter = `brightness(${options.brightness || 100}%) contrast(${options.contrast || 100}%)`
        }

        // Draw the image
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Could not create blob"))
              return
            }
            resolve(blob)
          },
          "image/jpeg",
          0.95,
        )
      }

      img.onerror = () => reject(new Error("Could not load image"))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}

export async function removeBackground(file: File, backgroundColor: string): Promise<Blob> {
  // For now, this will just replace with solid color
  // In production, you'd use an AI service like remove.bg
  return processPassportPhoto(file, {
    width: 600,
    height: 600,
    backgroundColor,
  })
}
