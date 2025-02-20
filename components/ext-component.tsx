"use client"

import { useExt } from "@/contexts/ext-context"
import { useExtComponent } from "@/hooks/use-ext-component"

interface ExtComponentProps {
  componentUsage?: string
  componentDefinition?: string
  xtype?: string
  config?: any
  className?: string
  onReady?: (component: any) => void
  onError?: (error: Error) => void
}

export function ExtComponent({ className = "", onReady, onError, ...props }: ExtComponentProps) {
  const { isExtLoaded, error: contextError } = useExt()
  const { containerRef, error } = useExtComponent({
    ...props,
    onReady,
    onError,
  })

  if (contextError || error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md">Error: {(contextError || error)?.message}</div>
    )
  }

  if (!isExtLoaded) {
    return (
      <div className="animate-pulse bg-muted h-[200px] flex items-center justify-center">
        Loading ExtJS Component...
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}