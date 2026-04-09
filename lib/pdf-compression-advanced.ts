export type CompressionLevel = "extreme" | "recommended" | "less"

/**
 * Advanced PDF compression using a hybrid approach
 * @param file The original PDF file
 * @param level Compression intensity (less = structural, extreme = rasterization)
 */
export async function compressPDFWithRendering(file: File, level: CompressionLevel = "recommended"): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const { PDFDocument } = await import("pdf-lib")
    
    // "Less" Compression: Purely structural (lossless visual quality, metadata stripped)
    if (level === "less") {
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      
      // Strip metadata
      pdfDoc.setTitle("")
      pdfDoc.setAuthor("")
      pdfDoc.setSubject("")
      pdfDoc.setProducer("")
      pdfDoc.setCreator("")
      pdfDoc.setKeywords([])

      // Save with object stream compression
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true })
      const compressedBlob = new Blob([compressedBytes], { type: "application/pdf" })
      
      console.log(`PDF Compressed (less): ${(file.size / 1024).toFixed(1)}KB -> ${(compressedBlob.size / 1024).toFixed(1)}KB`)
      return compressedBlob
    }

    // "Recommended" & "Extreme" Compression: Rendering-based squashing
    const pdfjsLib = await import("pdfjs-dist")

    // Set worker path (pdfjs-dist v4+ uses .mjs instead of .js)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    // Define quality settings based on level
    const settings = {
      recommended: { scale: 1.5, quality: 0.8 }, // Good Quality, Good Compression
      extreme: { scale: 0.8, quality: 0.5 },     // Lower Quality, High Compression
    }[level]

    if (!settings) throw new Error("Invalid compression level")

    // Load the PDF with pdf.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdfJsDoc = await loadingTask.promise

    // Create new PDF with pdf-lib
    const newPdfDoc = await PDFDocument.create()
    const numPages = pdfJsDoc.numPages

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfJsDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: settings.scale })

      // Create canvas
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (!context) throw new Error("Could not get canvas context")

      canvas.height = viewport.height
      canvas.width = viewport.width

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise

      // Convert canvas to JPEG blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error("Failed to create blob"))
          },
          "image/jpeg",
          settings.quality,
        )
      })

      // Embed image in new PDF
      const imageBytes = await blob.arrayBuffer()
      const image = await newPdfDoc.embedJpg(imageBytes)

      // Use original dimensions for the new page but draw the scaled image onto it
      const originalViewport = page.getViewport({ scale: 1.0 })
      const newPage = newPdfDoc.addPage([originalViewport.width, originalViewport.height])
      
      newPage.drawImage(image, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      })
    }

    // Save compressed PDF
    const compressedBytes = await newPdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    })

    const compressedBlob = new Blob([compressedBytes], { type: "application/pdf" })

    // Return compressed version
    console.log(`PDF Compressed (${level}): ${(file.size / 1024).toFixed(1)}KB -> ${(compressedBlob.size / 1024).toFixed(1)}KB`)
    return compressedBlob
  } catch (error) {
    console.error("Advanced PDF compression error:", error)
    throw error
  }
}
