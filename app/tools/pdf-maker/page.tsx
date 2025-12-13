"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  generateInvoicePDF,
  generateCertificatePDF,
  generateResumePDF,
  type InvoiceData,
  type CertificateData,
  type ResumeData,
} from "@/lib/pdf-maker-utils"
import { Download, FileText, Award, Briefcase } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function PDFMakerPage() {
  const [activeTab, setActiveTab] = useState("invoice")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)

  // Invoice state
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    date: new Date().toLocaleDateString(),
    from: "Your Company\n123 Business St\nCity, State 12345",
    to: "Client Name\n456 Client Ave\nCity, State 67890",
    items: [{ description: "Service/Product", quantity: 1, price: 100 }],
    total: 100,
  })

  // Certificate state
  const [certificateData, setCertificateData] = useState<CertificateData>({
    recipientName: "John Doe",
    courseName: "Web Development Fundamentals",
    date: new Date().toLocaleDateString(),
    instructorName: "Jane Smith",
  })

  // Resume state
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "Your Name",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    summary: "Experienced professional with expertise in...",
    experience: "Company Name - Position (2020-Present)\nKey responsibilities and achievements...",
    education: "University Name - Degree (Year)\nRelevant coursework and honors...",
    skills: "JavaScript, React, Node.js, Python, SQL",
  })

  const handleGenerate = async () => {
    setGenerating(true)
    setResult(null)

    try {
      let pdfBlob: Blob

      if (activeTab === "invoice") {
        pdfBlob = await generateInvoicePDF(invoiceData)
      } else if (activeTab === "certificate") {
        pdfBlob = await generateCertificatePDF(certificateData)
      } else if (activeTab === "resume") {
        pdfBlob = await generateResumePDF(resumeData)
      } else {
        throw new Error("Invalid template type")
      }

      setResult(pdfBlob)

      // Track action
      const token = localStorage.getItem("auth_token")
      if (token) {
        await fetch("/api/tool-actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: `${activeTab}.pdf`,
            fileType: "application/pdf",
            action: "make",
          }),
        })
      }
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const url = URL.createObjectURL(result)
    const link = document.createElement("a")
    link.href = url
    link.download = `${activeTab}-${Date.now()}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const addInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: 0 }],
    })
  }

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    const total = newItems.reduce((sum, item) => sum + item.quantity * item.price, 0)
    setInvoiceData({ ...invoiceData, items: newItems, total })
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">PDF Maker</h1>
      <p className="text-muted-foreground mb-8">Generate professional PDFs from templates</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Invoice
          </TabsTrigger>
          <TabsTrigger value="certificate" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certificate
          </TabsTrigger>
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Resume
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoice" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Invoice Details</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="text"
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <textarea
                  value={invoiceData.from}
                  onChange={(e) => setInvoiceData({ ...invoiceData, from: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <textarea
                  value={invoiceData.to}
                  onChange={(e) => setInvoiceData({ ...invoiceData, to: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Items</label>
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                      className="col-span-6 px-3 py-2 rounded border border-border"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(index, "quantity", Number(e.target.value))}
                      className="col-span-2 px-3 py-2 rounded border border-border"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateInvoiceItem(index, "price", Number(e.target.value))}
                      className="col-span-4 px-3 py-2 rounded border border-border"
                    />
                  </div>
                ))}
                <Button onClick={addInvoiceItem} variant="outline" size="sm">
                  Add Item
                </Button>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">Total: ${invoiceData.total.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="certificate" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Certificate Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={certificateData.recipientName}
                  onChange={(e) => setCertificateData({ ...certificateData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  value={certificateData.courseName}
                  onChange={(e) => setCertificateData({ ...certificateData, courseName: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="text"
                  value={certificateData.date}
                  onChange={(e) => setCertificateData({ ...certificateData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instructor Name</label>
                <input
                  type="text"
                  value={certificateData.instructorName}
                  onChange={(e) => setCertificateData({ ...certificateData, instructorName: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="resume" className="space-y-6 mt-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Resume Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Professional Summary</label>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <textarea
                  value={resumeData.experience}
                  onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Education</label>
                <textarea
                  value={resumeData.education}
                  onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <textarea
                  value={resumeData.skills}
                  onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-border"
                  rows={2}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {!result && (
        <Card className="p-6">
          <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
            {generating ? "Generating PDF..." : "Generate PDF"}
          </Button>
        </Card>
      )}

      {result && (
        <Card className="p-6 bg-accent/5 border-accent">
          <h2 className="text-lg font-bold mb-4 text-accent">PDF Generated Successfully</h2>
          <p className="text-sm mb-4">Your {activeTab} PDF is ready to download.</p>
          <Button onClick={handleDownload} className="w-full" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
        </Card>
      )}

      <FooterCredit />
    </main>
  )
}
