import Link from "next/link"
import { ArrowLeft, CheckCircle, UserCheck, File, Activity, Lightbulb, AlertTriangle, XOctagon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Terms of Service | DocEasy",
  description: "Terms of Service and Usage Guidelines for DocEasy.",
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="text-center mb-16">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-12 text-foreground/80 leading-relaxed max-w-3xl mx-auto">
          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            </div>
            <p className="text-muted-foreground">
              By accessing and using DocEasy, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <UserCheck className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">2. User Responsibilities</h2>
            </div>
            <p className="text-muted-foreground">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <File className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">3. File Usage Policy</h2>
            </div>
            <p className="text-muted-foreground">
              You retain all rights to the files you process using DocEasy. However, you agree not to upload or process files that contain malicious code, illegal content, or infringe upon the intellectual property rights of others.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Activity className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">4. Service Availability</h2>
            </div>
            <p className="text-muted-foreground">
              We strive to ensure DocEasy is available 24/7. However, we reserve the right to modify, suspend, or discontinue the service at any time, with or without notice, without liability to you.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
            </div>
            <p className="text-muted-foreground">
              The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of DocEasy and its licensors.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <AlertTriangle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
            </div>
            <p className="text-muted-foreground">
              In no event shall DocEasy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <XOctagon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">7. Termination</h2>
            </div>
            <p className="text-muted-foreground">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">8. Contact Information</h2>
            </div>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us via the <Link href="/contact" className="text-primary hover:underline font-medium">Contact Page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
