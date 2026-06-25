import { ReactNode } from "react"
import { ToolHeader } from "./tool-header"

interface ToolLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export function ToolLayout({ children, title, description }: ToolLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <ToolHeader title={title} description={description} />
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
