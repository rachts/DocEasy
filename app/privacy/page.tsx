import Link from "next/link"
import { ArrowLeft, Shield, Lock, EyeOff, Server } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mt-1">Last updated: April 2026</p>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Our Commitment to Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At DocEasy, your privacy is our foundation. We built this tool because we believe 
              document processing should be fast, free, and completely private. We do not require
              accounts, we don't track your identity, and we certainly don't look at your files.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <EyeOff className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-bold mb-2">No Data Collection</h3>
              <p className="text-sm text-muted-foreground">
                We do not collect names, emails, or personal identifiers. We don't use 
                third-party tracking cookies that follow you across the web.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <Server className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-bold mb-2">Auto-Deletion</h3>
              <p className="text-sm text-muted-foreground">
                All uploaded files and their processed versions are automatically deleted 
                from our temporary processing servers within 2 hours.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold">How we handle your files</h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
                <div className="font-bold text-primary">1.</div>
                <p className="text-sm text-muted-foreground">
                  You upload a file over a secure HTTPS connection.
                </p>
              </div>
              <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
                <div className="font-bold text-primary">2.</div>
                <p className="text-sm text-muted-foreground">
                  Our serverless functions process the file in an isolated environment.
                </p>
              </div>
              <div className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
                <div className="font-bold text-primary">3.</div>
                <p className="text-sm text-muted-foreground">
                  You download the result. The file is tagged for deletion automatically.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">Questions?</h3>
            <p className="text-muted-foreground">
              If you have any questions about our privacy practices, please contact us at 
              <span className="font-semibold text-foreground"> privacy@doceasy.app</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
