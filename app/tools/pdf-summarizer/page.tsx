'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/Sidebar'
import { ProgressBar } from '@/components/ProgressBar'
import { UploadZone } from '@/components/UploadZone'
import { 
  Sparkles, 
  FileText, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  AlertTriangle,
  FileCheck,
  ShieldCheck
} from 'lucide-react'
import { extractTextFromPDF } from '@/lib/pdf-extractor-utils'

interface SummaryResult {
  summary: string
  keyPoints: string[]
  wordCount: number
  sentenceCount: number
  summaryWordCount: number
  reductionPercentage: number
}

// Extractive Summarization using Keyword Frequency (TF)
function summarizeText(rawText: string, targetSentenceCount = 4): SummaryResult {
  const cleaned = rawText.replace(/\r\n/g, '\n').replace(/\t/g, ' ')
  
  // Split into sentences using punctuation boundaries
  const rawSentences = cleaned
    .split(/(?<=[.?!])\s+(?=[A-Z0-9"'])/)
    .map(s => s.trim().replace(/\s+/g, ' '))
    .filter(s => s.length > 20 && s.length < 600)

  const words = cleaned.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
  const totalWords = words.length

  if (rawSentences.length === 0) {
    const fallbackSummary = rawText.slice(0, 400).trim()
    const summaryWords = fallbackSummary.split(/\s+/).filter(Boolean).length
    return {
      summary: fallbackSummary || 'No extractable sentences found in this document.',
      keyPoints: fallbackSummary ? [fallbackSummary] : [],
      wordCount: totalWords,
      sentenceCount: 0,
      summaryWordCount: summaryWords,
      reductionPercentage: totalWords > 0 ? Math.round((1 - summaryWords / totalWords) * 100) : 0,
    }
  }

  // Common English stop words
  const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
    'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
    'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
    'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
    'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
    'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
    'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
    'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
    'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
    'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
    'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
    'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
    'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'also', 'will', 'just', 'like', 'one', 'two'
  ])

  // Calculate word frequencies
  const wordFreq = new Map<string, number>()
  for (const w of words) {
    if (!STOP_WORDS.has(w)) {
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1)
    }
  }

  // Score sentences using normalized keyword frequency
  const scoredSentences = rawSentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
    let score = 0
    for (const w of sWords) {
      if (!STOP_WORDS.has(w)) {
        score += (wordFreq.get(w) || 0)
      }
    }
    // Normalized by word count to avoid runaway sentence length bias
    const normalizedScore = sWords.length > 0 ? score / Math.sqrt(sWords.length) : 0
    return {
      sentence,
      index,
      score: normalizedScore,
    }
  })

  // Select top N sentences for summary
  const count = Math.min(targetSentenceCount, scoredSentences.length)
  const topForSummary = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    // Preserve original chronological order for readable narrative
    .sort((a, b) => a.index - b.index)

  const summary = topForSummary.map(s => s.sentence).join(' ')

  // Select key takeaways (top 4 distinct high-scoring sentences)
  const topKeyPoints = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(5, scoredSentences.length))
    .map(s => s.sentence)

  const summaryWords = summary.split(/\s+/).filter(Boolean).length
  const reduction = totalWords > 0 ? Math.max(0, Math.round((1 - summaryWords / totalWords) * 100)) : 0

  return {
    summary,
    keyPoints: topKeyPoints,
    wordCount: totalWords,
    sentenceCount: rawSentences.length,
    summaryWordCount: summaryWords,
    reductionPercentage: reduction
  }
}

