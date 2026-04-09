"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Mail, FileText, Shield, Heart } from "lucide-react"
import { motion } from "motion/react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                DocEasy
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The ultimate privacy-first document toolkit. Built for speed, 
              security, and simplicity. No login required, ever.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/rachts" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://linkedin.com/in/rachitkumar" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Tools Grid Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Tools</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/tools/compressor" className="hover:text-primary transition-colors">PDF Compressor</Link></li>
              <li><Link href="/tools/converter" className="hover:text-primary transition-colors">Image Converter</Link></li>
              <li><Link href="/tools/pdf-merger" className="hover:text-primary transition-colors">PDF Merger</Link></li>
              <li><Link href="/tools/passport-photo" className="hover:text-primary transition-colors">Passport Photo</Link></li>
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Rachit</Link></li>
            </ul>
          </div>

          {/* About Creator */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Creator</h4>
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Designed and developed by <span className="font-semibold text-foreground">Rachit</span>. 
                CSE student and full-stack builder focused on creating high-utility web products.
              </p>
              <Link 
                href="mailto:contact@rachit.me" 
                className="inline-flex items-center mt-4 text-xs font-semibold text-primary hover:underline"
              >
                <Mail className="w-3 h-3 mr-1" />
                Work with me
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} DocEasy. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> by Rachit
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Secure processing
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
