"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Zap, Shield, ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { motion } from "motion/react"
import { TrustBadges } from "@/components/trust-badges"
import { ToolsGrid } from "@/components/tools-grid"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { RecentFiles } from "@/components/recent-files"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden flex flex-col items-center text-center">
        {/* Premium background glow effect */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center relative z-10"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-muted-foreground text-sm font-medium mb-8 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
              Privacy-First Workspace
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground text-balance leading-[1.1] mb-6"
            >
              Document processing, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">simplified.</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed text-balance"
            >
              The ultra-fast, secure, and professional suite for all your document needs. 
              Convert, compress, and sign in seconds—without ever leaving your browser.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/tools" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium shadow-[0_0_40px_rgba(var(--primary),0.4)] transition-all active:scale-[0.98]">
                  Try for free
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full border-border/50 bg-card/50 hover:bg-muted text-foreground text-base font-medium backdrop-blur-sm transition-all active:scale-[0.98]">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-20 w-full max-w-5xl"
            >
              <TrustBadges />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Recent Files Section */}
      <RecentFiles />

      {/* How it works */}
      <HowItWorks />

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToolsGrid />
      </div>

      {/* About Creator Section */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Why I built DocEasy</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                I was tired of using document tools that were cluttered with ads, 
                required account sign-ups, or had suspicious privacy policies. 
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                As a CSE student and developer, I wanted to build something that I'd 
                use myself—a clean, fast, and privacy-first solution for common 
                document tasks.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-bold text-xl text-foreground">Rachit Kumar</span>
                  <span className="text-primary font-medium">Founder & Lead Developer</span>
                </div>
                <div className="h-12 w-[1px] bg-border" />
                <div className="flex gap-4">
                  <Link href="https://github.com/rachts" target="_blank" className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link href="https://www.linkedin.com/in/rachitkrtiwari/" target="_blank" className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                  <Link href="https://x.com/rachtss" target="_blank" className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Privacy is our Priority</h3>
                  <p className="text-muted-foreground">
                    No trackers. No logs. No nonsense. 
                    Just your documents, processed securely.
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background/20 via-transparent to-transparent" />
            </div>

            <h2 className="text-4xl font-bold mb-6 tracking-tight relative z-10">
              Ready to simplify your tasks?
            </h2>
            <p className="text-lg mb-10 text-background/80 max-w-xl mx-auto relative z-10">
              Join thousands of users who process their documents securely every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/tools">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-10 rounded-2xl text-lg font-bold">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="mailto:tiwari.rachit@gmail.com">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-2xl text-lg font-bold bg-transparent text-background border-background/20 hover:bg-background/10">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