export default function PdfSummarizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [summaryLength, setSummaryLength] = useState<number>(4)
  const [result, setResult] = useState<SummaryResult | null>(null)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const processFile = async (selectedFile: File, sentenceCount: number) => {
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(`File "${selectedFile.name}" exceeds 50MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB). Please select a PDF under 50MB.`)
      return
    }
    setFile(selectedFile)
    setProcessing(true)
    setProgress(15)
    setError('')
    setResult(null)

    try {
      let rawText = ''
      setProgress(35)
      
      if (selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf')) {
        rawText = await extractTextFromPDF(selectedFile)
      } else {
        rawText = await selectedFile.text()
      }

      setProgress(75)
      if (!rawText || rawText.trim().length === 0) {
        throw new Error('No readable text found in document. It may contain only scanned images or be password protected.')
      }

      setExtractedText(rawText)
      const summaryData = summarizeText(rawText, sentenceCount)
      setResult(summaryData)
      setProgress(100)
    } catch (err: any) {
      console.error('Summarization error:', err)
      setError(err.message || 'Failed to extract text or summarize document')
    } finally {
      setProcessing(false)
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    processFile(selectedFile, summaryLength)
  }

  const handleLengthChange = (newCount: number) => {
    setSummaryLength(newCount)
    if (extractedText) {
      const summaryData = summarizeText(extractedText, newCount)
      setResult(summaryData)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    const textToCopy = `DOCUMENT SUMMARY:\n\n${result.summary}\n\nKEY POINTS:\n${result.keyPoints.map(p => `• ${p}`).join('\n')}`
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result || !file) return
    const content = `# Document Summary: ${file.name}\n\n## Executive Summary\n${result.summary}\n\n## Key Takeaways\n${result.keyPoints.map(p => `- ${p}`).join('\n')}\n\n---\nGenerated locally with DocEasy PDF Summarizer (zero server uploads).\n`
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}-summary.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setFile(null)
    setExtractedText('')
    setResult(null)
    setProgress(0)
    setError('')
  }

  return (
    <div className="flex min-h-screen bg-[#0C0A09] text-[#FAFAF9]">
      <Sidebar currentPath="/tools/pdf-summarizer" />

      <main className="flex-1 ml-[240px] p-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-[6px] bg-[#1C1917] border border-[#292524] flex items-center justify-center text-[#D97706]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#FAFAF9]">
                PDF Summarizer
              </h1>
              <p className="text-[13px] text-[#A8A29E]">
                Extractive document summarization powered by keyword frequency ranking. 100% client-side.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Zone or Processing State */}
        {!file && (
          <div className="space-y-6">
            <UploadZone
              onFileSelect={handleFileSelect}
              accept={{
                'application/pdf': ['.pdf'],
                'text/plain': ['.txt'],
              }}
              maxSize={50 * 1024 * 1024}
              label="Drop your PDF or document here"
              sublabel="Client-side text parsing and keyword ranking. Zero server uploads."
            />

            <div className="rounded-[6px] border border-[#292524] bg-[#141110] p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="text-[13px]">
                <span className="text-[#FAFAF9] font-medium">100% Private Document Intelligence: </span>
                <span className="text-[#A8A29E]">
                  Your document never leaves your machine. Text is extracted locally using WebAssembly and ranked by keyword importance in browser memory. Check your browser Network tab to verify zero network requests.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {processing && (
          <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1C1917] text-[#D97706] animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-[#FAFAF9]">Analyzing Document Content</h3>
              <p className="text-[13px] text-[#A8A29E] mt-1">
                Parsing text streams and computing keyword frequency weights...
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <ProgressBar progress={progress} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-[#1C1917] border border-[#EF4444]/30 rounded-[8px] p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-[14px] font-medium text-[#FAFAF9]">Summarization Error</h4>
                <p className="text-[13px] text-[#A8A29E]">{error}</p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#292524] text-[#FAFAF9] text-[12px] hover:bg-[#3E3835] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Another File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result State */}
        {result && !processing && (
          <div className="space-y-6">
            {/* File & Controls Bar */}
            <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] bg-[#1C1917] flex items-center justify-center text-[#D97706]">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-[#FAFAF9]">{file?.name}</div>
                  <div className="text-[12px] text-[#A8A29E]">
                    {result.wordCount.toLocaleString()} words · {result.sentenceCount} sentences
                  </div>
                </div>
              </div>

              {/* Summary Length Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#A8A29E] mr-1">Summary Length:</span>
                {[
                  { label: 'Concise (3)', count: 3 },
                  { label: 'Standard (5)', count: 5 },
                  { label: 'Detailed (7)', count: 7 },
                ].map(len => (
                  <button
                    key={len.count}
                    onClick={() => handleLengthChange(len.count)}
                    className={`px-2.5 py-1 text-[12px] rounded-[4px] transition-colors ${
                      summaryLength === len.count
                        ? 'bg-[#D97706] text-black font-medium'
                        : 'bg-[#1C1917] text-[#A8A29E] hover:text-[#FAFAF9] border border-[#292524]'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#1C1917] border border-[#292524] text-[13px] text-[#FAFAF9] hover:bg-[#292524] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#D97706] text-black font-medium text-[13px] hover:bg-[#B45309] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Summary
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-[4px] text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-[#1C1917] transition-colors"
                  title="Summarize another document"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4">
                <div className="text-[12px] text-[#A8A29E]">Original Length</div>
                <div className="text-xl font-semibold text-[#FAFAF9] mt-1">
                  {result.wordCount.toLocaleString()} <span className="text-[13px] font-normal text-[#78716C]">words</span>
                </div>
              </div>
              <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4">
                <div className="text-[12px] text-[#A8A29E]">Summary Length</div>
                <div className="text-xl font-semibold text-[#FAFAF9] mt-1">
                  {result.summaryWordCount.toLocaleString()} <span className="text-[13px] font-normal text-[#78716C]">words</span>
                </div>
              </div>
              <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-4">
                <div className="text-[12px] text-[#A8A29E]">Reduction Ratio</div>
                <div className="text-xl font-semibold text-[#D97706] mt-1">
                  -{result.reductionPercentage}%
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-6 space-y-3">
              <h2 className="text-[15px] font-medium text-[#FAFAF9] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                Executive Summary
              </h2>
              <div className="text-[14px] leading-relaxed text-[#D6D3D1] bg-[#0C0A09] p-4 rounded-[6px] border border-[#1C1917]">
                {result.summary}
              </div>
            </div>

            {/* Key Takeaways */}
            {result.keyPoints.length > 0 && (
              <div className="bg-[#141110] border border-[#292524] rounded-[8px] p-6 space-y-3">
                <h2 className="text-[15px] font-medium text-[#FAFAF9] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#D97706]" />
                  Key Takeaways
                </h2>
                <ul className="space-y-2">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-[13.5px] text-[#D6D3D1] bg-[#0C0A09] p-3 rounded-[6px] border border-[#1C1917]">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1C1917] text-[#D97706] text-[11px] font-mono flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
