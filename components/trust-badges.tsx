"use client"

import { ShieldCheck, Clock, Lock, Zap } from "lucide-react"
import { motion } from "motion/react"

const badges = [
  {
    icon: Clock,
    title: "Auto-Deletion",
    description: "Files are automatically deleted after 2 hours of processing.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "We don't store your data or sell it to third parties.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Processing",
    description: "HTTPS encryption ensures your files are safe during transit.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Serverless processing for near-instant document handling.",
  },
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-start p-4 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mr-4 p-2 rounded-lg bg-primary/10">
            <badge.icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{badge.title}</h3>
            <p className="text-muted-foreground text-xs leading-relaxed mt-1">
              {badge.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
