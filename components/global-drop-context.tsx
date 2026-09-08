'use client'

import React, { createContext, useContext, useRef, useCallback } from 'react'

type FileDropHandler = (file: File) => void

interface GlobalDropContextType {
  registerDropHandler: (handler: FileDropHandler) => () => void
  getActiveDropHandler: () => FileDropHandler | null
}

const GlobalDropContext = createContext<GlobalDropContextType | null>(null)

export function GlobalDropProvider({ children }: { children: React.ReactNode }) {
  const handlersRef = useRef<FileDropHandler[]>([])

  const registerDropHandler = useCallback((handler: FileDropHandler) => {
    handlersRef.current.push(handler)
    return () => {
      handlersRef.current = handlersRef.current.filter((h) => h !== handler)
    }
  }, [])

  const getActiveDropHandler = useCallback(() => {
    if (handlersRef.current.length === 0) return null
    // return the most recently registered active handler
    return handlersRef.current[handlersRef.current.length - 1]
  }, [])

  return (
    <GlobalDropContext.Provider value={{ registerDropHandler, getActiveDropHandler }}>
      {children}
    </GlobalDropContext.Provider>
  )
}

export function useGlobalDrop() {
  const context = useContext(GlobalDropContext)
  return context
}
