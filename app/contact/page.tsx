"use client"

import Link from "next/link"
import { ArrowLeft, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    const mailtoSubject = encodeURIComponent(`DocEasy Contact: ${subject}`)
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )

    window.location.href = `mailto:tiwari.rachit@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`
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
              className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all"
            >
              <Send className="w-5 h-5 mr-2" />
              Send via Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
