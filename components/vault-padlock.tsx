'use client'

import React, { useState, useEffect } from 'react'

interface VaultPadlockProps {
  initialUnlocked?: boolean
  className?: string
  onUnlock?: () => void
}

export function VaultPadlock({
  initialUnlocked = true,
  className = '',
  onUnlock
}: VaultPadlockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(isReduced)

    if (isReduced || !initialUnlocked) {
      setIsUnlocked(initialUnlocked)
      return
    }

    // Trigger unlock sequence (<300ms constraint: 200ms duration)
    const timer = setTimeout(() => {
      setIsUnlocked(true)
      onUnlock?.()
    }, 120)

    return () => clearTimeout(timer)
  }, [initialUnlocked, onUnlock])

  const toggleLock = () => {
    setIsUnlocked((prev) => !prev)
  }

  return (
    <button
      type="button"
      onClick={toggleLock}
      className={`inline-flex items-center gap-2 cursor-pointer select-none transition-colors ${className}`}
      title={isUnlocked ? 'Vault unlocked - click to toggle' : 'Vault locked - click to unlock'}
      aria-label={isUnlocked ? 'Vault unlocked' : 'Vault locked'}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Shackle: animates up and rotates when unlocked */}
        <path
          d="M7 11V7a5 5 0 0 1 10 0v4"
          stroke={isUnlocked ? '#34D399' : '#A8A29E'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transform-gpu origin-[7px_11px] ${
            reducedMotion
              ? isUnlocked ? 'translate-y-[-3px] rotate-[15deg]' : ''
              : 'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]'
          }`}
          style={
            !reducedMotion && isUnlocked
              ? { transform: 'translateY(-3.5px) rotate(18deg)' }
              : undefined
          }
        />
        {/* Padlock Body */}
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          ry="2"
          stroke={isUnlocked ? '#34D399' : '#FAFAF9'}
          strokeWidth="2"
          fill={isUnlocked ? 'rgba(52, 211, 153, 0.08)' : 'rgba(28, 25, 23, 0.6)'}
          className="transition-colors duration-200"
        />
        {/* Keyhole */}
        <circle
          cx="12"
          cy="16"
          r="1.2"
          fill={isUnlocked ? '#34D399' : '#A8A29E'}
          className="transition-colors duration-200"
        />
        <path
          d="M12 17.2V19"
          stroke={isUnlocked ? '#34D399' : '#A8A29E'}
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-colors duration-200"
        />
      </svg>
      <span className={`text-[12px] font-mono transition-colors duration-200 ${
        isUnlocked ? 'text-emerald-400 font-medium' : 'text-[#A8A29E]'
      }`}>
        {isUnlocked ? 'VAULT UNLOCKED' : 'VAULT LOCKED'}
      </span>
    </button>
  )
}
