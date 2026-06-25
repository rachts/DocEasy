import { motion } from "motion/react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "./button"

export type StatusType = "idle" | "processing" | "success" | "error"

interface ProcessingStatusProps {
  status: StatusType
  progress?: number
  title?: string
  description?: string
  error?: string
  onDownload?: () => void
  onReset?: () => void
}

export function ProcessingStatus({ 
  status, 
  progress = 0, 
  title, 
  description, 
  error,
  onDownload,
  onReset
}: ProcessingStatusProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-8 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 text-center shadow-glass"
    >
      {status === "processing" && (
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="48" cy="48" r="46" className="stroke-secondary fill-none" strokeWidth="4" />
              <circle 
                cx="48" 
                cy="48" 
                r="46" 
                className="stroke-primary fill-none transition-all duration-300" 
                strokeWidth="4" 
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progress) / 100}
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">{title || "Processing..."}</h3>
          <p className="text-sm text-muted-foreground">{description || "Please wait while we prepare your file."}</p>
          <div className="mt-4 font-mono text-sm text-primary font-medium">{Math.round(progress)}%</div>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">{title || "Success!"}</h3>
          <p className="text-sm text-muted-foreground mb-8">{description || "Your file is ready to download."}</p>
          <div className="flex flex-col w-full gap-3">
            <Button onClick={onDownload} size="lg" className="w-full rounded-xl shadow-glow">
              Download File
            </Button>
            <Button onClick={onReset} variant="outline" size="lg" className="w-full rounded-xl">
              Process Another
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-destructive/5">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-8">{error || "An unknown error occurred."}</p>
          <Button onClick={onReset} variant="outline" size="lg" className="w-full rounded-xl">
            Try Again
          </Button>
        </div>
      )}
    </motion.div>
  )
}
