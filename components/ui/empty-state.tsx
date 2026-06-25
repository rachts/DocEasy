import { ReactNode } from "react"
import { motion } from "motion/react"
import { FileQuestion } from "lucide-react"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-10 py-16 border border-dashed border-border/60 rounded-3xl bg-card/20"
    >
      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-5 text-muted-foreground">
        {icon || <FileQuestion className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
