"use client"

import { ExtComponent } from "@/components/ext-component"

interface PreviewTabProps {
  componentDefinition: string
  componentUsage: string
}

export function PreviewTab({ componentDefinition, componentUsage }: PreviewTabProps) {
  return (
    <div className="h-full p-4 flex items-center justify-center border rounded-md">
      <ExtComponent componentDefinition={componentDefinition} componentUsage={componentUsage} />
    </div>
  )
}

