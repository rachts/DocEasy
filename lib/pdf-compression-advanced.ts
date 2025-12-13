export async function compressPDFWithRendering(file: File, quality = 0.7): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const { PDFDocument } = await import("pdf-lib")
    const pdfjsLib = await import("pdfjs-dist")

    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

    // Load the PDF with pdf.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdfJsDoc = await loadingTask.promise

    // Create new PDF with pdf-lib
    const newPdfDoc = await PDFDocument.create()

    const numPages = pdfJsDoc.numPages

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfJsDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: quality > 0.8 ? 2.0 : quality > 0.5 ? 1.5 : 1.0 })

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
          quality,
        )
      })

      // Embed image in new PDF
      const imageBytes = await blob.arrayBuffer()
      const image = await newPdfDoc.embedJpg(imageBytes)

      const newPage = newPdfDoc.addPage([viewport.width, viewport.height])
      newPage.drawImage(image, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      })
    }

    // Save compressed PDF
    const compressedBytes = await newPdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    })

    const compressedBlob = new Blob([compressedBytes], { type: "application/pdf" })

    // Return compressed if smaller, otherwise original
    return compressedBlob.size < file.size ? compressedBlob : file
  } catch (error) {
    console.error("Advanced PDF compression error:", error)
    throw error
  }
}
