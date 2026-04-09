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
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Abstract Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
            >
              <Zap className="w-4 h-4" />
              <span>100% Free & Privacy Focused</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-foreground text-balance leading-[1.1]"
            >
              The ultimate toolkit for your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">documents</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed text-balance"
            >
              Merge, compress, and convert your files in seconds. 
              No login, no watermarks, and no data tracking. Just pure speed.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
            >
              <Link href="/tools" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Upload your file
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-2xl bg-background/50 backdrop-blur-sm">
                  Explore Tools
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="mt-16 w-full max-w-5xl"
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
                  <Link href="https://linkedin.com/in/rachitkumar" target="_blank" className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors">
                    <Linkedin className="w-5 h-5" />
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
              <Link href="mailto:contact@doceasy.app">
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
