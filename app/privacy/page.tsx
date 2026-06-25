import Link from "next/link"
import { ArrowLeft, Shield, Lock, FileText, Database, Cookie, Mail, Clock, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Privacy Policy | DocEasy",
  description: "Learn about how DocEasy protects your data and privacy.",
}

export default function PrivacyPolicyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-12 text-foreground/80 leading-relaxed max-w-3xl mx-auto">
          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">1. Information Collection</h2>
            </div>
            <p className="text-muted-foreground">
              At DocEasy, your privacy is our priority. We collect minimal information necessary to provide our services. 
              This includes basic account details (if you choose to sign up) and temporary processing data required for file conversions.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">2. Authentication Data</h2>
            </div>
            <p className="text-muted-foreground">
              When you create an account, we store your email address and a securely hashed password. Authentication is managed by Supabase, 
              which employs industry-standard encryption and security practices. We never have access to your plaintext password.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">3. File Processing Policy</h2>
            </div>
            <p className="text-muted-foreground">
              DocEasy is built on a privacy-first philosophy. The majority of our tools, including PDF compression and image conversions, 
              are processed entirely client-side (within your browser). Your sensitive files are never uploaded to our servers unless you explicitly 
              choose to save them to your cloud dashboard or use advanced AI tools.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Database className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">4. Storage Policy</h2>
            </div>
            <p className="text-muted-foreground">
              Files uploaded to the cloud dashboard are securely stored in private storage buckets. Only you have access to your uploaded 
              files and generated exports. You can delete these files at any time from your dashboard, which will permanently remove them from our storage.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Cookie className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">5. Cookies</h2>
            </div>
            <p className="text-muted-foreground">
              We use essential cookies to maintain your session and keep you logged in securely. We do not use third-party tracking cookies 
              or sell your data to advertisers.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <UserCheck className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">6. Third Party Services</h2>
            </div>
            <p className="text-muted-foreground">
              We use Supabase for database and authentication infrastructure. For certain AI features, we utilize Google Gemini API. 
              Data sent to these services is strictly limited to what is necessary for the feature to function.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">7. Data Retention & User Rights</h2>
            </div>
            <p className="text-muted-foreground">
              You have the right to access, modify, or delete your personal data at any time. If you delete your account, all associated 
              files, activity logs, and personal information will be permanently erased from our systems.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-foreground">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">8. Contact Information</h2>
            </div>
            <p className="text-muted-foreground">
              If you have any questions or concerns regarding this Privacy Policy, please reach out to us via the <Link href="/contact" className="text-primary hover:underline font-medium">Contact Page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
