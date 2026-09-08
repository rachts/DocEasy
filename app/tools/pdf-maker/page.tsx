'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { 
  Award, 
  FileText, 
  Briefcase, 
  Download, 
  RotateCcw, 
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import {
  generateInvoicePDF,
  generateCertificatePDF,
  generateResumePDF,
  type InvoiceData,
  type CertificateData,
  type ResumeData,
} from '@/lib/pdf-maker-utils'

export default function PDFMakerPage() {
  const [activeTab, setActiveTab] = useState<'invoice' | 'certificate' | 'resume'>('invoice')
  const [generating, setGenerating] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>('')

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    from: 'DocEasy Corporation\n100 Architectural Way\nSan Francisco, CA',
    to: 'Acme Systems Ltd\n500 Industrial Plaza\nNew York, NY',
    items: [{ description: 'Engineering Consultancy & Systems Audit', quantity: 1, price: 2500 }],
    total: 2500,
  })

  const [certificateData, setCertificateData] = useState<CertificateData>({
    recipientName: 'Alex Mercer',
    courseName: 'Advanced WebAssembly & Cryptographic Memory Isolation',
    date: new Date().toISOString().split('T')[0],
    instructorName: 'Rachit Kumar Tiwari',
  })

  const [resumeData, setResumeData] = useState<ResumeData>({
    name: 'Alex Mercer',
    email: 'alex.mercer@systems.internal',
    phone: '+1 (555) 019-2831',
    summary: 'Senior systems engineer with 8+ years developing high-throughput client runtime pipelines and cryptographic vaults.',
    experience: 'DocEasy - Lead Infrastructure Architect (2022-Present)\nArchitected client-side WebAssembly computation engine with zero server exfiltration.\n\nVercel - Staff Systems Engineer (2019-2022)\nImplemented edge compiler routines and linear memory caching layers.',
    education: 'B.S. in Computer Science & Applied Mathematics\nCarnegie Mellon University (2015-2019)',
    skills: 'Rust, WebAssembly, TypeScript, Next.js, C++, Memory Security, Linux Kernel',
  })

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')

    try {
      let pdfBlob: Blob

      if (activeTab === 'invoice') {
        pdfBlob = await generateInvoicePDF(invoiceData)
      } else if (activeTab === 'certificate') {
        pdfBlob = await generateCertificatePDF(certificateData)
      } else {
        pdfBlob = await generateResumePDF(resumeData)
      }

      const url = URL.createObjectURL(pdfBlob)
      setDownloadUrl(url)
    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || 'Failed to compile document')
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setDownloadUrl(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#FAFAF9] font-sans flex antialiased">
      <ProgressBar active={generating} />
      <Sidebar currentPath="/tools" />

      <main className="w-full md:pl-[240px] flex flex-col min-h-screen">
        <header className="bg-[#141110] border-b border-[#292524] h-[56px] flex justify-between items-center px-8 md:px-16 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-[12px]">
            <Link href="/tools" className="text-[#78716C] hover:text-[#FAFAF9] transition-colors">
              Tools
            </Link>
            <span className="text-[#44403C]">/</span>
            <span className="text-[#FAFAF9]">PDF Maker</span>
          </div>
          <div className="hidden md:flex text-[12px] text-[#78716C]">
            Runs locally in your browser
          </div>
        </header>

        <div className="p-8 md:p-16 max-w-6xl w-full mx-auto flex-1 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-[#FAFAF9]">
              PDF Maker
            </h1>
            <p className="text-[15px] text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              Compile structured invoices, credentials certificates, and professional resumes directly into vectorized PDF outputs.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-[#1C1917] border border-[#7F1D1D] rounded-[6px] text-[13px] text-[#FAFAF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError('')}
                className="px-3 py-1.5 bg-[#292524] hover:bg-[#44403C] text-[#FAFAF9] text-[12px] font-medium rounded-[4px] transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Dismiss & retry
              </button>
            </div>
          )}

          {/* Template Selectors */}
          <div className="flex gap-2 border-b border-[#292524] pb-4 text-[13px]">
            {[
              { id: 'invoice', label: 'Commercial invoice', icon: FileText },
              { id: 'certificate', label: 'Certificate', icon: Award },
              { id: 'resume', label: 'Curriculum vitae', icon: Briefcase },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setDownloadUrl(null)
                }}
                className={`px-4 py-2 rounded-[6px] border text-[13px] transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#FAFAF9] text-[#0C0A09] border-[#FAFAF9] font-medium'
                    : 'bg-[#141110] text-[#78716C] border-[#292524] hover:text-[#FAFAF9] hover:border-[#44403C]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-[#1C1917] border border-[#292524] p-6 md:p-8 rounded-[8px]">
            {activeTab === 'invoice' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      Invoice number
                    </label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                      className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      Issue date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                      className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      From (issuer)
                    </label>
                    <textarea
                      rows={3}
                      value={invoiceData.from}
                      onChange={(e) => setInvoiceData({ ...invoiceData, from: e.target.value })}
                      className="w-full bg-[#141110] border border-[#292524] rounded-[6px] p-3 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      To (client)
                    </label>
                    <textarea
                      rows={3}
                      value={invoiceData.to}
                      onChange={(e) => setInvoiceData({ ...invoiceData, to: e.target.value })}
                      className="w-full bg-[#141110] border border-[#292524] rounded-[6px] p-3 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificate' && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#A8A29E] block">
                    Recipient full name
                  </label>
                  <input
                    type="text"
                    value={certificateData.recipientName}
                    onChange={(e) => setCertificateData({ ...certificateData, recipientName: e.target.value })}
                    className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#A8A29E] block">
                    Course or credential title
                  </label>
                  <input
                    type="text"
                    value={certificateData.courseName}
                    onChange={(e) => setCertificateData({ ...certificateData, courseName: e.target.value })}
                    className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#A8A29E] block">
                    Authorized signatory
                  </label>
                  <input
                    type="text"
                    value={certificateData.instructorName}
                    onChange={(e) => setCertificateData({ ...certificateData, instructorName: e.target.value })}
                    className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={resumeData.name}
                      onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                      className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                      className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#A8A29E] block">
                      Phone number
                    </label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                      className="w-full h-10 bg-[#141110] border border-[#292524] rounded-[6px] px-3.5 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#A8A29E] block">
                    Professional summary
                  </label>
                  <textarea
                    rows={2}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    className="w-full bg-[#141110] border border-[#292524] rounded-[6px] p-3 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#A8A29E] block">
                    Experience
                  </label>
                  <textarea
                    rows={4}
                    value={resumeData.experience}
                    onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                    className="w-full bg-[#141110] border border-[#292524] rounded-[6px] p-3 text-[14px] text-[#FAFAF9] focus:border-[#A8A29E] focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {downloadUrl ? (
              <div className="mt-8 pt-6 border-t border-[#292524] flex flex-col sm:flex-row gap-4">
                <a
                  href={downloadUrl}
                  download={`${activeTab}_document.pdf`}
                  className="flex-1 h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
                <button
                  onClick={handleReset}
                  className="h-10 px-6 bg-transparent text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524] hover:border-[#A8A29E] text-[13px] rounded-[6px] transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Edit details
                </button>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-[#292524] flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full sm:w-auto px-6 h-10 bg-[#FAFAF9] text-[#0C0A09] text-[13px] font-medium rounded-[6px] hover:bg-[#E7E5E4] transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[#0C0A09] pulse-dot" />
                      Creating PDF...
                    </>
                  ) : (
                    <>
                      Create PDF
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className="bg-[#141110] border-t border-[#292524] w-full py-4 px-8 md:px-16 flex justify-between items-center mt-auto text-[12px] text-[#78716C]">
          <span className="text-[#FAFAF9] font-medium">DocEasy</span>
          <span>© {new Date().getFullYear()} DocEasy. All rights reserved.</span>
        </footer>
      </main>
    </div>
  )
}
