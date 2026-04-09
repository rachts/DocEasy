"use client"

import { UploadCloud, Settings, Download } from "lucide-react"
import { motion } from "motion/react"

const steps = [
  {
    icon: UploadCloud,
    title: "Upload",
    description: "Choose any document or image from your device.",
  },
  {
    icon: Settings,
    title: "Process",
    description: "Our tools process your file instantly with high precision.",
  },
  {
    icon: Download,
    title: "Download",
    description: "Save your processed file securely back to your device.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden md:block" />
      
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
          How DocEasy works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Simplifying document management in three easy steps. No credit card, no login, no hassle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto px-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300">
              <step.icon className="w-8 h-8 text-primary" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
