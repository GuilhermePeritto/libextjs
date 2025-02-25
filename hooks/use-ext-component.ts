"use client"

import { useEffect, useRef, useState } from "react"

interface ExtComponentConfig {
  componentUsage?: string
  componentDefinition?: string
  xtype?: string
  config?: any,

}

interface UseExtComponentProps extends ExtComponentConfig {
  onReady?: (component: any) => void
  onError?: (error: Error) => void
}

export function useExtComponent({
  componentUsage,
  componentDefinition,
  xtype,
  config = {},
  onReady,
  onError,
}: UseExtComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<any>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const Ext = (window as any).Ext
    if (!Ext) {
      const error = new Error("ExtJS not loaded")
      setError(error)
      onError?.(error)
      return
    }

    const createComponent = async () => {
      try {
        // Clean up previous component
        if (componentRef.current?.destroy) {
          componentRef.current.destroy()
        }

        // If there's a component definition, evaluate it first
        if (componentDefinition) {
          const defineComponent = new Function("Ext", "Use", componentDefinition)
          defineComponent(Ext, (window as any).Use)
        }

        // Create the component
        if (componentUsage) {
          const createConfig = new Function(
            "Ext",
            "Use",
            `
            const config = ${componentUsage};
            return config;
          `,
          )
          const componentConfig = createConfig(Ext, (window as any).Use)
          componentRef.current = Ext.create({
            ...componentConfig,
            renderTo: containerRef.current,
          })
        } else if (xtype) {
          componentRef.current = Ext.create({
            xtype,
            renderTo: containerRef.current,
            ...config,
          })
        }

        setIsReady(true)
        setError(null)
        onReady?.(componentRef.current)
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to create ExtJS component")
        setError(error)
        onError?.(error)
      }
    }

    // Wait for Ext to be ready
    if (Ext.isReady) {
      createComponent()
    } else {
      Ext.onReady(createComponent)
    }

    // Cleanup
    return () => {
      if (componentRef.current?.destroy) {
        componentRef.current.destroy()
      }
    }
  }, [componentUsage, componentDefinition, xtype, config, onReady, onError])

  return {
    containerRef,
    component: componentRef.current,
    error,
    isReady,

  }
}