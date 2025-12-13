import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Zap, Shield, ArrowRight } from "lucide-react"
import { FooterCredit } from "@/components/footer-credit"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-foreground text-balance">Simplify Your Document Management</h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-balance">
          Upload, organize, compress, and convert your documents in seconds. Perfect for form fill-ups, applications,
          and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              <FileText className="w-5 h-5 mr-2" />
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Zap className="w-5 h-5 mr-2" />
              Explore Tools
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground text-balance">Why Choose DocEasy?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Quick Compression</h3>
            <p className="text-muted-foreground">Reduce file sizes to meet upload limits without losing quality.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
            <FileText className="w-10 h-10 text-secondary mb-4" />
            <h3 className="text-xl font-bold mb-3">Format Conversion</h3>
            <p className="text-muted-foreground">Convert between JPG, PNG, and PDF formats instantly.</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
            <Shield className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-3">Safe & Organized</h3>
            <p className="text-muted-foreground">
              Keep your documents organized with categories and tags. Optional login for cloud storage.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 p-12 rounded-lg shadow-lg border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4 text-balance text-white dark:text-gray-100">
            Ready to organize your documents?
          </h2>
          <p className="text-lg mb-6 text-blue-50 dark:text-gray-200">
            Start as a guest or create an account to save your files permanently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-transparent text-white border-2 border-white hover:bg-white/10 dark:text-gray-100 dark:border-gray-200 dark:hover:bg-gray-100/10"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 text-center text-muted-foreground">
        <p>© 2025 DocEasy. Made with care for document management.</p>
        <FooterCredit />
      </footer>
    </main>
  )
}
