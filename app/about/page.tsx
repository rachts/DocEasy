import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Github, Linkedin, Mail, Code, Terminal, Cpu, Layout, Layers, Database, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Rachit | DocEasy",
  description: "Learn more about the creator of DocEasy.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/">
            <Button variant="ghost" className="mb-12 hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for new opportunities
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                Hi, I'm <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Rachit Kumar Tiwari</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                A passionate Computer Science Student, Full Stack Developer, and Builder of useful products. I love turning complex problems into simple, beautiful, and intuitive designs.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link href="https://github.com/rachts" target="_blank">
                  <Button variant="outline" className="gap-2 h-12 px-6 rounded-full">
                    <Github className="w-5 h-5" />
                    GitHub
                  </Button>
                </Link>
                <Link href="https://www.linkedin.com/in/rachitkrtiwari/" target="_blank">
                  <Button variant="outline" className="gap-2 h-12 px-6 rounded-full border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </Button>
                </Link>
                <Link href="https://x.com/rachtss" target="_blank">
                  <Button variant="outline" className="gap-2 h-12 px-6 rounded-full hover:bg-muted">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                  </Button>
                </Link>
                <Link href="mailto:tiwari.rachit@gmail.com">
                  <Button className="gap-2 h-12 px-6 rounded-full bg-primary hover:bg-primary/90">
                    <Mail className="w-5 h-5" />
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Want to know more?</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Check out my personal portfolio to see my full journey, other featured projects, and the complete tech stack I work with.
          </p>
          <Link href="https://portfolio-rachts.vercel.app/" target="_blank">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold gap-2 group">
              Visit My Portfolio
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Let's build something great together.</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full font-bold">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
