import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ToolHeaderProps {
  title: string
  description: string
}

export function ToolHeader({ title, description }: ToolHeaderProps) {
  return (
    <div className="mb-10 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tighter mb-4 text-foreground">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
