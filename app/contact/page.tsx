"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitContactForm } from "./actions"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      e.currentTarget.reset()
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="text-center mb-12">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have questions, feedback, or found a bug? We'd love to hear from you.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
          {success && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
              <h3 className="font-bold text-lg mb-1">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">Thank you for reaching out. We will get back to you soon.</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-red-500 mb-1">Could not send message</p>
                <p className="text-red-500/80">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold">Name</label>
                <input 
                  id="name"
                  name="name"
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold">Email</label>
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold">Subject</label>
              <input 
                id="subject"
                name="subject"
                type="text" 
                required
                placeholder="How can we help?"
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-semibold">Message</label>
              <textarea 
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full p-4 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 disabled:opacity-70 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
